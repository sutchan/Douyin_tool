// src/ui_manager.ts v2.1.0
// UI 管理器：单例。负责初始化、构建设置面板、应用视频/直播定制、自定义样式与脚本。
// 面板渲染拆分至 ./ui_manager/panelRenderer，主题/表单逻辑拆分至 themeApplier/settingsSaver。
// 具体页面元素查找与显隐逻辑委托给 ./ui/customizations/*。

import type { Config } from './config';
import { getConfig, setConfig } from './config';
import logger from './utils/logger';
import eventEmitter from './utils/eventEmitter';
import { findElementsByClassPattern, findElementsByStructure } from './utils/dom';
import { applyVideoCustomizations as applyVideo } from './ui/customizations/videoCustomizations';
import { applyLiveCustomizations as applyLive } from './ui/customizations/liveCustomizations';
import { renderSettingsPanel } from './ui_manager/panelRenderer';
import { applyTheme, customizeControlBar, customizeDanmaku } from './ui_manager/themeApplier';
import { makePanelDraggable } from './ui/core/panelDrag';
import { injectCustomizerStyles } from './ui_manager/injectStyles';
import { applyCustomStyles, applyCustomScripts } from './ui_manager/customAsset';
import AutoTestController from './controllers/autoTestController';
import { t } from './i18n';

class UIManagerImpl {
  private _config: Config;
  private settingsPanel: HTMLElement | null = null;
  private toggleButton: HTMLElement | null = null;
  private isInitialized = false;

  constructor(config?: Config) {
    this._config = config ?? getConfig();
  }

  public static getInstance(): UIManagerImpl {
    const g = window as unknown as { __douyinUIManager?: UIManagerImpl };
    if (!g.__douyinUIManager) {
      g.__douyinUIManager = new UIManagerImpl();
    }
    return g.__douyinUIManager;
  }

  // 供 customizations 模块访问配置
  public get config(): Config {
    return this._config;
  }

  public getConfig(): Config {
    return this._config;
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

  private injectStyles(): void {
    injectCustomizerStyles();
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
        renderSettingsPanel(panel, this as unknown as UIManager);
        makePanelDraggable(panel);
      }
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      eventEmitter.emit('ui.panel.toggled', panel.style.display !== 'none');
    } catch (error) {
      logger.error('显示设置面板失败:', error);
    }
  }

  // ---- 视频 / 直播定制：委托给 customizations 模块 ----

  public toggleElement(finder: () => HTMLElement[], show: boolean | undefined): void {
    if (show === undefined) return;
    const elements = finder();
    elements.forEach(el => {
      el.style.display = show ? '' : 'none';
    });
  }

  public findElementsByClassPattern(pattern: RegExp | string): HTMLElement[] {
    return findElementsByClassPattern(pattern instanceof RegExp ? pattern.source : String(pattern));
  }

  // 增强版结构查找（支持 attributes / children / text），委托给 dom 模块
  public findElementsByStructure(struct: {
    tagName?: string;
    attributes?: Record<string, string | RegExp>;
    children?: Array<{ tagName?: string; attributes?: Record<string, string | RegExp> }>;
    text?: string | RegExp;
  }): HTMLElement[] {
    return findElementsByStructure(struct);
  }

  public customizeControlBar(config: Config['videoUI']['controlBar']): void {
    customizeControlBar(this as unknown as UIManager, config);
  }

  public customizeDanmaku(config: Config['liveUI']['danmaku']): void {
    customizeDanmaku(config);
  }

  public applyLayout(_type: string, _layout: string): void {
    // 布局切换占位：具体实现可在此注入对应 CSS class
    logger.info(`应用布局: ${_type} / ${_layout}`);
  }

  public applyVideoCustomizations(): void {
    try {
      applyVideo(this as unknown as UIManager);
      if (this.config.darkMode) applyTheme(this as unknown as UIManager, 'dark');
      eventEmitter.emit('ui.video.applied', this.config.videoUI);
    } catch (error) {
      logger.error('应用视频定制失败:', error);
    }
  }

  public applyLiveCustomizations(): void {
    try {
      applyLive(this as unknown as UIManager);
      eventEmitter.emit('ui.live.applied', this.config.liveUI);
    } catch (error) {
      logger.error('应用直播定制失败:', error);
    }
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
  }

  // 自定义 CSS / 脚本：委托 customAsset 模块（安全注入）
  public applyCustomStyles(css: string): void {
    applyCustomStyles(css, this.config);
  }

  public applyCustomScripts(scripts: string): void {
    applyCustomScripts(scripts, this.config);
  }

  public persistConfig(): void {
    setConfig(this.config);
  }

  // 运行一次自动化测试（自检 UI 自定义项是否正常应用）
  public async runAutoTest(): Promise<{ success: boolean; steps: string[] }> {
    const controller = new AutoTestController();
    return controller.runAutoTest();
  }
}

const UIManager = UIManagerImpl;
export default UIManager;
export { UIManagerImpl };
// 供子模块用作类型（与值同名 UIManager，分处类型/值空间）
export type UIManager = UIManagerImpl;
