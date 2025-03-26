/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-12 10:52:42
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-26 15:42:28
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\store\auth.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { Recordable } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@vben/constants';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { getPKApi, loginApi, registerApi } from '#/api';
import { encryption, useMainGetData } from '#/composables';
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
      accessStore.setAccessToken(res.res_token);

      // 获取用户信息并存储到 accessStore 中
      // const [fetchUserInfoResult, accessCodes] = await Promise.all([
      //   fetchUserInfo(),
      //   getAccessCodesApi(),
      // ]);

      userInfo = {
        ...res,
        homePath: '/home',
        realName: res.TELLERNAME,
        companyName: res.TELLERCOMPANY,
        tellerNo: res.tellerNo,
        // roles: ['super', 'buyer'],
      };
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      const fetchUserInfoResult = await fetchUserInfo();
      if (fetchUserInfoResult.tellerNo) {
        // console.log('fetchUserInfoResult', fetchUserInfoResult);

        userInfo = fetchUserInfoResult;
      }

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
      accessStore.setLoginExpired(false);

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
    // try {
    //   await logoutApi();
    // } catch {
    //   // 不做任何处理
    // }
    resetAllStores();
    accessStore.setLoginExpired(true);
    userStore.setUserInfo(null);
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('accessToken');

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      // path: '/',
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchUserInfo() {
    try {
      let userInfo: any = null;
      const data = {
        pageID: 'personInfoManagement',
        pageDataGrpID: 'queryPersonalInfo',
      };
      userInfo = await useMainGetData(data);
      if (userInfo) {
        userInfo = {
          ...userInfo,
          homePath: '/home',
          realName: userInfo.employeeName,
          companyName: userInfo.companyName,
          tellerNo: userInfo.workNo,
        };
        userStore.setUserInfo(userInfo);
        // sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        return userInfo;
      }
    } catch (error) {
      console.error('fetchUserInfo error', error);
      // await logout();
      return null;
    }
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
