// src/utils/buttonDetectorTypes.ts v2.1.0
// 按钮检测器相关类型与默认配置常量，供 buttonDetector.ts 复用。

export interface ButtonDetectorOptions {
  buttonTexts?: string[];
  cssSelectors?: string[];
  enableLogging?: boolean;
}

// 默认待检测按钮文案（中英文）
export const DEFAULT_BUTTON_TEXTS: string[] = [
  'Continue', 'Run', 'Execute', 'Next', 'Proceed', 'Start',
  '继续', '运行', '执行', '下一步', '开始'
];

// 默认 CSS 选择器（含 :contains 伪类与常见主按钮类）
export const DEFAULT_CSS_SELECTORS: string[] = [
  'button:contains(Continue)',
  'button:contains(Run)',
  'button:contains(Execute)',
  'button:contains(Next)',
  'button:contains(Proceed)',
  'button:contains(Start)',
  'button:contains(继续)',
  'button:contains(运行)',
  'button:contains(执行)',
  'button:contains(下一步)',
  'button:contains(开始)',
  '.button-primary',
  '.btn-primary',
  '[type="submit"]',
  '.continue-button',
  '.run-button',
  '.execute-button'
];
