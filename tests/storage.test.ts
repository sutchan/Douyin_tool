// tests/storage.test.ts v2.1.0
import assert from 'node:assert/strict';
import { getItem, setItem, removeItem, NamespacedStorage, clearAll } from '../src/utils/storage';

describe('storage 存储', () => {
  beforeEach(() => clearAll());

  it('setItem 后 getItem 能取回', () => {
    assert.equal(setItem('k1', { a: 1 }), true);
    assert.deepEqual(getItem('k1'), { a: 1 });
  });

  it('缺失 key 返回默认值', () => {
    assert.equal(getItem('nope', 'default'), 'default');
  });

  it('removeItem 移除数据', () => {
    setItem('k2', 123);
    assert.equal(removeItem('k2'), true);
    assert.equal(getItem('k2'), null);
  });

  it('带过期时间的数据到期后被清除', () => {
    setItem('k3', 'v', -1);
    assert.equal(getItem('k3', 'expired'), 'expired');
  });

  it('NamespacedStorage 命名空间隔离', () => {
    const ns1 = new NamespacedStorage('ns_a');
    const ns2 = new NamespacedStorage('ns_b');
    ns1.setItem('x', 1);
    ns2.setItem('x', 2);
    assert.equal(ns1.getItem('x'), 1);
    assert.equal(ns2.getItem('x'), 2);
    ns1.clear();
    assert.equal(ns1.getItem('x'), null);
    assert.equal(ns2.getItem('x'), 2);
  });
});
