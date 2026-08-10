// src/utils/dom/styleOps.ts v2.1.0
// 元素 class 增删操作，拆分自 dom.ts

import logger from '../logger';

export function addClass(element: HTMLElement | null, className: string): void {
  try {
    if (element && className && !element.classList.contains(className)) {
      element.classList.add(className);
    }
  } catch (error) {
    logger.error(`添加类名失败 (${className}):`, error);
  }
}

export function removeClass(element: HTMLElement | null, className: string): void {
  try {
    if (element && className && element.classList.contains(className)) {
      element.classList.remove(className);
    }
  } catch (error) {
    logger.error(`移除类名失败 (${className}):`, error);
  }
}
