// src/utils/dom/factory.ts v2.1.0
// 元素创建、样式注入与 HTML 转义工具，拆分自 dom.ts

import logger from '../logger';
import { addClass, removeClass } from './styleOps';

// HTML 特殊字符转义，防止注入
export function escapeHtml(html: string): string {
  if (typeof html !== 'string') return '';
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: ElementCreationOptions = {}
): HTMLElementTagNameMap[K] {
  try {
    const element = document.createElement(tagName, options);
    addClass(element, 'douyin-customizer-element');
    return element;
  } catch (error) {
    logger.error(`创建元素失败 (${tagName}):`, error);
    throw error;
  }
}

export function injectStyle(css: string, id: string): void {
  try {
    if (!css || typeof css !== 'string') {
      logger.warn('injectStyle: css 为空或类型错误');
      return;
    }
    let styleElement = document.getElementById(id) as HTMLStyleElement | null;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = id;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = css;
  } catch (error) {
    logger.error(`注入样式失败 (${id}):`, error);
  }
}

export { addClass, removeClass };
