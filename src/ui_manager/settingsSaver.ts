// src/ui_manager/settingsSaver.ts v2.1.0
// 从控制面板收集表单数据并写入配置，以及基础配置校验。
// 提取自 ui_manager，保持单一职责，便于维护与测试。

import logger from '../utils/logger';
import type { Config } from '../config';
import type { UIManager } from '../ui_manager';

// 危险代码特征，用于自定义脚本安全提示
const DANGEROUS_PATTERNS = ['eval(', 'Function(', 'innerHTML', 'document.write', 'execScript'];
const TRUSTED_SCRIPT_DOMAINS = [
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
  'jsdelivr.net',
  'cdnjs.com',
];

function readCheckbox(panel: HTMLElement, id: string): boolean | null {
  const el = panel.querySelector(`#${id}`) as HTMLInputElement | null;
  return el ? el.checked : null;
}

function readValue(panel: HTMLElement, id: string): string | null {
  const el = panel.querySelector(`#${id}`) as HTMLInputElement | null;
  return el ? el.value : null;
}

// 从面板表单读取所有配置项并写入 config 对象
export function collectSettingsFromPanel(panel: HTMLElement, config: Config): void {
  const themeRadio = panel.querySelector('input[type="radio"][name="theme"]:checked') as HTMLInputElement | null;
  if (themeRadio) {
    config.theme = themeRadio.value as Config['theme'];
  }

  if (!config.general) config.general = {} as Config['general'];
  ['autoPlay', 'autoScroll', 'keyboardShortcuts', 'notifications'].forEach(setting => {
    const value = readCheckbox(panel, setting);
    if (value !== null) {
      (config.general as unknown as Record<string, boolean>)[setting] = value;
    }
  });

  if (!config.videoUI) config.videoUI = {} as Config['videoUI'];
  ['showLikeButton', 'showCommentButton', 'showShareButton', 'showAuthorInfo', 'showMusicInfo', 'showDescription', 'showRecommendations'].forEach(setting => {
    const value = readCheckbox(panel, setting);
    if (value !== null) {
      (config.videoUI as unknown as Record<string, boolean>)[setting] = value;
    }
  });

  if (!config.videoUI!.controlBar) config.videoUI!.controlBar = {} as Config['videoUI']['controlBar'];
  ['controlBar-show', 'controlBar-autoHide', 'controlBar-position', 'controlBar-size', 'controlBar-opacity'].forEach(setting => {
    const el = panel.querySelector(`#${setting}`) as HTMLInputElement | null;
    if (el) {
      const key = setting.replace('controlBar-', '');
      let value: string | boolean | number = el.value;
      if (el.type === 'checkbox') value = el.checked;
      else if (key === 'opacity') value = parseFloat(value as string);
      (config.videoUI!.controlBar as unknown as Record<string, unknown>)[key] = value;
    }
  });

  if (!config.videoUI!.playback) config.videoUI!.playback = {} as Config['videoUI']['playback'];
  ['playback-defaultQuality', 'playback-autoPlay', 'playback-loop'].forEach(setting => {
    const el = panel.querySelector(`#${setting}`) as HTMLInputElement | null;
    if (el) {
      const key = setting.replace('playback-', '');
      let value: string | boolean = el.value;
      if (el.type === 'checkbox') value = el.checked;
      (config.videoUI!.playback as unknown as Record<string, unknown>)[key] = value;
    }
  });

  if (!config.liveUI) config.liveUI = {} as Config['liveUI'];
  ['liveShowGifts', 'liveShowDanmaku', 'liveShowRecommendations', 'liveShowAds', 'liveShowStats'].forEach(setting => {
    const value = readCheckbox(panel, setting);
    if (value !== null) {
      const key = setting.replace('liveShow', 'show');
      (config.liveUI as unknown as Record<string, boolean>)[key] = value;
    }
  });

  if (!config.liveUI!.danmaku) config.liveUI!.danmaku = {} as Config['liveUI']['danmaku'];
  ['danmaku-fontSize', 'danmaku-color', 'danmaku-opacity', 'danmaku-speed', 'danmaku-position', 'danmaku-maxLines'].forEach(setting => {
    const el = panel.querySelector(`#${setting}`) as HTMLInputElement | null;
    if (el) {
      const key = setting.replace('danmaku-', '');
      let value: string | number = el.value;
      if (key === 'fontSize' || key === 'maxLines') value = parseInt(value as string, 10);
      else if (key === 'opacity') value = parseFloat(value as string);
      (config.liveUI!.danmaku as unknown as Record<string, unknown>)[key] = value;
    }
  });

  const liveLayout = panel.querySelector('#live-layout') as HTMLSelectElement | null;
  if (liveLayout) config.liveUI!.layout = liveLayout.value as Config['liveUI']['layout'];

  const liveVolume = panel.querySelector('#live-volume') as HTMLInputElement | null;
  if (liveVolume) config.liveUI!.volume = parseInt(liveVolume.value, 10);

  if (!config.advanced) config.advanced = {} as Config['advanced'];
  const debugMode = readCheckbox(panel, 'advanced-debugMode');
  const performanceMode = readCheckbox(panel, 'advanced-performanceMode');
  const customCSS = panel.querySelector('#advanced-customCSS') as HTMLTextAreaElement | null;
  if (debugMode !== null) config.advanced!.debugMode = debugMode;
  if (performanceMode !== null) config.advanced!.performanceMode = performanceMode;
  if (customCSS) config.advanced!.customCSS = customCSS.value;

  const scriptInputs = panel.querySelectorAll('#custom-scripts-list .script-item input');
  const scripts: string[] = [];
  let hasScripts = false;
  scriptInputs.forEach(input => {
    const value = (input as HTMLInputElement).value.trim();
    if (value) {
      scripts.push(value);
      hasScripts = true;
    }
  });

  if (hasScripts) {
    if (typeof confirm === 'function' && !confirm('警告：自定义脚本可能会带来安全风险，是否继续保存？')) {
      return;
    }
    for (const script of scripts) {
      if (DANGEROUS_PATTERNS.some(p => script.includes(p))) {
        if (typeof confirm === 'function' && !confirm('警告：检测到可能的危险代码，是否确认添加此脚本？')) {
          return;
        }
      }
      if (script.startsWith('http://') || script.startsWith('https://')) {
        try {
          const domain = new URL(script).hostname;
          const trusted = TRUSTED_SCRIPT_DOMAINS.some(d => domain === d || domain.endsWith('.' + d));
          if (!trusted && typeof confirm === 'function' &&
            !confirm(`警告：脚本URL来自非白名单域名 (${domain})，是否确认添加此脚本？`)) {
            return;
          }
        } catch {
          if (typeof confirm === 'function' && !confirm('警告：脚本URL解析失败，是否确认添加此脚本？')) {
            return;
          }
        }
      }
    }
  }
  config.advanced!.customScripts = scripts;
}

export function basicValidateConfig(config: Config): { valid: boolean; issues: string[] } {
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
    if (config.liveUI?.volume !== undefined && (config.liveUI.volume < 0 || config.liveUI.volume > 100)) {
      issues.push('音量应在 0-100 之间');
    }
    if (config.videoUI?.controlBar?.opacity && (config.videoUI.controlBar.opacity < 0.1 || config.videoUI.controlBar.opacity > 1)) {
      issues.push('控制栏透明度应在 0.1-1 之间');
    }
  } catch (error) {
    logger.error('基本验证配置失败:', error);
    issues.push('配置验证过程中发生错误');
  }
  return { valid: issues.length === 0, issues };
}

// 从面板保存设置：收集表单 -> 校验 -> 落库 -> 应用
export async function saveSettings(uiManager: UIManager, panel: HTMLElement): Promise<void> {
  try {
    collectSettingsFromPanel(panel, uiManager.getConfig());
    const result = basicValidateConfig(uiManager.getConfig());
    if (!result.valid) {
      if (typeof alert === 'function') alert('配置验证失败：\n' + result.issues.join('\n'));
      return;
    }
    uiManager.persistConfig();
    logger.info('Settings saved from panel');
    uiManager.applyAllCustomizations();
    if (typeof alert === 'function') alert('设置保存成功！');
  } catch (error) {
    logger.error('保存设置失败:', error);
    if (typeof alert === 'function') alert('保存设置失败，请重试');
  }
}
