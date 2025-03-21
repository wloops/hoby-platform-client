import type { IncomingMessage } from 'node:http';

import { Buffer } from 'node:buffer';

import { defineConfig } from '@vben/vite-config';

import qs from 'qs';

/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-03 21:58:41
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-14 11:29:17
 * @FilePath: \hoby-platform-client\apps\web-hoby\vite.config.mts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

interface ExtendedIncomingMessage extends IncomingMessage {
  body?: any;
}

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            configure: (proxy) => {
              proxy.on('proxyReq', (proxyReq, req: ExtendedIncomingMessage) => {
                if (req.body) {
                  const bodyData = qs.stringify(req.body); // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
                  let contentType = req.headers['content-type'];
                  if (!contentType) {
                    contentType = 'application/x-www-form-urlencoded';
                  }
                  proxyReq.setHeader('Content-Type', contentType);
                  proxyReq.setHeader(
                    'Content-Length',
                    Buffer.byteLength(bodyData),
                  ); // stream the content
                  proxyReq.write(bodyData);
                }
              });
            },
            credentials: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            secure: false,
            target:
              'http://795tg1082ff7.vicp.fun/java-hoby-member-service-plug-plat/',
            ws: true,
          },
        },
      },
    },
  };
});
