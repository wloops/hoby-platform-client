/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-28 17:14:48
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-09 13:42:47
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\DynamicForm\modules\utils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 从查询字符串中提取指定的字段值
 * @param queryStr 查询字符串，格式如: "query::table=1491,readFld=companyName,writable=1,condition=SPLENWISEQUERYOPTIONS=distinct=1`fields=companyName"
 * @param fields 需要提取的字段名数组，如 ['table', 'readFld', 'condition']
 * @returns 包含指定字段值的对象
 */
export function parseQueryString(
  queryStr: string,
  fields: string[],
): Record<string, string> {
  // 移除开头的 "query::"|"form::"
  // 定义需要移除的前缀列表
  const PREFIXES_TO_REMOVE = [
    'query::',
    'form::',
    'data::',
    'enum::',
    'auto.enum.',
  ];
  const isEnum = queryStr.includes('enum');
  // 移除指定的前缀
  let cleanStr = queryStr;
  for (const prefix of PREFIXES_TO_REMOVE) {
    if (cleanStr.startsWith(prefix)) {
      cleanStr = cleanStr.slice(prefix.length);
      break; // 找到一个匹配的前缀后就停止
    }
  }

  // 分割所有键值对
  const keyValuePairs = cleanStr.split(',');

  const result: Record<string, string> = {};

  // 处理每个键值对
  keyValuePairs.forEach((pair) => {
    // 处理包含等号的情况
    if (pair.includes('=')) {
      const [key, ...valueParts] = pair.split('=');
      const value = valueParts.join('='); // 处理值中包含等号的情况

      // 如果这个键是我们要提取的
      if (fields.includes(key as string)) {
        result[key as string] = value;
      }
    }
  });

  if (isEnum) {
    return {
      readFld: '',
      table: '',
      condition: `enum::${keyValuePairs[0] || ''}`,
      ...result,
    };
  }

  return result;
}

/**
 * 将对象数组转换为标准选项格式
 * @param data 原始数据数组
 * @param keyName 要作为value和label的字段名，默认为'label'
 * @returns 转换后的选项数组
 */
interface Option {
  value: string;
  label: string;
}

// 正确的泛型参数顺序
export function convertToOptions<K extends string, T extends Record<K, string>>(
  data: T[],
  keyName: K,
): Option[] {
  return data.map((item) => ({
    value: item[keyName],
    label: item[keyName],
  }));
}

/**
 * 将对象数组转换为{key, title}格式数组
 * @param data 原始数据数组
 * @param fieldName 用于生成key和title的字段名
 * @param value 已选默认值
 * @returns 转换后的数组（保留原始顺序，无重复项）
 */
export function convertToKeyTitleArray<T extends Record<string, any>>(
  data: T[],
  fieldName: keyof T,
  value: string,
): Array<{ key: string; title: string }> {
  const seen = new Set<string>();
  const result: Array<{ chosen: boolean; key: string; title: string }> = [];
  const values = value && value.split(',');
  data.forEach((item) => {
    const fieldValue = String(item[fieldName]); // 确保转换为字符串
    if (!seen.has(fieldValue)) {
      seen.add(fieldValue);
      result.push({
        key: fieldValue,
        title: fieldValue,
        chosen: !!values.includes(fieldValue),
      });
    }
  });

  return result;
}
