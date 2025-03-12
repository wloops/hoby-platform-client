/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-12 12:01:24
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-12 14:43:20
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\composables\useMainGetData.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref } from 'vue';

import { mainGetDataApi } from '#/api';

/**
 * 通用的数据获取 Hook
 * @param reqParams - 请求参数对象，包含必填的 pageID 和 pageDataGrpID，以及其他可选字段
 * @returns 包含数据、加载状态、错误信息和刷新方法的对象
 */
export const useMainGetData = <T>(
  reqParams: Record<string, any> & { pageDataGrpID: string; pageID: string },
) => {
  const data = ref<null | T>(null); // 存储获取的数据
  const total = ref(0); // 存储总条数
  const loading = ref(true); // 加载状态
  const error = ref<Error | null>(null); // 错误信息

  // 数据获取函数
  const fetchData = async () => {
    try {
      loading.value = true; // 开始加载
      error.value = null; // 清空错误信息
      const response = await mainGetDataApi(reqParams); // 调用 API

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
    } catch (error_) {
      console.error('Error fetching data:', error_); // 打印错误信息
      error.value = error_ as Error; // 捕获错误
      data.value = null; // 清空数据
    } finally {
      loading.value = false; // 结束加载
    }
  };

  // 初始化时自动获取数据
  fetchData();

  // 返回数据、加载状态、错误信息和刷新方法
  return {
    data,
    total,
    loading,
    error,
    refresh: fetchData, // 提供刷新方法
  };
};
