import type { RouteRecordRaw } from 'vue-router';

import { mergeRouteModules } from '@vben/utils';

export const useDynamicRoutes = (fileName: string) => {
  const routeFiles: Record<string, { default: RouteRecordRaw[] }> =
    import.meta.glob(`../router/routes/modules/**/*.ts`, {
      eager: true,
    });

  const filteredRoutes = Object.fromEntries(
    Object.entries(routeFiles).filter(([path]) => path.includes(fileName)),
  );

  /** 动态路由 */
  const dynamicRoutes: RouteRecordRaw[] = mergeRouteModules(filteredRoutes);
  return dynamicRoutes;
};
