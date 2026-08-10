// src/config.ts v2.1.0
// 配置管理器：负责配置的加载、读取、写入与状态维护。
// 默认配置与常量拆分至 ./configDefaults，纯函数逻辑拆分至 ./configCore。

import { NamespacedStorage } from './utils/storage';
import logger from './utils/logger';
import eventEmitter from './utils/eventEmitter';
import { CONFIG_KEY, CONFIG_VERSION, DEFAULT_CONFIG, type Config } from './configDefaults';
import { mergeConfig, migrateConfig, validateConfig, getNestedItemFromConfig, safeJsonParse } from './configCore';

export type { Config } from './configDefaults';

const configStorage = new NamespacedStorage('douyin_tool_config');

let currentConfig: Config | null = null;

export function loadConfig(): Config {
  try {
    const savedConfig = configStorage.getJSON<Config>(CONFIG_KEY, null as unknown as Config);

    if (savedConfig) {
      logger.info('[抖音工具] 加载已保存的配置');
      const loadedConfig = migrateConfig(savedConfig);
      const validatedConfig = validateConfig(loadedConfig);
      if (!validatedConfig.valid) {
        logger.warn('[抖音工具] 配置校验未通过:', validatedConfig.issues);
      }
      currentConfig = loadedConfig;
      eventEmitter.emit('config.loaded', { config: currentConfig });
    } else {
      logger.info('[抖音工具] 未找到已保存配置，使用默认配置');
      currentConfig = { ...DEFAULT_CONFIG };
      eventEmitter.emit('config.loaded', { config: currentConfig });
    }
  } catch (error) {
    logger.error('[抖音工具] 加载配置失败，使用默认配置：', error);
    currentConfig = { ...DEFAULT_CONFIG };
    eventEmitter.emit('config.error', { type: 'load', error });
  }

  return currentConfig;
}

export const defaultConfig: Config = { ...DEFAULT_CONFIG };

export function getConfig(): Config {
  if (!currentConfig) {
    loadConfig();
  }
  return { ...currentConfig! };
}

export function updateConfig(partial: Partial<Config>): boolean {
  try {
    if (!currentConfig) {
      loadConfig();
    }
    currentConfig = mergeConfig(partial, currentConfig!);
    currentConfig.version = CONFIG_VERSION;
    saveConfig(currentConfig);
    eventEmitter.emit('config.updated', { config: currentConfig });
    logger.info('[抖音工具] 配置已更新');
    return true;
  } catch (error) {
    logger.error('[抖音工具] 更新配置失败：', error);
    eventEmitter.emit('config.error', { type: 'update', error });
    return false;
  }
}

export function setConfig(config: Config): boolean {
  try {
    currentConfig = config;
    currentConfig.version = CONFIG_VERSION;
    saveConfig(currentConfig);
    eventEmitter.emit('config.set', { config: currentConfig });
    logger.info('[抖音工具] 配置已设置');
    return true;
  } catch (error) {
    logger.error('[抖音工具] 设置配置失败：', error);
    eventEmitter.emit('config.error', { type: 'set', error });
    return false;
  }
}

export function saveConfig(config: Config): boolean {
  try {
    configStorage.setJSON(CONFIG_KEY, config);
    logger.info('[抖音工具] 配置已保存');
    eventEmitter.emit('config.saved', { config });
    return true;
  } catch (error) {
    logger.error('[抖音工具] 保存配置失败：', error);
    eventEmitter.emit('config.error', { type: 'save', error });
    return false;
  }
}

export function resetConfig(): Config {
  try {
    currentConfig = { ...DEFAULT_CONFIG };
    configStorage.setJSON(CONFIG_KEY, currentConfig);
    logger.info('[抖音工具] 配置已重置为默认值');
    eventEmitter.emit('config.reset', { config: currentConfig });
    return currentConfig;
  } catch (error) {
    logger.error('[抖音工具] 重置配置失败：', error);
    eventEmitter.emit('config.error', { type: 'reset', error });
    return { ...DEFAULT_CONFIG };
  }
}

export function getConfigValue<T = unknown>(path: string, defaultValue?: T): T {
  if (!currentConfig) {
    loadConfig();
  }

  if (path.includes('.')) {
    return getNestedItemFromConfig(currentConfig as Record<string, unknown>, path) as T ?? defaultValue as T;
  }

  const value = (currentConfig as Record<string, unknown>)[path];
  return value !== undefined ? (value as T) : defaultValue as T;
}

export function exportConfig(): string {
  const config = getConfig();
  try {
    const result = JSON.stringify(config, null, 2);
    logger.info('[抖音工具] 配置导出成功');
    return result;
  } catch (error) {
    logger.error('[抖音工具] 导出配置失败：', error);
    eventEmitter.emit('config.error', { type: 'export', error });
    return '{}';
  }
}

export function importConfig(jsonString: string): boolean {
  try {
    const config = safeJsonParse<Record<string, unknown>>(jsonString);

    if (typeof config !== 'object' || config === null || Array.isArray(config)) {
      throw new Error('配置格式无效');
    }

    currentConfig = mergeConfig(config as Partial<Config>, DEFAULT_CONFIG);
    currentConfig.version = CONFIG_VERSION;
    saveConfig(currentConfig);

    logger.info('[抖音工具] 配置导入成功');
    eventEmitter.emit('config.imported', { config: currentConfig });
    return true;
  } catch (error) {
    logger.error('[抖音工具] 导入配置失败：', error);
    eventEmitter.emit('config.error', { type: 'import', error });
    return false;
  }
}

const initialized = loadConfig();

eventEmitter.on('config.saved', (data) => {
  logger.debug('[抖音工具] 配置已保存:', data);
});

eventEmitter.on('config.error', (data) => {
  logger.error('[抖音工具] 配置错误:', data);
});

export default {
  loadConfig,
  getConfig,
  setConfig,
  getConfigValue,
  saveConfig,
  resetConfig,
  exportConfig,
  importConfig,
  validateConfig,
  get DEFAULT_CONFIG() {
    return { ...DEFAULT_CONFIG };
  },
  get CONFIG_VERSION() {
    return CONFIG_VERSION;
  },
  get initialized() {
    return initialized !== null;
  }
};

logger.info('[抖音工具] 配置管理器已初始化');
eventEmitter.emit('config.initialized', { config: currentConfig });
