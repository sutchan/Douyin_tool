// src/ui_manager/customAsset.ts v2.1.0
// 自定义 CSS / 脚本的安全注入逻辑（纯函数，接收配置与事件发射器）。

import logger from '../utils/logger';
import eventEmitter from '../utils/eventEmitter';
import type { Config } from '../config';

// 自定义 CSS：textContent 注入，避免 innerHTML 注入风险
export function applyCustomStyles(css: string, config: Config): void {
  if (!css || typeof css !== 'string') {
    logger.warn('自定义样式为空或类型错误，跳过应用');
    return;
  }
  if (config.advanced?.performanceMode) {
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

// 危险脚本片段黑名单（防止 eval / XSS / 任意写入）
const DANGEROUS_PATTERN = /eval\(|Function\(|innerHTML|document\.write|execScript/;

// 自定义脚本：仅允许受控内联或远程 <script src>，禁止危险片段
export function applyCustomScripts(scripts: string, config: Config): void {
  if (!scripts || typeof scripts !== 'string') {
    logger.warn('自定义脚本为空或类型错误，跳过应用');
    return;
  }
  if (config.advanced?.performanceMode) {
    logger.info('性能模式下跳过自定义脚本');
    return;
  }
  const lines = scripts.split('\n').map(s => s.trim()).filter(Boolean);
  for (const script of lines) {
    if (DANGEROUS_PATTERN.test(script)) {
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
