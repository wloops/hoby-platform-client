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
  // 批量操作时间窗口(ms)，在此时间窗口内的多次调用被视为批量操作
  batchWindow?: number;
  // 操作成功后的回调
  onSuccess?: (result: any) => void;
  // 操作失败后的回调
  onError?: (error: any) => void;
  // 自动刷新函数
  refreshFunc?: () => void;
}

/**
 * 创建服务调用钩子
 * @returns {loading, call} loading状态和调用函数
 */
export function useServiceCall() {
  // 全局loading状态
  const loading = ref(false);

  // 批量操作相关
  let batchOperations: Array<{
    params: any;
    reject: (reason?: any) => void;
    resolve: (value: any) => void;
  }> = [];
  let batchTimer: null | number = null;

  // 最后一次操作的时间戳
  let lastOperationTime = 0;

  /**
   * 调用服务
   * @param params 请求参数，直接传给mainServiceApi
   * @param options 调用选项
   */
  const call = async (params: any, options: ServiceCallOptions = {}) => {
    // 默认选项
    const defaultOptions: ServiceCallOptions = {
      successMessage: '操作成功',
      errorMessage: '操作失败',
      batchWindow: 500, // 默认500ms内的操作视为批量操作
    };

    const mergedOptions = { ...defaultOptions, ...options };

    // 判断是否处于批量操作窗口期
    const currentTime = Date.now();
    const isWithinBatchWindow =
      currentTime - lastOperationTime < (mergedOptions.batchWindow || 0);
    lastOperationTime = currentTime;

    // 如果已经在loading或在批量窗口期内，则将请求加入批量操作队列
    if (loading.value || isWithinBatchWindow) {
      return new Promise((resolve, reject) => {
        // 将操作加入批量队列
        batchOperations.push({
          params,
          resolve,
          reject,
        });

        // 如果当前没有批量处理计时器且loading为false，则创建一个
        if (!batchTimer && !loading.value) {
          loading.value = true; // 立即设置loading状态

          // 设置批量处理计时器，等待窗口期结束后统一处理
          batchTimer = window.setTimeout(() => {
            executeBatchOperations(mergedOptions);
          }, mergedOptions.batchWindow);
        }
      });
    }

    // 单次操作，直接执行
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
  };

  /**
   * 执行批量操作
   */
  const executeBatchOperations = async (options: ServiceCallOptions) => {
    if (batchOperations.length === 0) {
      loading.value = false;
      batchTimer = null;
      return;
    }

    // 复制当前批量操作队列并清空队列
    const operations = [...batchOperations];
    batchOperations = [];
    batchTimer = null;

    // 统计成功和失败数量
    let successCount = 0;
    let failCount = 0;

    try {
      // 并行执行所有操作
      const results = await Promise.allSettled(
        operations.map(({ params }) => mainServiceApi(params)),
      );

      // 处理结果
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount++;
          if (operations[index]) {
            operations[index].resolve(result.value);
          }
        } else {
          failCount++;
          if (operations[index]) {
            operations[index].reject(result.reason);
          }
        }
      });

      // 显示整合后的成功消息
      if (options.successMessage !== false && successCount > 0) {
        if (successCount === operations.length) {
          message.success(options.successMessage);
        } else {
          message.success(`${successCount}个操作成功，${failCount}个操作失败`);
        }
      }

      // 调用刷新函数
      if (options.refreshFunc && successCount > 0) {
        options.refreshFunc();
      }
    } catch (error) {
      console.warn('批量操作执行异常', error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    call,
  };
}
