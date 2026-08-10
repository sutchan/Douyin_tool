// src/ui_manager.ts v2.1.0
// UI 管理器：单例。负责初始化、构建设置面板、应用视频/直播定制、自定义样式与脚本。
// 面板渲染拆分至 ./ui_manager/panelRenderer，主题/表单逻辑拆分至 themeApplier/settingsSaver。
// 具体页面元素查找与显隐逻辑委托给 ./ui/customizations/*。

import type { Config } from './config';
import { getConfig, setConfig } from './config';
import logger from './utils/logger';
import eventEmitter from './utils/eventEmitter';
import { findElementsByClassPattern } from './utils/dom';
import { applyVideoCustomizations as applyVideo } from './ui/customizations/videoCustomizations';
import { applyLiveCustomizations as applyLive } from './ui/customizations/liveCustomizations';
import { renderSettingsPanel } from './ui_manager/panelRenderer';
import { applyTheme, customizeControlBar, customizeDanmaku } from './ui_manager/themeApplier';
import { makePanelDraggable } from './ui/core/panelDrag';
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

  // 增强版结构查找（支持 attributes / children / text），供 customizations 模块使用
  public findElementsByStructure(struct: {
    tagName?: string;
    attributes?: Record<string, string | RegExp>;
    children?: Array<{ tagName?: string; attributes?: Record<string, string | RegExp> }>;
    text?: string | RegExp;
  }): HTMLElement[] {
    const results: HTMLElement[] = [];
    const baseTag = struct.tagName || '*';
    const candidates = Array.from(document.querySelectorAll(baseTag)) as HTMLElement[];
    for (const el of candidates) {
      if (struct.attributes) {
        let ok = true;
        for (const [attr, val] of Object.entries(struct.attributes)) {
          const attrVal = el.getAttribute(attr) || '';
          if (val instanceof RegExp) {
            if (!val.test(attrVal)) { ok = false; break; }
          } else if (!attrVal.includes(val)) { ok = false; break; }
        }
        if (!ok) continue;
      }
      if (struct.text) {
        const content = el.textContent || '';
        if (struct.text instanceof RegExp) {
          if (!struct.text.test(content)) continue;
        } else if (!content.includes(struct.text)) continue;
      }
      results.push(el);
    }
    return results;
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

  // 自定义 CSS：textContent 注入，避免 innerHTML 注入风险
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

  // 自定义脚本：仅允许远程 <script src> 或受控内联，禁止 eval/innerHTML 等危险操作
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
        const el = document.createElement('script');
        el.id = 'douyin-custom-script';
        el.dataset.douyinCustom = 'true';
        if (script.startsWith('http://') || script.startsWith('https://')) {
          el.src = script;
        } else {
          el.textContent = script;
          el.dataset.inline = 'true';
        }
        document.head.appendChild(el);
        logger.info('已应用自定义脚本');
        eventEmitter.emit('ui.customScripts.applied', script);
      } catch (error) {
        logger.error('应用自定义脚本失败:', error);
      }
    }
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
