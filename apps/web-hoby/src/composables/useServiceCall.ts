// 先创建一个简单的 MainServiceApi 类型定义，避免导入错误
import { ref } from 'vue';

import { message } from 'ant-design-vue';

import { mainServiceApi } from '#/api';

/**
 * 服务调用选项
 */
export interface ServiceCallOptions {
  // 成功消息，设置为false则不显示
  successMessage?: false | string;
  // 错误消息，设置为false则不显示
  errorMessage?: false | string;
  // 操作成功后的回调
  onSuccess?: (result: any) => void;
  // 操作失败后的回调
  onError?: (error: any) => void;
  // 自动刷新函数
  refreshFunc?: () => void;
}

/**
 * 创建服务调用钩子
 * @param params 请求参数，直接传给mainServiceApi
 * @param options 调用选项
 * @returns result 请求结果
 */
export async function useServiceCall(
  params: any,
  options: ServiceCallOptions = {},
) {
  // loading状态
  const loading = ref(false);

  const defaultOptions: ServiceCallOptions = {
    successMessage: '操作成功',
    errorMessage: '操作失败',
  };

  const mergedOptions = { ...defaultOptions, ...options };

  // 执行请求
  loading.value = true;
  try {
    const result = await mainServiceApi(params);

    // 显示成功消息
    if (mergedOptions.successMessage !== false) {
      message.success(mergedOptions.successMessage);
    }

    // 调用成功回调
    if (mergedOptions.onSuccess) {
      mergedOptions.onSuccess(result);
    }

    // 自动刷新
    if (mergedOptions.refreshFunc) {
      mergedOptions.refreshFunc();
    }

    return result;
  } catch (error: any) {
    // 显示错误消息
    if (mergedOptions.errorMessage !== false) {
      const errorMsg =
        error?.message || error?.data?.message || mergedOptions.errorMessage;
      message.error(errorMsg);
    }

    // 调用错误回调
    if (mergedOptions.onError) {
      mergedOptions.onError(error);
    }

    throw error;
  } finally {
    loading.value = false;
  }
}
