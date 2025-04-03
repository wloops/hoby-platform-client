// areaData.ts
import type { AreaData, AreaLevel, AreaNode, GetAreaListParams } from './types';

import { getLoadAreaData } from './areaDataWithCache';

/**
 * 加载地区数据
 */
async function loadAreaData(): Promise<AreaData> {
  return getLoadAreaData();
}

/**
 * 获取地区列表
 */
export async function getAreaList(
  params: GetAreaListParams = {},
): Promise<AreaNode[]> {
  const { condition, province, city } = params;
  const data = await loadAreaData();

  // 1. 获取全国省份列表
  if (condition?.includes('cityID=全国')) {
    return data.map((p) => ({ code: p.code, name: p.name }));
  }

  // 2. 获取指定省份下的城市列表
  if (condition?.includes('cityID=local.province') && province) {
    const provinceNode = data.find((p) => p.name.includes(province));

    if (!provinceNode?.children) return [];
    return provinceNode.children.map((c) => ({ code: c.code, name: c.name }));
  }

  // 3. 获取指定城市下的区县列表
  if (condition?.includes('cityID=local.city') && city) {
    for (const provinceNode of data) {
      if (provinceNode.children) {
        const cityNode = provinceNode.children.find((c) =>
          c.name.includes(city),
        );
        if (cityNode?.children) {
          return cityNode.children.map((d) => ({ code: d.code, name: d.name }));
        }
      }
    }
    return [];
  }

  return [];
}

/**
 * 获取完整省市区树形结构
 */
export async function getAreaTree(): Promise<AreaData> {
  return await loadAreaData();
}

/**
 * 根据code获取地区名称
 */
export async function getAreaNameByCode(
  code: string,
  // level?: AreaLevel,
): Promise<string> {
  const data = await loadAreaData();

  // 递归查找
  function findNode(nodes: AreaNode[]): AreaNode | undefined {
    for (const node of nodes) {
      if (node.code === code) return node;
      if (node.children) {
        const found = findNode(node.children);
        if (found) return found;
      }
    }
  }

  const node = findNode(data);
  return node?.name || '';
}

/**
 * 根据名称获取地区code
 */
export async function getAreaCodeByName(
  name: string,
  level: AreaLevel = 'province',
): Promise<string> {
  const data = await loadAreaData();

  // 根据层级优化查找
  if (level === 'province') {
    const province = data.find((p) => p.name === name);
    return province?.code || '';
  }

  // 查找城市或区县
  function findCode(nodes: AreaNode[], targetName: string): string {
    for (const node of nodes) {
      if (node.name === targetName) return node.code;
      if (node.children) {
        const code = findCode(node.children, targetName);
        if (code) return code;
      }
    }
    return '';
  }

  return findCode(data, name);
}

/**
 * 模糊搜索地区
 */
export async function searchAreas(
  keyword: string,
  limit: number = 50,
): Promise<AreaNode[]> {
  const data = await loadAreaData();
  const results: AreaNode[] = [];

  function searchNodes(nodes: AreaNode[]) {
    for (const node of nodes) {
      if (node.name.includes(keyword)) {
        results.push({ code: node.code, name: node.name });
      }
      if (node.children) {
        searchNodes(node.children);
      }
      if (results.length >= limit) break;
    }
  }

  searchNodes(data);
  return results.slice(0, limit);
}

/**
 * 获取指定层级的下级区域
 */
export async function getSubAreas(
  parentCode: string,
  // level: AreaLevel,
): Promise<AreaNode[]> {
  const data = await loadAreaData();

  function findChildren(nodes: AreaNode[]): AreaNode[] {
    for (const node of nodes) {
      if (node.code === parentCode) {
        return (
          node.children?.map((c) => ({ code: c.code, name: c.name })) || []
        );
      }
      if (node.children) {
        const children = findChildren(node.children);
        if (children.length > 0) return children;
      }
    }
    return [];
  }

  return findChildren(data);
}
