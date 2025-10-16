// ==UserScript==
// @name         douyin-ui-customizer
// @namespace    https://github.com/SutChan/douyin_tool
// @version      1.0.12
// @description  抖音Web端界面UI定制工具
// @author       SutChan
// @match        https://www.douyin.com/*
// @match        https://*.douyin.com/*
// @icon         https://www.douyin.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @updateURL    https://github.com/SutChan/douyin_tool/raw/main/dist/douyin_ui_customizer.user.js
// @downloadURL  https://github.com/SutChan/douyin_tool/raw/main/dist/douyin_ui_customizer.user.js
// @license      MIT
// ==/UserScript==
/* eslint-disable */
// @ts-nocheck


    // CSS样式
    const defaultStyles = `/**
 * 抖音UI定制工具 - 默认样式
 */

/* 设置面板样式 */
.douyin-ui-customizer-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 999999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.douyin-ui-customizer-panel .panel-header {
  padding: 20px;
  background: #000000;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.douyin-ui-customizer-panel .panel-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.douyin-ui-customizer-panel .close-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.douyin-ui-customizer-panel .close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.douyin-ui-customizer-panel .panel-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.douyin-ui-customizer-panel .settings-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.douyin-ui-customizer-panel .tab-btn {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
}

.douyin-ui-customizer-panel .tab-btn:hover {
  background: #e8e8e8;
}

.douyin-ui-customizer-panel .tab-btn.active {
  background: #000000;
  color: #ffffff;
  border-color: #000000;
}

.douyin-ui-customizer-panel .tab-content {
  display: none;
}

.douyin-ui-customizer-panel .tab-content.active {
  display: block;
}

.douyin-ui-customizer-panel .setting-group {
  margin-bottom: 25px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
}

.douyin-ui-customizer-panel .setting-group h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}

.douyin-ui-customizer-panel label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #555555;
  transition: color 0.2s;
}

.douyin-ui-customizer-panel label:hover {
  color: #000000;
}

.douyin-ui-customizer-panel input[type="checkbox"],
.douyin-ui-customizer-panel input[type="radio"] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.douyin-ui-customizer-panel input[type="number"],
.douyin-ui-customizer-panel input[type="text"],
.douyin-ui-customizer-panel select {
  margin-left: 8px;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.douyin-ui-customizer-panel input[type="range"] {
  margin-left: 8px;
  margin-right: 8px;
  flex: 1;
}

.douyin-ui-customizer-panel input[type="color"] {
  margin-left: 8px;
  width: 40px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.douyin-ui-customizer-panel .panel-footer {
  padding: 20px;
  background: #f8f8f8;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.douyin-ui-customizer-panel .save-btn,
.douyin-ui-customizer-panel .reset-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.douyin-ui-customizer-panel .save-btn {
  background: #000000;
  color: #ffffff;
}

.douyin-ui-customizer-panel .save-btn:hover {
  background: #333333;
}

.douyin-ui-customizer-panel .reset-btn {
  background: #ffffff;
  color: #666666;
  border: 1px solid #ddd;
}

.douyin-ui-customizer-panel .reset-btn:hover {
  background: #f0f0f0;
  color: #333333;
}

.douyin-ui-customizer-panel button#exportBtn,
.douyin-ui-customizer-panel button#importBtn {
  padding: 8px 16px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 10px;
  transition: background-color 0.2s;
}

.douyin-ui-customizer-panel button#exportBtn:hover,
.douyin-ui-customizer-panel button#importBtn:hover {
  background: #333333;
}

.douyin-ui-customizer-panel input[type="file"] {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.douyin-ui-customizer-panel p {
  font-size: 13px;
  color: #777777;
  margin-top: 5px;
  line-height: 1.5;
}

/* 工具提示样式 */
.douyin-ui-customizer-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 999999;
  white-space: nowrap;
}

/* 滚动条样式 */
.douyin-ui-customizer-panel ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.douyin-ui-customizer-panel ::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.douyin-ui-customizer-panel ::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.douyin-ui-customizer-panel ::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .douyin-ui-customizer-panel {
    width: 95%;
    max-width: none;
    margin: 10px;
    top: 10px;
    left: 10px;
    transform: none;
    max-height: calc(100vh - 20px);
  }
  
  .douyin-ui-customizer-panel .settings-tabs {
    flex-wrap: wrap;
  }
  
  .douyin-ui-customizer-panel .panel-footer {
    flex-direction: column;
  }
  
  .douyin-ui-customizer-panel .save-btn,
  .douyin-ui-customizer-panel .reset-btn {
    width: 100%;
  }
}`;
    const darkStyles = `/**
 * 抖音UI定制工具 - 暗黑模式样式
 */

/* 设置面板样式 */
.douyin-ui-customizer-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background: #1a1a1a;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 999999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.douyin-ui-customizer-panel .panel-header {
  padding: 20px;
  background: #2d2d2d;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #3d3d3d;
}

.douyin-ui-customizer-panel .panel-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.douyin-ui-customizer-panel .close-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.douyin-ui-customizer-panel .close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.douyin-ui-customizer-panel .panel-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.douyin-ui-customizer-panel .settings-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #3d3d3d;
  padding-bottom: 10px;
}

.douyin-ui-customizer-panel .tab-btn {
  background: #2d2d2d;
  border: 1px solid #3d3d3d;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  color: #cccccc;
}

.douyin-ui-customizer-panel .tab-btn:hover {
  background: #3d3d3d;
  color: #ffffff;
}

.douyin-ui-customizer-panel .tab-btn.active {
  background: #ffffff;
  color: #1a1a1a;
  border-color: #ffffff;
}

.douyin-ui-customizer-panel .tab-content {
  display: none;
}

.douyin-ui-customizer-panel .tab-content.active {
  display: block;
}

.douyin-ui-customizer-panel .setting-group {
  margin-bottom: 25px;
  padding: 15px;
  background: #2d2d2d;
  border-radius: 8px;
}

.douyin-ui-customizer-panel .setting-group h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.douyin-ui-customizer-panel label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #cccccc;
  transition: color 0.2s;
}

.douyin-ui-customizer-panel label:hover {
  color: #ffffff;
}

.douyin-ui-customizer-panel input[type="checkbox"],
.douyin-ui-customizer-panel input[type="radio"] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.douyin-ui-customizer-panel input[type="number"],
.douyin-ui-customizer-panel input[type="text"],
.douyin-ui-customizer-panel select {
  margin-left: 8px;
  padding: 6px 10px;
  border: 1px solid #4d4d4d;
  border-radius: 4px;
  font-size: 14px;
  background: #1a1a1a;
  color: #ffffff;
}

.douyin-ui-customizer-panel input[type="number"]:focus,
.douyin-ui-customizer-panel input[type="text"]:focus,
.douyin-ui-customizer-panel select:focus {
  outline: none;
  border-color: #ffffff;
}

.douyin-ui-customizer-panel input[type="range"] {
  margin-left: 8px;
  margin-right: 8px;
  flex: 1;
}

.douyin-ui-customizer-panel input[type="color"] {
  margin-left: 8px;
  width: 40px;
  height: 30px;
  border: 1px solid #4d4d4d;
  border-radius: 4px;
  cursor: pointer;
}

.douyin-ui-customizer-panel .panel-footer {
  padding: 20px;
  background: #2d2d2d;
  border-top: 1px solid #3d3d3d;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.douyin-ui-customizer-panel .save-btn,
.douyin-ui-customizer-panel .reset-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.douyin-ui-customizer-panel .save-btn {
  background: #ffffff;
  color: #1a1a1a;
}

.douyin-ui-customizer-panel .save-btn:hover {
  background: #e0e0e0;
}

.douyin-ui-customizer-panel .reset-btn {
  background: #1a1a1a;
  color: #cccccc;
  border: 1px solid #4d4d4d;
}

.douyin-ui-customizer-panel .reset-btn:hover {
  background: #3d3d3d;
  color: #ffffff;
}

.douyin-ui-customizer-panel button#exportBtn,
.douyin-ui-customizer-panel button#importBtn {
  padding: 8px 16px;
  background: #ffffff;
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 10px;
  transition: background-color 0.2s;
}

.douyin-ui-customizer-panel button#exportBtn:hover,
.douyin-ui-customizer-panel button#importBtn:hover {
  background: #e0e0e0;
}

.douyin-ui-customizer-panel input[type="file"] {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #4d4d4d;
  border-radius: 4px;
  font-size: 14px;
  background: #1a1a1a;
  color: #ffffff;
}

.douyin-ui-customizer-panel p {
  font-size: 13px;
  color: #999999;
  margin-top: 5px;
  line-height: 1.5;
}

/* 工具提示样式 */
.douyin-ui-customizer-tooltip {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  color: #1a1a1a;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 999999;
  white-space: nowrap;
}

/* 滚动条样式 */
.douyin-ui-customizer-panel ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.douyin-ui-customizer-panel ::-webkit-scrollbar-track {
  background: #3d3d3d;
  border-radius: 4px;
}

.douyin-ui-customizer-panel ::-webkit-scrollbar-thumb {
  background: #666666;
  border-radius: 4px;
}

.douyin-ui-customizer-panel ::-webkit-scrollbar-thumb:hover {
  background: #888888;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .douyin-ui-customizer-panel {
    width: 95%;
    max-width: none;
    margin: 10px;
    top: 10px;
    left: 10px;
    transform: none;
    max-height: calc(100vh - 20px);
  }
  
  .douyin-ui-customizer-panel .settings-tabs {
    flex-wrap: wrap;
  }
  
  .douyin-ui-customizer-panel .panel-footer {
    flex-direction: column;
  }
  
  .douyin-ui-customizer-panel .save-btn,
  .douyin-ui-customizer-panel .reset-btn {
    width: 100%;
  }
}`;
    
    // 工具函数和基础模块
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
    /**
 * 本地存储工具模块
 * 提供数据存储、读取、删除等功能，支持自动序列化和反序列化
 */

/**
 * 安全地获取本地存储数据
 * @param {string} key - 存储键名
 * @param {*} defaultValue - 默认值，当没有找到数据时返回
 * @returns {*} 存储的数据或默认值
 */
function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`获取本地存储数据失败 (${key}):`, error);
    return defaultValue;
  }
}

/**
 * 安全地设置本地存储数据
 * @param {string} key - 存储键名
 * @param {*} value - 要存储的数据
 * @returns {boolean} 是否存储成功
 */
function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`设置本地存储数据失败 (${key}):`, error);
    return false;
  }
}

/**
 * 安全地移除本地存储数据
 * @param {string} key - 存储键名
 * @returns {boolean} 是否移除成功
 */
function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`移除本地存储数据失败 (${key}):`, error);
    return false;
  }
}

/**
 * 安全地清空所有本地存储数据
 * @returns {boolean} 是否清空成功
 */
function clear() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('清空本地存储数据失败:', error);
    return false;
  }
}

/**
 * 检查是否存在指定的存储键
 * @param {string} key - 存储键名
 * @returns {boolean} 是否存在
 */
function hasItem(key) {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`检查存储键失败 (${key}):`, error);
    return false;
  }
}

/**
 * 获取所有存储键名
 * @returns {string[]} 键名数组
 */
function getAllKeys() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i));
    }
    return keys;
  } catch (error) {
    console.error('获取所有存储键失败:', error);
    return [];
  }
}

/**
 * 批量获取存储数据
 * @param {string[]} keys - 键名数组
 * @returns {Object} 键值对对象
 */
function getItems(keys) {
  const result = {};
  keys.forEach(key => {
    result[key] = getItem(key);
  });
  return result;
}

/**
 * 批量设置存储数据
 * @param {Object} items - 键值对对象
 * @returns {boolean} 是否全部设置成功
 */
function setItems(items) {
  let success = true;
  Object.entries(items).forEach(([key, value]) => {
    if (!setItem(key, value)) {
      success = false;
    }
  });
  return success;
}

/**
 * 批量移除存储数据
 * @param {string[]} keys - 键名数组
 * @returns {boolean} 是否全部移除成功
 */
function removeItems(keys) {
  let success = true;
  keys.forEach(key => {
    if (!removeItem(key)) {
      success = false;
    }
  });
  return success;
}

/**
 * 获取本地存储使用情况
 * @returns {Object} 存储使用情况信息
 */
function getStorageInfo() {
  try {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      totalSize += key.length + value.length;
    }
    
    return {
      itemCount: localStorage.length,
      totalSize: totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      quota: getStorageQuota()
    };
  } catch (error) {
    console.error('获取存储信息失败:', error);
    return {
      itemCount: 0,
      totalSize: 0,
      totalSizeKB: '0',
      quota: null
    };
  }
}

/**
 * 估算本地存储配额（浏览器限制）
 * @returns {number|null} 配额大小（字节）或null
 */
function getStorageQuota() {
  try {
    // 这是一个估算方法，不同浏览器可能有不同的限制
    // 通常本地存储配额为5MB
    return 5 * 1024 * 1024;
  } catch (error) {
    console.error('获取存储配额失败:', error);
    return null;
  }
}

/**
 * 检查本地存储是否可用
 * @returns {boolean} 是否可用
 */
function isStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 创建带过期时间的存储项
 * @param {string} key - 存储键名
 * @param {*} value - 要存储的数据
 * @param {number} ttl - 过期时间（毫秒）
 * @returns {boolean} 是否存储成功
 */
function setItemWithExpiry(key, value, ttl) {
  const item = {
    value: value,
    expiry: Date.now() + ttl
  };
  return setItem(key, item);
}

/**
 * 获取带过期时间的存储项
 * @param {string} key - 存储键名
 * @param {*} defaultValue - 默认值
 * @returns {*} 存储的数据或默认值
 */
function getItemWithExpiry(key, defaultValue = null) {
  const item = getItem(key);
  
  // 如果不存在或不是有效的过期项，返回默认值
  if (!item || typeof item !== 'object' || !item.hasOwnProperty('expiry')) {
    return defaultValue;
  }
  
  // 检查是否过期
  if (Date.now() > item.expiry) {
    // 过期了，移除该项
    removeItem(key);
    return defaultValue;
  }
  
  return item.value;
}

/**
 * 保存配置到本地存储（带版本号）
 * @param {string} appName - 应用名称
 * @param {Object} config - 配置对象
 * @param {string} version - 版本号
 * @returns {boolean} 是否保存成功
 */
function saveConfigWithVersion(appName, config, version) {
  const configWithVersion = {
    version: version,
    config: config,
    savedAt: new Date().toISOString()
  };
  return setItem(`${appName}_config`, configWithVersion);
}

/**
 * 加载配置（支持版本检查）
 * @param {string} appName - 应用名称
 * @param {Object} defaultConfig - 默认配置
 * @param {string} currentVersion - 当前版本号
 * @returns {Object} 配置对象
 */
function loadConfigWithVersion(appName, defaultConfig, currentVersion) {
  const saved = getItem(`${appName}_config`);
  
  if (saved && saved.version === currentVersion) {
    // 版本匹配，返回保存的配置
    return saved.config;
  }
  
  // 版本不匹配或没有保存的配置，返回默认配置
  return defaultConfig;
}

/**
 * 导出本地存储数据为JSON文件
 * @param {string} filename - 文件名
 */
function exportStorageToJson(filename = 'storage-export.json') {
  try {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = getItem(key);
    }
    
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('导出存储数据失败:', error);
  }
}

/**
 * 从JSON文件导入本地存储数据
 * @param {File} file - JSON文件对象
 * @param {Function} callback - 完成回调函数
 */
function importStorageFromJson(file, callback) {
  const reader = new FileReader();
  
  reader.onload = function(event) {
    try {
      const data = JSON.parse(event.target.result);
      
      // 清空现有存储
      clear();
      
      // 导入数据
      Object.entries(data).forEach(([key, value]) => {
        setItem(key, value);
      });
      
      callback(true);
    } catch (error) {
      console.error('导入存储数据失败:', error);
      callback(false, error);
    }
  };
  
  reader.onerror = function() {
    callback(false, new Error('文件读取失败'));
  };
  
  reader.readAsText(file);
}
    /**
 * 配置管理模块
 * 负责处理配置的加载、保存和默认设置
 */

/**
 * 默认配置
 */
const DEFAULT_CONFIG = {
  theme: 'light', // light 或 dark
  
  // 短视频界面配置
  videoUI: {
    showLikeButton: true,
    showCommentButton: true,
    showShareButton: true,
    showAuthorInfo: true,
    showMusicInfo: true,
    showDescription: true,
    showRecommendations: true,
    layout: 'default',
    controlBar: {
      show: true,
      autoHide: true,
      position: 'bottom'
    }
  },
  
  // 直播间界面配置
  liveUI: {
    showGifts: true,
    showDanmaku: true,
    showRecommendations: true,
    showAds: false,
    showStats: true,
    danmaku: {
      fontSize: 16,
      color: '#FFFFFF',
      opacity: 0.8,
      speed: 'medium',
      position: 'top'
    },
    layout: 'default'
  },
  
  // 通用配置
  general: {
    autoPlay: true,
    autoScroll: false,
    keyboardShortcuts: true,
    notifications: false
  }
};

/**
 * 加载配置
 * @returns {Object} 配置对象
 */
function loadConfig() {
  try {
    const savedConfig = GM_getValue('douyin_ui_customizer_config');
    if (savedConfig) {
      // 合并保存的配置和默认配置，确保所有必需字段都存在
      return mergeConfig(savedConfig, DEFAULT_CONFIG);
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('加载配置失败：', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * 保存配置
 * @param {Object} config - 要保存的配置对象
 */
function saveConfig(config) {
  try {
    GM_setValue('douyin_ui_customizer_config', config);
    console.log('配置已保存');
  } catch (error) {
    console.error('保存配置失败：', error);
  }
}

/**
 * 重置配置为默认值
 */
function resetConfig() {
  try {
    GM_setValue('douyin_ui_customizer_config', DEFAULT_CONFIG);
    console.log('配置已重置为默认值');
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('重置配置失败：', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * 合并配置对象
 * @param {Object} userConfig - 用户配置
 * @param {Object} defaultConfig - 默认配置
 * @returns {Object} 合并后的配置
 */
function mergeConfig(userConfig, defaultConfig) {
  const merged = { ...defaultConfig };
  
  for (const key in userConfig) {
    if (userConfig.hasOwnProperty(key)) {
      if (typeof userConfig[key] === 'object' && userConfig[key] !== null && 
          typeof defaultConfig[key] === 'object' && defaultConfig[key] !== null &&
          !Array.isArray(userConfig[key]) && !Array.isArray(defaultConfig[key])) {
        // 递归合并嵌套对象
        merged[key] = mergeConfig(userConfig[key], defaultConfig[key]);
      } else {
        merged[key] = userConfig[key];
      }
    }
  }
  
  return merged;
}

/**
 * 导出配置为JSON字符串
 * @returns {string} JSON格式的配置字符串
 */
function exportConfig() {
  const config = loadConfig();
  return JSON.stringify(config, null, 2);
}

/**
 * 导入配置
 * @param {string} jsonString - JSON格式的配置字符串
 * @returns {boolean} 是否导入成功
 */
function importConfig(jsonString) {
  try {
    const config = JSON.parse(jsonString);
    saveConfig(config);
    return true;
  } catch (error) {
    console.error('导入配置失败：', error);
    return false;
  }
}
    
    // 定义页面检测函数（提取自main.js，确保在UIManager前可用）
    function isVideoPage() {
      return location.pathname.includes('/video/') || 
             location.pathname === '/' || 
             location.pathname.includes('/user/');
    }
    
    function isLivePage() {
      return location.pathname.includes('/live/');
    }
    
    // 加载UI管理器和主脚本
    /**
 * UI管理器模块
 * 负责处理界面定制和设置面板
 */

class UIManager {
  /**
   * 构造函数
   * @param {Object} config - 配置对象
   */
  constructor(config) {
    this.config = config;
    this.settingsPanel = null;
  }

  /**
   * 应用短视频界面定制
   */
  applyVideoCustomizations() {
    console.log('应用短视频界面定制');
    
    if (!this.config.videoUI) return;
    
    const { videoUI } = this.config;
    
    // 隐藏/显示点赞按钮（使用多种策略）
    this.toggleElement(() => {
      // 1. 首先尝试通过可能的点赞图标查找
      const heartIcons = this.findElementsByStructure({
        tagName: 'svg',
        attributes: { viewBox: '0 0 1024 1024' }
      });
      
      if (heartIcons.length > 0) {
        // 找到包含点赞图标的元素，返回其父元素
        return heartIcons.map(icon => icon.closest('div') || icon);
      }
      
      // 2. 通过类名模式匹配
      return this.findElementsByClassPattern(/like|heart/i);
    }, videoUI.showLikeButton);
    
    // 隐藏/显示评论按钮
    this.toggleElement(() => {
      const commentElements = this.findElementsByStructure({
        tagName: 'div',
        children: [{
          tagName: 'svg',
          attributes: { viewBox: '0 0 1024 1024' }
        }]
      });
      
      if (commentElements.length > 0) {
        return commentElements;
      }
      
      return this.findElementsByClassPattern(/comment|discuss/i);
    }, videoUI.showCommentButton);
    
    // 隐藏/显示分享按钮
    this.toggleElement(() => {
      const shareElements = this.findElementsByStructure({
        tagName: 'div',
        children: [{
          tagName: 'svg',
          attributes: { viewBox: '0 0 1024 1024' }
        }]
      });
      
      if (shareElements.length > 0) {
        return shareElements.filter(el => {
          // 尝试排除已找到的点赞和评论按钮
          const text = el.textContent.toLowerCase();
          return text.includes('share') || text.includes('分享');
        });
      }
      
      return this.findElementsByClassPattern(/share|forward/i);
    }, videoUI.showShareButton);
    
    // 隐藏/显示作者信息
    this.toggleElement(() => {
      // 查找包含头像的元素，通常是作者信息
      const avatarElements = this.findElementsByStructure({
        tagName: 'img',
        attributes: { class: /avatar|user/i }
      });
      
      if (avatarElements.length > 0) {
        return avatarElements.map(img => img.closest('div') || img);
      }
      
      return this.findElementsByClassPattern(/author|user|avatar/i);
    }, videoUI.showAuthorInfo);
    
    // 隐藏/显示音乐信息
    this.toggleElement(() => {
      // 查找包含音乐相关文本或图标的元素
      const musicElements = this.findElementsByStructure({
        text: '音乐'
      });
      
      if (musicElements.length > 0) {
        return musicElements.map(el => el.closest('div') || el);
      }
      
      return this.findElementsByClassPattern(/music|sound/i);
    }, videoUI.showMusicInfo);
    
    // 隐藏/显示描述
    this.toggleElement(() => {
      // 查找包含长文本的元素，可能是视频描述
      const textElements = document.body.querySelectorAll('div');
      const descriptions = Array.from(textElements).filter(el => {
        return el.textContent.length > 20 && 
               el.textContent.length < 200 && 
               !el.querySelector('img') &&
               !el.querySelector('video');
      });
      
      if (descriptions.length > 0) {
        return descriptions;
      }
      
      return this.findElementsByClassPattern(/desc|description|content/i);
    }, videoUI.showDescription);
    
    // 隐藏/显示推荐
    this.toggleElement(() => {
      // 查找可能包含推荐内容的容器
      const recommendationContainers = this.findElementsByStructure({
        tagName: 'div',
        children: [{
          tagName: 'video'
        }]
      });
      
      if (recommendationContainers.length > 0) {
        return recommendationContainers;
      }
      
      return this.findElementsByClassPattern(/recommend|suggest|related/i);
    }, videoUI.showRecommendations);
    
    // 自定义控制栏
    if (videoUI.controlBar) {
      this.customizeControlBar(videoUI.controlBar);
    }
    
    // 应用自定义布局
    this.applyLayout('video', videoUI.layout);
  }

  /**
   * 应用直播间界面定制
   */
  applyLiveCustomizations() {
    console.log('应用直播间界面定制');
    
    if (!this.config.liveUI) return;
    
    const { liveUI } = this.config;
    
    // 隐藏/显示礼物（添加更多可能的礼物相关选择器）
    this.toggleElement(() => {
      // 查找动画元素，可能是礼物特效
      const animatedElements = this.findElementsByStructure({
        attributes: { class: /animation|effect|gift/i }
      });
      
      if (animatedElements.length > 0) {
        return animatedElements;
      }
      
      // 查找可能包含礼物的容器
      const giftContainers = document.body.querySelectorAll('div');
      const potentialGifts = Array.from(giftContainers).filter(el => {
        // 礼物通常有特定的动画样式
        const style = window.getComputedStyle(el);
        return style.animationName !== 'none' || 
               style.transform !== 'none';
      });
      
      return potentialGifts.length > 0 ? potentialGifts : 
             this.findElementsByClassPattern(/gift|present|reward/i);
    }, liveUI.showGifts);
    
    // 隐藏/显示弹幕
    this.toggleElement(() => {
      // 查找可能包含弹幕的元素
      const bulletElements = document.body.querySelectorAll('div');
      const potentialBullets = Array.from(bulletElements).filter(el => {
        // 弹幕通常是半透明覆盖层
        const style = window.getComputedStyle(el);
        return style.position === 'absolute' && 
               style.pointerEvents === 'none' &&
               style.zIndex > 0;
      });
      
      if (potentialBullets.length > 0) {
        return potentialBullets;
      }
      
      // 备用方案：通过类名模式匹配
      return this.findElementsByClassPattern(/danmu|bullet|comment|danmaku/i);
    }, liveUI.showDanmaku);
    
    // 隐藏/显示推荐
    this.toggleElement(() => {
      // 查找可能包含推荐内容的容器
      const recommendationContainers = this.findElementsByStructure({
        tagName: 'div',
        children: [{
          tagName: 'img'
        }]
      });
      
      if (recommendationContainers.length > 0) {
        return recommendationContainers;
      }
      
      return this.findElementsByClassPattern(/recommend|suggest|related|live-recommend/i);
    }, liveUI.showRecommendations);
    
    // 隐藏/显示广告
    this.toggleElement(() => {
      // 查找可能是广告的元素
      const adElements = this.findElementsByStructure({
        text: /广告|推广|ad|promotion/i
      });
      
      if (adElements.length > 0) {
        return adElements.map(el => el.closest('div') || el);
      }
      
      return this.findElementsByClassPattern(/ad|advertisement|promotion|广告/i);
    }, liveUI.showAds);
    
    // 隐藏/显示统计信息
    this.toggleElement(() => {
      // 查找可能包含数字的元素，可能是统计信息
      const numberElements = document.body.querySelectorAll('div');
      const potentialStats = Array.from(numberElements).filter(el => {
        return /\d+/.test(el.textContent);
      });
      
      if (potentialStats.length > 0) {
        return potentialStats;
      }
      
      return this.findElementsByClassPattern(/stat|count|number|view/i);
    }, liveUI.showStats);
    
    // 自定义弹幕样式
    if (liveUI.danmaku) {
      this.customizeDanmaku(liveUI.danmaku);
    }
    
    // 应用自定义布局
    this.applyLayout('live', liveUI.layout);
  }

  /**
   * 切换元素的显示/隐藏
   * @param {string|Function} selectorOrFinder - CSS选择器或元素查找函数
   * @param {boolean} show - 是否显示
   */
  toggleElement(selectorOrFinder, show) {
    let elements = [];
    
    // 检查参数类型
    if (typeof selectorOrFinder === 'function') {
      try {
        // 如果是函数，则调用它来查找元素
        elements = selectorOrFinder();
      } catch (e) {
        console.error('查找元素函数执行失败:', e);
        return;
      }
    } else {
      // 如果是选择器字符串，则使用querySelectorAll
      elements = document.querySelectorAll(selectorOrFinder);
    }
    
    // 确保elements是数组
    if (!Array.isArray(elements)) {
      elements = Array.from(elements);
    }
    
    // 处理元素显示/隐藏
    elements.forEach(function(element) {
      if (element && element.style) {
        if (show) {
          element.style.display = '';
          element.style.visibility = 'visible';
        } else {
          element.style.display = 'none';
          element.style.visibility = 'hidden';
        }
      }
    });
  }
  
  /**
   * 基于结构特征查找元素
   * @param {Object} options - 查找选项
   * @returns {HTMLElement[]} 找到的元素数组
   */
  findElementsByStructure(options) {
    const result = [];
    
    // 根据选项执行不同的查找策略
    if (options.text) {
      // 通过文本内容查找
      const allElements = document.body.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.textContent.includes(options.text)) {
          result.push(el);
        }
      });
    }
    
    if (options.tagName) {
      // 通过标签名初步筛选
      const elements = document.body.querySelectorAll(options.tagName);
      
      // 如果提供了属性，则进一步筛选
      if (options.attributes) {
        elements.forEach(el => {
          let match = true;
          for (const [attr, value] of Object.entries(options.attributes)) {
            if (!el.hasAttribute(attr) || 
                (value && el.getAttribute(attr) !== value)) {
              match = false;
              break;
            }
          }
          if (match) result.push(el);
        });
      } else {
        // 没有属性筛选，直接添加
        result.push(...Array.from(elements));
      }
    }
    
    // 如果提供了子元素结构条件
    if (options.children) {
      const candidates = result.length > 0 ? result : document.body.querySelectorAll('*');
      const filtered = [];
      
      candidates.forEach(parent => {
        let match = true;
        for (const childCriteria of options.children) {
          const selector = childCriteria.tagName;
          let found = false;
          
          parent.querySelectorAll(selector).forEach(child => {
            // 检查子元素的条件
            let childMatch = true;
            if (childCriteria.text && !child.textContent.includes(childCriteria.text)) {
              childMatch = false;
            }
            
            if (childCriteria.attributes) {
              for (const [attr, value] of Object.entries(childCriteria.attributes)) {
                if (!child.hasAttribute(attr) || 
                    (value && child.getAttribute(attr) !== value)) {
                  childMatch = false;
                  break;
                }
              }
            }
            
            if (childMatch) found = true;
          });
          
          if (!found) {
            match = false;
            break;
          }
        });
        
        if (match) filtered.push(parent);
      });
      
      return filtered;
    }
    
    return result;
  }
  
  /**
   * 查找符合模式的类名
   * @param {RegExp} pattern - 类名匹配模式
   * @param {string} tagName - 可选的标签名限制
   * @returns {HTMLElement[]} 匹配的元素数组
   */
  findElementsByClassPattern(pattern, tagName = '*') {
    const elements = document.querySelectorAll(tagName);
    const result = [];
    
    elements.forEach(el => {
      if (el.className && pattern.test(el.className)) {
        result.push(el);
      }
    });
    
    return result;
  }

  /**
   * 自定义控制栏
   * @param {Object} controlBarConfig - 控制栏配置
   */
  customizeControlBar(controlBarConfig) {
    const controlBar = document.querySelector('.video-control-bar');
    if (!controlBar) return;
    
    // 显示/隐藏控制栏
    if (!controlBarConfig.show) {
      controlBar.style.display = 'none';
      return;
    }
    
    // 设置控制栏位置
    if (controlBarConfig.position) {
      controlBar.style.position = 'absolute';
      switch (controlBarConfig.position) {
        case 'top':
          controlBar.style.top = '0';
          controlBar.style.bottom = 'auto';
          break;
        case 'bottom':
          controlBar.style.bottom = '0';
          controlBar.style.top = 'auto';
          break;
        default:
          controlBar.style.bottom = '0';
      }
    }
    
    // 自动隐藏功能（需要额外的事件监听）
    if (controlBarConfig.autoHide) {
      // 实现自动隐藏逻辑
    }
  }

  /**
   * 自定义弹幕样式
   * @param {Object} danmakuConfig - 弹幕配置
   */
  customizeDanmaku(danmakuConfig) {
    // 添加弹幕样式
    const styleId = 'douyin-danmaku-custom-styles';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    let css = '';
    
    if (danmakuConfig.fontSize) {
      css += `.danmaku { font-size: ${danmakuConfig.fontSize}px !important; }`;
    }
    
    if (danmakuConfig.color) {
      css += `.danmaku { color: ${danmakuConfig.color} !important; }`;
    }
    
    if (danmakuConfig.opacity) {
      css += `.danmaku { opacity: ${danmakuConfig.opacity} !important; }`;
    }
    
    if (danmakuConfig.speed) {
      // 根据速度设置动画时长
      let duration = 6; // 默认6秒
      switch (danmakuConfig.speed) {
        case 'fast':
          duration = 3;
          break;
        case 'slow':
          duration = 10;
          break;
        default:
          duration = 6;
      }
      css += `.danmaku { animation-duration: ${duration}s !important; }`;
    }
    
    styleElement.textContent = css;
  }

  /**
   * 应用自定义布局
   * @param {string} type - 类型（video或live）
   * @param {string} layout - 布局名称
   */
  applyLayout(type, layout) {
    if (!layout || layout === 'default') return;
    
    // 根据不同类型和布局应用相应的样式
    // 这里可以扩展更多布局选项
    console.log(`应用${type}布局：${layout}`);
  }

  /**
   * 显示设置面板
   */
  showSettingsPanel() {
    // 如果设置面板已存在，先移除
    if (this.settingsPanel) {
      this.settingsPanel.remove();
    }
    
    // 创建设置面板
    this.settingsPanel = this.createSettingsPanel();
    document.body.appendChild(this.settingsPanel);
  }

  /**
   * 创建设置面板
   * @returns {HTMLElement} 设置面板元素
   */
  createSettingsPanel() {
    const panel = document.createElement('div');
    panel.className = 'douyin-ui-customizer-panel';
    panel.innerHTML = `
      <div class="panel-header">
        <h2>抖音UI定制设置</h2>
        <button class="close-btn">×</button>
      </div>
      <div class="panel-content">
        <div class="settings-tabs">
          <button class="tab-btn active" data-tab="general">通用设置</button>
          <button class="tab-btn" data-tab="video">短视频设置</button>
          <button class="tab-btn" data-tab="live">直播间设置</button>
          <button class="tab-btn" data-tab="import-export">导入导出</button>
        </div>
        
        <div class="tab-content active" id="general-tab">
          ${this.createGeneralSettings()}
        </div>
        
        <div class="tab-content" id="video-tab">
          ${this.createVideoSettings()}
        </div>
        
        <div class="tab-content" id="live-tab">
          ${this.createLiveSettings()}
        </div>
        
        <div class="tab-content" id="import-export-tab">
          ${this.createImportExportSettings()}
        </div>
      </div>
      <div class="panel-footer">
        <button class="save-btn">保存设置</button>
        <button class="reset-btn">重置为默认</button>
      </div>
    `;
    
    // 添加事件监听
    this.setupSettingsPanelEvents(panel);
    
    return panel;
  }

  /**
   * 设置设置面板的事件监听
   * @param {HTMLElement} panel - 设置面板元素
   */
  setupSettingsPanelEvents(panel) {
    // 关闭按钮
    panel.querySelector('.close-btn').addEventListener('click', () => {
      panel.remove();
    });
    
    // 标签切换
    panel.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        // 移除所有活跃状态
        panel.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // 设置当前活跃状态
        btn.classList.add('active');
        panel.querySelector(`#${tabId}-tab`).classList.add('active');
      });
    });
    
    // 保存按钮
    panel.querySelector('.save-btn').addEventListener('click', () => {
      this.saveSettings(panel);
    });
    
    // 重置按钮
    panel.querySelector('.reset-btn').addEventListener('click', () => {
      if (confirm('确定要重置所有设置吗？')) {
        this.config = resetConfig();
        panel.remove();
        location.reload();
      }
    });
    
    // 添加拖动功能
    this.makePanelDraggable(panel);
  }
  
  /**
   * 使设置面板可拖动
   * @param {HTMLElement} panel - 设置面板元素
   */
  makePanelDraggable(panel) {
    const header = panel.querySelector('.panel-header');
    let isDragging = false;
    let offsetX, offsetY;
    
    // 鼠标按下事件
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      
      // 计算鼠标相对于面板左上角的偏移量
      const panelRect = panel.getBoundingClientRect();
      offsetX = e.clientX - panelRect.left;
      offsetY = e.clientY - panelRect.top;
      
      // 设置面板为绝对定位（如果还不是）
      if (panel.style.position !== 'fixed') {
        panel.style.position = 'fixed';
      }
      
      // 添加拖拽时的视觉效果
      header.style.cursor = 'grabbing';
    });
    
    // 鼠标移动事件（添加到document以允许鼠标移出面板时仍能拖动）
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      // 计算新位置
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;
      
      // 限制在视口范围内
      const panelRect = panel.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      newX = Math.max(0, Math.min(newX, viewportWidth - panelRect.width));
      newY = Math.max(0, Math.min(newY, viewportHeight - panelRect.height));
      
      // 更新面板位置
      panel.style.left = `${newX}px`;
      panel.style.top = `${newY}px`;
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    });
    
    // 鼠标释放事件
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = 'grab';
      }
    });
    
    // 初始化光标样式
    header.style.cursor = 'grab';
    
    // 阻止鼠标按下时的文本选择
    header.addEventListener('selectstart', (e) => {
      e.preventDefault();
    });
  }

  /**
   * 创建通用设置内容
   * @returns {string} HTML字符串
   */
  createGeneralSettings() {
    return `
      <div class="setting-group">
        <h3>主题设置</h3>
        <label>
          <input type="radio" name="theme" value="light" ${this.config.theme === 'light' ? 'checked' : ''}>
          浅色主题
        </label>
        <label>
          <input type="radio" name="theme" value="dark" ${this.config.theme === 'dark' ? 'checked' : ''}>
          深色主题
        </label>
      </div>
      
      <div class="setting-group">
        <h3>播放设置</h3>
        <label>
          <input type="checkbox" id="autoPlay" ${this.config.general?.autoPlay ? 'checked' : ''}>
          自动播放视频
        </label>
        <label>
          <input type="checkbox" id="autoScroll" ${this.config.general?.autoScroll ? 'checked' : ''}>
          自动滚动到下一个视频
        </label>
      </div>
      
      <div class="setting-group">
        <h3>功能设置</h3>
        <label>
          <input type="checkbox" id="keyboardShortcuts" ${this.config.general?.keyboardShortcuts ? 'checked' : ''}>
          启用键盘快捷键
        </label>
        <label>
          <input type="checkbox" id="notifications" ${this.config.general?.notifications ? 'checked' : ''}>
          启用通知提醒
        </label>
      </div>
    `;
  }

  /**
   * 创建短视频设置内容
   * @returns {string} HTML字符串
   */
  createVideoSettings() {
    return `
      <div class="setting-group">
        <h3>显示元素</h3>
        <label>
          <input type="checkbox" id="showLikeButton" ${this.config.videoUI?.showLikeButton ? 'checked' : ''}>
          显示点赞按钮
        </label>
        <label>
          <input type="checkbox" id="showCommentButton" ${this.config.videoUI?.showCommentButton ? 'checked' : ''}>
          显示评论按钮
        </label>
        <label>
          <input type="checkbox" id="showShareButton" ${this.config.videoUI?.showShareButton ? 'checked' : ''}>
          显示分享按钮
        </label>
        <label>
          <input type="checkbox" id="showAuthorInfo" ${this.config.videoUI?.showAuthorInfo ? 'checked' : ''}>
          显示作者信息
        </label>
        <label>
          <input type="checkbox" id="showMusicInfo" ${this.config.videoUI?.showMusicInfo ? 'checked' : ''}>
          显示音乐信息
        </label>
        <label>
          <input type="checkbox" id="showDescription" ${this.config.videoUI?.showDescription ? 'checked' : ''}>
          显示视频描述
        </label>
        <label>
          <input type="checkbox" id="showRecommendations" ${this.config.videoUI?.showRecommendations ? 'checked' : ''}>
          显示推荐视频
        </label>
      </div>
      
      <div class="setting-group">
        <h3>控制栏设置</h3>
        <label>
          <input type="checkbox" id="controlBarShow" ${this.config.videoUI?.controlBar?.show ? 'checked' : ''}>
          显示控制栏
        </label>
        <label>
          <input type="checkbox" id="controlBarAutoHide" ${this.config.videoUI?.controlBar?.autoHide ? 'checked' : ''}>
          自动隐藏控制栏
        </label>
        <label>
          <select id="controlBarPosition">
            <option value="bottom" ${this.config.videoUI?.controlBar?.position === 'bottom' ? 'selected' : ''}>底部</option>
            <option value="top" ${this.config.videoUI?.controlBar?.position === 'top' ? 'selected' : ''}>顶部</option>
          </select>
          控制栏位置
        </label>
      </div>
    `;
  }

  /**
   * 创建直播间设置内容
   * @returns {string} HTML字符串
   */
  createLiveSettings() {
    return `
      <div class="setting-group">
        <h3>显示元素</h3>
        <label>
          <input type="checkbox" id="showGifts" ${this.config.liveUI?.showGifts ? 'checked' : ''}>
          显示礼物动画
        </label>
        <label>
          <input type="checkbox" id="showDanmaku" ${this.config.liveUI?.showDanmaku ? 'checked' : ''}>
          显示弹幕
        </label>
        <label>
          <input type="checkbox" id="showRecommendations" ${this.config.liveUI?.showRecommendations ? 'checked' : ''}>
          显示推荐直播
        </label>
        <label>
          <input type="checkbox" id="showAds" ${this.config.liveUI?.showAds ? 'checked' : ''}>
          显示广告
        </label>
        <label>
          <input type="checkbox" id="showStats" ${this.config.liveUI?.showStats ? 'checked' : ''}>
          显示统计信息
        </label>
      </div>
      
      <div class="setting-group">
        <h3>弹幕设置</h3>
        <label>
          <input type="number" id="danmakuFontSize" min="12" max="36" value="${this.config.liveUI?.danmaku?.fontSize || 16}">
          字体大小（px）
        </label>
        <label>
          <input type="color" id="danmakuColor" value="${this.config.liveUI?.danmaku?.color || '#FFFFFF'}">
          字体颜色
        </label>
        <label>
          <input type="range" id="danmakuOpacity" min="0.1" max="1" step="0.1" value="${this.config.liveUI?.danmaku?.opacity || 0.8}">
          透明度: <span id="opacityValue">${this.config.liveUI?.danmaku?.opacity || 0.8}</span>
        </label>
        <label>
          <select id="danmakuSpeed">
            <option value="slow" ${this.config.liveUI?.danmaku?.speed === 'slow' ? 'selected' : ''}>慢速</option>
            <option value="medium" ${this.config.liveUI?.danmaku?.speed === 'medium' ? 'selected' : ''}>中速</option>
            <option value="fast" ${this.config.liveUI?.danmaku?.speed === 'fast' ? 'selected' : ''}>快速</option>
          </select>
          弹幕速度
        </label>
      </div>
    `;
  }

  /**
   * 创建导入导出设置内容
   * @returns {string} HTML字符串
   */
  createImportExportSettings() {
    return `
      <div class="setting-group">
        <h3>导出配置</h3>
        <button id="exportBtn">导出配置</button>
        <p>点击按钮导出当前配置到JSON文件</p>
      </div>
      
      <div class="setting-group">
        <h3>导入配置</h3>
        <input type="file" id="importFile" accept=".json">
        <button id="importBtn">导入配置</button>
        <p>选择JSON配置文件并点击导入</p>
      </div>
    `;
  }

  /**
   * 显示提示消息
   * @param {string} message - 提示消息内容
   * @param {string} type - 提示类型：success, error, info
   */
  showNotification(message, type = 'success') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `douyin-ui-customizer-notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '6px',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: '999999',
      opacity: '0',
      transform: 'translateX(100%)',
      transition: 'all 0.3s ease-out',
      backgroundColor: type === 'success' ? '#52c41a' : 
                       type === 'error' ? '#ff4d4f' : '#1890ff',
      maxWidth: '300px',
      wordWrap: 'break-word'
    });
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
      Object.assign(notification.style, {
        opacity: '1',
        transform: 'translateX(0)'
      });
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
      Object.assign(notification.style, {
        opacity: '0',
        transform: 'translateX(100%)'
      });
      
      // 移除元素
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  /**
   * 保存设置
   * @param {HTMLElement} panel - 设置面板元素
   */
  saveSettings(panel) {
    try {
      // 保存通用设置
      this.config.theme = panel.querySelector('input[name="theme"]:checked').value;
      
      if (!this.config.general) {
        this.config.general = {};
      }
      this.config.general.autoPlay = panel.querySelector('#autoPlay').checked;
      this.config.general.autoScroll = panel.querySelector('#autoScroll').checked;
      this.config.general.keyboardShortcuts = panel.querySelector('#keyboardShortcuts').checked;
      this.config.general.notifications = panel.querySelector('#notifications').checked;
      
      // 保存短视频设置
      if (!this.config.videoUI) {
        this.config.videoUI = {};
      }
      this.config.videoUI.showLikeButton = panel.querySelector('#showLikeButton').checked;
      this.config.videoUI.showCommentButton = panel.querySelector('#showCommentButton').checked;
      this.config.videoUI.showShareButton = panel.querySelector('#showShareButton').checked;
      this.config.videoUI.showAuthorInfo = panel.querySelector('#showAuthorInfo').checked;
      this.config.videoUI.showMusicInfo = panel.querySelector('#showMusicInfo').checked;
      this.config.videoUI.showDescription = panel.querySelector('#showDescription').checked;
      this.config.videoUI.showRecommendations = panel.querySelector('#showRecommendations').checked;
      
      if (!this.config.videoUI.controlBar) {
        this.config.videoUI.controlBar = {};
      }
      this.config.videoUI.controlBar.show = panel.querySelector('#controlBarShow').checked;
      this.config.videoUI.controlBar.autoHide = panel.querySelector('#controlBarAutoHide').checked;
      this.config.videoUI.controlBar.position = panel.querySelector('#controlBarPosition').value;
      
      // 保存直播间设置
      if (!this.config.liveUI) {
        this.config.liveUI = {};
      }
      this.config.liveUI.showGifts = panel.querySelector('#showGifts').checked;
      this.config.liveUI.showDanmaku = panel.querySelector('#showDanmaku').checked;
      this.config.liveUI.showRecommendations = panel.querySelector('#showRecommendations').checked;
      this.config.liveUI.showAds = panel.querySelector('#showAds').checked;
      this.config.liveUI.showStats = panel.querySelector('#showStats').checked;
      
      if (!this.config.liveUI.danmaku) {
        this.config.liveUI.danmaku = {};
      }
      this.config.liveUI.danmaku.fontSize = parseInt(panel.querySelector('#danmakuFontSize').value);
      this.config.liveUI.danmaku.color = panel.querySelector('#danmakuColor').value;
      this.config.liveUI.danmaku.opacity = parseFloat(panel.querySelector('#danmakuOpacity').value);
      this.config.liveUI.danmaku.speed = panel.querySelector('#danmakuSpeed').value;
      
      // 保存配置
      saveConfig(this.config);
      
      // 为确保配置完全保存，添加一个小延迟后再应用设置
      setTimeout(() => {
        // 应用新设置
        injectStyles(this.config.theme);
        
        // 强制重新应用UI定制
        if (isVideoPage()) {
          // 清除现有样式并重新应用
          const customStyle = document.getElementById('douyin-ui-customizer-custom');
          if (customStyle) {
            customStyle.remove();
          }
          this.applyVideoCustomizations();
        }
        if (isLivePage()) {
          // 清除现有样式并重新应用
          const customStyle = document.getElementById('douyin-ui-customizer-custom');
          if (customStyle) {
            customStyle.remove();
          }
          this.applyLiveCustomizations();
        }
        
        // 显示保存成功提示
        this.showNotification('设置已成功保存并应用！', 'success');
        
        // 延迟关闭设置面板
        setTimeout(() => {
          panel.remove();
        }, 300);
      }, 100);
    } catch (error) {
      console.error('保存设置失败:', error);
      this.showNotification('保存设置失败，请重试', 'error');
    }
  }
}
    /**
 * 抖音Web端界面UI定制工具主入口
 * 作者：SutChan
 * 版本：1.0.12
 */

// 当前脚本版本
const CURRENT_VERSION = '1.0.12';
// 更新检查间隔（毫秒）
const UPDATE_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24小时

/**
 * 检查脚本更新
 */
async function checkForUpdates(showNoUpdateMessage = false) {
  try {
    // 从GitHub获取最新版本的脚本
    const updateUrl = 'https://github.com/SutChan/douyin_tool/raw/main/dist/douyin_ui_customizer.user.js';
    
    GM_xmlhttpRequest({
      method: 'GET',
      url: updateUrl,
      onload: function(response) {
        if (response.status === 200) {
          // 从脚本头部提取版本号
          const scriptContent = response.responseText;
          const versionMatch = scriptContent.match(/@version\s+(\d+\.\d+\.\d+)/i);
          
          if (versionMatch && versionMatch[1]) {
            const latestVersion = versionMatch[1];
            
            // 比较版本号
            if (isNewerVersion(latestVersion, CURRENT_VERSION)) {
              if (confirm(`发现新版本 ${latestVersion}！是否更新脚本？\n\n当前版本：${CURRENT_VERSION}`)) {
                // 打开更新链接
                window.open(updateUrl, '_blank');
              }
            } else if (showNoUpdateMessage) {
              alert('您的脚本已是最新版本！');
            }
          }
        }
      },
      onerror: function() {
        if (showNoUpdateMessage) {
          alert('检查更新失败，请稍后重试。');
        }
      }
    });
  } catch (error) {
    console.error('检查更新时发生错误：', error);
  }
}

/**
 * 比较版本号
 * @param {string} newVersion - 新版本号
 * @param {string} currentVersion - 当前版本号
 * @returns {boolean} 是否是新版本
 */
function isNewerVersion(newVersion, currentVersion) {
  const newParts = newVersion.split('.').map(Number);
  const currentParts = currentVersion.split('.').map(Number);
  
  for (let i = 0; i < newParts.length; i++) {
    if (newParts[i] > currentParts[i]) return true;
    if (newParts[i] < currentParts[i]) return false;
  }
  
  return false;
}

/**
 * 检查是否需要进行自动更新检查
 */
function shouldCheckForUpdates() {
  const lastCheckTime = getItem('lastUpdateCheckTime', 0);
  const now = Date.now();
  
  // 如果距离上次检查超过了设定的间隔时间
  if (now - lastCheckTime > UPDATE_CHECK_INTERVAL) {
    setItem('lastUpdateCheckTime', now);
    return true;
  }
  
  return false;
}

// 初始化函数
function init() {
  console.log('抖音UI定制工具已启动');
  
  // 加载配置
  const config = loadConfig();
  
  // 初始化UI管理器
  const uiManager = new UIManager(config);
  
  // 注入样式
  injectStyles(config.theme);
  
  // 监听页面变化
  observePageChanges(uiManager);
  
  // 注册油猴菜单命令
  registerMenuCommands(uiManager);
  
  // 检查是否需要进行自动更新检查
  if (shouldCheckForUpdates()) {
    checkForUpdates(false);
  }
}

/**
 * 注入样式
 * @param {string} theme - 主题名称
 */
function injectStyles(theme) {
  // 移除可能存在的旧样式
  const oldStyle = document.getElementById('douyin-ui-customizer-styles');
  if (oldStyle) {
    oldStyle.remove();
  }
  
  // 注入新样式
  const styleElement = document.createElement('style');
  styleElement.id = 'douyin-ui-customizer-styles';
  
  // 根据主题选择样式
  if (theme === 'dark') {
    styleElement.textContent = darkStyles;
  } else {
    styleElement.textContent = defaultStyles;
  }
  
  document.head.appendChild(styleElement);
  
  // 注入自定义样式
  const customStyle = document.createElement('style');
  customStyle.id = 'douyin-ui-customizer-custom';
  customStyle.textContent = generateCustomStyles();
  document.head.appendChild(customStyle);
}

/**
 * 生成自定义样式
 * @returns {string} 自定义CSS
 */
function generateCustomStyles() {
  const config = loadConfig();
  let customCSS = '';
  
  // 短视频界面定制样式
  if (config.videoUI) {
    // 隐藏点赞按钮
    if (!config.videoUI.showLikeButton) {
      customCSS += '.like-button { display: none !important; }';
    }
    
    // 隐藏评论按钮
    if (!config.videoUI.showCommentButton) {
      customCSS += '.comment-button { display: none !important; }';
    }
    
    // 隐藏分享按钮
    if (!config.videoUI.showShareButton) {
      customCSS += '.share-button { display: none !important; }';
    }
    
    // 隐藏作者信息
    if (!config.videoUI.showAuthorInfo) {
      customCSS += '.author-info { display: none !important; }';
    }
    
    // 调整界面元素布局
    if (config.videoUI.layout) {
      // 这里可以根据配置添加相应的布局样式
    }
  }
  
  // 直播间界面定制样式
  if (config.liveUI) {
    // 隐藏礼物动画
    if (!config.liveUI.showGifts) {
      customCSS += '.gift-animation, .gift-container { display: none !important; }';
    }
    
    // 隐藏推荐和广告
    if (!config.liveUI.showRecommendations) {
      customCSS += '.live-recommendations, .live-ads { display: none !important; }';
    }
    
    // 自定义弹幕样式
    if (config.liveUI.danmaku) {
      if (config.liveUI.danmaku.fontSize) {
        customCSS += `.danmaku { font-size: ${config.liveUI.danmaku.fontSize}px !important; }`;
      }
      if (config.liveUI.danmaku.color) {
        customCSS += `.danmaku { color: ${config.liveUI.danmaku.color} !important; }`;
      }
    }
  }
  
  return customCSS;
}

/**
 * 监听页面变化
 * @param {UIManager} uiManager - UI管理器实例
 */
function observePageChanges(uiManager) {
  // 使用MutationObserver监听DOM变化
  const observer = new MutationObserver((mutations) => {
    // 检查是否是短视频页面
    if (isVideoPage()) {
      uiManager.applyVideoCustomizations();
    }
    
    // 检查是否是直播间页面
    if (isLivePage()) {
      uiManager.applyLiveCustomizations();
    }
  });
  
  // 开始观察
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // 初始应用
  setTimeout(() => {
    if (isVideoPage()) {
      uiManager.applyVideoCustomizations();
    }
    if (isLivePage()) {
      uiManager.applyLiveCustomizations();
    }
  }, 1000);
}

/**
 * 检查是否是短视频页面
 * @returns {boolean} 是否是短视频页面
 */
function isVideoPage() {
  return location.pathname.includes('/video/') || 
         location.pathname === '/' || 
         location.pathname.includes('/user/');
}

/**
 * 检查是否是直播间页面
 * @returns {boolean} 是否是直播间页面
 */
function isLivePage() {
  return location.pathname.includes('/live/');
}

/**
 * 创建浮动设置按钮
 * @param {UIManager} uiManager - UI管理器实例
 */
function createFloatingSettingsButton(uiManager) {
  // 检查按钮是否已存在
  let settingsButton = document.getElementById('douyin-ui-customizer-settings-btn');
  if (settingsButton) {
    settingsButton.remove();
  }
  
  // 创建设置按钮
  settingsButton = document.createElement('div');
  settingsButton.id = 'douyin-ui-customizer-settings-btn';
  settingsButton.innerHTML = '⚙️';
  settingsButton.title = '抖音UI定制设置';
  
  // 设置按钮样式
  Object.assign(settingsButton.style, {
    position: 'fixed',
    right: '20px',
    bottom: '80px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#000000',
    color: '#ffffff',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: '99999',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease'
  });
  
  // 添加点击事件
  settingsButton.addEventListener('click', () => {
    uiManager.showSettingsPanel();
  });
  
  // 添加悬停效果
  settingsButton.addEventListener('mouseenter', () => {
    settingsButton.style.transform = 'scale(1.1)';
  });
  
  settingsButton.addEventListener('mouseleave', () => {
    settingsButton.style.transform = 'scale(1)';
  });
  
  // 添加到页面
  document.body.appendChild(settingsButton);
  
  // 定期检查按钮是否被移除
  setInterval(() => {
    const btn = document.getElementById('douyin-ui-customizer-settings-btn');
    if (!btn) {
      createFloatingSettingsButton(uiManager);
    }
  }, 10000); // 每10秒检查一次
}

/**
 * 注册油猴菜单命令
 * @param {UIManager} uiManager - UI管理器实例
 */
function registerMenuCommands(uiManager) {
  // 创建浮动设置按钮
  createFloatingSettingsButton(uiManager);
  
  // 打开设置面板
  GM_registerMenuCommand('打开设置面板', () => {
    uiManager.showSettingsPanel();
  });
  
  // 切换暗黑模式
  GM_registerMenuCommand('切换暗黑模式', () => {
    const config = loadConfig();
    config.theme = config.theme === 'dark' ? 'light' : 'dark';
    saveConfig(config);
    injectStyles(config.theme);
  });
  
  // 手动检查更新
  GM_registerMenuCommand('检查更新', () => {
    checkForUpdates(true);
  });
  
  // 重置设置
  GM_registerMenuCommand('重置所有设置', () => {
    if (confirm('确定要重置所有设置吗？')) {
      resetConfig();
      location.reload();
    }
  });
}

// 当页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
  