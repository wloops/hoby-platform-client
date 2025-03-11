/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-03 21:58:41
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-11 18:09:53
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\api\core\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { requestClient } from '#/api/request';

/**
 * 通用获取数据接口
 */
export async function getCommonData(data: any) {
  return requestClient.post<any>('/dataGrpService', data);
}
