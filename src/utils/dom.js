/**
 * DOM操作工具模块
 * 提供常用的DOM操作工具函数
 */

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 安全地选择单个元素
 * @param {string|HTMLElement} selector - CSS选择器或DOM元素
 * @returns {HTMLElement|null} 找到的元素或null
 */
export function safeSelector(selector) {
  if (!selector) return null;
  if (typeof selector === 'string') {
    return document.querySelector(selector);
  }
  return selector instanceof HTMLElement ? selector : null;
}

/**
 * 安全地选择多个元素
 * @param {string} selector - CSS选择器
 * @returns {NodeList} 找到的元素列表
 */
export function safeSelectorAll(selector) {
  if (!selector || typeof selector !== 'string') {
    return document.createDocumentFragment().childNodes;
  }
  return document.querySelectorAll(selector);
}