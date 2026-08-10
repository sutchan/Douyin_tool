// src/styles/themeTypes.ts v2.1.0
// 主题系统类型定义。

export interface ThemeVariables {
  [key: string]: string;
}

export interface Theme {
  name: string;
  label: string;
  variables: ThemeVariables;
}

export interface ThemeConfig {
  name: string;
  label: string;
  colors?: Record<string, string>;
  fonts?: Record<string, string>;
}
