// src/utils/dom/cache.ts v2.1.0
// DOM 查询结果缓存与清理逻辑，拆分自 dom.ts

import logger from '../logger';

// 本地缓存条目类型（不依赖外部 DOMCacheEntry，避免结构与缓存读写不一致）
export interface CacheEntry {
  element: HTMLElement | HTMLElement[];
  timestamp: number;
}

const domCache = new Map<string, CacheEntry>();
const cacheExpiry = 5000;

// 生产环境使用的轻量缓存条目校验（仅检查必要字段）
function isValidCacheEntry(entry: unknown): entry is CacheEntry {
  if (typeof entry !== 'object' || entry === null) {
    return false;
  }
  const e = entry as Record<string, unknown>;
  return typeof e.timestamp === 'number' &&
    (Array.isArray(e.element) || e.element instanceof HTMLElement);
}

export const validateCacheEntry = isValidCacheEntry;

export function generateCacheKey(selector: string | RegExp, parent: HTMLElement | Document = document): string {
  const selectorStr = typeof selector === 'string' ? selector : selector.toString();
  let parentStr = 'document';
  if (parent !== document && 'id' in parent) {
    parentStr = parent.id || parent.className || parent.tagName;
  }
  return `${selectorStr}_${parentStr}`;
}

function cleanupCache(): void {
  const now = Date.now();
  for (const [key, { timestamp }] of domCache.entries()) {
    if (now - timestamp > cacheExpiry) {
      domCache.delete(key);
    }
  }
}

let cleanupInterval: ReturnType<typeof setInterval> = setInterval(cleanupCache, cacheExpiry * 2);

export function stopCacheCleanup(): void {
  clearInterval(cleanupInterval);
}

export function clearDomCache(): void {
  domCache.clear();
  logger.info('DOM缓存已清理');
}

export function getCache(): Map<string, CacheEntry> {
  return domCache;
}
