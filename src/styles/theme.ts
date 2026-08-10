// src/styles/theme.ts v2.1.0
// 主题系统入口：聚合类型、默认主题、ThemeManager 实现与默认实例。

export type { Theme, ThemeVariables, ThemeConfig } from './themeTypes';
export { DEFAULT_THEMES } from './defaultThemes';
export { ThemeManager, themeManager } from './themeManager';

import themeManager from './themeManager';

export default themeManager;
