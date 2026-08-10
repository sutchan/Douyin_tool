// tests/version.test.ts v2.1.0
import assert from 'node:assert/strict';
import { version } from '../src/version';

describe('version 模块', () => {
  it('导出非空语义化版本号', () => {
    assert.match(version, /^\d+\.\d+\.\d+$/);
  });
});
