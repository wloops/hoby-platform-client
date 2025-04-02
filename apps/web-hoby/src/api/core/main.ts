/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-03 21:58:41
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-01 17:18:38
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\api\core\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { requestClient } from '#/api/request';

/**
 * 通用获取单数据集页面记录接口
 */
export async function mainGetViewDataApi(data: any) {
  return requestClient.post<any>('/GenDataGrpOnRefInterView', data, {
    withCredentials: true,
  });
}
/**
 * 通用获取单数据集页面搜索记录接口
 */
export async function mainGetViewSearchDataApi(data: any) {
  return requestClient.post<any>('/GenDataGrpOnQueryConditions', data, {
    withCredentials: true,
  });
}

/**
 * 通用获取单数据集接口
 */
export async function mainGetDataApi(data: any) {
  return requestClient.post<any>('/dataGrpService', data, {
    withCredentials: true,
  });
}

/**
 * 通用级联获取数据接口
 */
export async function mainGetDataApiCascade(data: any) {
  return requestClient.post<any>('/datasetService', data, {
    withCredentials: true,
  });
}
/**
 * 通用服务接口
 */
export async function mainServiceApi(data: any) {
  return requestClient.post<any>('/buttonService', data, {
    withCredentials: true,
  });
}

/**
 * 上传文件接口
 */
export async function uploadFile(data: any) {
  return requestClient.post<any>('/uploadFile', data, {
    withCredentials: true,
  });
}

/**
 * 发送指定文件接口（大数据传输）
 */
export async function mainSendFile(data: any) {
  return requestClient.post<any>('/buttonServiceFile', data, {
    withCredentials: true,
  });
}

/**
 * 通用新增记录接口
 */
export async function mainAddRecrdApi(data: any) {
  return requestClient.post<any>('/GenDataGrpAdd', data, {
    withCredentials: true,
  });
}
/**
 * 通用删除记录接口
 */
export async function mainDeleteRecrdApi(data: any) {
  return requestClient.post<any>('/GenDataGrpDelete', data, {
    withCredentials: true,
  });
}
/**
 * 通用更新记录接口
 */
export async function mainUpdateRecrdApi(data: any) {
  return requestClient.post<any>('/GenDataGrpUpdate', data, {
    withCredentials: true,
  });
}
/**
 * 通用查询记录接口
 */
export async function mainSelectRecrdApi(data: any) {
  return requestClient.post<any>('/GenDataGrpSelect', data, {
    withCredentials: true,
  });
}
/**
 * 文件数据发送接口
 */
export async function mainSendFileDataApi(data: any) {
  return requestClient.post<any>('/buttonServiceOnFileData', data, {
    withCredentials: true,
  });
}
