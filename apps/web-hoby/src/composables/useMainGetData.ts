/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-12 12:01:24
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-25 13:52:43
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\composables\useMainGetData.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref } from 'vue';

import { mainGetDataApi, mainGetDataApiCascade } from '#/api';

/**
 * 通用的数据获取 Hook
 * @param reqParams - 请求参数对象，包含必填的 pageID 和 pageDataGrpID，以及其他可选字段
 * @returns 包含数据、加载状态、错误信息和刷新方法的对象
 */
export const useMainGetData = async <T>(
  reqParams: Record<string, any> & { pageDataGrpID: string; pageID: string },
) => {
  const data = ref<null | T>(null); // 存储获取的数据
  const total = ref(0); // 存储总条数
  const loading = ref(true); // 加载状态
  const error = ref<Error | null>(null); // 错误信息

  const params = ref<Record<string, any>>({
    ...reqParams,
  });
  const isCascade = ref(false);
  // 处理cascade数据集请求参数
  if (reqParams.pageID === '' && reqParams.pageDataGrpID) {
    params.value.bllID = reqParams.pageDataGrpID;
    delete params.value.pageID;
    delete params.value.pageDataGrpID;
    isCascade.value = true;
  }
  // 数据获取函数
  const fetchData = async () => {
    try {
      loading.value = true; // 开始加载
      error.value = null; // 清空错误信息
      if (isCascade.value === false) {
        const response = await mainGetDataApi(params.value); // 调用 API
        const code = response.rs;
        // 如果code不是1，则抛出错误
        if (code !== '1') {
          throw new Error(`API returned code: ${code}`);
        }
        const result = response[reqParams.pageDataGrpID]; // 动态获取需要的字段
        const responseTotal =
          response[`${reqParams.pageDataGrpID}_totalRecNum`]?.[0]?.TOTALRECNUM;
        data.value = result; // 设置数据
        total.value = Number(responseTotal);
      } else {
        const response = await mainGetDataApiCascade(params.value); // 调用 API

        const code = response.rs;
        // 如果code不是1，则抛出错误
        if (code !== '1') {
          throw new Error(`API returned code: ${code}`);
        }
        data.value = getCascadeData(response); // 设置数据
        total.value = 1;
      }
    } catch (error_) {
      console.error('Error fetching data:', error_); // 打印错误信息
      error.value = error_ as Error; // 捕获错误
      data.value = null; // 清空数据
    } finally {
      loading.value = false; // 结束加载
    }
  };

  // 初始化时自动获取数据
  await fetchData();

  // 返回数据、加载状态、错误信息和刷新方法
  return {
    data,
    total,
    loading,
    error,
    refresh: fetchData, // 提供刷新方法
  };
};

const getCascadeData = async (data: any) => {
  // 获取data对象的key,只有一个且非 rs
  const keys = Object.keys(data).filter((key) => key !== 'rs');
  if (keys.length === 1) {
    const key = keys[0] as string;
    const response = data[key][0];
    if (response) {
      return response;
    }
  }
  return null;
};
