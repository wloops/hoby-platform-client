import type { AxiosProgressEvent, AxiosRequestConfig } from 'axios';

import { ref } from 'vue';

import { useUserStore } from '@vben/stores';

import axios from 'axios';
import qs from 'qs';

interface UploadOptions<_T = any> {
  url?: string;
  file: Blob | File;
  data?: Record<string, any>; // 用于 URL query 参数
  formData?: Record<string, any>; // 用于 FormData 附加字段
  headers?: Record<string, string>;
  onProgress?: (progress: number) => void;
  axiosConfig?: Omit<
    AxiosRequestConfig,
    'data' | 'headers' | 'method' | 'onUploadProgress' | 'url'
  >;
}

/**
 * 文件上传 Hook
 * @returns 上传相关方法和状态
 */
export function useUpload<T = any>() {
  const isLoading = ref(false);
  const error = ref<unknown>(null);
  const progress = ref(0);
  const data = ref<null | T>(null);

  /**
   * 执行文件上传
   * @param options 上传配置
   * @returns Promise 包含响应数据
   */
  const upload = async (options: UploadOptions<T>): Promise<T> => {
    isLoading.value = true;
    error.value = null;
    progress.value = 0;
    data.value = null;

    try {
      // 处理 query 参数
      const queryString = options.data ? qs.stringify(options.data) : '';
      const url =
        options.url ||
        '/java-hoby-member-service-plug-plat/buttonServiceFileNew';
      const urlWithQuery = queryString ? `${url}?${queryString}` : url;

      // 创建 FormData
      const formData = new FormData();
      formData.append('file', options.file);

      // 添加额外的 FormData 字段
      if (options.formData) {
        Object.entries(options.formData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      // 合并 headers
      const headers: any = {
        'Content-Type': 'multipart/form-data',
        ...options.headers,
      };

      const userStore = useUserStore();
      const userInfo = userStore.userInfo;
      if (userInfo) {
        headers.res_token = userInfo?.res_token;
        headers['X-CSRF-TOKEN'] = userInfo?.token?.token;
      }

      // 发起请求
      const response = await axios.post<T>(urlWithQuery, formData, {
        ...options.axiosConfig,
        headers,
        withCredentials: true,
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total && options.onProgress) {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            progress.value = percent;
            options.onProgress(percent);
          }
        },
      });

      data.value = response.data;
      return response.data;
    } catch (error_) {
      error.value = error_;
      throw error_;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 重置上传状态
   */
  const reset = () => {
    isLoading.value = false;
    error.value = null;
    progress.value = 0;
    data.value = null;
  };

  return {
    upload,
    reset,
    isLoading,
    error,
    progress,
    data,
  };
}
