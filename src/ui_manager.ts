// src/ui_manager.ts v2.1.0
// UI 管理器：单例。负责构建设置面板/悬浮按钮、应用视频与直播定制、自定义样式与脚本。
// 主题与表单保存逻辑拆分至 ./ui_manager/themeApplier 与 ./ui_manager/settingsSaver，保持单一职责。

import type { Config } from './config';
import { getConfig, saveConfig, setConfig } from './config';
import logger from './utils/logger';
import eventEmitter from './utils/eventEmitter';
import { applyTheme, customizeControlBar, customizeDanmaku } from './ui_manager/themeApplier';
import { saveSettings } from './ui_manager/settingsSaver';
import { t } from './i18n';

class CustomizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomizationError';
  }
}

// 声明 UIManager 类型供子模块使用（避免循环依赖时的类型导入）
export type { UIManager };

class UIManagerImpl {
  private config: Config;
  private settingsPanel: HTMLElement | null = null;
  private toggleButton: HTMLElement | null = null;
  private isInitialized = false;

  constructor(config?: Config) {
    this.config = config ?? getConfig();
  }
}

// 供子模块（themeApplier、settingsSaver）引用主类类型
export type UIManager = UIManagerImpl;

  // 单例访问：从全局配置读取，避免重复实例化
  public static getInstance(): UIManagerImpl {
    const g = window as unknown as { __douyinUIManager?: UIManagerImpl };
    if (!g.__douyinUIManager) {
      g.__douyinUIManager = new UIManagerImpl();
    }
    return g.__douyinUIManager;
  }

  public getConfig(): Config {
    return this.config;
  }

  public getSettingsPanel(): HTMLElement | null {
    return this.settingsPanel;
  }

  public init(): void {
    if (this.isInitialized) {
      logger.warn('UIManager 已初始化，跳过重复 init');
      return;
    }
    this.isInitialized = true;
    this.injectStyles();
    this.showToggleButton();
    logger.info('UIManager 初始化完成');
  }

  public initUI(): void {
    this.showToggleButton();
    this.showSettingsPanel();
  }

  private injectStyles(): void {
    if (document.getElementById('douyin-customizer-styles')) return;
    const style = document.createElement('style');
    style.id = 'douyin-customizer-styles';
    style.textContent = `
      .dy-settings-panel { position: fixed; top: 20px; right: 20px; width: 340px; max-height: 90vh;
        overflow-y: auto; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 9999; padding: 16px; font-family: -apple-system, sans-serif; }
      .dy-settings-panel h2 { margin: 0 0 12px; font-size: 18px; }
      .dy-settings-panel .dy-section { border-bottom: 1px solid #eee; padding: 10px 0; }
      .dy-settings-panel label { display: block; margin: 6px 0; font-size: 13px; }
      .dy-toggle-btn { position: fixed; top: 60px; right: 20px; z-index: 9998; background: #fe2c55;
        color: #fff; border: none; border-radius: 20px; padding: 8px 14px; cursor: pointer; font-size: 13px; }
    `;
    document.head.appendChild(style);
  }

  public showToggleButton(): void {
    if (this.toggleButton) return;
    const button = document.createElement('button');
    button.id = 'douyin-customizer-toggle';
    button.className = 'dy-toggle-btn';
    button.textContent = t('app.name');
    button.addEventListener('click', () => this.showSettingsPanel());
    document.body.appendChild(button);
    this.toggleButton = button;
  }

  public showSettingsPanel(): void {
    try {
      let panel = this.settingsPanel;
      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'douyin-settings-panel';
        panel.className = 'dy-settings-panel';
        panel.style.display = 'none';
        document.body.appendChild(panel);
        this.settingsPanel = panel;
        this.renderSettingsPanel(panel);
      }
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      eventEmitter.emit('ui.panel.toggled', panel.style.display !== 'none');
    } catch (error) {
      logger.error('显示设置面板失败:', error);
      throw new CustomizationError('无法显示设置面板');
    }
  }

  // 渲染面板内容（DOM 结构），文案通过 i18n 提供
  private renderSettingsPanel(panel: HTMLElement): void {
    panel.innerHTML = '';
    const title = document.createElement('h2');
    title.id = 'dy-panel-title';
    title.textContent = t('settings.title');
    panel.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.id = 'dy-panel-close';
    closeBtn.textContent = t('settings.close');
    closeBtn.style.cssText = 'position:absolute;top:8px;right:8px;border:none;background:none;cursor:pointer;font-size:18px;';
    closeBtn.addEventListener('click', () => {
      if (this.settingsPanel) this.settingsPanel.style.display = 'none';
    });
    panel.appendChild(closeBtn);

    panel.appendChild(this.buildSection('theme', t('settings.theme'), this.buildThemeSection()));
    panel.appendChild(this.buildSection('video', t('settings.miniPlayer'), this.buildVideoSection()));
    panel.appendChild(this.buildSection('live', t('settings.hideLiveTopBar'), this.buildLiveSection()));
    panel.appendChild(this.buildSection('custom', t('settings.customStyles'), this.buildCustomSection()));
    panel.appendChild(this.buildSection('testing', t('settings.testing.title'), this.buildTestingSection()));

    const saveBtn = document.createElement('button');
    saveBtn.id = 'dy-save-btn';
    saveBtn.textContent = t('settings.save');
    saveBtn.style.cssText = 'margin-top:12px;width:100%;background:#fe2c55;color:#fff;border:none;border-radius:4px;padding:10px;cursor:pointer;';
    saveBtn.addEventListener('click', async () => {
      if (this.settingsPanel) await saveSettings(this as unknown as UIManager, this.settingsPanel);
    });
    panel.appendChild(saveBtn);
  }

  private buildSection(id: string, heading: string, content: HTMLElement): HTMLElement {
    const section = document.createElement('div');
    section.id = `dy-section-${id}`;
    section.className = 'dy-section';
    const h = document.createElement('h3');
    h.id = `dy-section-${id}-title`;
    h.textContent = heading;
    section.appendChild(h);
    section.appendChild(content);
    return section;
  }

  private buildThemeSection(): HTMLElement {
    const wrap = document.createElement('div');
    wrap.id = 'dy-theme-wrap';
    ['light', 'dark'].forEach(value => {
      const label = document.createElement('label');
      label.id = `dy-theme-label-${value}`;
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'theme';
      input.value = value;
      input.checked = this.config.theme === value;
      label.appendChild(input);
      label.appendChild(document.createTextNode(value === 'light' ? t('theme.light') : t('theme.dark')));
      wrap.appendChild(label);
    });
    return wrap;
  }

  private buildVideoSection(): HTMLElement {
    const wrap = document.createElement('div');
    wrap.id = 'dy-video-wrap';
    const items: [string, string][] = [
      ['miniPlayer', t('settings.miniPlayer')],
      ['hideTopBar', t('settings.hideTopBar')],
      ['hideSidebar', t('settings.hideSidebar')],
      ['hideComments', t('settings.hideComments')],
      ['autoPlay', t('settings.autoPlay')],
      ['autoMute', t('settings.autoMute')],
    ];
    items.forEach(([key, label]) => {
      wrap.appendChild(this.buildCheckbox(key, label, Boolean(this.config[key as keyof Config])));
    });
    return wrap;
  }

  private buildLiveSection(): HTMLElement {
    const wrap = document.createElement('div');
    wrap.id = 'dy-live-wrap';
    const items: [string, string][] = [
      ['hideLiveTopBar', t('settings.hideLiveTopBar')],
      ['hideLiveGift', t('settings.hideLiveGift')],
      ['hideLiveChat', t('settings.hideLiveChat')],
    ];
    items.forEach(([key, label]) => {
      wrap.appendChild(this.buildCheckbox(key, label, Boolean(this.config[key as keyof Config])));
    });
    return wrap;
  }

  private buildCustomSection(): HTMLElement {
    const wrap = document.createElement('div');
    wrap.id = 'dy-custom-wrap';
    const stylesLabel = document.createElement('label');
    stylesLabel.id = 'dy-custom-styles-label';
    stylesLabel.textContent = t('settings.customStyles');
    const stylesArea = document.createElement('textarea');
    stylesArea.id = 'advanced-customCSS';
    stylesArea.value = this.config.customStyles || '';
    stylesArea.rows = 4;
    stylesArea.style.cssText = 'width:100%;font-family:monospace;';
    stylesLabel.appendChild(stylesArea);
    wrap.appendChild(stylesLabel);
    return wrap;
  }

  private buildTestingSection(): HTMLElement {
    const wrap = document.createElement('div');
    wrap.id = 'dy-testing-wrap';
    const autoApplyLabel = document.createElement('label');
    autoApplyLabel.id = 'dy-testing-autoapply-label';
    const autoApplyInput = document.createElement('input');
    autoApplyInput.type = 'checkbox';
    autoApplyInput.id = 'autoApply';
    autoApplyInput.checked = Boolean(this.config.autoApply);
    autoApplyLabel.appendChild(autoApplyInput);
    autoApplyLabel.appendChild(document.createTextNode(t('settings.testing.autoApply')));
    wrap.appendChild(autoApplyLabel);
    return wrap;
  }

  private buildCheckbox(id: string, labelText: string, checked: boolean): HTMLElement {
    const label = document.createElement('label');
    label.id = `dy-checkbox-${id}`;
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.checked = checked;
    label.appendChild(input);
    label.appendChild(document.createTextNode(labelText));
    return label;
  }

  public applyAllCustomizations(): void {
    this.applyVideoCustomizations();
    this.applyLiveCustomizations();
    if (this.config.customStylesEnabled && this.config.customStyles) {
      this.applyCustomStyles(this.config.customStyles);
    }
    if (this.config.customScriptsEnabled && this.config.customScripts) {
      this.applyCustomScripts(this.config.customScripts);
    }
    this.injectStyles();
    this.initUI();
    eventEmitter.emit('ui.allCustomizations.applied', this.config);
  }

  public applyVideoCustomizations(): void {
    try {
      const videoUI = this.config.videoUI || {};
      if (videoUI.showLikeButton !== undefined) {
        const likeBtn = document.querySelector('.like-button') as HTMLElement | null;
        if (likeBtn) likeBtn.style.display = videoUI.showLikeButton ? '' : 'none';
      }
      if (videoUI.controlBar) customizeControlBar(this as unknown as UIManager, videoUI.controlBar);
      if (this.config.darkMode) applyTheme(this as unknown as UIManager, 'dark');
      eventEmitter.emit('ui.video.applied', videoUI);
    } catch (error) {
      logger.error('应用视频定制失败:', error);
      throw new CustomizationError('视频定制应用失败');
    }
  }

  public applyLiveCustomizations(): void {
    try {
      const liveUI = this.config.liveUI || {};
      if (liveUI.danmaku) customizeDanmaku(liveUI.danmaku);
      eventEmitter.emit('ui.live.applied', liveUI);
    } catch (error) {
      logger.error('应用直播定制失败:', error);
      throw new CustomizationError('直播定制应用失败');
    }
  }

  // 自定义 CSS：使用 textContent 注入（不执行脚本），避免 innerHTML 导致的注入风险
  public applyCustomStyles(css: string): void {
    if (!css || typeof css !== 'string') {
      logger.warn('自定义样式为空或类型错误，跳过应用');
      return;
    }
    if (this.config.advanced?.performanceMode) {
      logger.info('性能模式下跳过自定义样式');
      return;
    }
    let styleElement = document.getElementById('douyin-custom-styles') as HTMLStyleElement | null;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'douyin-custom-styles';
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = css;
    eventEmitter.emit('ui.customStyles.applied', css);
  }

  // 自定义脚本：使用 <script> 元素加载远程脚本，禁止 eval/Function/innerHTML 注入，避免 XSS
  public applyCustomScripts(scripts: string): void {
    if (!scripts || typeof scripts !== 'string') {
      logger.warn('自定义脚本为空或类型错误，跳过应用');
      return;
    }
    if (this.config.advanced?.performanceMode) {
      logger.info('性能模式下跳过自定义脚本');
      return;
    }
    const lines = scripts.split('\n').map(s => s.trim()).filter(Boolean);
    for (const script of lines) {
      if (/eval\(|Function\(|innerHTML|document\.write|execScript/.test(script)) {
        logger.error('检测到危险脚本片段，已拒绝执行：', script);
        continue;
      }
      try {
        if (script.startsWith('http://') || script.startsWith('https://')) {
          const existing = document.querySelector(`script[data-douyin-custom][src="${script}"]`);
          if (existing) continue;
          const el = document.createElement('script');
          el.id = 'douyin-custom-script';
          el.dataset.douyinCustom = 'true';
          el.src = script;
          document.head.appendChild(el);
          logger.info('已加载远程自定义脚本：', script);
        } else {
          const existing = document.querySelector(`script[data-douyin-custom][data-inline]`);
          // 仅允许一次内联（避免重复堆叠），内联脚本以 textContent 注入
          const el = document.createElement('script');
          el.id = 'douyin-custom-script-inline';
          el.dataset.douyinCustom = 'true';
          el.dataset.inline = 'true';
          el.textContent = script;
          document.head.appendChild(el);
          logger.info('已注入内联自定义脚本');
        }
        eventEmitter.emit('ui.customScripts.applied', script);
      } catch (error) {
        logger.error('应用自定义脚本失败:', error);
      }
    }
  }

  public persistConfig(): void {
    setConfig(this.config);
  }
}

const UIManager = UIManagerImpl;
export default UIManager;
export { UIManagerImpl };
