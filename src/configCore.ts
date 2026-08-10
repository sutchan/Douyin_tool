// src/configCore.ts v2.1.0
// 配置纯函数逻辑：合并、迁移、校验、嵌套读取、安全解析（不依赖模块级状态）。

import logger from './utils/logger';
import eventEmitter from './utils/eventEmitter';
import { CONFIG_VERSION, DEFAULT_CONFIG, type Config } from './configDefaults';

// 深度合并用户配置与默认配置
export function mergeConfig(userConfig: Partial<Config>, defaultConfig: Config): Config {
  const merged = { ...defaultConfig };

  for (const key in userConfig) {
    if (Object.prototype.hasOwnProperty.call(userConfig, key)) {
      const userValue = userConfig[key];
      const defaultVal = defaultConfig[key];

      if (typeof userValue === 'object' && userValue !== null &&
        typeof defaultVal === 'object' && defaultVal !== null &&
        !Array.isArray(userValue) && !Array.isArray(defaultVal)) {
        merged[key] = mergeConfig(
          userValue as Partial<Config>,
          defaultVal as Config
        );
      } else {
        merged[key] = userValue;
      }
    }
  }

  return merged;
}

// 从旧版本配置迁移到当前版本
export function migrateConfig(oldConfig: Config): Config {
  if (!oldConfig.version || oldConfig.version !== CONFIG_VERSION) {
    logger.info(`[抖音工具] 执行配置迁移: ${oldConfig.version || 'unknown'} -> ${CONFIG_VERSION}`);
    eventEmitter.emit('config.migrating', {
      fromVersion: oldConfig.version || 'unknown',
      toVersion: CONFIG_VERSION
    });

    if (!oldConfig.advanced) {
      oldConfig.advanced = DEFAULT_CONFIG.advanced;
    }

    if (!oldConfig.videoUI.playback) {
      oldConfig.videoUI.playback = DEFAULT_CONFIG.videoUI.playback;
    }

    if (!oldConfig.liveUI.danmaku.maxLines) {
      oldConfig.liveUI.danmaku.maxLines = DEFAULT_CONFIG.liveUI.danmaku.maxLines;
    }
  }

  return oldConfig;
}

// 按点路径读取嵌套配置项
export function getNestedItemFromConfig(
  obj: Record<string, unknown>,
  path: string
): unknown {
  const keys = path.split('.');
  let current: Record<string, unknown> = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object' || !(key in current)) {
      return undefined;
    }
    current = current[key] as Record<string, unknown>;
  }

  return current;
}

// 安全解析 JSON，剔除危险原型键，防止原型污染
export function safeJsonParse<T = unknown>(input: string): T {
  const parsed = JSON.parse(input) as T;
  const seen = new WeakSet();
  const sanitize = (value: unknown): unknown => {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map(sanitize);
    }
    if (seen.has(value as object)) {
      return undefined;
    }
    seen.add(value as object);
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      result[key] = sanitize((value as Record<string, unknown>)[key]);
    }
    return result;
  };
  return sanitize(parsed) as T;
}

// 校验配置合法性，返回问题清单
export function validateConfig(config: Partial<Config>): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  try {
    if (config.theme && !['light', 'dark'].includes(config.theme)) {
      issues.push('主题配置无效，应为 light 或 dark');
    }

    if (config.videoUI?.layout && !['default', 'compact', 'fullscreen'].includes(config.videoUI.layout)) {
      issues.push('视频界面布局配置无效');
    }

    if (config.liveUI?.layout && !['default', 'minimal', 'immersive'].includes(config.liveUI.layout)) {
      issues.push('直播间界面布局配置无效');
    }

    if (config.liveUI?.danmaku?.fontSize && (config.liveUI.danmaku.fontSize < 12 || config.liveUI.danmaku.fontSize > 36)) {
      issues.push('弹幕字体大小应在 12-36 之间');
    }

    if (config.liveUI?.danmaku?.opacity && (config.liveUI.danmaku.opacity < 0.1 || config.liveUI.danmaku.opacity > 1)) {
      issues.push('弹幕透明度应在 0.1-1 之间');
    }

  } catch (error) {
    logger.error('[抖音工具] 验证配置失败：', error);
    eventEmitter.emit('config.error', { type: 'validate', error });
    issues.push('配置验证过程中发生错误');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}
