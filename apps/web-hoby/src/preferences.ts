/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-03 21:58:41
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-17 16:08:08
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\preferences.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    loginExpiredMode: 'modal',
    authPageLayout: 'panel-center',
    layout: 'header-sidebar-nav',
  },
  logo: {
    source: import.meta.env.VITE_APP_LOGO,
  },
  tabbar: {
    enable: false,
  },
  theme: {
    mode: 'light',
  },
  widget: {
    fullscreen: true,
    globalSearch: false,
    languageToggle: false,
    lockScreen: true,
    notification: false,
    refresh: true,
    sidebarToggle: false,
    themeToggle: false,
  },
  breadcrumb: {
    showHome: true,
  },
  copyright: {
    companyName: '湖南货比网络科技有限公司',
    date: '2025',
    companySiteLink: 'baidu.com',
    enable: true,
    icp: '湘-xxxxxxx',
    icpLink:
      'https://beian.miit.gov.cn/?spm=5176.27804673.J_9220772140.J_4NWEMkQ5nDwOgLi8EJmHs.58',
  },
  footer: {
    enable: true,
    fixed: false,
  },
  transition: {
    progress: false,
  },
  navigation: {
    accordion: true,
  },
  shortcutKeys: {
    globalLogout: false,
  },
});
