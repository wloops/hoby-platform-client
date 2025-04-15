/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-15 11:52:28
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-15 15:15:29
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\composables\table\useSetButtons.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useMacroValue } from '#/composables';

export const useSetButtons = () => {
  const setButtonParams = (buttons: any[]): any[] => {
    return buttons.map((btn: any) => {
      let runMode = 'default';
      let pageID = btn.pageID;
      // inputPageIDList
      if (btn.inputPageIDList) {
        const pageIDList = btn.inputPageIDList.split(',');
        // 如果pageIDList数量大于1,则是分步表单,否则是单表
        pageID = pageIDList.length === 1 ? pageIDList[0] : btn.pageID;
        if (pageIDList.length > 1) {
          runMode = 'drawer';
        }
      }
      return {
        text: btn.displayName,
        type: 'link',
        visible: true,
        runMode,
        batchable: btn.isSingleOperation !== 1,
        confirm: btn.isNeedConfirm === 1 ? 'auto' : false,
        params: (record: any) => ({
          pageID,
          pageButtonID: btn.pageButtonID,
          ...record,
        }),
      };
    });
  };
  return { setButtonParams, setButtonSubmitParams };
};

const setButtonSubmitParams = (
  params: any[],
  currentFormData: any,
  entryRecordData: any,
): any => {
  const { getValueByMacro } = useMacroValue({
    currentFormData,
    entryRecordData,
  });
  const _params = {};
  params.forEach((item) => {
    const value = getValueByMacro(
      item.methodID,
      item.fieldName,
      item.methodVar,
    );
    (_params as Record<string, any>)[item.fieldName] = value;
  });

  return _params;
};
