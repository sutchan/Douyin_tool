// src/configDefaults.ts v2.1.0
// 配置相关的常量与默认配置对象（从 config.ts 拆分以保持主文件精简）。

import { version as APP_VERSION } from './version';
import type { AppConfig } from './types';

// 配置权威类型：与 types/index.ts 的 AppConfig 保持一致（含索引签名以支持动态键）
export interface Config extends AppConfig {
  [key: string]: unknown;
}

export const CONFIG_KEY = 'main';
export const CONFIG_VERSION = APP_VERSION;

export const DEFAULT_CONFIG: Config = {
  version: CONFIG_VERSION,
  theme: 'light',
  language: 'zh-CN',

  // 短视频页面定制选项
  hideTopBar: false,
  hideSidebar: false,
  miniPlayer: true,
  miniPlayerEnabled: true,
  hideComments: false,
  autoPlay: true,
  autoMute: false,

  // 直播间页面定制选项
  hideLiveTopBar: false,
  hideLiveGift: false,
  hideLiveChat: false,
  liveGiftEnabled: true,
  liveChatEnabled: true,
  liveTopBarEnabled: true,

  // 通用
  darkMode: false,
  autoApply: true,

  // 自定义样式与脚本
  customStyles: '',
  customStylesEnabled: false,
  customScripts: '',
  customScriptsEnabled: false,

  videoUI: {
    showLikeButton: true,
    showCommentButton: true,
    showShareButton: true,
    showAuthorInfo: true,
    showMusicInfo: true,
    showDescription: true,
    showRecommendations: true,
    layout: 'default',
    controlBar: {
      show: true,
      autoHide: true,
      position: 'bottom',
      size: 'medium',
      opacity: 0.9
    },
    playback: {
      defaultQuality: 'auto',
      autoPlay: true,
      loop: false
    }
  },

  liveUI: {
    showGifts: true,
    showDanmaku: true,
    showRecommendations: true,
    showAds: false,
    showStats: true,
    danmaku: {
      fontSize: 16,
      color: '#FFFFFF',
      opacity: 0.8,
      speed: 'medium',
      position: 'top',
      maxLines: 5
    },
    layout: 'default',
    volume: 100
  },

  general: {
    autoPlay: true,
    autoScroll: false,
    keyboardShortcuts: true,
    notifications: false,
    language: 'zh-CN',
    animations: true,
    updateCheck: true
  },

  advanced: {
    debugMode: false,
    performanceMode: false,
    customCSS: '',
    customScripts: []
  }
};
