// src/index.ts v2.1.0
// 库入口：聚合导出，供构建工具打包为可复用模块时使用。
// 注意：浏览器用户脚本实际入口为 src/main.ts（已含初始化逻辑），
// 本文件仅做 re-export，不在此处执行任何初始化或全局对象赋值，避免与 main.ts 冲突。

export { default as UIManager } from './ui_manager';
export { getConfig, saveConfig, updateConfig, defaultConfig, type AppConfig } from './config';
export { default as ElementController, default as elementController } from './controllers/elementController';
export { default as LayoutController, default as layoutController } from './controllers/layoutController';
export { default as AutoTestController, default as autoTestController } from './controllers/autoTestController';
export { initI18n, t, getLocale, setLocale, type SupportedLocale } from './i18n';
export { version } from './version';
export * from './utils/dom';
export * from './utils/logger';
export * from './utils/storage';
export * from './utils/eventEmitter';
export * from './utils/autoExecutor';
export * from './utils/buttonDetector';
export * from './utils/styleGenerator';
export * from './utils/performance';
export * from './utils/pageObserver';
export * from './ui';
export * from './types';
