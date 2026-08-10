// src/utils/dom.ts v2.1.0
// DOM 操作工具核心：元素查询、批量更新、批量显隐切换、防抖/节流。
// 缓存/事件/元素工厂/样式操作拆分至 ./dom/* 子模块，本文件仅保留编排与公共导出。

import logger from './logger';
import { getCache, validateCacheEntry, generateCacheKey } from './dom/cache';

// 从子模块再导出，保持对外 API 稳定
export {
  addEvent, removeEvent, delegateEvent
} from './dom/events';
export {
  createElement, injectStyle, escapeHtml, addClass, removeClass
} from './dom/factory';
export {
  clearDomCache, getCache, validateCacheEntry, generateCacheKey
} from './dom/cache';

// 获取单个元素（带缓存）
export function getElement(selector: string, parent: ParentNode = document): HTMLElement | null {
  try {
    const cacheKey = generateCacheKey(selector, parent as HTMLElement | Document);
    const cached = getCache().get(cacheKey);
    const now = Date.now();
    if (cached && now - cached.timestamp < 5000) {
      return cached.element as HTMLElement | null;
    }
    const element = (parent as ParentNode).querySelector(selector);
    if (element) {
      const entry = { element, timestamp: now };
      if (validateCacheEntry(entry)) {
        getCache().set(cacheKey, entry);
      }
    }
    return element as HTMLElement | null;
  } catch (error) {
    logger.error(`获取元素失败 (${selector}):`, error);
    return null;
  }
}

// 获取多个元素（带缓存）
export function getElements(selector: string, parent: ParentNode = document): HTMLElement[] {
  try {
    const cacheKey = generateCacheKey(selector, parent as HTMLElement | Document);
    const cached = getCache().get(cacheKey);
    const now = Date.now();
    if (cached && now - cached.timestamp < 5000) {
      return (Array.isArray(cached.element) ? cached.element : [cached.element]) as HTMLElement[];
    }
    const elements = Array.from((parent as ParentNode).querySelectorAll(selector)) as HTMLElement[];
    const entry = { element: elements, timestamp: now };
    if (validateCacheEntry(entry)) {
      getCache().set(cacheKey, entry);
    }
    return elements;
  } catch (error) {
    logger.error(`获取元素列表失败 (${selector}):`, error);
    return [];
  }
}

export function findElementsByClassPattern(...classPatterns: string[]): HTMLElement[] {
  try {
    const results: HTMLElement[] = [];
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      if (element instanceof HTMLElement) {
        for (const pattern of classPatterns) {
          if (element.className && element.className.includes(pattern)) {
            results.push(element);
            break;
          }
        }
      }
    });
    return results;
  } catch (error) {
    logger.error('根据类名模式查找元素失败:', error);
    return [];
  }
}

export function findElementsByStructure(structure: { tag?: string; className?: string; text?: string }): HTMLElement[] {
  try {
    const results: HTMLElement[] = [];
    const selector = structure.tag ? structure.tag : '*';
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element instanceof HTMLElement) {
        if (structure.className && !(element.className && element.className.includes(structure.className))) {
          return;
        }
        if (structure.text && !element.textContent?.includes(structure.text)) {
          return;
        }
        results.push(element);
      }
    });
    return results;
  } catch (error) {
    logger.error('根据结构查找元素失败:', error);
    return [];
  }
}

export function findElementsWithText(text: string, exact = false): HTMLElement[] {
  try {
    const results: HTMLElement[] = [];
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      if (element instanceof HTMLElement) {
        const content = element.textContent || '';
        if (exact ? content === text : content.includes(text)) {
          if (!element.querySelector('*')) {
            results.push(element);
          }
        }
      }
    });
    return results;
  } catch (error) {
    logger.error('根据文本查找元素失败:', error);
    return [];
  }
}

export function batchUpdate(elements: HTMLElement[], updates: Record<string, string>): void {
  try {
    elements.forEach(element => {
      Object.entries(updates).forEach(([property, value]) => {
        element.style.setProperty(property, value);
      });
    });
  } catch (error) {
    logger.error('批量更新元素失败:', error);
  }
}

export function toggleElements(selectors: string[], show: boolean): void {
  try {
    selectors.forEach(selector => {
      const elements = getElements(selector);
      elements.forEach(element => {
        element.style.display = show ? '' : 'none';
      });
    });
  } catch (error) {
    logger.error('切换元素显示状态失败:', error);
  }
}

export function debounce<T extends (...args: unknown[]) => void>(func: T, wait = 300): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>): void => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function throttle<T extends (...args: unknown[]) => void>(func: T, limit = 300): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
