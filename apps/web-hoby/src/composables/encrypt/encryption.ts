/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-04 19:12:45
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-05 17:30:05
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\composables\encrypt\encryption.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import JSEncrypt from 'jsencrypt';

// interface EncryptionData {
//   password: string;
//   captcha?: string;
// }

export function encryption(pkbase64: string, data: string): string {
  // 密码前面添加4位长度
  let newPassword = prefixZero(data.length * 2, 4);
  newPassword = newPassword + stringToHex(data);

  // 使用标准RSA算法处理
  const privateKey = `-----BEGIN PUBLIC KEY-----${pkbase64}-----END PUBLIC KEY-----`;
  const encryptedPassword = encryptedData(privateKey, newPassword);
  // const passwordTemp = encryptedPassword.replaceAll('+', '%2B');
  return encryptedPassword;
}

function prefixZero(num: number, n: number): string {
  return (Array.from({ length: n }).join('0') + num).slice(-n);
}

function stringToHex(str: string): string {
  let val = '';
  for (let i = 0; i < str.length; i++) {
    const temp = str.codePointAt(i)?.toString(16) || '';
    val += temp.length === 1 ? `0${temp}` : temp;
  }
  return val.toUpperCase();
}

function encryptedData(publicKey: string, password: string): string {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encrypt.encrypt(password) || '';
}
