// src/utils/storageBackend.ts v2.1.0
// 存储后端抽象与降级逻辑：优先用浏览器 localStorage，失败则降级为内存存储。

export interface StorageBackend {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

// 内存存储（localStorage 不可用时的降级方案）
class MemoryStorage implements StorageBackend {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }
}

// 获取可用的存储后端，localStorage 不可用时降级到内存
export function getStorage(): StorageBackend {
  try {
    if (typeof localStorage !== 'undefined') {
      const testKey = '__dy_tool_storage_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return localStorage as unknown as StorageBackend;
    }
  } catch {
    // 忽略，使用内存降级
  }
  return new MemoryStorage();
}
