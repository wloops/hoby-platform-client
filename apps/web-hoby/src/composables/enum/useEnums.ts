import type { EnumItem, Enums } from './enums';

import { ref } from 'vue';

import { mainGetCommonQueryData } from '#/api';

import { localEnums } from './enums';

// 定义缓存数据的结构
interface CacheData<T> {
  data: T;
  expires: number;
}

// 设置缓存过期时间（7*24小时）
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

// 自定义 Hook
export function useEnums() {
  // 将枚举值转换为响应式对象
  const enums = ref<Enums>(localEnums);

  /**
   * 保存数据到 localStorage，带过期时间
   */
  const setStorageWithExpiry = (key: string, value: any) => {
    const item: CacheData<any> = {
      data: value,
      expires: Date.now() + CACHE_EXPIRATION,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  /**
   * 从 localStorage 获取数据，检查是否过期
   */
  const getStorageWithExpiry = (key: string) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item: CacheData<any> = JSON.parse(itemStr);
      if (Date.now() > item.expires) {
        // 数据已过期，删除它
        localStorage.removeItem(key);
        return null;
      }
      return item.data;
    } catch {
      return null;
    }
  };

  /**
   * 获取枚举值的描述
   * @param type 枚举类型（如 'enumName|id'）
   * @param key 枚举键（如 '0'）
   * @returns 枚举值的描述（如 '不需要进货'）
   */
  const getEnumLabel = (type: string, key: string): string => {
    const [enumName, id] = type.split('|') as [string, string];
    const mapKey = enumName || id;

    // 从本地枚举中查找
    const enumList = enums.value[mapKey];
    if (enumList) {
      const item = enumList.find((item) => item.value === key);
      if (item) return item.label;
    }

    // 从缓存中查找
    const storageKey = `ENUM__${mapKey}`;
    const cachedData = getStorageWithExpiry(storageKey);
    if (cachedData) {
      const item = cachedData.find((item: EnumItem) => item.value === key);
      if (item) return item.label;
    }

    return '未知';
  };

  /**
   * 获取枚举值的颜色
   * @param type 枚举类型（如 'enumName|id'）
   * @param key 枚举键（如 '0'）
   * @returns 枚举值的颜色（如 'default'）
   */
  const getEnumColor = (type: string, key?: string): string => {
    const [enumName, id] = type.split('|') as [string, string];
    const mapKey = enumName || id;

    // 从本地枚举中查找
    const enumList = enums.value[mapKey];
    if (enumList && key) {
      const item = enumList.find((item) => item.value === key);
      if (item) return item.color || '';
    }

    // 从缓存中查找
    const storageKey = `ENUM__${mapKey}`;
    const cachedData = getStorageWithExpiry(storageKey);
    if (cachedData && key) {
      const item = cachedData.find((item: EnumItem) => item.value === key);
      if (item) return item.color || '';
    }
    if (!key) {
      return enumList?.[0]?.color ?? '';
    }
    return '';
  };

  /**
   * 获取枚举列表
   * @param type 枚举类型（如 'restockingStatus'）
   * @returns 枚举列表
   */
  const getEnumList = async (type: string): Promise<EnumItem[]> => {
    // 先从本地枚举中查找
    if (enums.value[type]) {
      return enums.value[type];
    }

    // 再从缓存中查找
    const storageKey = `ENUM__${type}`;
    const cachedData = getStorageWithExpiry(storageKey);
    if (cachedData) {
      return cachedData;
    }

    // 最后从服务器获取
    const params = {
      INTERQUERYCON: `enum::${type}`,
      INTERFLDNAMELIST: '',
      INTERRESID: '',
    };
    const res = await mainGetCommonQueryData(params);
    const options = res?.data?.enumValues || [];

    // 保存到 localStorage，带过期时间
    setStorageWithExpiry(storageKey, options);

    return options;
  };

  return {
    enums,
    getEnumLabel,
    getEnumColor,
    getEnumList,
  };
}
