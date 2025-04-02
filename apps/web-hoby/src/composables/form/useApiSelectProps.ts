/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-31 10:49:27
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-02 14:26:23
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\composables\form\useApiSelectProps.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { mainGetCommonQueryData } from '#/api';
import {
  convertToKeyTitleArray,
  convertToOptions,
  parseQueryString,
} from '#/components/DynamicForm/modules/utils';

export function useApiSelectProps(
  sourceData: any,
  defaultRecord: Record<string, any>,
) {
  const record = defaultRecord;
  const result = parseQueryString(sourceData.value, [
    'table',
    'condition',
    'readFld',
  ]);
  const extractName: string = result.readFld ?? '';
  const params: Record<string, any> = {
    INTERQUERYCON: result.condition ?? '',
    INTERFLDNAMELIST: result.readFld ?? '',
    INTERRESID: result.table ?? '',
    ...record,
  };
  return {
    extractName,
    selectApi: mainGetCommonQueryData,
    params,
    afterFetch,
  };
}

function afterFetch(
  type: string,
  res: any,
  extractName: string,
  currentFieldValue?: string,
) {
  const { rs, data } = res;
  if (rs !== '1') return [];
  if (type === 'query') {
    return convertToOptions(data?.dbRecsGrp, extractName);
  } else if (type === 'form') {
    return convertToKeyTitleArray(
      data.dbRecsGrp,
      extractName,
      currentFieldValue ?? '',
    );
  }
}
