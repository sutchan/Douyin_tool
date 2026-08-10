// src/utils/autoExecutorTypes.ts v2.1.0
// AutoExecutor 相关类型定义。

export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  backoffFactor: number;
}

export interface AutoExecutorOptions {
  detectionStrategies?: string[];
  retryConfig?: RetryConfig;
  checkInterval?: number;
  enabled?: boolean;
  customDetector?: () => HTMLElement | null;
  confirmationRequired?: boolean;
  enableLogging?: boolean;
  captureScreenshots?: boolean;
  maxHistorySize?: number;
}

export interface ExecutionRecord {
  timestamp: string;
  buttonText: string;
  buttonSelector: string;
  success: boolean;
  error?: string;
}

export interface ButtonClickEvent {
  button: HTMLElement;
  text: string | null;
  selector: string;
}
