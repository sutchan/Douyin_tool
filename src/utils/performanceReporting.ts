// src/utils/performanceReporting.ts v2.1.0
// 性能监控的健康计算与监视器（纯逻辑，由 PerformanceMonitor 委托调用）。

import type { MemoryInfo, PerformanceHealth, PerformanceMetrics, PerformanceMetric } from './performanceTypes';

// 根据平均 FPS 与内存信息计算健康状态
export function computeHealth(avgFps: number, memoryInfo: MemoryInfo | null): PerformanceHealth {
  const usedPercent = memoryInfo ? (memoryInfo.usedPercent ?? 0) : 0;
  return {
    isHealthy: avgFps >= 30 && usedPercent < 80,
    fpsHealthy: avgFps >= 30,
    memoryHealthy: usedPercent < 80,
    currentFps: avgFps,
    averageFps: avgFps,
    memoryUsage: memoryInfo ? `${usedPercent}%` : 'N/A'
  };
}

// 创建周期性健康检查监视器，返回停止函数
export function createWatcher(
  check: () => PerformanceHealth,
  callback: (health: PerformanceHealth) => void,
  intervalMs = 5000
): () => void {
  const timer = setInterval(() => {
    const health = check();
    if (!health.isHealthy) {
      callback(health);
    }
  }, intervalMs);
  return () => clearInterval(timer);
}

// 计算历史样本平均值
export function averageOf(history: number[], samples: number = 10): number {
  if (history.length === 0) return 0;
  const recent = history.slice(-samples);
  const sum = recent.reduce((acc, fps) => acc + fps, 0);
  return Math.round(sum / recent.length);
}

// 构造指标快照对象
export function buildMetricsSnapshot(
  metrics: PerformanceMetrics,
  currentFps: number,
  averageFps: number,
  memoryInfo: MemoryInfo | null
) {
  return {
    fps: [...metrics.fps],
    memory: [...metrics.memory],
    executionTimes: { ...metrics.executionTimes },
    renderTimes: [...metrics.renderTimes],
    currentFps,
    averageFps,
    memoryInfo
  };
}

// 生成空指标状态
export function emptyMetrics(): PerformanceMetrics {
  return {
    fps: [],
    memory: [],
    executionTimes: {},
    renderTimes: []
  };
}

// 将快照格式化为 JSON 报告
export function formatReport(snapshot: ReturnType<typeof buildMetricsSnapshot>): string {
  return JSON.stringify(snapshot, null, 2);
}
