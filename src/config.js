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