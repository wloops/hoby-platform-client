/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-14 11:54:06
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-14 13:19:02
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\composables\table\useTabs.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getTabsListApi } from '#/api';

interface BasicOption {
  label: string;
  value: string;
  [key: string]: any;
}

export const useTabs = () => {
  const getTabsList = async (
    pageID: string,
  ): Promise<{
    defaultTab: BasicOption;
    tabs: BasicOption[];
  }> => {
    const { rs, responseObj } = await getTabsListApi({ INTERPAGEID: pageID });
    if (rs !== '1') {
      return {
        defaultTab: {
          label: '',
          value: '',
        },
        tabs: [],
      };
    }
    const tabsParams = JSON.parse(responseObj);
    const tabs = tabsParams.childPageNameList.map((item: BasicOption) => ({
      ...item,
      label: item.pageAlais,
      value: item.pageID,
    }));
    const defaultTab: BasicOption = tabs[0];

    return {
      tabs,
      defaultTab,
    };
  };

  return {
    getTabsList,
  };
};
