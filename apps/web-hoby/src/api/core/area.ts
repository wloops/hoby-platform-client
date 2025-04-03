/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-03 11:50:14
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-03 14:56:13
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\api\core\area.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import type { AreaData } from '@/composables/area/types';
import { getAreaList } from '#/composables/area/areaData';

/**
 * 获取地区数据
 */
export async function getAreaApi(data: any) {
  return getAreaList(data);
}
