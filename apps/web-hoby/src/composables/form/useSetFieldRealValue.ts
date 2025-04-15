import { useUserStore } from '@vben/stores';

/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-10 16:36:57
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-15 13:55:33
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\composables\form\useSetFieldRealValue.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getPKApi } from '#/api';
import { encryption } from '#/composables';

export interface ActionUserMap {
  /** 操作人姓名 */
  tellerName?: string;
  /** 操作人账号 */
  tellerNo?: string;
  /** 操作人公司名称 */
  tellerCompanyName?: string;
  /** 操作人公司名称 */
  TELLERCOMPANY?: string;
  /** 操作人姓名 */
  TELLERNAME?: string;
  /** 操作人ID */
  memberID?: string;
  [key: string]: any;
}

export function useSetFieldRealValue() {
  /**
   * 加密表单值
   * @param values 表单值
   * @param schema 表单配置
   * @returns 加密后的表单值
   */
  const encryptionFormValues = async (
    values: Record<string, any>,
    schema: any,
  ) => {
    const formValues = {
      ...values,
    };
    const { pkkey: pk } = await getPKApi();
    const needEncryptionFields = new Set(['oldPassword', 'passwordEncBypk']);
    schema.forEach((item: any) => {
      const fieldType = item?.componentProps?.fieldType;
      if (needEncryptionFields.has(fieldType) && values[item.fieldName]) {
        formValues[item.fieldName] = encryptPasswordForPublicKey(
          values[item.fieldName],
          pk,
          true,
        );
      }
    });
    return formValues;
  };
  /**
   * 加密密码
   * @param value 密码
   * @param isHex 是否转换为hex
   * @returns 加密后的密码
   */
  const encryptPasswordForPublicKey = (
    value: string,
    pk: string,
    isHex = true,
  ) => {
    const encryptedPassword = encryption(pk, value);
    return isHex ? processCipherText(encryptedPassword) : encryptedPassword;
  };
  /**
   * 获取actionUserMap
   * @returns actionUserMap
   */
  const getActionUserMap = (): ActionUserMap => {
    const userStore = useUserStore();
    const actionUserMap: ActionUserMap = {
      ...userStore.userInfo,
      tellerName: userStore.userInfo?.TELLERNAME,
      tellerCompanyName: userStore.userInfo?.TELLERCOMPANY,
    };
    return actionUserMap;
  };

  return {
    encryptPasswordForPublicKey,
    encryptionFormValues,
    getActionUserMap,
  };
}

function decodeBase64(base64String: string): Uint8Array {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    // eslint-disable-next-line unicorn/prefer-code-point
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function byte2hex(bytes: Uint8Array): string {
  let hexStr = '';
  for (const byte of bytes) {
    // eslint-disable-next-line unicorn/number-literal-case
    const hex = (byte & 0xff).toString(16);
    // Pad with leading zero if needed
    hexStr += hex.length === 1 ? `0${hex}` : hex;
  }
  return hexStr;
}

// 加密主函数
function processCipherText(cipherText: string): string {
  const decodedBytes = decodeBase64(cipherText);
  return byte2hex(decodedBytes).toUpperCase();
}
