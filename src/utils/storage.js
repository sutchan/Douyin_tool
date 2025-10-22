/**
 * 本地存储工具模块
 * 提供数据存储、读取功能
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