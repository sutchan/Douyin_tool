// src/utils/autoExecutor.ts v2.1.0
// 自动执行控制器：检测并点击页面按钮，支持重试、节流与紧急停止。
// 纯类型拆分至 ./autoExecutorTypes，检测/点击纯函数拆分至 ./autoExecutorDetection 与 ./autoExecutorClicker，
// 辅助函数拆分至 ./autoExecutor/helpers，主文件仅保留编排逻辑与类外壳。

import { debounce, throttle, getElement, getElements, findElementsByClassPattern, findElementsByStructure } from './dom';
import logger from './logger';
import eventEmitter from './eventEmitter';
import buttonDetector from './buttonDetector';
import { getElementSelector, captureScreenshot } from './autoExecutor/helpers';
import { detectButton, isButtonClickable } from './autoExecutorDetection';
import { clickButton } from './autoExecutorClicker';
import type { AutoExecutorOptions, RetryConfig, ExecutionRecord, ButtonClickEvent } from './autoExecutorTypes';

export type { AutoExecutorOptions, RetryConfig, ExecutionRecord, ButtonClickEvent } from './autoExecutorTypes';

class AutoExecutor {
  private options: Required<AutoExecutorOptions>;
  private isRunning: boolean;
  private isEmergencyStopped: boolean;
  private checkIntervalId: ReturnType<typeof setInterval> | null;
  private executionHistory: ExecutionRecord[];
  private currentAttempt: number;

  constructor(options: AutoExecutorOptions = {}) {
    this.options = {
      detectionStrategies: ['text', 'css', 'structure'],
      retryConfig: {
        maxAttempts: 10,
        initialDelay: 500,
        backoffFactor: 2
      },
      checkInterval: 1000,
      enabled: false,
      customDetector: (() => null) as () => HTMLElement | null,
      confirmationRequired: false,
      enableLogging: true,
      captureScreenshots: false,
      maxHistorySize: 100,
      ...options
    };

    this.isRunning = false;
    this.isEmergencyStopped = false;
    this.checkIntervalId = null;
    this.executionHistory = [];
    this.currentAttempt = 0;

    if (this.options.enableLogging) {
      logger.info('AutoExecutor initialized with options:', this.options);
    }

    eventEmitter.on('autoExecutor.emergencyStop', () => {
      this.emergencyStop();
    });
  }

  start(): void {
    if (this.isRunning) {
      if (this.options.enableLogging) {
        logger.warn('AutoExecutor is already running');
      }
      return;
    }

    if (this.options.confirmationRequired) {
      const confirmed = confirm('确认要启动自动执行控制器吗？这将自动点击界面中的按钮。');
      if (!confirmed) {
        return;
      }
    }

    this.isRunning = true;
    this.isEmergencyStopped = false;
    this.currentAttempt = 0;

    if (this.options.enableLogging) {
      logger.info('AutoExecutor started');
    }

    this.detectAndClick();

    this.checkIntervalId = setInterval(() => {
      this.detectAndClick();
    }, this.options.checkInterval);

    eventEmitter.emit('autoExecutor.started');
  }

  stop(): void {
    if (!this.isRunning) {
      if (this.options.enableLogging) {
        logger.warn('AutoExecutor is not running');
      }
      return;
    }

    this.isRunning = false;
    this.isEmergencyStopped = false;

    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }

    if (this.options.enableLogging) {
      logger.info('AutoExecutor stopped');
    }

    eventEmitter.emit('autoExecutor.stopped');
  }

  emergencyStop(): void {
    this.isEmergencyStopped = true;
    this.stop();

    if (this.options.enableLogging) {
      logger.error('AutoExecutor emergency stopped');
    }

    eventEmitter.emit('autoExecutor.emergencyStopped');
  }

  private async detectAndClick(): Promise<void> {
    if (this.isEmergencyStopped) {
      return;
    }

    try {
      this.currentAttempt++;

      const button = await detectButton(this.options, this.options.enableLogging);

      if (button) {
        if (isButtonClickable(button)) {
          if (this.options.captureScreenshots) {
            captureScreenshot('before_click');
          }

          clickButton(button, this.options, this.executionHistory);

          if (this.options.captureScreenshots) {
            setTimeout(() => {
              captureScreenshot('after_click');
            }, 500);
          }

          this.currentAttempt = 0;
        }
      } else if (this.currentAttempt >= this.options.retryConfig.maxAttempts) {
        if (this.options.enableLogging) {
          logger.warn(`AutoExecutor failed to detect button after ${this.currentAttempt} attempts`);
        }

        eventEmitter.emit('autoExecutor.retryFailed', { attempts: this.currentAttempt });
        this.currentAttempt = 0;
      }
    } catch (error) {
      if (this.options.enableLogging) {
        logger.error('AutoExecutor error during detectAndClick:', error);
      }

      eventEmitter.emit('autoExecutor.error', { error });
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      isEmergencyStopped: this.isEmergencyStopped,
      currentAttempt: this.currentAttempt,
      executionHistory: this.executionHistory.slice(-10),
      options: this.options
    };
  }

  getExecutionHistory(limit: number | null = null): ExecutionRecord[] {
    if (limit) {
      return this.executionHistory.slice(-limit);
    }
    return [...this.executionHistory];
  }

  getCurrentAttempt(): number {
    return this.currentAttempt;
  }

  updateOptions(newOptions: Partial<AutoExecutorOptions>): void {
    this.options = { ...this.options, ...newOptions };

    if (this.options.enableLogging) {
      logger.info('AutoExecutor options updated:', newOptions);
    }
  }
}

export default new AutoExecutor();
