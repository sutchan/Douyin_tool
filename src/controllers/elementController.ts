// src/controllers/elementController.ts v2.1.0
// 元素控制器：隐藏/显示/切换/修改/重置页面元素样式，并维护原始样式缓存。
// 纯函数与类型拆分至 ./elementHelpers，主文件保留状态编排与类外壳。

import logger from '../utils/logger';
import { resolveElements, collectInteractiveElements, type ElementInfo, type OriginalStyle } from './elementHelpers';

export type { ElementInfo, OriginalStyle } from './elementHelpers';

class ElementController {
  private originalStyles: WeakMap<HTMLElement, OriginalStyle>;
  private elementVisibility: WeakMap<HTMLElement, boolean>;

  constructor() {
    this.originalStyles = new WeakMap();
    this.elementVisibility = new WeakMap();
    logger.info('ElementController 初始化成功');
  }

  async hideElement(selector: string | HTMLElement): Promise<boolean> {
    try {
      const elements = resolveElements(selector);

      if (elements.length === 0) {
        logger.warn(`没有找到匹配的元素: ${selector}`);
        return false;
      }

      for (const element of elements) {
        this._saveOriginalStyle(element);

        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
        element.style.pointerEvents = 'none';

        this.elementVisibility.set(element, false);
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      for (const element of elements) {
        element.style.display = 'none';
      }

      logger.info(`成功隐藏 ${elements.length} 个元素`);
      return true;
    } catch (error) {
      logger.error(`隐藏元素失败:`, error);
      return false;
    }
  }

  async showElement(selector: string | HTMLElement): Promise<boolean> {
    try {
      const elements = resolveElements(selector);

      if (elements.length === 0) {
        logger.warn(`没有找到匹配的元素: ${selector}`);
        return false;
      }

      for (const element of elements) {
        element.style.display = '';

        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      for (const element of elements) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.style.pointerEvents = '';

        this.elementVisibility.set(element, true);
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      for (const element of elements) {
        element.style.transition = '';
      }

      logger.info(`成功显示 ${elements.length} 个元素`);
      return true;
    } catch (error) {
      logger.error(`显示元素失败:`, error);
      return false;
    }
  }

  async toggleElement(selector: string | HTMLElement): Promise<boolean> {
    try {
      const elements = resolveElements(selector);

      if (elements.length === 0) {
        logger.warn(`没有找到匹配的元素: ${selector}`);
        return false;
      }

      const firstElement = elements[0];
      const currentVisibility = this.elementVisibility.get(firstElement) !== false &&
        firstElement.style.display !== 'none';
      const targetVisibility = !currentVisibility;

      if (targetVisibility) {
        await this.showElement(selector);
      } else {
        await this.hideElement(selector);
      }

      return targetVisibility;
    } catch (error) {
      logger.error(`切换元素状态失败:`, error);
      return false;
    }
  }

  modifyElementStyle(selector: string | HTMLElement, styles: Record<string, string>): boolean {
    try {
      const elements = resolveElements(selector);

      if (elements.length === 0) {
        logger.warn(`没有找到匹配的元素: ${selector}`);
        return false;
      }

      for (const element of elements) {
        if (!this.originalStyles.has(element)) {
          this._saveOriginalStyle(element);
        }

        Object.assign(element.style, styles);
      }

      logger.info(`成功修改 ${elements.length} 个元素的样式`);
      return true;
    } catch (error) {
      logger.error(`修改元素样式失败:`, error);
      return false;
    }
  }

  resetElementStyle(selector: string | HTMLElement): boolean {
    try {
      const elements = resolveElements(selector);

      if (elements.length === 0) {
        logger.warn(`没有找到匹配的元素: ${selector}`);
        return false;
      }

      for (const element of elements) {
        if (this.originalStyles.has(element)) {
          const originalStyle = this.originalStyles.get(element);

          element.removeAttribute('style');

          if (originalStyle) {
            Object.assign(element.style, originalStyle);
          }

          this.originalStyles.delete(element);
          this.elementVisibility.delete(element);
        } else {
          element.removeAttribute('style');
        }
      }

      logger.info(`成功重置 ${elements.length} 个元素的样式`);
      return true;
    } catch (error) {
      logger.error(`重置元素样式失败:`, error);
      return false;
    }
  }

  identifyElements(): ElementInfo[] {
    try {
      const elements = collectInteractiveElements();
      logger.info(`成功识别 ${elements.length} 个可操作元素`);
      return elements;
    } catch (error) {
      logger.error(`识别元素失败:`, error);
      return [];
    }
  }

  private _saveOriginalStyle(element: HTMLElement): void {
    if (!this.originalStyles.has(element)) {
      const originalStyle: OriginalStyle = {};

      const importantProperties = ['display', 'opacity', 'transform', 'pointer-events'];
      importantProperties.forEach(prop => {
        originalStyle[prop] = (element.style as unknown as Record<string, string>)[prop];
      });

      this.originalStyles.set(element, originalStyle);
    }
  }
}

const elementController = new ElementController();

export { ElementController };
export default elementController;
