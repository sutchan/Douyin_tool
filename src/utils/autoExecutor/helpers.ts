// src/utils/autoExecutor/helpers.ts v2.1.0
// AutoExecutor 的纯辅助函数：元素选择器生成与截图占位，拆分自 autoExecutor.ts

import logger from '../logger';

// 生成元素的唯一 CSS 选择器（优先 id，其次唯一 class，最后路径）
export function getElementSelector(element: HTMLElement | null): string {
  if (!element) return '';

  try {
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className && typeof element.className === 'string') {
      const classes = element.className.trim().split(/\s+/);
      for (const cls of classes) {
        if (document.querySelectorAll(`.${cls}`).length === 1) {
          return `.${cls}`;
        }
      }
    }

    const path: string[] = [];
    let current: HTMLElement | null = element;

    while (current && current.tagName) {
      let selector = current.tagName.toLowerCase();

      if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\s+/);
        selector += '.' + classes.join('.');
      }

      path.unshift(selector);
      current = current.parentElement;
    }

    return path.join(' > ');
  } catch {
    return element.tagName.toLowerCase();
  }
}

// 截图占位实现：实际页面截图需结合外部 API，此处仅做日志记录
export function captureScreenshot(type: string): void {
  try {
    if (typeof HTMLCanvasElement !== 'undefined') {
      logger.info(`AutoExecutor capturing screenshot: ${type}`);
    }
  } catch (error) {
    logger.error('AutoExecutor failed to capture screenshot:', error);
  }
}
