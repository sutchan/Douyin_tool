/**
 * DOM操作工具模块
 * 提供常用的DOM查询、创建、修改和事件处理函数
 */

/**
 * 安全地查询DOM元素
 * @param {string} selector - CSS选择器
 * @param {HTMLElement} context - 上下文元素，默认为document
 * @returns {HTMLElement|null} 找到的元素或null
 */
function $(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (error) {
    console.error(`DOM查询错误 (${selector}):`, error);
    return null;
  }
}

/**
 * 安全地查询多个DOM元素
 * @param {string} selector - CSS选择器
 * @param {HTMLElement} context - 上下文元素，默认为document
 * @returns {NodeList} 找到的元素列表
 */
function $$(selector, context = document) {
  try {
    return context.querySelectorAll(selector);
  } catch (error) {
    console.error(`DOM查询错误 (${selector}):`, error);
    return new NodeList();
  }
}

/**
 * 创建DOM元素
 * @param {string} tagName - 标签名
 * @param {Object} attributes - 元素属性
 * @param {Array|string} children - 子元素或文本内容
 * @returns {HTMLElement} 创建的元素
 */
function createElement(tagName, attributes = {}, children = []) {
  const element = document.createElement(tagName);
  
  // 设置属性
  for (const [key, value] of Object.entries(attributes)) {
    if (key.startsWith('on') && typeof value === 'function') {
      // 处理事件
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'style' && typeof value === 'object') {
      // 处理样式对象
      Object.assign(element.style, value);
    } else {
      // 设置普通属性
      element.setAttribute(key, value);
    }
  }
  
  // 添加子元素
  if (typeof children === 'string') {
    element.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (child instanceof Node) {
        element.appendChild(child);
      } else if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      }
    });
  }
  
  return element;
}

/**
 * 添加CSS类
 * @param {HTMLElement} element - 目标元素
 * @param {string|Array} className - 类名或类名数组
 */
function addClass(element, className) {
  if (!element || !element.classList) return;
  
  if (Array.isArray(className)) {
    className.forEach(cls => element.classList.add(cls));
  } else {
    element.classList.add(className);
  }
}

/**
 * 移除CSS类
 * @param {HTMLElement} element - 目标元素
 * @param {string|Array} className - 类名或类名数组
 */
function removeClass(element, className) {
  if (!element || !element.classList) return;
  
  if (Array.isArray(className)) {
    className.forEach(cls => element.classList.remove(cls));
  } else {
    element.classList.remove(className);
  }
}

/**
 * 切换CSS类
 * @param {HTMLElement} element - 目标元素
 * @param {string} className - 类名
 * @returns {boolean} 切换后的类状态
 */
function toggleClass(element, className) {
  if (!element || !element.classList) return false;
  return element.classList.toggle(className);
}

/**
 * 检查元素是否包含CSS类
 * @param {HTMLElement} element - 目标元素
 * @param {string} className - 类名
 * @returns {boolean} 是否包含该类
 */
function hasClass(element, className) {
  if (!element || !element.classList) return false;
  return element.classList.contains(className);
}

/**
 * 安全地添加事件监听器
 * @param {HTMLElement} element - 目标元素
 * @param {string} eventName - 事件名
 * @param {Function} handler - 事件处理函数
 * @param {Object} options - 事件选项
 */
function addEventListener(element, eventName, handler, options = {}) {
  if (!element || typeof element.addEventListener !== 'function') return;
  element.addEventListener(eventName, handler, options);
}

/**
 * 安全地移除事件监听器
 * @param {HTMLElement} element - 目标元素
 * @param {string} eventName - 事件名
 * @param {Function} handler - 事件处理函数
 * @param {Object} options - 事件选项
 */
function removeEventListener(element, eventName, handler, options = {}) {
  if (!element || typeof element.removeEventListener !== 'function') return;
  element.removeEventListener(eventName, handler, options);
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
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
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 获取元素的计算样式
 * @param {HTMLElement} element - 目标元素
 * @param {string} property - 样式属性名
 * @returns {string} 样式值
 */
function getComputedStyle(element, property) {
  if (!element) return '';
  const computed = window.getComputedStyle(element);
  return computed.getPropertyValue(property);
}

/**
 * 安全地设置元素样式
 * @param {HTMLElement} element - 目标元素
 * @param {string} property - 样式属性
 * @param {string} value - 样式值
 */
function setStyle(element, property, value) {
  if (!element) return;
  try {
    element.style[property] = value;
  } catch (error) {
    console.error(`设置样式错误 (${property}):`, error);
  }
}

/**
 * 安全地设置元素多个样式
 * @param {HTMLElement} element - 目标元素
 * @param {Object} styles - 样式对象
 */
function setStyles(element, styles) {
  if (!element) return;
  try {
    Object.assign(element.style, styles);
  } catch (error) {
    console.error('设置样式错误:', error);
  }
}

/**
 * 检查元素是否在视口中
 * @param {HTMLElement} element - 目标元素
 * @returns {boolean} 是否在视口中
 */
function isInViewport(element) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 获取元素在文档中的位置
 * @param {HTMLElement} element - 目标元素
 * @returns {Object} 位置对象 {top, left}
 */
function getElementPosition(element) {
  if (!element) return { top: 0, left: 0 };
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset
  };
}

/**
 * 安全地移除元素
 * @param {HTMLElement} element - 要移除的元素
 */
function removeElement(element) {
  if (!element || !element.parentNode) return;
  element.parentNode.removeChild(element);
}

/**
 * 克隆元素
 * @param {HTMLElement} element - 要克隆的元素
 * @param {boolean} deep - 是否深度克隆
 * @returns {HTMLElement} 克隆的元素
 */
function cloneElement(element, deep = true) {
  if (!element) return null;
  try {
    return element.cloneNode(deep);
  } catch (error) {
    console.error('克隆元素错误:', error);
    return null;
  }
}

/**
 * 插入元素到目标元素之后
 * @param {HTMLElement} newElement - 新元素
 * @param {HTMLElement} targetElement - 目标元素
 */
function insertAfter(newElement, targetElement) {
  if (!newElement || !targetElement || !targetElement.parentNode) return;
  targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling);
}

/**
 * 插入元素到目标元素之前
 * @param {HTMLElement} newElement - 新元素
 * @param {HTMLElement} targetElement - 目标元素
 */
function insertBefore(newElement, targetElement) {
  if (!newElement || !targetElement || !targetElement.parentNode) return;
  targetElement.parentNode.insertBefore(newElement, targetElement);
}