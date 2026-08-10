// src/utils/performanceMonitor.ts v2.1.0
// 性能监控器实现：FPS / 内存 / 执行时间采集与健康检查。

import logger from './logger';
import type {
  PerformanceMonitorOptions,
  MemoryInfo,
  MemoryRecord,
  PerformanceHealth,
  WatchResult,
  FpsRecord,
  ExecutionTimeRecord,
  RenderTimeRecord,
  PerformanceMetrics
} from './performanceTypes';
import { computeHealth, createWatcher, averageOf, buildMetricsSnapshot, emptyMetrics, formatReport } from './performanceReporting';

class PerformanceMonitor {
  private enableFpsMonitor: boolean;
  private enableMemoryMonitor: boolean;
  private sampleInterval: number;
  private metrics: PerformanceMetrics;
  private isMonitoring: boolean;
  private fpsMonitorId: number | null;
  private memoryMonitorId: ReturnType<typeof setInterval> | null;
  private lastTime: number;
  private frameCount: number;
  private fpsHistory: number[];
  private maxFpsHistory: number;

  constructor(options: PerformanceMonitorOptions = {}) {
    this.enableFpsMonitor = options.enableFpsMonitor !== false;
    this.enableMemoryMonitor = options.enableMemoryMonitor !== false;
    this.sampleInterval = options.sampleInterval || 1000;

    this.metrics = {
      fps: [],
      memory: [],
      executionTimes: {},
      renderTimes: []
    };

    this.isMonitoring = false;
    this.fpsMonitorId = null;
    this.memoryMonitorId = null;

    this.lastTime = 0;
    this.frameCount = 0;
    this.fpsHistory = [];
    this.maxFpsHistory = 60;
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;

    if (this.enableFpsMonitor && typeof window.requestAnimationFrame === 'function') {
      this.lastTime = performance.now();
      this.frameCount = 0;
      this._startFpsMonitoring();
    }

    if (this.enableMemoryMonitor && (performance as unknown as { memory: MemoryInfo }).memory) {
      this.memoryMonitorId = setInterval(() => {
        this._collectMemoryMetrics();
      }, this.sampleInterval);
    }
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;

    if (this.fpsMonitorId) {
      cancelAnimationFrame(this.fpsMonitorId);
      this.fpsMonitorId = null;
    }

    if (this.memoryMonitorId) {
      clearInterval(this.memoryMonitorId);
      this.memoryMonitorId = null;
    }
  }

  private _startFpsMonitoring(): void {
    if (!this.isMonitoring) return;

    this.fpsMonitorId = requestAnimationFrame((currentTime) => {
      this.frameCount++;
      const deltaTime = currentTime - this.lastTime;

      if (deltaTime >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / deltaTime);
        this._recordFps(fps);

        this.frameCount = 0;
        this.lastTime = currentTime;
      }

      this._startFpsMonitoring();
    });
  }

  private _recordFps(fps: number): void {
    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > this.maxFpsHistory) {
      this.fpsHistory.shift();
    }

    this.metrics.fps.push({
      timestamp: Date.now(),
      value: fps
    });
  }

  private _collectMemoryMetrics(): void {
    const memory = (performance as unknown as { memory: MemoryInfo }).memory;
    if (!memory) return;

    const memoryInfo: MemoryRecord = {
      timestamp: Date.now(),
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    };

    this.metrics.memory.push(memoryInfo);
  }

  measureExecutionTime<T>(id: string, fn: () => T): T {
    const startTime = performance.now();

    try {
      const result = fn();
      const duration = performance.now() - startTime;

      if (!this.metrics.executionTimes[id]) {
        this.metrics.executionTimes[id] = [];
      }

      this.metrics.executionTimes[id].push({
        timestamp: Date.now(),
        duration
      });

      return result;
    } catch (error) {
      logger.error(`测量执行时间出错 [${id}]:`, error);
      throw error;
    }
  }

  startRenderMeasurement(): () => number {
    const startTime = performance.now();

    return (): number => {
      const duration = performance.now() - startTime;
      this.metrics.renderTimes.push({
        timestamp: Date.now(),
        duration
      });
      return duration;
    };
  }

  getCurrentFps(): number {
    if (this.fpsHistory.length === 0) return 0;
    return this.fpsHistory[this.fpsHistory.length - 1];
  }

  getAverageFps(samples: number = 10): number {
    return averageOf(this.fpsHistory, samples);
  }

  getMemoryInfo(): MemoryInfo | null {
    const memory = (performance as unknown as { memory: MemoryInfo }).memory;
    if (!memory) return null;

    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usedPercent: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
    };
  }

  getMetrics() {
    return buildMetricsSnapshot(
      this.metrics,
      this.getCurrentFps(),
      this.getAverageFps(),
      this.getMemoryInfo()
    );
  }

  clearMetrics(): void {
    this.metrics = emptyMetrics();
    this.fpsHistory = [];
  }

  exportReport(): string {
    return formatReport(this.getMetrics());
  }

  checkPerformanceHealth(): PerformanceHealth {
    return computeHealth(this.getAverageFps(), this.getMemoryInfo());
  }

  watchPerformance(callback: (health: PerformanceHealth) => void): WatchResult {
    const stop = createWatcher(() => this.checkPerformanceHealth(), callback);
    return { stop };
  }
}

const defaultPerformanceMonitor = new PerformanceMonitor();

export { PerformanceMonitor, defaultPerformanceMonitor };
export default defaultPerformanceMonitor;
