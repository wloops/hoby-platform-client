/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-03 13:45:06
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-08 13:49:01
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\composables\area\areaDataWithCache.ts
 * @Description: 地区数据缓存处理工具
 */
import type { AreaData } from './types';

const AREA_DATA_URL = 'data/areaData.json';
const CACHE_KEY = 'areaDataCache';

let memoryCache: AreaData | null = null;

interface CachedData {
  data: AreaData;
  timestamp: number;
  dataVersion: string; // 改为数据本身的版本标识
}

/**
 * 从缓存加载数据
 */
async function loadFromCache(): Promise<AreaData | null> {
  // 内存缓存优先
  if (memoryCache) return memoryCache;

  // 尝试从localStorage获取
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    const { data, timestamp, dataVersion }: CachedData = JSON.parse(cached);

    // 检查数据版本是否变化（假设数据本身包含version字段）
    if (dataVersion !== getDataVersion(data)) return null;

    // 检查缓存有效期（1天）
    const isExpired = Date.now() - timestamp > 86_400_000;
    if (isExpired) return null;

    memoryCache = data;
    return data;
  } catch (error) {
    console.error('解析缓存数据失败:', error);
    return null;
  }
}

/**
 * 从数据中提取版本信息
 * 假设数据格式为：[{..., version?: string}, ...]
 */
function getDataVersion(_data: AreaData): string {
  // 如果数据中有版本字段则使用，否则使用默认值
  // return data[0]?.version || 'default-version';
  return 'default-version';
}

/**
 * 保存数据到缓存
 */
function saveToCache(data: AreaData): void {
  const cache: CachedData = {
    data,
    timestamp: Date.now(),
    dataVersion: getDataVersion(data), // 从数据中提取版本
  };

  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  memoryCache = data;
}

/**
 * 加载地区数据（带缓存机制）
 */
export async function getLoadAreaData(): Promise<AreaData> {
  // 尝试从缓存加载
  const cachedData = await loadFromCache();
  if (cachedData) return cachedData;

  // 从网络加载
  try {
    // const response = await fetch(AREA_DATA_URL);
    // const data: AreaData = await response.json();
    const data: AreaData = await loadPublicFile(AREA_DATA_URL);

    // 保存到缓存
    saveToCache(data);
    return data;
  } catch (error) {
    console.error('加载地区数据失败:', error);
    throw new Error('加载地区数据失败');
  }
}

// 动态获取文件路径
function getPublicFileUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}
// 读取文件内容
async function loadPublicFile(path: string) {
  const fileUrl = getPublicFileUrl(path);
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}`);
    }
    const data = await response.json(); // 假设是 JSON 文件
    return data;
  } catch (error) {
    console.error('Error loading file:', error);
    return null;
  }
}

/**
 * 清除地区数据缓存
 */
export function clearAreaCache(): void {
  memoryCache = null;
  localStorage.removeItem(CACHE_KEY);
}

/**
 * 强制刷新地区数据
 */
export async function refreshAreaData(): Promise<AreaData> {
  clearAreaCache();
  return await getLoadAreaData();
}
