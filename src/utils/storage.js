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