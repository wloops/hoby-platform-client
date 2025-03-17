/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-17 11:11:02
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-17 11:14:27
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\composables\useParseResponse.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-17 11:11:02
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-17 11:14:02
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\composables\useParseResponse.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
interface ResponseResult {
  success: boolean; // 是否成功
  code: null | number; // 错误码（失败时）
  message: null | string; // 错误信息（失败时）
}

/**
 * 解析接口响应
 * @param response 接口返回的数据
 * @returns 返回解析后的结果，包含是否成功、错误码和错误信息
 */
export function useParseResponse(response: unknown): ResponseResult {
  // 如果返回的是 '1' 或 1，表示成功
  if (response === '1' || response === 1) {
    return {
      success: true,
      code: null,
      message: null,
    };
  }

  // 如果返回的是字符串，尝试提取错误码和错误信息
  if (typeof response === 'string') {
    const match = response.match(/\[(-?\d+)\](.+)/);
    if (match) {
      return {
        success: false,
        code: Number.parseInt(match[1] ?? '0', 10), // 提取错误码
        message: match[2]?.trim() ?? '操作失败', // 提取错误信息
      };
    }
  }

  // 如果返回的是数字，表示错误码
  if (typeof response === 'number') {
    return {
      success: false,
      code: response,
      message: '操作失败', // 默认错误信息
    };
  }

  // 如果返回的是对象，尝试解析 code 和 message
  if (typeof response === 'object' && response !== null) {
    const { code, message } = response as { code?: unknown; message?: unknown };

    // 如果 code 是 '1' 或 1，表示成功
    if (code === '1' || code === 1) {
      return {
        success: true,
        code: null,
        message: null,
      };
    }

    // 如果 code 是数字或字符串，表示错误码
    if (typeof code === 'number' || typeof code === 'string') {
      return {
        success: false,
        code: typeof code === 'string' ? Number.parseInt(code, 10) : code,
        message: typeof message === 'string' ? message : '操作失败',
      };
    }
  }

  // 其他情况，返回默认失败结果
  return {
    success: false,
    code: null,
    message: '未知错误',
  };
}
