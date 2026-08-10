// src/styles/themeManager.ts v2.1.0
// 主题管理器实现：主题切换、注册、导入导出、预览与重置。

import logger from '../utils/logger';
import { injectStyle } from '../utils/dom';
import { NamespacedStorage } from '../utils/storage';
import { DEFAULT_THEMES } from './defaultThemes';
import type { Theme, ThemeVariables, ThemeConfig } from './themeTypes';
import { buildThemeCss, createThemeFromConfig, generatePreviewStyle, applyThemeStylesToElement } from './themeOperations';

class ThemeManager {
  private themes: Record<string, Theme>;
  private currentTheme: string | null;
  private styleElement: HTMLStyleElement | null;
  private storage: NamespacedStorage;

  constructor() {
    this.themes = { ...DEFAULT_THEMES };
    this.currentTheme = null;
    this.styleElement = null;
    this.storage = new NamespacedStorage('douyin_ui_customizer_theme');
  }

  init(): void {
    try {
      const savedTheme = this.storage.getItem('current');

      if (savedTheme && this.themes[savedTheme]) {
        this.switchTheme(savedTheme);
      } else {
        this.switchTheme('light');
      }

      logger.info('主题管理器初始化成功');
    } catch (error) {
      logger.error('主题管理器初始化失败:', error);
      this.switchTheme('light');
    }
  }

  switchTheme(themeName: string): boolean {
    try {
      if (!this.themes[themeName]) {
        logger.warn(`主题 ${themeName} 不存在，使用默认主题`);
        themeName = 'light';
      }

      const theme = this.themes[themeName];

      const css = buildThemeCss(theme);

      if (this.styleElement && this.styleElement.parentNode) {
        this.styleElement.parentNode.removeChild(this.styleElement);
      }

      this.styleElement = injectStyle(css);

      this.currentTheme = themeName;

      this.storage.setItem('current', themeName);

      document.body.classList.remove(
        ...Object.keys(this.themes).map(t => `douyin-ui-customizer-theme-${t}`)
      );
      document.body.classList.add(`douyin-ui-customizer-theme-${themeName}`);

      logger.info(`主题切换到 ${theme.label} (${themeName})`);
      return true;
    } catch (error) {
      logger.error(`主题切换失败 (${themeName}):`, error);
      return false;
    }
  }

  getCurrentTheme(): string {
    return this.currentTheme || 'light';
  }

  getAvailableThemes(): Theme[] {
    return Object.values(this.themes);
  }

  createTheme(themeConfig: ThemeConfig): string | null {
    try {
      const theme = createThemeFromConfig(themeConfig);
      this.registerTheme(theme);
      logger.info(`创建新主题成功: ${themeConfig.label}`);
      return themeConfig.name;
    } catch (error) {
      logger.error('创建主题失败:', error);
      return null;
    }
  }

  deleteTheme(themeName: string): boolean {
    try {
      if (DEFAULT_THEMES[themeName]) {
        logger.warn(`不能删除默认主题: ${themeName}`);
        return false;
      }

      if (!this.themes[themeName]) {
        logger.warn(`主题不存在: ${themeName}`);
        return false;
      }

      if (this.currentTheme === themeName) {
        this.switchTheme('light');
      }

      delete this.themes[themeName];
      logger.info(`主题删除成功: ${themeName}`);
      return true;
    } catch (error) {
      logger.error(`删除主题失败 (${themeName}):`, error);
      return false;
    }
  }

  getTheme(themeName: string): Theme | null {
    return this.themes[themeName] || null;
  }

  registerTheme(theme: Theme): boolean {
    try {
      if (!theme.name || !theme.variables) {
        throw new Error('主题配置必须包含name和variables属性');
      }

      if (typeof theme.variables !== 'object') {
        throw new Error('variables必须是对象');
      }

      this.themes[theme.name] = {
        name: theme.name,
        label: theme.label || theme.name,
        variables: { ...theme.variables }
      };

      logger.info(`新主题注册成功: ${theme.label || theme.name}`);
      return true;
    } catch (error) {
      logger.error('主题注册失败:', error);
      return false;
    }
  }

  exportTheme(themeName: string): string | null {
    const theme = this.themes[themeName] || null;
    return serializeTheme(theme);
  }

  importTheme(themeJson: string): boolean {
    const theme = parseThemeJson(themeJson);
    if (!theme) return false;
    return this.registerTheme(theme);
  }

  generatePreviewStyle(themeName: string): string | null {
    const theme = this.themes[themeName];
    if (!theme) return null;

    return generatePreviewStyle(theme);
  }

  applyThemeToElement(element: HTMLElement, themeName: string): void {
    try {
      const theme = this.themes[themeName];
      if (!theme || !element) return;

      applyThemeStylesToElement(element, theme);
    } catch (error) {
      logger.error(`应用主题到元素失败:`, error);
    }
  }

  reset(): void {
    try {
      if (this.styleElement && this.styleElement.parentNode) {
        this.styleElement.parentNode.removeChild(this.styleElement);
      }

      Object.keys(this.themes).forEach(themeName => {
        document.body.classList.remove(`douyin-ui-customizer-theme-${themeName}`);
      });

      this.themes = { ...DEFAULT_THEMES };
      this.currentTheme = null;
      this.styleElement = null;

      this.storage.removeItem('current');

      this.init();

      logger.info('主题设置已重置');
    } catch (error) {
      logger.error('重置主题设置失败:', error);
    }
  }

  on(event: string, callback: (data: unknown) => void): void {
    if (event === 'themeChanged') {
      const originalSwitchTheme = this.switchTheme.bind(this);
      this.switchTheme = (themeName: string): boolean => {
        const result = originalSwitchTheme(themeName);
        if (result) {
          callback(themeName);
        }
        return result;
      };
    }
  }

  applyTheme(themeName: string): Promise<boolean> {
    return Promise.resolve(this.switchTheme(themeName));
  }

  listThemes(): Theme[] {
    return this.getAvailableThemes();
  }
}

const themeManager = new ThemeManager();

export { ThemeManager, themeManager };
export default themeManager;
