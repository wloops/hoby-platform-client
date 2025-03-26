/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { RequestClientOptions } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore, useUserStore } from '@vben/stores';

import { message } from 'ant-design-vue';
import qs from 'qs';

import { useParseResponse } from '#/composables';
import { useAuthStore } from '#/store';

import { refreshTokenApi } from './core';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
    withCredentials: true,
  });

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi();
    const newToken = resp.data;
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();
      const userStore = useUserStore();
      // let userInfo: any = null;
      // const userStore = sessionStorage.getItem('userInfo');
      // if (userStore) {
      // userInfo = JSON.parse(userStore);
      // }
      const userInfo = userStore.userInfo;
      // console.log('userStore', userStore.userInfo);

      if (userInfo) {
        config.headers.res_token = userInfo?.res_token;
        config.headers['X-CSRF-TOKEN'] = userInfo?.token?.token;
        // 通用请求body添加参数
        config.data = {
          ...config.data,
          TELLERCOMPANY: userInfo?.TELLERCOMPANY,
        };
      }
      config.headers.Accept = '*/*';
      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;
      // post 默认x-www-form-urlencoded
      config.headers['content-type'] = 'application/x-www-form-urlencoded';
      config.headers['Cache-Control'] = 'no-cache';
      // console.log('request config', config);
      config.data = qs.stringify(config.data);
      return config;
    },
  });

  // 处理返回的响应数据格式
  // client.addResponseInterceptor(
  //   defaultResponseInterceptor({
  //     codeField: 'code',
  //     dataField: 'data',
  //     successCode: 0,
  //   }),
  // );

  // response数据解构
  client.addResponseInterceptor<any>({
    fulfilled: (response) => {
      const { data: responseData, status } = response;

      // const code = 0;
      // const { code, data, message: msg } = responseData;
      const { rs, msg } = responseData;
      const { success, code, message: errMsg } = useParseResponse(rs);
      if (code === -11_422 || code === -10_245 || code === -6) {
        doReAuthenticate();
      }

      if (!success && rs) {
        // throw new Error(`${msg || errMsg || code}`);
        message.error(`${msg || errMsg || code}`);
      }

      if (status >= 200 && status < 400) {
        return responseData;
      }
      throw new Error(`${status}: ${msg}`);
    },
  });

  // token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      // 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
      // 当前mock接口返回的错误字段是 error 或者 message
      // console.log('error', error);
      // const responseData = error?.response?.data ?? {};
      // const errorMessage = responseData?.error ?? responseData?.message ?? '';
      // 如果没有错误信息，则会根据状态码进行提示
      message.error(error || msg);
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL, {
  responseReturn: 'data',
});

export const baseRequestClient = new RequestClient({ baseURL: apiURL });
