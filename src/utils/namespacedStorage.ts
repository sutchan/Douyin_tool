// src/utils/namespacedStorage.ts v2.1.0
// 命名空间存储封装：为不同模块提供带前缀的隔离存储。

import { StorageBackend, getStorage } from './storageBackend';

export class NamespacedStorage {
  private prefix: string;
  private backend: StorageBackend;

  constructor(prefix = 'douyin_tool') {
    this.prefix = prefix;
    this.backend = getStorage();
  }

  getItem(key: string): string | null {
    return this.backend.getItem(`${this.prefix}:${key}`);
  }

  setItem(key: string, value: string): void {
    this.backend.setItem(`${this.prefix}:${key}`, value);
  }

  removeItem(key: string): void {
    this.backend.removeItem(`${this.prefix}:${key}`);
  }

  getJSON<T>(key: string, fallback: T): T {
    const raw = this.getItem(key);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  setJSON<T>(key: string, value: T): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch {
      // 序列化失败时静默忽略
    }
  }
}
