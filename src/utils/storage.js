/**
 * 本地存储工具模块
 * 提供数据存储、读取和移除功能
 */

/**
 * 安全地获取本地存储数据
 * @param {string} key - 存储键名
 * @param {*} defaultValue - 默认值，当没有找到数据时返回
 * @returns {*} 存储的数据或默认值
 */
export function getItem(key, defaultValue = null) {
  if (!key || typeof key !== 'string') {
    console.error('无效的存储键名');
    return defaultValue;
  }
  
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
export function setItem(key, value) {
  if (!key || typeof key !== 'string') {
    console.error('无效的存储键名');
    return false;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`设置本地存储数据失败 (${key}):`, error);
    
    // 检查是否是存储容量限制导致的错误
    if (error.name === 'QuotaExceededError') {
      console.warn('本地存储容量已达到上限');
    }
    
    return false;
  }
}

/**
 * 安全地移除本地存储数据
 * @param {string} key - 要移除的存储键名
 * @returns {boolean} 是否移除成功
 */
export function removeItem(key) {
  if (!key || typeof key !== 'string') {
    console.error('无效的存储键名');
    return false;
  }
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`移除本地存储数据失败 (${key}):`, error);
    return false;
  }
}