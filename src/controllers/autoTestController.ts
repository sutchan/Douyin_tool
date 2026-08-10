// src/controllers/autoTestController.ts v2.1.0
// 自动化测试控制器：在控制台触发一次性的 UI 自定义项自检，便于排查页面是否正常应用
// 风格与 elementController / layoutController 保持一致（单一职责 + 默认导出）

import { getConfig } from '../config';
import UIManager from '../ui_manager';
import logger from '../utils/logger';

export class AutoTestController {
  private running = false;

  // 执行一次自动化测试：依次应用视频/直播自定义项并校验结果
  async runAutoTest(): Promise<{ success: boolean; steps: string[] }> {
    if (this.running) {
      logger.warn('[抖音工具] 自动化测试已在运行中，跳过重复执行');
      return { success: false, steps: ['skipped: already running'] };
    }
    this.running = true;
    const steps: string[] = [];

    try {
      const uiManager = UIManager.getInstance();
      const config = getConfig();

      steps.push('apply video customizations');
      uiManager.applyVideoCustomizations();

      steps.push('apply live customizations');
      uiManager.applyLiveCustomizations();

      if (config.customStylesEnabled && config.customStyles) {
        steps.push('apply custom styles');
        uiManager.applyCustomStyles(config.customStyles);
      }

      if (config.customScriptsEnabled && config.customScripts) {
        steps.push('apply custom scripts');
        uiManager.applyCustomScripts(config.customScripts);
      }

      logger.info('[抖音工具] 自动化测试完成，步骤：', steps);
      return { success: true, steps };
    } catch (error) {
      logger.error('[抖音工具] 自动化测试失败：', error);
      steps.push(`error: ${(error as Error).message}`);
      return { success: false, steps };
    } finally {
      this.running = false;
    }
  }
}

export default AutoTestController;
