// ==UserScript==
// @name         抖音UI定制器
// @namespace    https://github.com/sutchan/douyin_tool
// @version      1.0.124
// @description  自定义抖音界面，提供暗黑模式和UI调整
// @author       Sut
// @match        https://www.douyin.com/*
// @match        https://www.douyin.com
// @match        https://www.douyin.com/search/*
// @match        https://www.douyin.com/user/*
// @match        https://www.douyin.com/video/*
// @match        https://www.douyin.com/live/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// ==/UserScript==

// CSS样式定义
const defaultStyles = '/**\n * 抖音UI定制工具 - 默认样式\n */\n\n/* 设置面板样式 */\n.douyin-ui-customizer-panel {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 90%;\n  max-width: 800px;\n  max-height: 90vh;\n  background: #ffffff;\n  border-radius: 12px;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);\n  z-index: 999999;\n  font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n\n.douyin-ui-customizer-panel .panel-header {\n  padding: 20px;\n  background: #000000;\n  color: #ffffff;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid #e0e0e0;\n}\n\n.douyin-ui-customizer-panel .panel-header h2 {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 600;\n}\n\n.douyin-ui-customizer-panel .close-btn {\n  background: none;\n  border: none;\n  color: #ffffff;\n  font-size: 28px;\n  cursor: pointer;\n  padding: 0;\n  width: 30px;\n  height: 30px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  transition: background-color 0.2s;\n}\n\n.douyin-ui-customizer-panel .close-btn:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n\n.douyin-ui-customizer-panel .panel-content {\n  flex: 1;\n  padding: 20px;\n  overflow-y: auto;\n}\n\n.douyin-ui-customizer-panel .settings-tabs {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 20px;\n  border-bottom: 1px solid #e0e0e0;\n  padding-bottom: 10px;\n}\n\n.douyin-ui-customizer-panel .tab-btn {\n  background: #f5f5f5;\n  border: 1px solid #e0e0e0;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s;\n  font-size: 14px;\n  font-weight: 500;\n}\n\n.douyin-ui-customizer-panel .tab-btn:hover {\n  background: #e8e8e8;\n}\n\n.douyin-ui-customizer-panel .tab-btn.active {\n  background: #000000;\n  color: #ffffff;\n  border-color: #000000;\n}\n\n.douyin-ui-customizer-panel .tab-content {\n  display: none;\n}\n\n.douyin-ui-customizer-panel .tab-content.active {\n  display: block;\n}\n\n.douyin-ui-customizer-panel .setting-group {\n  margin-bottom: 25px;\n  padding: 15px;\n  background: #fafafa;\n  border-radius: 8px;\n}\n\n.douyin-ui-customizer-panel .setting-group h3 {\n  margin-top: 0;\n  margin-bottom: 15px;\n  font-size: 16px;\n  font-weight: 600;\n  color: #333333;\n}\n\n.douyin-ui-customizer-panel label {\n  display: flex;\n  align-items: center;\n  margin-bottom: 10px;\n  cursor: pointer;\n  font-size: 14px;\n  color: #555555;\n  transition: color 0.2s;\n}\n\n.douyin-ui-customizer-panel label:hover {\n  color: #000000;\n}\n\n.douyin-ui-customizer-panel input[type="checkbox"],\n.douyin-ui-customizer-panel input[type="radio"] {\n  margin-right: 8px;\n  width: 16px;\n  height: 16px;\n}\n\n.douyin-ui-customizer-panel input[type="number"],\n.douyin-ui-customizer-panel input[type="text"],\n.douyin-ui-customizer-panel select {\n  margin-left: 8px;\n  padding: 6px 10px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  font-size: 14px;\n}\n\n.douyin-ui-customizer-panel input[type="range"] {\n  margin-left: 8px;\n  margin-right: 8px;\n  flex: 1;\n}\n\n.douyin-ui-customizer-panel input[type="color"] {\n  margin-left: 8px;\n  width: 40px;\n  height: 30px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\n.douyin-ui-customizer-panel .panel-footer {\n  padding: 20px;\n  background: #f8f8f8;\n  border-top: 1px solid #e0e0e0;\n  display: flex;\n  gap: 10px;\n  justify-content: flex-end;\n}\n\n.douyin-ui-customizer-panel .save-btn,\n.douyin-ui-customizer-panel .reset-btn {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 6px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\n.douyin-ui-customizer-panel .save-btn {\n  background: #000000;\n  color: #ffffff;\n}\n\n.douyin-ui-customizer-panel .save-btn:hover {\n  background: #333333;\n}\n\n.douyin-ui-customizer-panel .reset-btn {\n  background: #ffffff;\n  color: #666666;\n  border: 1px solid #ddd;\n}\n\n.douyin-ui-customizer-panel .reset-btn:hover {\n  background: #f0f0f0;\n  color: #333333;\n}\n\n.douyin-ui-customizer-panel button#exportBtn,\n.douyin-ui-customizer-panel button#importBtn {\n  padding: 8px 16px;\n  background: #000000;\n  color: #ffffff;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 14px;\n  margin-bottom: 10px;\n  transition: background-color 0.2s;\n}\n\n.douyin-ui-customizer-panel button#exportBtn:hover,\n.douyin-ui-customizer-panel button#importBtn:hover {\n  background: #333333;\n}\n\n.douyin-ui-customizer-panel input[type="file"] {\n  margin-bottom: 10px;\n  padding: 8px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  font-size: 14px;\n}\n\n.douyin-ui-customizer-panel p {\n  font-size: 13px;\n  color: #777777;\n  margin-top: 5px;\n  line-height: 1.5;\n}\n\n/* 工具提示样式 */\n.douyin-ui-customizer-tooltip {\n  position: absolute;\n  background: rgba(0, 0, 0, 0.9);\n  color: #ffffff;\n  padding: 8px 12px;\n  border-radius: 4px;\n  font-size: 12px;\n  pointer-events: none;\n  z-index: 999999;\n  white-space: nowrap;\n}\n\n/* 滚动条样式 */\n.douyin-ui-customizer-panel ::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n\n.douyin-ui-customizer-panel ::-webkit-scrollbar-track {\n  background: #f1f1f1;\n  border-radius: 4px;\n}\n\n.douyin-ui-customizer-panel ::-webkit-scrollbar-thumb {\n  background: #888;\n  border-radius: 4px;\n}\n\n.douyin-ui-customizer-panel ::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n\n/* 响应式设计 */\n@media (max-width: 600px) {\n  .douyin-ui-customizer-panel {\n    width: 95%;\n    max-width: none;\n    margin: 10px;\n    top: 10px;\n    left: 10px;\n    transform: none;\n    max-height: calc(100vh - 20px);\n  }\n  \n  .douyin-ui-customizer-panel .settings-tabs {\n    flex-wrap: wrap;\n  }\n  \n  .douyin-ui-customizer-panel .panel-footer {\n    flex-direction: column;\n  }\n  \n  .douyin-ui-customizer-panel .save-btn,\n  .douyin-ui-customizer-panel .reset-btn {\n    width: 100%;\n  }\n}';
const darkStyles = '/**\n * 抖音UI定制工具 - 暗黑模式样式\n */\n\n/* 设置面板样式 */\n.douyin-ui-customizer-panel {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 90%;\n  max-width: 800px;\n  max-height: 90vh;\n  background: #1a1a1a;\n  border-radius: 12px;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);\n  z-index: 999999;\n  font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n\n.douyin-ui-customizer-panel .panel-header {\n  padding: 20px;\n  background: #2d2d2d;\n  color: #ffffff;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid #3d3d3d;\n}\n\n.douyin-ui-customizer-panel .panel-header h2 {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 600;\n}\n\n.douyin-ui-customizer-panel .close-btn {\n  background: none;\n  border: none;\n  color: #ffffff;\n  font-size: 28px;\n  cursor: pointer;\n  padding: 0;\n  width: 30px;\n  height: 30px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  transition: background-color 0.2s;\n}\n\n.douyin-ui-customizer-panel .close-btn:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n\n.douyin-ui-customizer-panel .panel-content {\n  flex: 1;\n  padding: 20px;\n  overflow-y: auto;\n}\n\n.douyin-ui-customizer-panel .settings-tabs {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 20px;\n  border-bottom: 1px solid #3d3d3d;\n  padding-bottom: 10px;\n}\n\n.douyin-ui-customizer-panel .tab-btn {\n  background: #2d2d2d;\n  border: 1px solid #3d3d3d;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s;\n  font-size: 14px;\n  font-weight: 500;\n  color: #cccccc;\n}\n\n.douyin-ui-customizer-panel .tab-btn:hover {\n  background: #3d3d3d;\n  color: #ffffff;\n}\n\n.douyin-ui-customizer-panel .tab-btn.active {\n  background: #ffffff;\n  color: #1a1a1a;\n  border-color: #ffffff;\n}\n\n.douyin-ui-customizer-panel .tab-content {\n  display: none;\n}\n\n.douyin-ui-customizer-panel .tab-content.active {\n  display: block;\n}\n\n.douyin-ui-customizer-panel .setting-group {\n  margin-bottom: 25px;\n  padding: 15px;\n  background: #2d2d2d;\n  border-radius: 8px;\n}\n\n.douyin-ui-customizer-panel .setting-group h3 {\n  margin-top: 0;\n  margin-bottom: 15px;\n  font-size: 16px;\n  font-weight: 600;\n  color: #ffffff;\n}\n\n.douyin-ui-customizer-panel label {\n  display: flex;\n  align-items: center;\n  margin-bottom: 10px;\n  cursor: pointer;\n  font-size: 14px;\n  color: #cccccc;\n  transition: color 0.2s;\n}\n\n.douyin-ui-customizer-panel label:hover {\n  color: #ffffff;\n}\n\n.douyin-ui-customizer-panel input[type="checkbox"],\n.douyin-ui-customizer-panel input[type="radio"] {\n  margin-right: 8px;\n  width: 16px;\n  height: 16px;\n}\n\n.douyin-ui-customizer-panel input[type="number"],\n.douyin-ui-customizer-panel input[type="text"],\n.douyin-ui-customizer-panel select {\n  margin-left: 8px;\n  padding: 6px 10px;\n  border: 1px solid #4d4d4d;\n  border-radius: 4px;\n  font-size: 14px;\n  background: #1a1a1a;\n  color: #ffffff;\n}\n\n.douyin-ui-customizer-panel input[type="number"]:focus,\n.douyin-ui-customizer-panel input[type="text"]:focus,\n.douyin-ui-customizer-panel select:focus {\n  outline: none;\n  border-color: #ffffff;\n}\n\n.douyin-ui-customizer-panel input[type="range"] {\n  margin-left: 8px;\n  margin-right: 8px;\n  flex: 1;\n}\n\n.douyin-ui-customizer-panel input[type="color"] {\n  margin-left: 8px;\n  width: 40px;\n  height: 30px;\n  border: 1px solid #4d4d4d;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\n.douyin-ui-customizer-panel .panel-footer {\n  padding: 20px;\n  background: #2d2d2d;\n  border-top: 1px solid #3d3d3d;\n  display: flex;\n  gap: 10px;\n  justify-content: flex-end;\n}\n\n.douyin-ui-customizer-panel .save-btn,\n.douyin-ui-customizer-panel .reset-btn {\n  padding: 10px 20px;\n  border: none;\n  border-radius: 6px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\n.douyin-ui-customizer-panel .save-btn {\n  background: #ffffff;\n  color: #1a1a1a;\n}\n\n.douyin-ui-customizer-panel .save-btn:hover {\n  background: #e0e0e0;\n}\n\n.douyin-ui-customizer-panel .reset-btn {\n  background: #1a1a1a;\n  color: #cccccc;\n  border: 1px solid #4d4d4d;\n}\n\n.douyin-ui-customizer-panel .reset-btn:hover {\n  background: #3d3d3d;\n  color: #ffffff;\n}\n\n.douyin-ui-customizer-panel button#exportBtn,\n.douyin-ui-customizer-panel button#importBtn {\n  padding: 8px 16px;\n  background: #ffffff;\n  color: #1a1a1a;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 14px;\n  margin-bottom: 10px;\n  transition: background-color 0.2s;\n}\n\n.douyin-ui-customizer-panel button#exportBtn:hover,\n.douyin-ui-customizer-panel button#importBtn:hover {\n  background: #e0e0e0;\n}\n\n.douyin-ui-customizer-panel input[type="file"] {\n  margin-bottom: 10px;\n  padding: 8px;\n  border: 1px solid #4d4d4d;\n  border-radius: 4px;\n  font-size: 14px;\n  background: #1a1a1a;\n  color: #ffffff;\n}\n\n.douyin-ui-customizer-panel p {\n  font-size: 13px;\n  color: #999999;\n  margin-top: 5px;\n  line-height: 1.5;\n}\n\n/* 工具提示样式 */\n.douyin-ui-customizer-tooltip {\n  position: absolute;\n  background: rgba(255, 255, 255, 0.9);\n  color: #1a1a1a;\n  padding: 8px 12px;\n  border-radius: 4px;\n  font-size: 12px;\n  pointer-events: none;\n  z-index: 999999;\n  white-space: nowrap;\n}\n\n/* 滚动条样式 */\n.douyin-ui-customizer-panel ::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n\n.douyin-ui-customizer-panel ::-webkit-scrollbar-track {\n  background: #3d3d3d;\n  border-radius: 4px;\n}\n\n.douyin-ui-customizer-panel ::-webkit-scrollbar-thumb {\n  background: #666666;\n  border-radius: 4px;\n}\n\n.douyin-ui-customizer-panel ::-webkit-scrollbar-thumb:hover {\n  background: #888888;\n}\n\n/* 响应式设计 */\n@media (max-width: 600px) {\n  .douyin-ui-customizer-panel {\n    width: 95%;\n    max-width: none;\n    margin: 10px;\n    top: 10px;\n    left: 10px;\n    transform: none;\n    max-height: calc(100vh - 20px);\n  }\n  \n  .douyin-ui-customizer-panel .settings-tabs {\n    flex-wrap: wrap;\n  }\n  \n  .douyin-ui-customizer-panel .panel-footer {\n    flex-direction: column;\n  }\n  \n  .douyin-ui-customizer-panel .save-btn,\n  .douyin-ui-customizer-panel .reset-btn {\n    width: 100%;\n  }\n}';

// 工具函数模块
/**
 * DOM操作工具模块
 * 简化版，保留必要的工具函数
 */

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

// 存储工具模块
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

// 配置管理模块
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

// UI管理器模块
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
    console.log('[UI定制] 开始应用短视频界面定制');
    
    if (!this.config.videoUI) {
      console.log('[UI定制] 警告：videoUI配置缺失');
      return;
    }
    
    const { videoUI } = this.config;
    console.log('[UI定制] 视频UI配置:', JSON.stringify(videoUI));
    
    // 确保DOM已准备好
    if (!document.body) {
      console.log('[UI定制] 警告：document.body未准备好，延迟应用定制');
      setTimeout(() => this.applyVideoCustomizations(), 500);
      return;
    }
    
    // 隐藏/显示点赞按钮（使用多种策略）
    this.toggleElement(() => {
      console.log('[UI定制] 查找点赞按钮元素...');
      // 1. 首先尝试通过可能的点赞图标查找
      const heartIcons = this.findElementsByStructure({
        tagName: 'svg',
        attributes: { viewBox: '0 0 1024 1024' }
      });
      
      if (heartIcons.length > 0) {
        console.log(`[UI定制] 找到 ${heartIcons.length} 个可能的点赞图标`);
        // 找到包含点赞图标的元素，返回其父元素
        const elements = heartIcons.map(icon => icon.closest('div') || icon);
        console.log(`[UI定制] 获取到 ${elements.length} 个点赞相关元素`);
        return elements;
      }
      
      // 2. 通过类名模式匹配
      console.log('[UI定制] 尝试通过类名模式匹配点赞按钮');
      const classElements = this.findElementsByClassPattern(/like|heart|favorite/i);
      console.log(`[UI定制] 通过类名找到 ${classElements.length} 个可能的点赞元素`);
      return classElements;
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
      } else {
        return this.findElementsByClassPattern(/share|forward/i);
      }
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
    
    // 隐藏/显示礼物（增强礼物识别能力）
    this.toggleElement(() => {
      console.log('[UI定制] 开始查找礼物元素...');
      
      // 1. 组合所有可能的礼物相关元素
      let giftElements = [];
      
      // 通过类名模式匹配多种礼物相关元素
      giftElements = giftElements.concat(
        this.findElementsByClassPattern(/gift|present|reward|award|effect|animation|特效|礼物|打赏|赠送|连击|连击奖励|豪华礼物|礼物特效|礼物动画|送礼物|礼物展示/i)
      );
      
      // 通过属性和结构特征查找
      giftElements = giftElements.concat(
        this.findElementsByStructure({
          attributes: {
            class: /gift|present|reward|award|effect|animation/i
          }
        })
      );
      
      // 查找可能是礼物动画的元素
      const animatedElements = document.body.querySelectorAll('div');
      const potentialGiftAnims = Array.from(animatedElements).filter(el => {
        const style = window.getComputedStyle(el);
        // 礼物通常有动画效果、较高的z-index、绝对定位
        return (style.animationName !== 'none' || 
                style.transitionProperty.includes('transform') ||
                style.transform !== 'none') && 
               parseInt(style.zIndex) > 100 &&
               style.position !== 'static';
      });
      
      giftElements = giftElements.concat(potentialGiftAnims);
      
      // 查找包含特定文字的礼物元素
      const textGiftElements = this.findElementsByStructure({
        text: /礼物|特效|打赏|赠送|连击|连击奖励|豪华礼物/i
      });
      
      // 收集这些元素及其父容器
      if (textGiftElements.length > 0) {
        textGiftElements.forEach(el => {
          giftElements.push(el);
          giftElements.push(el.closest('div') || el);
          giftElements.push(el.closest('.gift-container') || el);
          giftElements.push(el.closest('.animation-container') || el);
        });
      }
      
      // 去重
      giftElements = [...new Set(giftElements)];
      
      console.log(`[UI定制] 找到 ${giftElements.length} 个礼物相关元素`);
      return giftElements;
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
    } else if (typeof selectorOrFinder === 'string' && selectorOrFinder.trim() !== '') {
      // 如果是选择器字符串且不为空，则使用querySelectorAll
      try {
        elements = document.querySelectorAll(selectorOrFinder);
      } catch (e) {
        console.error('无效的CSS选择器:', selectorOrFinder, e);
        return;
      }
    } else {
      console.error('无效的选择器或查找函数参数');
      return;
    }
    
    // 确保elements是数组
    if (!Array.isArray(elements)) {
      elements = Array.from(elements);
    }
    
    // 处理元素显示/隐藏
    elements.forEach(function(element) {
      if (element && element.style) {
        try {
          // 检查元素是否可能是视频内容元素，避免隐藏关键内容
          const isVideoContent = element.tagName === 'VIDEO' || 
                               element.classList.contains('video-content') || 
                               element.classList.contains('video-player') ||
                               element.closest('.video-content') || 
                               element.closest('.video-player');
           
          if (isVideoContent && !show) {
            console.warn('尝试隐藏可能的视频内容元素，跳过此操作');
            return; // 跳过对视频内容元素的隐藏操作
          }
           
          if (show) {
            // 显示元素，移除所有隐藏样式
            element.style.display = '';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            element.style.width = '';
            element.style.height = '';
            element.style.pointerEvents = '';
            element.style.zIndex = '';
            // 同时设置CSS类，用于确保样式优先
            element.classList.remove('douyin-ui-hidden');
          } else {
            // 隐藏元素，使用更强大的样式隐藏方式
            element.style.display = 'none !important';
            element.style.visibility = 'hidden !important';
            element.style.opacity = '0 !important';
            element.style.width = '0 !important';
            element.style.height = '0 !important';
            element.style.pointerEvents = 'none !important';
            element.style.zIndex = '-1 !important';
            // 添加CSS类作为额外保障
            element.classList.add('douyin-ui-hidden');
          }
          let successCount = 0; // 初始化计数器以避免引用错误
          successCount++;
        } catch (error) {
          console.error('处理元素时出错:', error);
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
        // 如果是正则表达式，则使用test方法，否则使用includes
        if (options.text instanceof RegExp) {
          if (options.text.test(el.textContent)) {
            result.push(el);
          }
        } else {
          if (el.textContent.includes(options.text)) {
            result.push(el);
          }
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
          
          // 优化查找逻辑，使用for循环替代forEach以便找到匹配后立即跳出
          const children = parent.querySelectorAll(selector);
          for (let i = 0; i < children.length && !found; i++) {
            const child = children[i];
            // 检查子元素的条件
            let childMatch = true;
            if (childCriteria.text) {
              if (childCriteria.text instanceof RegExp) {
                if (!childCriteria.text.test(child.textContent)) {
                  childMatch = false;
                }
              } else {
                if (!child.textContent.includes(childCriteria.text)) {
                  childMatch = false;
                }
              }
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
            
            if (childMatch) {
              found = true;
              break;
            }
          }
          
          if (!found) {
            match = false;
            break;
          }
        }
        
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
    
    // 启用设置面板拖拽功能
    this.makePanelDraggable(this.settingsPanel);
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
    const closeBtn = panel.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        panel.remove();
      });
    }
    
    // 标签切换
    const tabBtns = panel.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        if (!tabId) return;
        
        // 移除所有活跃状态
        tabBtns.forEach(b => b.classList.remove('active'));
        panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // 设置当前活跃状态
        btn.classList.add('active');
        const tabContent = panel.querySelector(`#${tabId}-tab`);
        if (tabContent) {
          tabContent.classList.add('active');
        }
      });
    });
    
    // 保存按钮
    const saveBtn = panel.querySelector('.save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveSettings(panel);
      });
    }
    
    // 重置按钮
    const resetBtn = panel.querySelector('.reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('确定要重置所有设置吗？')) {
          if (typeof resetConfig === 'function') {
            this.config = resetConfig();
          }
          panel.remove();
          location.reload();
        }
      });
    }
    
    // 初始化导入导出功能
    this.initImportExport(panel);
    
    // 取消拖动功能
  }
  
  /**
   * 使面板可拖动并确保不会移出窗口范围
   * @param {HTMLElement} panel - 要使其可拖动的面板元素
   */
  makePanelDraggable(panel) {
    if (!panel) return;
    
    const header = panel.querySelector('.panel-header');
    if (!header) return;
    
    // 确保面板初始化时就不会超出视口范围
    this.restrictPanelToViewport(panel);
    
    // 移除transform属性，改用left和top定位
    panel.style.transform = 'none';
    
    let isDragging = false;
    let offsetX, offsetY;
    
    header.addEventListener('mousedown', (e) => {
      // 只有点击标题栏区域才触发拖动
      if (e.target.closest('button')) return;
      
      isDragging = true;
      const rect = panel.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      
      // 添加样式标识拖动状态
      panel.classList.add('dragging');
      
      // 防止文本选择
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      // 计算新位置
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;
      
      // 限制在视口内
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const panelWidth = panel.offsetWidth;
      const panelHeight = panel.offsetHeight;
      
      // 确保面板不会移出视口范围
      newLeft = Math.max(0, Math.min(newLeft, viewportWidth - panelWidth));
      newTop = Math.max(0, Math.min(newTop, viewportHeight - panelHeight));
      
      // 设置位置
      panel.style.left = newLeft + 'px';
      panel.style.top = newTop + 'px';
    });
    
    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      
      isDragging = false;
      panel.classList.remove('dragging');
      
      // 释放拖动后再次检查边界
      this.restrictPanelToViewport(panel);
    });
    
    // 添加触摸事件支持
    header.addEventListener('touchstart', (e) => {
      if (e.target.closest('button')) return;
      
      isDragging = true;
      const touch = e.touches[0];
      const rect = panel.getBoundingClientRect();
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
      
      panel.classList.add('dragging');
      e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      const touch = e.touches[0];
      let newLeft = touch.clientX - offsetX;
      let newTop = touch.clientY - offsetY;
      
      // 限制在视口内
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const panelWidth = panel.offsetWidth;
      const panelHeight = panel.offsetHeight;
      
      // 确保面板不会移出视口范围
      newLeft = Math.max(0, Math.min(newLeft, viewportWidth - panelWidth));
      newTop = Math.max(0, Math.min(newTop, viewportHeight - panelHeight));
      
      panel.style.left = newLeft + 'px';
      panel.style.top = newTop + 'px';
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
      if (!isDragging) return;
      
      isDragging = false;
      panel.classList.remove('dragging');
      
      // 释放拖动后再次检查边界
      this.restrictPanelToViewport(panel);
    });
  }
  
  /**
   * 确保面板完全在视口范围内
   * @param {HTMLElement} panel - 面板元素
   */
  restrictPanelToViewport(panel) {
    if (!panel) return;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const rect = panel.getBoundingClientRect();
    const panelWidth = rect.width;
    const panelHeight = rect.height;
    
    let left = rect.left;
    let top = rect.top;
    
    // 检查左右边界
    if (left < 0) {
      left = 0;
    } else if (left + panelWidth > viewportWidth) {
      left = viewportWidth - panelWidth;
    }
    
    // 检查上下边界
    if (top < 0) {
      top = 0;
    } else if (top + panelHeight > viewportHeight) {
      top = viewportHeight - panelHeight;
    }
    
    // 应用修正后的位置
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
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
          <input type="checkbox" id="showLikeButton" ${this.config.video?.showLikeButton ?? true ? 'checked' : ''}>
          显示点赞按钮
        </label>
        <label>
          <input type="checkbox" id="showCommentButton" ${this.config.video?.showCommentButton ?? true ? 'checked' : ''}>
          显示评论按钮
        </label>
        <label>
          <input type="checkbox" id="showShareButton" ${this.config.video?.showShareButton ?? true ? 'checked' : ''}>
          显示分享按钮
        </label>
        <label>
          <input type="checkbox" id="showAuthorInfo" ${this.config.video?.showAuthorInfo ?? true ? 'checked' : ''}>
          显示作者信息
        </label>
        <label>
          <input type="checkbox" id="showMusicInfo" ${this.config.video?.showMusicInfo ?? true ? 'checked' : ''}>
          显示音乐信息
        </label>
        <label>
          <input type="checkbox" id="showVideoDesc" ${this.config.video?.showVideoDesc ?? true ? 'checked' : ''}>
          显示视频描述
        </label>
        <label>
          <input type="checkbox" id="showRecommendedVideos" ${this.config.video?.showRecommendedVideos ?? true ? 'checked' : ''}>
          显示推荐视频
        </label>
      </div>
      
      <div class="setting-group">
        <h3>控制栏设置</h3>
        <label>
          <input type="checkbox" id="showProgressBar" ${this.config.video?.showProgressBar ?? true ? 'checked' : ''}>
          显示进度条
        </label>
        <label>
          <input type="checkbox" id="showPlayPauseButton" ${this.config.video?.showPlayPauseButton ?? true ? 'checked' : ''}>
          显示播放/暂停按钮
        </label>
        <label>
          <input type="checkbox" id="showVolumeControl" ${this.config.video?.showVolumeControl ?? true ? 'checked' : ''}>
          显示音量控制
        </label>
        <label>
          <input type="checkbox" id="showFullscreenButton" ${this.config.video?.showFullscreenButton ?? true ? 'checked' : ''}>
          显示全屏按钮
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
          <input type="checkbox" id="liveShowLikeButton" ${this.config.live?.showLikeButton ?? true ? 'checked' : ''}>
          显示点赞按钮
        </label>
        <label>
          <input type="checkbox" id="liveShowCommentButton" ${this.config.live?.showCommentButton ?? true ? 'checked' : ''}>
          显示评论按钮
        </label>
        <label>
          <input type="checkbox" id="liveShowShareButton" ${this.config.live?.showShareButton ?? true ? 'checked' : ''}>
          显示分享按钮
        </label>
        <label>
          <input type="checkbox" id="liveShowAuthorInfo" ${this.config.live?.showAuthorInfo ?? true ? 'checked' : ''}>
          显示作者信息
        </label>
        <label>
          <input type="checkbox" id="liveShowGiftButton" ${this.config.live?.showGiftButton ?? true ? 'checked' : ''}>
          显示礼物按钮
        </label>
      </div>
      
      <div class="setting-group">
        <h3>弹幕设置</h3>
        <label>
          <input type="checkbox" id="showDanmu" ${this.config.live?.showDanmu ?? true ? 'checked' : ''}>
          显示弹幕
        </label>
        <label>
          <input type="range" id="danmuOpacity" min="0" max="1" step="0.1" value="${this.config.live?.danmuOpacity ?? 1}">
          弹幕透明度: <span id="danmuOpacityValue">${(this.config.live?.danmuOpacity ?? 1) * 100}%</span>
        </label>
      </div>
    `;
  }

  /**
   * 应用配置到设置面板
   */
  applySettingsToPanel() {
    if (!this.settingsPanel) return;

    // 应用主题
    this.applyTheme(this.config.theme);

    // 添加事件监听
    this.settingsPanel.querySelectorAll('input[type="radio"][name="theme"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.config.theme = e.target.value;
        this.applyTheme(this.config.theme);
        this.saveConfig();
      });
    });

    // 通用设置事件监听
    const generalSettings = [
      'autoPlay', 'autoScroll', 'keyboardShortcuts', 'notifications'
    ];

    generalSettings.forEach(setting => {
      const checkbox = this.settingsPanel.querySelector(`#${setting}`);
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          if (!this.config.general) this.config.general = {};
          this.config.general[setting] = e.target.checked;
          this.saveConfig();
        });
      }
    });

    // 视频设置事件监听
    const videoSettings = [
      'showLikeButton', 'showCommentButton', 'showShareButton',
      'showAuthorInfo', 'showMusicInfo', 'showVideoDesc',
      'showRecommendedVideos', 'showProgressBar', 'showPlayPauseButton',
      'showVolumeControl', 'showFullscreenButton'
    ];

    videoSettings.forEach(setting => {
      const checkbox = this.settingsPanel.querySelector(`#${setting}`);
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          if (!this.config.video) this.config.video = {};
          this.config.video[setting] = e.target.checked;
          this.saveConfig();
          this.applyVideoCustomizations();
        });
      }
    });

    // 直播间设置事件监听
    const liveSettings = [
      'liveShowLikeButton', 'liveShowCommentButton', 'liveShowShareButton',
      'liveShowAuthorInfo', 'liveShowGiftButton', 'showDanmu'
    ];

    liveSettings.forEach(setting => {
      const checkbox = this.settingsPanel.querySelector(`#${setting}`);
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          if (!this.config.live) this.config.live = {};
          this.config.live[setting] = e.target.checked;
          this.saveConfig();
          this.applyLiveCustomizations();
        });
      }
    });

    // 弹幕透明度设置
    const danmuOpacitySlider = this.settingsPanel.querySelector('#danmuOpacity');
    if (danmuOpacitySlider) {
      danmuOpacitySlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        this.settingsPanel.querySelector('#danmuOpacityValue').textContent = `${value * 100}%`;
        if (!this.config.live) this.config.live = {};
        this.config.live.danmuOpacity = value;
        this.saveConfig();
        this.applyLiveCustomizations();
      });
    }
  }

  /**
   * 应用主题到页面
   * @param {string} theme - 主题名称 ('light' 或 'dark')
   */
  applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      this.settingsPanel?.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      this.settingsPanel?.classList.remove('dark-theme');
    }
  }

  /**
   * 保存配置到本地存储
   */
  saveConfig() {
    saveConfig(this.config);
  }

  /**
   * 初始化设置面板
   */
  initSettingsPanel() {
    // 创建设置面板
    this.settingsPanel = document.createElement('div');
    this.settingsPanel.id = 'douyin-customizer-panel';
    this.settingsPanel.className = 'customizer-panel';
    
    // 设置面板样式
    this.settingsPanel.style.position = 'fixed';
    this.settingsPanel.style.left = '20px';
    this.settingsPanel.style.top = '20px';
    this.settingsPanel.style.width = '320px';
    this.settingsPanel.style.maxHeight = '80vh';
    this.settingsPanel.style.overflowY = 'auto';
    this.settingsPanel.style.backgroundColor = '#fff';
    this.settingsPanel.style.border = '1px solid #e0e0e0';
    this.settingsPanel.style.borderRadius = '8px';
    this.settingsPanel.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    this.settingsPanel.style.zIndex = '9999';
    this.settingsPanel.style.padding = '20px';
    
    // 添加拖动句柄
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.style.cursor = 'move';
    dragHandle.style.padding = '10px';
    dragHandle.style.backgroundColor = '#f5f5f5';
    dragHandle.style.borderRadius = '4px 4px 0 0';
    dragHandle.style.marginBottom = '15px';
    dragHandle.textContent = '抖音UI定制工具 (拖动移动)';
    
    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.width = '24px';
    closeButton.style.height = '24px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '18px';
    closeButton.style.lineHeight = '1';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => {
      this.settingsPanel.style.display = 'none';
      this.showToggleButton();
    });
    
    // 添加设置内容
    const settingsContent = document.createElement('div');
    settingsContent.className = 'settings-content';
    
    // 创建选项卡导航
    const tabNavigation = document.createElement('div');
    tabNavigation.className = 'tab-navigation';
    tabNavigation.innerHTML = `
      <button class="tab-button active" data-tab="general">通用设置</button>
      <button class="tab-button" data-tab="video">视频设置</button>
      <button class="tab-button" data-tab="live">直播设置</button>
    `;
    
    // 创建选项卡内容
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    
    // 通用设置选项卡
    const generalTab = document.createElement('div');
    generalTab.className = 'tab-pane active';
    generalTab.id = 'general-tab';
    generalTab.innerHTML = this.createGeneralSettings();
    
    // 视频设置选项卡
    const videoTab = document.createElement('div');
    videoTab.className = 'tab-pane';
    videoTab.id = 'video-tab';
    videoTab.innerHTML = this.createVideoSettings();
    
    // 直播设置选项卡
    const liveTab = document.createElement('div');
    liveTab.className = 'tab-pane';
    liveTab.id = 'live-tab';
    liveTab.innerHTML = this.createLiveSettings();
    
    // 组装设置面板
    this.settingsPanel.appendChild(dragHandle);
    this.settingsPanel.appendChild(closeButton);
    this.settingsPanel.appendChild(tabNavigation);
    tabContent.appendChild(generalTab);
    tabContent.appendChild(videoTab);
    tabContent.appendChild(liveTab);
    this.settingsPanel.appendChild(tabContent);
    
    // 添加到文档
    document.body.appendChild(this.settingsPanel);
    
    // 使面板可拖动
    this.makePanelDraggable(this.settingsPanel, dragHandle);
    
    // 初始化时检查并限制面板在视口内
    this.restrictPanelToViewport(this.settingsPanel);
    
    // 应用设置
    this.applySettingsToPanel();
    
    // 设置选项卡切换
    tabNavigation.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        // 移除所有活动状态
        tabNavigation.querySelectorAll('.tab-button').forEach(btn => {
          btn.classList.remove('active');
        });
        tabContent.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.remove('active');
        });
        
        // 添加活动状态
        button.classList.add('active');
        tabContent.querySelector(`#${tabId}-tab`).classList.add('active');
      });
    });
    
    // 初始化主题
    this.applyTheme(this.config.theme);
  }

  /**
   * 显示切换按钮
   */
  showToggleButton() {
    let toggleButton = document.getElementById('douyin-customizer-toggle');
    
    if (!toggleButton) {
      toggleButton = document.createElement('button');
      toggleButton.id = 'douyin-customizer-toggle';
      toggleButton.className = 'customizer-toggle';
      toggleButton.style.position = 'fixed';
      toggleButton.style.left = '20px';
      toggleButton.style.bottom = '20px';
      toggleButton.style.width = '50px';
      toggleButton.style.height = '50px';
      toggleButton.style.borderRadius = '50%';
      toggleButton.style.border = 'none';
      toggleButton.style.backgroundColor = '#ff0050';
      toggleButton.style.color = 'white';
      toggleButton.style.fontSize = '16px';
      toggleButton.style.cursor = 'pointer';
      toggleButton.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
      toggleButton.style.zIndex = '9998';
      toggleButton.style.display = 'flex';
      toggleButton.style.alignItems = 'center';
      toggleButton.style.justifyContent = 'center';
      toggleButton.innerHTML = '⚙️';
      
      document.body.appendChild(toggleButton);
    }
    
    toggleButton.style.display = 'flex';
    
    toggleButton.addEventListener('click', () => {
      this.settingsPanel.style.display = 'block';
      toggleButton.style.display = 'none';
    });
  }

  /**
   * 初始化UI管理器
   */
  init() {
    // 等待页面加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initUI());
    } else {
      this.initUI();
    }
  }

  /**
   * 初始化UI
   */
  initUI() {
    this.initSettingsPanel();
    this.showToggleButton();
    
    // 定期检查页面元素并应用定制
    setInterval(() => {
      this.applyVideoCustomizations();
      this.applyLiveCustomizations();
    }, 1000);
  }
}

// 导出UIManager类
export default UIManager;

// 主脚本逻辑

/**
 * 抖音Web端界面UI定制工具主入口
 * 作者：SutChan
 * 版本：1.0.83
 */

// 导入工具函数
const { getItem, setItem } = require('./utils/storage.js');

// 当前脚本版本
const CURRENT_VERSION = '1.0.124';
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
  
  // 创建浮动设置按钮
  createFloatingSettingsButton(uiManager);
  
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
  
  // 添加用于隐藏元素的CSS类，确保优先级
  customCSS += `
    .douyin-ui-hidden {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      width: 0 !important;
      height: 0 !important;
      pointer-events: none !important;
      z-index: -1 !important;
    }
  `;
  
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
    
    // 隐藏音乐信息
    if (!config.videoUI.showMusicInfo) {
      customCSS += '.music-info, .music-label, .sound-info { display: none !important; }';
    }
    
    // 隐藏视频描述
    if (!config.videoUI.showDescription) {
      customCSS += '.video-desc, .description, .video-content { display: none !important; }';
    }
    
    // 调整界面元素布局
    if (config.videoUI.layout) {
      // 这里可以根据配置添加相应的布局样式
    }
  }
  
  // 直播间界面定制样式
  if (config.liveUI) {
    // 隐藏礼物动画和相关元素（增强版，覆盖更多礼物元素）
    if (!config.liveUI.showGifts) {
      customCSS += `
        /* 礼物核心元素 */
        .gift-animation, .gift-container, .gift-effect, .gift-display,
        .present-animation, .reward-container, .award-animation,
        .animation-container, .live-gift, .live-gift-animation,
        /* 抖音常用礼物类名 */
        [class*="gift"], [class*="present"], [class*="reward"],
        [class*="award"], [class*="effect"], [class*="animation"],
        [class*="特效"], [class*="礼物"], [class*="打赏"],
        [class*="连击"], [class*="豪华礼物"], [class*="礼物特效"],
        /* 礼物按钮和面板 */
        .gift-panel, .gift-button, .send-gift-button,
        /* 礼物动画容器 */
        [style*="animation:"], [style*="transition:"], 
        /* 高z-index可能是礼物的元素 */
        [style*="z-index:"][style*="z-index: 1"],[style*="z-index: 2"],
        [style*="z-index: 3"],[style*="z-index: 4"],[style*="z-index: 5"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          width: 0 !important;
          height: 0 !important;
          pointer-events: none !important;
          z-index: -1 !important;
        }
      `;
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
  console.log('开始监听页面变化...');
  
  // 防抖函数，避免频繁触发UI更新
  const debouncedApplyCustomizations = debounce(() => {
    console.log('应用UI定制...');
    // 检查是否是短视频页面
    if (isVideoPage()) {
      console.log('检测到短视频页面，应用视频定制');
      uiManager.applyVideoCustomizations();
    }
    
    // 检查是否是直播间页面
    if (isLivePage()) {
      console.log('检测到直播间页面，应用直播定制');
      uiManager.applyLiveCustomizations();
    }
  }, 300);
  
  // 使用MutationObserver监听DOM变化
  const observer = new MutationObserver((mutations) => {
    // 检查是否有重要的DOM变化
    let hasSignificantChange = false;
    
    for (const mutation of mutations) {
      // 检查是否有新节点添加
      if (mutation.addedNodes.length > 0) {
        // 检查是否添加了视频容器、内容区域等重要元素
        const addedElements = Array.from(mutation.addedNodes).filter(node => node.nodeType === 1);
        for (const element of addedElements) {
          // 检查是否包含重要元素或类名
          if (element.querySelector('[class*="video"],[class*="content"],[class*="main"],[id*="video"]') || 
              element.className && (element.className.includes('video') || 
                                   element.className.includes('content') || 
                                   element.className.includes('main'))) {
            hasSignificantChange = true;
            break;
          }
        }
      }
      
      if (hasSignificantChange) break;
    }
    
    // 如果有重要变化，应用定制
    if (hasSignificantChange) {
      debouncedApplyCustomizations();
    }
  });
  
  // 更激进的观察配置
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,  // 监听属性变化，包括class变化
    characterData: true  // 监听文本内容变化
  });
  
  // 初始应用，使用多次应用策略确保效果
  const initialApplyDelay = [500, 2000, 5000];
  initialApplyDelay.forEach((delay, index) => {
    setTimeout(() => {
      console.log(`初始应用UI定制 (尝试 ${index + 1}/${initialApplyDelay.length})`);
      if (isVideoPage()) {
        uiManager.applyVideoCustomizations();
      }
      if (isLivePage()) {
        uiManager.applyLiveCustomizations();
      }
    }, delay);
  });
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
  // 检查是否已存在浮动按钮，避免重复创建
  if (document.getElementById('douyin-ui-customizer-float-btn')) {
    return;
  }

  // 创建浮动按钮元素
  const floatButton = document.createElement('div');
  floatButton.id = 'douyin-ui-customizer-float-btn';
  floatButton.innerHTML = '⚙️';
  floatButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #000000;
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    z-index: 999998;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  `;

  // 添加点击事件
  floatButton.addEventListener('click', () => {
    uiManager.showSettingsPanel();
  });

  // 添加悬停效果
  floatButton.addEventListener('mouseenter', () => {
    floatButton.style.transform = 'scale(1.1)';
  });
  
  floatButton.addEventListener('mouseleave', () => {
    floatButton.style.transform = 'scale(1)';
  });

  // 添加到文档中
  document.body.appendChild(floatButton);

  // 定期检查按钮是否存在，避免被页面脚本移除
  setInterval(() => {
    if (!document.getElementById('douyin-ui-customizer-float-btn')) {
      createFloatingSettingsButton(uiManager);
    }
  }, 5000); // 每5秒检查一次
}

// 定义全局UI管理器实例
let globalUIManager = null;

// 全局初始化UI管理器函数
function initUIManager() {
  if (!globalUIManager) {
    const config = loadConfig();
    globalUIManager = new UIManager(config);
  }
  return globalUIManager;
}

// 在脚本顶层注册油猴菜单命令，确保在油猴环境中立即执行
// 打开设置面板
GM_registerMenuCommand('打开设置面板', () => {
  const uiManager = initUIManager();
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

// 重置所有设置
GM_registerMenuCommand('重置所有设置', () => {
  if (confirm('确定要重置所有设置吗？')) {
    resetConfig();
    location.reload();
  }
});

// 增强的初始化逻辑，确保脚本在各种情况下都能正确执行
function ensureInit() {
  // 尝试直接初始化
  try {
    init();
  } catch (error) {
    console.error('初始化失败，将重试:', error);
    // 如果初始化失败，500ms后重试
    setTimeout(init, 500);
  }
}

// 使用多种方式确保初始化执行
// 1. 传统DOMContentLoaded事件监听
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ensureInit);
} 

// 2. 立即尝试初始化（如果文档已加载）
if (document.readyState !== 'loading') {
  setTimeout(ensureInit, 0); // 使用setTimeout确保在当前事件循环后执行
}

// 3. 添加延迟初始化作为后备方案
setTimeout(ensureInit, 1000);

// 4. 监听页面变化，确保SPA路由变化时也能初始化
let lastHref = location.href;
setInterval(() => {
  if (location.href !== lastHref) {
    lastHref = location.href;
    console.log('检测到页面URL变化，重新应用UI定制');
    ensureInit();
  }
}, 1000);