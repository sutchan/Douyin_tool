// src/styles/themeIO.ts v2.1.0
// 主题的序列化与解析（纯函数）。

import logger from '../utils/logger';
import type { Theme } from './themeTypes';

// 将主题序列化为格式化 JSON 字符串
export function serializeTheme(theme: Theme | null): string | null {
  if (!theme) return null;
  try {
    return JSON.stringify(theme, null, 2);
  } catch (error) {
    logger.error('主题序列化失败:', error);
    return null;
  }
}

// 将 JSON 字符串解析为主题对象，失败时返回 null
export function parseThemeJson(themeJson: string): Theme | null {
  try {
    return JSON.parse(themeJson) as Theme;
  } catch (error) {
    logger.error('主题解析失败:', error);
    return null;
  }
}
