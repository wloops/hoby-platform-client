import { ref } from 'vue';

// 定义枚举类型
/**
 * 枚举项
 *
 * 颜色
 * default|success|processing|warning|error|【自定义】
 */
interface EnumItem {
  label: string;
  color?: string; // color 非必填
}

interface Enums {
  restockingStatus: Record<string, EnumItem>;
}

// 本地枚举值
const localEnums: Enums = {
  restockingStatus: {
    '0': {
      label: '不需要进货',
      color: 'default',
    },
    '1': {
      label: '已完成进货',
      color: 'success',
    },
    '2': {
      label: '正在进货',
      color: 'processing',
    },
  },
};

// 自定义 Hook
export function useEnums() {
  // 将枚举值转换为响应式对象
  const enums = ref<Enums>(localEnums);

  /**
   * 获取枚举值的描述
   * @param type 枚举类型（如 'restockingStatus'）
   * @param key 枚举键（如 '0'）
   * @returns 枚举值的描述（如 '不需要进货'）
   */
  const getEnumLabel = (type: keyof Enums, key: string): string => {
    return enums.value[type][key]?.label || '未知';
  };

  /**
   * 获取枚举值的颜色
   * @param type 枚举类型（如 'restockingStatus'）
   * @param key 枚举键（如 '0'）
   * @returns 枚举值的颜色（如 'default'），如果未定义则返回默认值
   */
  const getEnumColor = (type: keyof Enums, key: string): string => {
    return enums.value[type][key]?.color || '#434B52'; // 默认灰色
  };

  /**
   * 获取枚举列表
   * @param type 枚举类型（如 'restockingStatus'）
   * @returns 枚举键值对列表（如 [{ key: '0', label: '不需要进货', color: 'default' }]）
   */
  const getEnumList = (
    type: keyof Enums,
  ): Array<{ color?: string; key: string; label: string }> => {
    return Object.entries(enums.value[type]).map(([key, item]) => ({
      key,
      label: item.label,
      color: item.color, // color 非必填
    }));
  };

  return {
    enums,
    getEnumLabel,
    getEnumColor,
    getEnumList,
  };
}
