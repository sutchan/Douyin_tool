// src/i18n/index.ts v2.1.0
// 国际化（i18n）核心模块：提供多语言加载、切换与文本解析能力

import type { AppConfig } from '../types';
import { getConfig } from '../config';

export type SupportedLocale = 'zh-CN' | 'en-US';

export interface I18nResource {
  [key: string]: string;
}

const resources: Record<SupportedLocale, I18nResource> = {
  'zh-CN': {
    'app.name': '抖音界面定制工具',
    'app.version': '版本',
    'app.author': '作者',
    'settings.title': '抖音界面定制设置',
    'settings.subtitle': '个性化你的抖音浏览体验',
    'settings.close': '关闭',
    'settings.save': '保存设置',
    'settings.reset': '恢复默认',
    'settings.theme': '主题',
    'settings.language': '语言',
    'settings.miniPlayer': '小窗播放',
    'settings.hideTopBar': '隐藏顶部栏',
    'settings.hideSidebar': '隐藏侧边栏',
    'settings.hideComments': '隐藏评论区',
    'settings.autoPlay': '自动播放',
    'settings.autoMute': '自动静音',
    'settings.hideLiveTopBar': '隐藏直播顶部栏',
    'settings.hideLiveGift': '隐藏直播礼物区',
    'settings.hideLiveChat': '隐藏直播聊天区',
    'settings.darkMode': '暗黑模式',
    'settings.customStyles': '自定义CSS',
    'settings.customScripts': '自定义脚本',
    'settings.apply': '应用',
    'settings.testing.title': '功能测试',
    'settings.testing.autoTest': '运行自动化测试',
    'settings.testing.autoApply': '自动应用设置',
    'status.initialized': '初始化完成',
    'status.saved': '设置已保存',
    'status.reset': '已恢复默认设置',
    'status.applied': '设置已应用',
    'test.running': '正在运行测试...',
    'test.passed': '测试通过',
    'test.failed': '测试失败',
    'test.total': '总计',
    'test.success': '成功',
    'test.fail': '失败',
    'theme.light': '浅色',
    'theme.dark': '深色',
    'lang.zh': '中文',
    'lang.en': 'English',
  },
  'en-US': {
    'app.name': 'Douyin UI Customizer',
    'app.version': 'Version',
    'app.author': 'Author',
    'settings.title': 'Douyin UI Customizer Settings',
    'settings.subtitle': 'Personalize your Douyin browsing experience',
    'settings.close': 'Close',
    'settings.save': 'Save Settings',
    'settings.reset': 'Restore Defaults',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.miniPlayer': 'Mini Player',
    'settings.hideTopBar': 'Hide Top Bar',
    'settings.hideSidebar': 'Hide Sidebar',
    'settings.hideComments': 'Hide Comments',
    'settings.autoPlay': 'Auto Play',
    'settings.autoMute': 'Auto Mute',
    'settings.hideLiveTopBar': 'Hide Live Top Bar',
    'settings.hideLiveGift': 'Hide Live Gift Area',
    'settings.hideLiveChat': 'Hide Live Chat',
    'settings.darkMode': 'Dark Mode',
    'settings.customStyles': 'Custom CSS',
    'settings.customScripts': 'Custom Scripts',
    'settings.apply': 'Apply',
    'settings.testing.title': 'Functionality Test',
    'settings.testing.autoTest': 'Run Automated Tests',
    'settings.testing.autoApply': 'Auto Apply Settings',
    'status.initialized': 'Initialization complete',
    'status.saved': 'Settings saved',
    'status.reset': 'Default settings restored',
    'status.applied': 'Settings applied',
    'test.running': 'Running tests...',
    'test.passed': 'Tests passed',
    'test.failed': 'Tests failed',
    'test.total': 'Total',
    'test.success': 'Success',
    'test.fail': 'Fail',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'lang.zh': '中文',
    'lang.en': 'English',
  },
};

let currentLocale: SupportedLocale = 'zh-CN';

// 确保 i18n 与 config 中的 language 设置保持一致
function syncLocaleFromConfig(): void {
  const config: AppConfig = getConfig();
  const lang = (config.language || 'zh') as string;
  currentLocale = lang.startsWith('en') ? 'en-US' : 'zh-CN';
}

export function getLocale(): SupportedLocale {
  return currentLocale;
}

export function setLocale(locale: SupportedLocale): void {
  currentLocale = locale;
}

export function initI18n(): void {
  syncLocaleFromConfig();
}

// 文本占位符替换：t('hello {name}', { name: 'world' })
export function t(key: string, params?: Record<string, string | number>): string {
  const dict = resources[currentLocale] || resources['zh-CN'];
  let text = dict[key] ?? resources['zh-CN'][key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return text;
}

export function getSupportedLocales(): SupportedLocale[] {
  return ['zh-CN', 'en-US'];
}
