// src/main.ts v2.1.0
// 应用主入口：初始化配置、UI、事件与页面监听（单例初始化，避免重复执行）

import { getConfig, saveConfig, setConfig, type Config } from './config';
import UIManager from './ui_manager';
import { observePageChanges, stopObserving } from './utils/pageObserver';
import { initI18n, setLocale } from './i18n';
import logger from './utils/logger';
import { version } from './version';

const APP_VERSION = version;

let initialized = false;

function applySettings(auto: boolean): void {
  const uiManager = UIManager.getInstance();
  const config: Config = getConfig();

  if (auto && !config.autoApply) {
    logger.info('自动应用已关闭，跳过自动应用');
    return;
  }

  logger.info(`应用设置 (auto=${auto})`);
  uiManager.applyVideoCustomizations();
  uiManager.applyLiveCustomizations();

  if (config.customStylesEnabled && config.customStyles) {
    uiManager.applyCustomStyles(config.customStyles);
  }
  if (config.customScriptsEnabled && config.customScripts) {
    uiManager.applyCustomScripts(config.customScripts);
  }
}

function onConfigChange(): void {
  const config = getConfig();
  setLocale(config.language.startsWith('en') ? 'en-US' : 'zh-CN');
  applySettings(false);
}

function initialize(): void {
  if (initialized) {
    logger.warn('应用已初始化，跳过重复初始化');
    return;
  }
  initialized = true;

  const config: Config = getConfig();
  initI18n();
  setLocale(config.language.startsWith('en') ? 'en-US' : 'zh-CN');

  const uiManager = UIManager.getInstance();
  uiManager.init();

  // 监听配置变化（用户点击保存时触发），实现多语言实时切换
  window.addEventListener('config-changed', onConfigChange);

  observePageChanges(uiManager);
  applySettings(true);

  logger.info(`应用初始化完成，版本 ${APP_VERSION}`);
}

// 单一入口：DOM 就绪后初始化（避免 setTimeout 轮询 + setInterval 重复执行）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}

// 暴露全局 API（供控制台调试，单例，不重复定义）
const globalApi = {
  version: APP_VERSION,
  config: getConfig,
  saveConfig,
  setConfig,
  uiManager: UIManager.getInstance(),
  applySettings,
  stopObserving,
  initialized: () => initialized,
};

const g = window as unknown as { douyinUICustomizer?: typeof globalApi };
if (!g.douyinUICustomizer) {
  Object.defineProperty(g, 'douyinUICustomizer', {
    value: globalApi,
    writable: false,
    configurable: false,
  });
}

export { applySettings, initialize };
