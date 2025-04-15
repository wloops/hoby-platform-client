import type { ActionUserMap } from '#/composables/form/useSetFieldRealValue';

/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-15 13:48:49
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-15 18:15:31
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\composables\form\useMacroValue.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/composables/useMacroValue.ts
import { computed } from 'vue';

import dayjs from 'dayjs';

import { useSetFieldRealValue } from '#/composables/form/useSetFieldRealValue';

interface UseMacroValueOptions {
  currentFormData: Record<string, any>; // 改为必传参数
  entryRecordData: Record<string, any>; // 改为必传参数
}

export function useMacroValue(options: UseMacroValueOptions) {
  const { currentFormData, entryRecordData } = options;
  const { getActionUserMap } = useSetFieldRealValue();
  const operatorInfo = computed<ActionUserMap>(() => ({
    ...getActionUserMap(),
  }));

  // 使用dayjs获取系统日期 YYYYMMDD
  const getSystemDate = (): string => dayjs().format('YYYYMMDD');

  // 使用dayjs获取系统时间 HHMMSS
  const getSystemTime = (): string => dayjs().format('HHmmss');

  /**
   * 根据宏定义值获取对应的值
   * @param macroValue 宏定义值
   * @param fieldName 字段名（某些类型需要）
   * @param fixedValue 固定值或固定域（类型为9或1时使用）
   * @returns 返回对应的值
   */
  const getValueByMacro = (
    macroValue: number,
    fieldName: string,
    fixedValue: any,
  ): any => {
    switch (macroValue) {
      case 0: {
        return undefined;
      } // 未知
      case 1: {
        // 取入口记录数据的域值
        return fixedValue
          ? entryRecordData[fixedValue]
          : entryRecordData[fieldName];
      }
      case 2: {
        // 取当前表单数据的域值
        if (!fieldName) throw new Error('获取当前表单数据域值需要提供字段名');
        return currentFormData[fieldName];
      }
      case 9: {
        return fixedValue;
      } // 取固定值
      case 10: {
        return operatorInfo.value.tellerName;
      } // 操作员姓名
      case 11: {
        return operatorInfo.value.tellerNo;
      } // 操作员账号
      case 12: {
        return operatorInfo.value.tellerCompanyName;
      } // 企业名称
      case 13: {
        return operatorInfo.value.memberID;
      } // 团队标识
      case 31: {
        return getSystemDate();
      } // 系统日期
      case 32: {
        return getSystemTime();
      } // 系统时间
      default: {
        throw new Error(`不支持的宏定义值: ${macroValue}`);
      }
    }
  };

  return {
    getValueByMacro,
    getSystemDate,
    getSystemTime,
    operatorInfo,
  };
}
