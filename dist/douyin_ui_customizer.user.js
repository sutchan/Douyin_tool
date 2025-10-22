// ==UserScript==
// @name         douyin-ui-customizer
// @namespace    https://github.com/SutChan/douyin_tool
// @version      1.0.96
// @description  抖音Web端界面UI定制工具
// @author       SutChan
// @match        https://www.douyin.com/*
// @match        https://*.douyin.com/*
// @match        http://www.douyin.com/*
// @match        http://*.douyin.com/*
// @match        https://www.tiktok.com/*
// @match        https://*.tiktok.com/*
// @match        http://www.tiktok.com/*
// @match        http://*.tiktok.com/*
// @icon         https://www.douyin.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @updateURL    https://github.com/SutChan/douyin_tool/raw/main/dist/douyin_ui_customizer.user.js
// @downloadURL  https://github.com/SutChan/douyin_tool/raw/main/dist/douyin_ui_customizer.user.js
// @license      MIT
// @run-at       document-start
// ==/UserScript==
/* eslint-disable */
// @ts-nocheck

// CSS样式定义
const defaultStyles = '/**
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
  font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;
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
}';
const darkStyles = '/**
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
  font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;
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
}';

// 工具函数模块
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

// 模块分隔符

// 存储工具模块
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
function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`设置本地存储数据失败 (${key}):`, error);
    return false;
  }
}

// 模块分隔符

// 配置管理模块
const DEFAULT_CONFIG = {
  theme: 'light',
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
  general: {
    autoPlay: true,
    autoScroll: false,
    keyboardShortcuts: true,
    notifications: false
  }
};
function loadConfig() {
  try {
    const savedConfig = GM_getValue('douyin_ui_customizer_config');
    if (savedConfig) {
      return mergeConfig(savedConfig, DEFAULT_CONFIG);
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('加载配置失败：', error);
    return DEFAULT_CONFIG;
  }
}
function saveConfig(config) {
  try {
    GM_setValue('douyin_ui_customizer_config', config);
  } catch (error) {
    console.error('保存配置失败：', error);
  }
}
function resetConfig() {
  try {
    GM_setValue('douyin_ui_customizer_config', DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('重置配置失败：', error);
    return DEFAULT_CONFIG;
  }
}
function mergeConfig(userConfig, defaultConfig) {
  const merged = { ...defaultConfig };
  for (const key in userConfig) {
    if (userConfig.hasOwnProperty(key)) {
      if (typeof userConfig[key] === 'object' && userConfig[key] !== null &&
          typeof defaultConfig[key] === 'object' && defaultConfig[key] !== null &&
          !Array.isArray(userConfig[key]) && !Array.isArray(defaultConfig[key])) {
        merged[key] = mergeConfig(userConfig[key], defaultConfig[key]);
      } else {
        merged[key] = userConfig[key];
      }
    }
  }
  return merged;
}
function exportConfig() {
  const config = loadConfig();
  return JSON.stringify(config, null, 2);
}
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

// 模块分隔符

// UI管理器模块
class UIManager {
  constructor(config) {
    this.config = config;
    this.settingsPanel = null;
  }
  applyVideoCustomizations() {
    if (!this.config.videoUI) {
      return;
    }
    const { videoUI } = this.config;
    if (!document.body) {
      setTimeout(() => this.applyVideoCustomizations(), 500);
      return;
    }
    this.toggleElement(() => {
      const heartIcons = this.findElementsByStructure({
        tagName: 'svg',
        attributes: { viewBox: '0 0 1024 1024' }
      });
      if (heartIcons.length > 0) {
        const elements = heartIcons.map(icon => icon.closest('div') || icon);
        return elements;
      }
      const classElements = this.findElementsByClassPattern(/like|heart|favorite/i);
      return classElements;
    }, videoUI.showLikeButton);
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
          const text = el.textContent.toLowerCase();
          return text.includes('share') || text.includes('分享');
        });
      } else {
        return this.findElementsByClassPattern(/share|forward/i);
      }
    }, videoUI.showShareButton);
    this.toggleElement(() => {
      const avatarElements = this.findElementsByStructure({
        tagName: 'img',
        attributes: { class: /avatar|user/i }
      });
      if (avatarElements.length > 0) {
        return avatarElements.map(img => img.closest('div') || img);
      }
      return this.findElementsByClassPattern(/author|user|avatar/i);
    }, videoUI.showAuthorInfo);
    this.toggleElement(() => {
      const musicElements = this.findElementsByStructure({
        text: '音乐'
      });
      if (musicElements.length > 0) {
        return musicElements.map(el => el.closest('div') || el);
      }
      return this.findElementsByClassPattern(/music|sound/i);
    }, videoUI.showMusicInfo);
    this.toggleElement(() => {
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
    this.toggleElement(() => {
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
    if (videoUI.controlBar) {
      this.customizeControlBar(videoUI.controlBar);
    }
    this.applyLayout('video', videoUI.layout);
  }
  applyLiveCustomizations() {
    if (!this.config.liveUI) return;
    const { liveUI } = this.config;
    this.toggleElement(() => {
      let giftElements = [];
      giftElements = giftElements.concat(
        this.findElementsByClassPattern(/gift|present|reward|award|effect|animation|特效|礼物|打赏|赠送|连击|连击奖励|豪华礼物|礼物特效|礼物动画|送礼物|礼物展示/i)
      );
      giftElements = giftElements.concat(
        this.findElementsByStructure({
          attributes: {
            class: /gift|present|reward|award|effect|animation/i
          }
        })
      );
      const animatedElements = document.body.querySelectorAll('div');
      const potentialGiftAnims = Array.from(animatedElements).filter(el => {
        const style = window.getComputedStyle(el);
        return (style.animationName !== 'none' ||
                style.transitionProperty.includes('transform') ||
                style.transform !== 'none') &&
               parseInt(style.zIndex) > 100 &&
               style.position !== 'static';
      });
      giftElements = giftElements.concat(potentialGiftAnims);
      const textGiftElements = this.findElementsByStructure({
        text: /礼物|特效|打赏|赠送|连击|连击奖励|豪华礼物/i
      });
      if (textGiftElements.length > 0) {
        textGiftElements.forEach(el => {
          giftElements.push(el);
          giftElements.push(el.closest('div') || el);
          giftElements.push(el.closest('.gift-container') || el);
          giftElements.push(el.closest('.animation-container') || el);
        });
      }
      giftElements = [...new Set(giftElements)];
      return giftElements;
    }, liveUI.showGifts);
    this.toggleElement(() => {
      const bulletElements = document.body.querySelectorAll('div');
      const potentialBullets = Array.from(bulletElements).filter(el => {
        const style = window.getComputedStyle(el);
        return style.position === 'absolute' &&
               style.pointerEvents === 'none' &&
               style.zIndex > 0;
      });
      if (potentialBullets.length > 0) {
        return potentialBullets;
      }
      return this.findElementsByClassPattern(/danmu|bullet|comment|danmaku/i);
    }, liveUI.showDanmaku);
    this.toggleElement(() => {
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
    this.toggleElement(() => {
      const adElements = this.findElementsByStructure({
        text: /广告|推广|ad|promotion/i
      });
      if (adElements.length > 0) {
        return adElements.map(el => el.closest('div') || el);
      }
      return this.findElementsByClassPattern(/ad|advertisement|promotion|广告/i);
    }, liveUI.showAds);
    this.toggleElement(() => {
      const numberElements = document.body.querySelectorAll('div');
      const potentialStats = Array.from(numberElements).filter(el => {
        return /\d+/.test(el.textContent);
      });
      if (potentialStats.length > 0) {
        return potentialStats;
      }
      return this.findElementsByClassPattern(/stat|count|number|view/i);
    }, liveUI.showStats);
    if (liveUI.danmaku) {
      this.customizeDanmaku(liveUI.danmaku);
    }
    this.applyLayout('live', liveUI.layout);
  }
  toggleElement(selectorOrFinder, show) {
    let elements = [];
    if (typeof selectorOrFinder === 'function') {
      try {
        elements = selectorOrFinder();
      } catch (e) {
        console.error('查找元素函数执行失败:', e);
        return;
      }
    } else if (typeof selectorOrFinder === 'string' && selectorOrFinder.trim() !== '') {
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
    if (!Array.isArray(elements)) {
      elements = Array.from(elements);
    }
    elements.forEach(function(element) {
      if (element && element.style) {
        try {
          const isVideoContent = element.tagName === 'VIDEO' ||
                               element.classList.contains('video-content') ||
                               element.classList.contains('video-player') ||
                               element.closest('.video-content') ||
                               element.closest('.video-player');
          if (isVideoContent && !show) {
            console.warn('尝试隐藏可能的视频内容元素，跳过此操作');
            return;
          }
          if (show) {
            element.style.display = '';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            element.style.width = '';
            element.style.height = '';
            element.style.pointerEvents = '';
            element.style.zIndex = '';
            element.classList.remove('douyin-ui-hidden');
          } else {
            element.style.display = 'none !important';
            element.style.visibility = 'hidden !important';
            element.style.opacity = '0 !important';
            element.style.width = '0 !important';
            element.style.height = '0 !important';
            element.style.pointerEvents = 'none !important';
            element.style.zIndex = '-1 !important';
            element.classList.add('douyin-ui-hidden');
          }
          let successCount = 0;
          successCount++;
        } catch (error) {
          console.error('处理元素时出错:', error);
        }
      }
    });
  }
  findElementsByStructure(options) {
    const result = [];
    if (options.text) {
      const allElements = document.body.querySelectorAll('*');
      allElements.forEach(el => {
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
      const elements = document.body.querySelectorAll(options.tagName);
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
        result.push(...Array.from(elements));
      }
    }
    if (options.children) {
      const candidates = result.length > 0 ? result : document.body.querySelectorAll('*');
      const filtered = [];
      candidates.forEach(parent => {
        let match = true;
        for (const childCriteria of options.children) {
          const selector = childCriteria.tagName;
          let found = false;
          const children = parent.querySelectorAll(selector);
          for (let i = 0; i < children.length && !found; i++) {
            const child = children[i];
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
  customizeControlBar(controlBarConfig) {
    const controlBar = document.querySelector('.video-control-bar');
    if (!controlBar) return;
    if (!controlBarConfig.show) {
      controlBar.style.display = 'none';
      return;
    }
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
    if (controlBarConfig.autoHide) {
    }
  }
  customizeDanmaku(danmakuConfig) {
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
      let duration = 6;
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
  applyLayout(type, layout) {
    if (!layout || layout === 'default') return;
  }
  showSettingsPanel() {
    if (this.settingsPanel) {
      this.settingsPanel.remove();
    }
    this.settingsPanel = this.createSettingsPanel();
    document.body.appendChild(this.settingsPanel);
    this.makePanelDraggable(this.settingsPanel);
  }
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
    this.setupSettingsPanelEvents(panel);
    return panel;
  }
  setupSettingsPanelEvents(panel) {
    const closeBtn = panel.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        panel.remove();
      });
    }
    const tabBtns = panel.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        if (!tabId) return;
        tabBtns.forEach(b => b.classList.remove('active'));
        panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tabContent = panel.querySelector(`#${tabId}-tab`);
        if (tabContent) {
          tabContent.classList.add('active');
        }
      });
    });
    const saveBtn = panel.querySelector('.save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveSettings(panel);
      });
    }
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
    this.initImportExport(panel);
  }
  makePanelDraggable(panel) {
    if (!panel) return;
    const header = panel.querySelector('.panel-header');
    if (!header) return;
    this.restrictPanelToViewport(panel);
    panel.style.transform = 'none';
    let isDragging = false;
    let offsetX, offsetY;
    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      const rect = panel.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      panel.classList.add('dragging');
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const panelWidth = panel.offsetWidth;
      const panelHeight = panel.offsetHeight;
      newLeft = Math.max(0, Math.min(newLeft, viewportWidth - panelWidth));
      newTop = Math.max(0, Math.min(newTop, viewportHeight - panelHeight));
      panel.style.left = newLeft + 'px';
      panel.style.top = newTop + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      panel.classList.remove('dragging');
      this.restrictPanelToViewport(panel);
    });
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
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const panelWidth = panel.offsetWidth;
      const panelHeight = panel.offsetHeight;
      newLeft = Math.max(0, Math.min(newLeft, viewportWidth - panelWidth));
      newTop = Math.max(0, Math.min(newTop, viewportHeight - panelHeight));
      panel.style.left = newLeft + 'px';
      panel.style.top = newTop + 'px';
    }, { passive: false });
    document.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      panel.classList.remove('dragging');
      this.restrictPanelToViewport(panel);
    });
  }
  restrictPanelToViewport(panel) {
    if (!panel) return;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const rect = panel.getBoundingClientRect();
    const panelWidth = rect.width;
    const panelHeight = rect.height;
    let left = rect.left;
    let top = rect.top;
    if (left < 0) {
      left = 0;
    } else if (left + panelWidth > viewportWidth) {
      left = viewportWidth - panelWidth;
    }
    if (top < 0) {
      top = 0;
    } else if (top + panelHeight > viewportHeight) {
      top = viewportHeight - panelHeight;
    }
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
  }
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
  applySettingsToPanel() {
    if (!this.settingsPanel) return;
    this.applyTheme(this.config.theme);
    this.settingsPanel.querySelectorAll('input[type="radio"][name="theme"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.config.theme = e.target.value;
        this.applyTheme(this.config.theme);
        this.saveConfig();
      });
    });
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
  applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      this.settingsPanel?.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      this.settingsPanel?.classList.remove('dark-theme');
    }
  }
  saveConfig() {
    saveConfig(this.config);
  }
  initSettingsPanel() {
    this.settingsPanel = document.createElement('div');
    this.settingsPanel.id = 'douyin-customizer-panel';
    this.settingsPanel.className = 'customizer-panel';
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
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.style.cursor = 'move';
    dragHandle.style.padding = '10px';
    dragHandle.style.backgroundColor = '#f5f5f5';
    dragHandle.style.borderRadius = '4px 4px 0 0';
    dragHandle.style.marginBottom = '15px';
    dragHandle.textContent = '抖音UI定制工具 (拖动移动)';
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
    const settingsContent = document.createElement('div');
    settingsContent.className = 'settings-content';
    const tabNavigation = document.createElement('div');
    tabNavigation.className = 'tab-navigation';
    tabNavigation.innerHTML = `
      <button class="tab-button active" data-tab="general">通用设置</button>
      <button class="tab-button" data-tab="video">视频设置</button>
      <button class="tab-button" data-tab="live">直播设置</button>
    `;
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    const generalTab = document.createElement('div');
    generalTab.className = 'tab-pane active';
    generalTab.id = 'general-tab';
    generalTab.innerHTML = this.createGeneralSettings();
    const videoTab = document.createElement('div');
    videoTab.className = 'tab-pane';
    videoTab.id = 'video-tab';
    videoTab.innerHTML = this.createVideoSettings();
    const liveTab = document.createElement('div');
    liveTab.className = 'tab-pane';
    liveTab.id = 'live-tab';
    liveTab.innerHTML = this.createLiveSettings();
    this.settingsPanel.appendChild(dragHandle);
    this.settingsPanel.appendChild(closeButton);
    this.settingsPanel.appendChild(tabNavigation);
    tabContent.appendChild(generalTab);
    tabContent.appendChild(videoTab);
    tabContent.appendChild(liveTab);
    this.settingsPanel.appendChild(tabContent);
    document.body.appendChild(this.settingsPanel);
    this.makePanelDraggable(this.settingsPanel, dragHandle);
    this.restrictPanelToViewport(this.settingsPanel);
    this.applySettingsToPanel();
    tabNavigation.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        tabNavigation.querySelectorAll('.tab-button').forEach(btn => {
          btn.classList.remove('active');
        });
        tabContent.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.remove('active');
        });
        button.classList.add('active');
        tabContent.querySelector(`#${tabId}-tab`).classList.add('active');
      });
    });
    this.applyTheme(this.config.theme);
  }
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
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initUI());
    } else {
      this.initUI();
    }
  }
  initUI() {
    this.initSettingsPanel();
    this.showToggleButton();
    setInterval(() => {
      this.applyVideoCustomizations();
      this.applyLiveCustomizations();
    }, 1000);
  }
}
export default UIManager;

// 模块分隔符

// 主脚本逻辑
/**
 * 抖音Web端界面UI定制工具主入口
 * 作者：SutChan
 * 版本：1.0.83
 */

// 导入工具函数


// 当前脚本版本
const CURRENT_VERSION = '1.0.96';
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
  
  
  // 防抖函数，避免频繁触发UI更新
  const debouncedApplyCustomizations = debounce(() => {
    
    // 检查是否是短视频页面
    if (isVideoPage()) {
      
      uiManager.applyVideoCustomizations();
    }
    
    // 检查是否是直播间页面
    if (isLivePage()) {
      
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
      `);
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
    
    ensureInit();
  }
}, 1000);