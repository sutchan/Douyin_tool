// src/utils/storage.ts v2.1.0
// 存储入口：聚合存储后端与命名空间封装，保持公开导出契约不变。

export { StorageBackend, getStorage } from './storageBackend';
export { NamespacedStorage } from './namespacedStorage';

import { NamespacedStorage } from './namespacedStorage';

const storage = new NamespacedStorage();

export default storage;
