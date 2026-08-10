// src/utils/performanceTypes.ts v2.1.0
// 性能监控相关类型定义。

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'time' | 'memory' | 'count' | 'custom';
  metadata?: Record<string, unknown>;
}

export interface PerformanceEntry {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  entries: PerformanceEntry[];
  summary: Record<string, { avg: number; min: number; max: number; count: number }>;
  generatedAt: number;
}

export interface PerformanceThresholds {
  maxOperationTime: number;
  maxMemoryUsage: number;
  maxErrorRate: number;
}

export interface PerformanceConfig {
  enabled: boolean;
  sampleRate: number;
  autoReport: boolean;
  reportInterval: number;
  thresholds: PerformanceThresholds;
}

export interface PerformanceObserver {
  onMetric: (metric: PerformanceMetric) => void;
  onReport: (report: PerformanceReport) => void;
  onThresholdExceeded: (metric: PerformanceMetric, threshold: number) => void;
}

export interface PerformanceManagerConfig {
  maxMetrics?: number;
  enableMemoryMonitoring?: boolean;
  enableLongTaskMonitoring?: boolean;
}

// 以下为 PerformanceMonitor 实现内部依赖的浏览器/自定义类型
export interface PerformanceMonitorOptions {
  enableFpsMonitor?: boolean;
  enableMemoryMonitor?: boolean;
  sampleInterval?: number;
}

export interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usedPercent?: number;
}

export interface MemoryRecord {
  timestamp: number;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export interface PerformanceHealth {
  isHealthy: boolean;
  fpsHealthy: boolean;
  memoryHealthy: boolean;
  currentFps: number;
  averageFps: number;
  memoryUsage: string;
}

export interface WatchResult {
  stop: () => void;
}

export interface FpsMetric {
  timestamp: number;
  value: number;
}

export interface MemoryMetric {
  timestamp: number;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export interface MemoryMetrics {
  timestamp: number;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

// 以下为 PerformanceMonitor 内部使用的指标记录类型
export interface FpsRecord {
  timestamp: number;
  value: number;
}

export interface ExecutionTimeRecord {
  timestamp: number;
  duration: number;
}

export interface RenderTimeRecord {
  timestamp: number;
  duration: number;
}

export interface PerformanceMetrics {
  fps: FpsRecord[];
  memory: MemoryRecord[];
  executionTimes: Record<string, ExecutionTimeRecord[]>;
  renderTimes: RenderTimeRecord[];
}
