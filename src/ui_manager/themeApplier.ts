// src/ui_manager/themeApplier.ts v2.1.0
// 主题与局部样式（控制栏、弹幕）应用逻辑，从 ui_manager 拆分为独立模块

import logger from '../utils/logger';
import eventEmitter from '../utils/eventEmitter';
import themeManager from '../styles/theme';
import type { UIManager } from '../ui_manager';

interface ControlBarConfig {
  show?: boolean;
  position?: string;
  autoHide?: boolean;
}

interface DanmakuConfig {
  fontSize?: number;
  color?: string;
  opacity?: number;
  speed?: string;
}

export function customizeControlBar(uiManager: UIManager, config: ControlBarConfig): void {
  const controlBar = document.querySelector('.video-control-bar') as HTMLElement | null;
  if (!controlBar) return;

  if (!config.show) {
    controlBar.style.display = 'none';
    return;
  }

  if (config.position) {
    controlBar.style.position = 'absolute';
    switch (config.position) {
      case 'top':
        controlBar.style.top = '0';
        controlBar.style.bottom = 'auto';
        break;
      case 'bottom':
        controlBar.style.bottom = '0';
        controlBar.style.top = 'auto';
        break;
      default:
        controlBar.style.bottom = '0';
    }
  }
}

export function customizeDanmaku(config: DanmakuConfig): void {
  const styleId = 'douyin-danmaku-custom-styles';
  let styleElement = document.getElementById(styleId);
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  let css = '';
  if (config.fontSize) {
    css += `.danmaku { font-size: ${config.fontSize}px !important; }`;
  }
  if (config.color) {
    css += `.danmaku { color: ${config.color} !important; }`;
  }
  if (config.opacity) {
    css += `.danmaku { opacity: ${config.opacity} !important; }`;
  }
  if (config.speed) {
    let duration = 6;
    switch (config.speed) {
      case 'fast': duration = 3; break;
      case 'slow': duration = 10; break;
      default: duration = 6;
    }
    css += `.danmaku { animation-duration: ${duration}s !important; }`;
  }

  styleElement.textContent = css;
}

export function applyTheme(uiManager: UIManager, theme: string): void {
  try {
    themeManager.applyTheme(theme);
    const panel = uiManager.getSettingsPanel();
    if (panel) {
      const themeConfig = themeManager.getTheme(theme);
      if (themeConfig && themeConfig.variables) {
        const vars = themeConfig.variables as Record<string, string>;
        panel.style.backgroundColor = vars['--bg-primary'] || '#fff';
        panel.style.color = vars['--text-primary'] || '#000';
        panel.style.borderColor = vars['--border-color'] || '#e0e0e0';

        const buttons = panel.querySelectorAll('button');
        buttons.forEach(btn => {
          btn.style.backgroundColor = vars['--bg-secondary'] || '#f5f5f5';
          btn.style.color = vars['--text-primary'] || '#333';
        });
      }
    }
    logger.info(`Theme ${theme} applied successfully`);
    eventEmitter.emit('ui.theme.applied', theme);
  } catch (error) {
    logger.error('Failed to apply theme:', error);
    eventEmitter.emit('ui.theme.error', error);
  }
}
