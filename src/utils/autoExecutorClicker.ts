// src/utils/autoExecutorClicker.ts v2.1.0
// 按钮点击执行（纯函数，接受状态参数，独立自 AutoExecutor 实例）。

import logger from './logger';
import eventEmitter from './eventEmitter';
import { getElementSelector } from './autoExecutor/helpers';
import type { AutoExecutorOptions, ExecutionRecord, ButtonClickEvent } from './autoExecutorTypes';

// 向执行历史追加记录
function pushHistory(history: ExecutionRecord[], record: ExecutionRecord, maxSize: number): void {
  history.push(record);
  if (history.length > maxSize) {
    history.length = maxSize;
  }
}

// 点击按钮并记录执行历史，失败时回退记录
export function clickButton(
  button: HTMLElement,
  options: AutoExecutorOptions,
  history: ExecutionRecord[]
): void {
  if (!button) return;

  try {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });

    button.dispatchEvent(clickEvent);

    pushHistory(history, {
      timestamp: new Date().toISOString(),
      buttonText: button.textContent || button.innerText || 'Unknown',
      buttonSelector: getElementSelector(button),
      success: true
    }, options.maxHistorySize ?? 100);

    if (options.enableLogging) {
      logger.info(`AutoExecutor clicked button: ${button.textContent || button.innerText}`);
    }

    eventEmitter.emit('autoExecutor.buttonClicked', {
      button,
      text: button.textContent || button.innerText,
      selector: getElementSelector(button)
    } as ButtonClickEvent);
  } catch (error) {
    const err = error as Error;
    pushHistory(history, {
      timestamp: new Date().toISOString(),
      buttonText: button.textContent || button.innerText || 'Unknown',
      buttonSelector: getElementSelector(button),
      success: false,
      error: err.message
    }, options.maxHistorySize ?? 100);

    if (options.enableLogging) {
      logger.error('AutoExecutor failed to click button:', error);
    }

    eventEmitter.emit('autoExecutor.buttonClickFailed', {
      button,
      error
    });
  }
}
