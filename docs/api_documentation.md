# 抖音Web端界面UI定制工具 - API文档

本文档详细描述抖音Web端界面UI定制工具的核心函数、类和API，供开发者参考和使用。

## 目录

- [主模块API](#主模块api)
- [配置管理API](#配置管理api)
- [UI管理器API](#ui管理器api)
- [工具函数API](#工具函数api)
- [构建系统API](#构建系统api)

## 主模块API

### init()

**功能**：初始化抖音UI定制工具

**调用时机**：页面加载完成后自动调用

**流程**：
1. 加载配置
2. 初始化UI管理器
3. 注入样式
4. 监听页面变化
5. 创建浮动设置按钮
6. 检查更新

```javascript
// 初始化函数
export function init() {
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
```

### injectStyles(theme)

**功能**：根据主题注入相应的CSS样式

**参数**：
- `theme`: 字符串，主题名称（'light' 或 'dark'）

**流程**：
1. 移除可能存在的旧样式
2. 创建新的样式元素
3. 根据主题选择样式内容
4. 注入自定义样式

```javascript
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
```

### observePageChanges(uiManager)

**功能**：监听页面DOM变化，自动应用UI定制

**参数**：
- `uiManager`: UIManager实例，用于应用UI定制

**流程**：
1. 创建MutationObserver实例
2. 监听body的DOM变化
3. 根据页面类型应用相应的定制

```javascript
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
```

### checkForUpdates(showNoUpdateMessage)

**功能**：检查脚本更新

**参数**：
- `showNoUpdateMessage`: 布尔值，是否在没有更新时显示消息

**流程**：
1. 从GitHub获取最新版本的脚本
2. 提取版本号
3. 比较版本号
4. 如有更新，提示用户

```javascript
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
```

## 配置管理API

### loadConfig()

**功能**：加载配置，合并默认配置和保存的配置

**返回值**：配置对象

```javascript
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
```

### saveConfig(config)

**功能**：保存配置到本地存储

**参数**：
- `config`: 对象，要保存的配置对象

```javascript
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
```

### resetConfig()

**功能**：重置配置为默认值

**返回值**：默认配置对象

```javascript
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
```

### exportConfig()

**功能**：导出配置为JSON字符串

**返回值**：JSON格式的配置字符串

```javascript
/**
 * 导出配置为JSON字符串
 * @returns {string} JSON格式的配置字符串
 */
function exportConfig() {
  const config = loadConfig();
  return JSON.stringify(config, null, 2);
}
```

### importConfig(jsonString)

**功能**：从JSON字符串导入配置

**参数**：
- `jsonString`: 字符串，JSON格式的配置

**返回值**：布尔值，是否导入成功

```javascript
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
```

## UI管理器API

### UIManager类

**功能**：UI管理器，负责界面元素查找和定制

**构造函数参数**：
- `config`: 对象，配置对象

**主要成员函数**：
- `applyVideoCustomizations()`: 应用短视频界面定制
- `applyLiveCustomizations()`: 应用直播间界面定制
- `toggleElement()`: 切换元素的显示/隐藏
- `showSettingsPanel()`: 显示设置面板

```javascript
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
}
```

### applyVideoCustomizations()

**功能**：应用短视频界面定制

**流程**：根据配置隐藏/显示各种UI元素

```javascript
/**
 * 应用短视频界面定制
 */
applyVideoCustomizations() {
  console.log('应用短视频界面定制');
  
  if (!this.config.videoUI) return;
  
  const { videoUI } = this.config;
  
  // 隐藏/显示点赞按钮
  this.toggleElement(() => {
    // 查找点赞相关元素
    // ...
  }, videoUI.showLikeButton);
  
  // 隐藏/显示评论按钮
  this.toggleElement(() => {
    // 查找评论相关元素
    // ...
  }, videoUI.showCommentButton);
  
  // 隐藏/显示其他元素...
}
```

### applyLiveCustomizations()

**功能**：应用直播间界面定制

**流程**：根据配置隐藏/显示各种直播间UI元素

```javascript
/**
 * 应用直播间界面定制
 */
applyLiveCustomizations() {
  console.log('应用直播间界面定制');
  
  if (!this.config.liveUI) return;
  
  const { liveUI } = this.config;
  
  // 隐藏/显示礼物
  this.toggleElement(() => {
    // 查找礼物相关元素
    // ...
  }, liveUI.showGifts);
  
  // 隐藏/显示弹幕
  this.toggleElement(() => {
    // 查找弹幕相关元素
    // ...
  }, liveUI.showDanmaku);
  
  // 隐藏/显示其他元素...
  
  // 自定义弹幕样式
  if (liveUI.danmaku) {
    this.customizeDanmaku(liveUI.danmaku);
  }
}
```

### toggleElement(selectorOrFinder, show)

**功能**：切换元素的显示/隐藏

**参数**：
- `selectorOrFinder`: 字符串或函数，CSS选择器或元素查找函数
- `show`: 布尔值，是否显示元素

```javascript
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
```

### showSettingsPanel()

**功能**：显示设置面板

```javascript
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
```

## 工具函数API

### debounce(func, wait)

**功能**：防抖函数，延迟执行函数直到一定时间内不再触发

**参数**：
- `func`: 函数，要防抖的函数
- `wait`: 数字，等待时间（毫秒）

**返回值**：函数，防抖后的函数

```javascript
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
```

### getItem(key, defaultValue)

**功能**：安全地获取本地存储数据

**参数**：
- `key`: 字符串，存储键名
- `defaultValue`: 任意类型，默认值，当没有找到数据时返回

**返回值**：存储的数据或默认值

```javascript
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
```

### setItem(key, value)

**功能**：安全地设置本地存储数据

**参数**：
- `key`: 字符串，存储键名
- `value`: 任意类型，要存储的数据

**返回值**：布尔值，是否存储成功

```javascript
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
```

## 构建系统API

### incrementVersion(version)

**功能**：递增版本号

**参数**：
- `version`: 字符串，当前版本号

**返回值**：字符串，递增后的版本号

```javascript
/**
 * 自动递增最小版本号
 */
function incrementVersion(version) {
  const parts = version.split('.').map(Number);
  parts[parts.length - 1] += 1; // 递增最小版本号
  return parts.join('.');
}
```

### generateUserscriptHeader()

**功能**：生成油猴脚本头部

**返回值**：字符串，油猴脚本头部

```javascript
/**
 * 生成油猴脚本头部
 */
function generateUserscriptHeader() {
  const updateUrl = 'https://github.com/SutChan/douyin_tool/raw/main/dist/douyin_ui_customizer.user.js';
  return `// ==UserScript==
// @name         ${pkg.name}
// @namespace    https://github.com/SutChan/douyin_tool
// @version      ${pkg.version}
// @description  ${pkg.description}
// @author       ${pkg.author}
// @match        https://www.douyin.com/*
// @match        https://*.douyin.com/*
// @icon         https://www.douyin.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @updateURL    ${updateUrl}
// @downloadURL  ${updateUrl}
// @license      ${pkg.license}
// ==/UserScript==
/* eslint-disable */
// @ts-nocheck`;
}
```

## 作者

SutChan

## 许可证

MIT