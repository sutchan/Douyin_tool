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
