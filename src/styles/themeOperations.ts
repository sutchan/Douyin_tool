// src/styles/themeOperations.ts v2.1.0
// 主题操作的纯函数：CSS 生成、配置转主题对象、预览与元素应用。

import type { Theme, ThemeConfig, ThemeVariables } from './themeTypes';

// 生成 :root 变量 CSS 字符串
export function buildThemeCss(theme: Theme): string {
  const cssVariables = Object.entries(theme.variables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n  ');

  return `:root {
  ${cssVariables}
}

.douyin-ui-customizer-theme-${theme.name} {}
`;
}

// 根据主题配置构建变量映射
export function buildThemeVariables(config: ThemeConfig): ThemeVariables {
  const variables: ThemeVariables = {};

  if (config.colors) {
    Object.entries(config.colors).forEach(([key, value]) => {
      variables[`--${key}`] = value;
    });
  }

  if (config.fonts) {
    Object.entries(config.fonts).forEach(([key, value]) => {
      variables[`--font-${key}`] = value;
    });
  }

  return variables;
}

// 由主题配置创建主题对象（不注册）
export function createThemeFromConfig(config: ThemeConfig): Theme {
  if (!config.name || !config.label) {
    throw new Error('主题配置必须包含name和label属性');
  }
  return {
    name: config.name,
    label: config.label,
    variables: buildThemeVariables(config)
  };
}

// 生成主题的预览样式字符串
export function generatePreviewStyle(theme: Theme): string {
  return Object.entries(theme.variables)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');
}

// 将主题变量应用到指定元素
export function applyThemeStylesToElement(element: HTMLElement, theme: Theme): void {
  Object.entries(theme.variables).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });

  element.classList.add(`douyin-ui-customizer-theme-${theme.name}`);
}
