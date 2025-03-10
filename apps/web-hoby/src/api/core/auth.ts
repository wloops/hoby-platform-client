/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-03 21:58:41
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-10 11:47:46
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\api\core\auth.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    tellerNo?: string;
    cipherText?: string;
  }

  /** 注册企业账户接口参数 */
  export interface RegisterParams {
    companyName: string; // 企业名称
    mobile: string; // 手机号
    contactor: string; // 姓名
    tellerNo: string; // 账号
    passwordCiper: string; // 密码
    creditCode?: string; // 统一社会信用代码
    address?: string; // 地址
    code?: string; // 验证码
  }

  /** 登录接口返回值 */
  // export interface LoginResult {
  //   accessToken: string;
  // }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
// export async function loginApi(data: AuthApi.LoginParams) {
//   return requestClient.post<AuthApi.LoginResult>('/auth/login', data);
// }
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<any>('/login/loginByAccount', data);
}

/**
 * 注册企业账户
 */
export async function registerApi(data: AuthApi.RegisterParams) {
  return requestClient.post<any>(
    '/insertReturn/btnRegisteredEnterpriseAccount',
    data,
  );
}

/**
 * 获取 public key
 */
export async function getPKApi() {
  return requestClient.get<any>('/app/getPK');
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  // return requestClient.get<string[]>('/auth/codes');
  return [];
}
