/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-31 15:22:06
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-31 15:56:59
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\store\form.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { acceptHMRUpdate, defineStore } from 'pinia';

interface FormState {
  /**
   * 当前表单数据
   */
  formValues: Record<any, any>;
}

/**
 * @zh_CN 表单相关
 */
export const useFormStore = defineStore('core-form', {
  actions: {
    getFormValues() {
      return this.formValues;
    },
    setFormValues(values: Record<any, any>) {
      this.formValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          value === undefined || value === null ? '' : value,
        ]),
      );
    },
    setTriggerFields(values: Record<any, any>) {
      const result = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          value === undefined || value === null ? '' : value,
        ]),
      );
      return Object.keys(result);
    },
  },
  persist: {
    // 持久化
    // pick: ['formValues'],
  },
  state: (): FormState => ({
    formValues: {},
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useFormStore, hot));
}
