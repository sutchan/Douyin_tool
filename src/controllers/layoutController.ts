// src/controllers/layoutController.ts v2.1.0
// 布局控制器：预定义/自定义/保存布局的应用、切换、导入导出与重置。
// 类型与预定义布局拆分至 ./layoutDefaults，纯函数逻辑拆分至 ./layoutHelpers。

import { NamespacedStorage } from '../utils/storage';
import logger from '../utils/logger';
import elementController from './elementController';
import {
  PREDEFINED_LAYOUTS,
  type Layout,
  type LayoutRule
} from './layoutDefaults';
import { collectAllSelectors, applyLayoutRules, validateLayoutInput } from './layoutHelpers';

export type { Layout, LayoutRule } from './layoutDefaults';

class LayoutController {
  private currentLayout: string | null;
  private storage: NamespacedStorage;
  private customLayouts: Record<string, Layout>;

  constructor() {
    this.currentLayout = null;
    this.storage = new NamespacedStorage('douyin_tool_layout');
    this.customLayouts = this._loadCustomLayouts();
    logger.info('LayoutController 初始化成功');
  }

  private _loadCustomLayouts(): Record<string, Layout> {
    try {
      return this.storage.getJSON<Record<string, Layout>>('custom', {});
    } catch {
      return {};
    }
  }

  private _saveCustomLayouts(): void {
    try {
      this.storage.setJSON('custom', this.customLayouts);
    } catch (error) {
      logger.error('保存自定义布局失败:', error);
    }
  }

  async applyLayout(layoutName: string): Promise<boolean> {
    try {
      const layout = PREDEFINED_LAYOUTS[layoutName] || this.customLayouts[layoutName];

      if (!layout) {
        logger.warn(`布局不存在: ${layoutName}`);
        return false;
      }

      await applyLayoutRules(layout, elementController);

      this.currentLayout = layoutName;
      this.storage.setItem('current', layoutName);

      logger.info(`应用布局: ${layout.label} (${layoutName})`);
      return true;
    } catch (error) {
      logger.error(`应用布局失败 (${layoutName}):`, error);
      return false;
    }
  }

  async resetLayout(): Promise<boolean> {
    try {
      const allSelectors = collectAllSelectors(PREDEFINED_LAYOUTS);
      for (const selector of allSelectors) {
        await elementController.resetElementStyle(selector);
      }

      const customSelectors = collectAllSelectors(this.customLayouts);
      for (const selector of customSelectors) {
        await elementController.resetElementStyle(selector);
      }

      this.currentLayout = null;
      this.storage.removeItem('current');

      logger.info('布局已重置');
      return true;
    } catch (error) {
      logger.error('重置布局失败:', error);
      return false;
    }
  }

  getCurrentLayout(): string | null {
    return this.currentLayout;
  }

  getAvailableLayouts(): Layout[] {
    return [
      ...Object.values(PREDEFINED_LAYOUTS),
      ...Object.values(this.customLayouts)
    ];
  }

  async switchLayout(layoutName: string): Promise<boolean> {
    try {
      if (this.currentLayout) {
        await this.resetLayout();
      }
      return await this.applyLayout(layoutName);
    } catch (error) {
      logger.error(`切换布局失败 (${layoutName}):`, error);
      return false;
    }
  }

  saveLayout(layoutName: string, layoutConfig: Partial<Layout>): boolean {
    const validationError = validateLayoutInput(layoutName, layoutConfig);
    if (validationError) {
      logger.error(`保存布局失败: ${validationError}`);
      return false;
    }

    try {
      this.customLayouts[layoutName] = {
        name: layoutName,
        label: layoutConfig.label || layoutName,
        description: layoutConfig.description || '',
        rules: layoutConfig.rules || [],
        isCustom: true,
        createdAt: new Date().toISOString()
      };

      this._saveCustomLayouts();
      logger.info(`布局保存成功: ${layoutName}`);
      return true;
    } catch (error) {
      logger.error(`保存布局失败 (${layoutName}):`, error);
      return false;
    }
  }

  deleteLayout(layoutName: string): boolean {
    try {
      if (PREDEFINED_LAYOUTS[layoutName]) {
        logger.warn(`不能删除预定义布局: ${layoutName}`);
        return false;
      }

      if (!this.customLayouts[layoutName]) {
        logger.warn(`布局不存在: ${layoutName}`);
        return false;
      }

      if (this.currentLayout === layoutName) {
        this.resetLayout();
      }

      delete this.customLayouts[layoutName];
      this._saveCustomLayouts();

      logger.info(`布局删除成功: ${layoutName}`);
      return true;
    } catch (error) {
      logger.error(`删除布局失败 (${layoutName}):`, error);
      return false;
    }
  }

  importLayout(jsonString: string): boolean {
    try {
      const layout = JSON.parse(jsonString) as Layout;

      if (!layout.name || !layout.rules) {
        throw new Error('布局数据格式无效');
      }

      layout.importedAt = new Date().toISOString();
      this.customLayouts[layout.name] = layout;
      this._saveCustomLayouts();

      logger.info(`布局导入成功: ${layout.label || layout.name}`);
      return true;
    } catch (error) {
      logger.error('导入布局失败:', error);
      return false;
    }
  }

  exportLayout(layoutName: string): string | null {
    try {
      const layout = PREDEFINED_LAYOUTS[layoutName] || this.customLayouts[layoutName];
      if (!layout) return null;

      return JSON.stringify(layout, null, 2);
    } catch (error) {
      logger.error(`导出布局失败 (${layoutName}):`, error);
      return null;
    }
  }
}

const layoutController = new LayoutController();

export { LayoutController };
export default layoutController;
