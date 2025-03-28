/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-03 21:58:41
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-28 14:02:03
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\api\core\user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 通用获取Form视图域条件
 */
export async function mainGetViewFieldConfigApi(data: any) {
  return requestClient.post<any>('/GenInterViewConfigurationFile', data, {
    withCredentials: true,
  });
}

/**
 * 获取通用查询数据（获取下拉列表）
 */
export async function mainGetCommonQueryData(data: any) {
  return requestClient.post<any>('/getCommonQueryData', data, {
    withCredentials: true,
  });
}
