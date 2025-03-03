import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target:
              'http://795tg1082ff7.vicp.fun/java-cloud-cipher-service-enterprise-service-plug-plat/',
            ws: true,
          },
        },
      },
    },
  };
});
