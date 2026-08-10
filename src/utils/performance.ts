// src/utils/performance.ts v2.1.0
// 性能监控入口：聚合类型、PerformanceMonitor 实现与默认实例。

export * from './performanceTypes';
export { PerformanceMonitor, defaultPerformanceMonitor } from './performanceMonitor';

import defaultPerformanceMonitor from './performanceMonitor';

export default defaultPerformanceMonitor;
