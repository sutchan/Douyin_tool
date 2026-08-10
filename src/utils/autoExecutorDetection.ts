// src/utils/autoExecutorDetection.ts v2.1.0
// 按钮检测与可点击性判定（纯函数，独立自 AutoExecutor 实例）。

import logger from './logger';
import buttonDetector from './buttonDetector';
import type { AutoExecutorOptions } from './autoExecutorTypes';

// 判断按钮当前是否可点击（未被禁用、可见且在视口内）
export function isButtonClickable(button: HTMLElement): boolean {
  if (!button) return false;
  const disabledAttr = button.getAttribute('disabled');
  const disabledProp = (button as HTMLButtonElement).disabled;
  if (disabledAttr !== null || disabledProp === true) return false;
  if (button.style.display === 'none' || button.style.visibility === 'hidden') return false;

  const rect = button.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;

  if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) {
    return false;
  }

  return true;
}

// 根据配置的检测策略探测目标按钮
export async function detectButton(
  options: AutoExecutorOptions,
  enableLogging: boolean
): Promise<HTMLElement | null> {
  if (options.customDetector) {
    try {
      const button = options.customDetector();
      if (button) {
        if (enableLogging) {
          logger.info('AutoExecutor detected button using custom detector');
        }
        return button;
      }
    } catch (error) {
      if (enableLogging) {
        logger.warn('AutoExecutor custom detector failed:', error);
      }
    }
  }

  const detectorOptions = {
    detectionStrategies: options.detectionStrategies
  };
  return buttonDetector.detect(detectorOptions);
}
