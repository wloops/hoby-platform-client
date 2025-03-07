import type { Recordable, UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH } from '@vben/constants';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import {
  getPKApi,
  getUserInfoApi,
  loginApi,
  logoutApi,
  registerApi,
} from '#/api';
import { encryption } from '#/composables/encrypt/encryption';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: any = null;
    try {
      loginLoading.value = true;
      const { pkkey: pk } = await getPKApi();
      const encryptedPassword = encryption(pk, params.password);
      console.error('encryptedPassword', encryptedPassword);

      const loginParams = {
        tellerNo: params.username,
        cipherText: encryptedPassword,
      };

      // const { accessToken } = await loginApi(loginParams);
      const res = await loginApi(loginParams);
      console.error('res', res);
      const resCode = res.rs;
      if (resCode !== '1') {
        const errorMessage = res.rs;
        notification.error({
          description: errorMessage + $t('authentication.loginFailedDesc'),
          duration: 2,
          message: $t('authentication.loginFailed'),
        });
        return;
      }

      // 如果成功获取到 accessToken
      // if (accessToken) {
      // accessStore.setAccessToken(accessToken);
      accessStore.setAccessToken(res.token.token);

      // 获取用户信息并存储到 accessStore 中
      // const [fetchUserInfoResult, accessCodes] = await Promise.all([
      //   fetchUserInfo(),
      //   getAccessCodesApi(),
      // ]);

      // userInfo = fetchUserInfoResult;
      userInfo = {
        homePath: '/',
        realName: res.TELLERNAME,
        ...res,
      };

      userStore.setUserInfo(userInfo);
      // console.log('loign userStore', userStore.userInfo);

      // accessStore.setAccessCodes(accessCodes);

      if (accessStore.loginExpired) {
        accessStore.setLoginExpired(false);
      } else {
        onSuccess
          ? await onSuccess?.()
          : await router.push(userInfo.homePath || DEFAULT_HOME_PATH);
      }

      if (userInfo?.realName) {
        notification.success({
          description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
          duration: 3,
          message: $t('authentication.loginSuccess'),
        });
      }
      // }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function authRegister(params: Recordable<any>) {
    try {
      loginLoading.value = true;
      const { pkkey: pk } = await getPKApi();
      const encryptedPassword = encryption(pk, params.password);
      const registerParams = {
        companyName: params.companyName,
        contactor: params.name,
        mobile: params.phone,
        tellerNo: params.username,
        passwordCiper: encryptedPassword,
      };
      const res = await registerApi(registerParams);
      console.error('res', res);
      if (res.rs === '1') {
        notification.success({
          description: $t('authentication.registerSuccessDesc'),
          duration: 2,
          message: $t('authentication.registerSuccess'),
        });
        await router.push('/auth/login');
      } else {
        notification.error({
          description: $t('authentication.registerFailedDesc'),
          duration: 2,
          message: $t('authentication.registerFailed'),
        });
      }
    } finally {
      loginLoading.value = false;
    }
  }

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登录页带上当前路由地址
    await router.replace({
      // path: LOGIN_PATH,
      path: '/',
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchUserInfo() {
    let userInfo: null | UserInfo = null;
    userInfo = await getUserInfoApi();
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    authRegister,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
