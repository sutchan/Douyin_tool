// tests/utils.test.ts v2.1.0
import assert from 'node:assert/strict';
import { escapeHtml } from '../src/utils/dom/factory';
import { debounce, throttle } from '../src/utils/dom';
import { basicValidateConfig } from '../src/ui_manager/settingsSaver';
import { defaultConfig, mergeConfig } from '../src/config';
import type { Config } from '../src/config';

describe('dom/factory.escapeHtml', () => {
  it('转义 HTML 特殊字符防止注入', () => {
    assert.equal(escapeHtml('<script>"&</script>'), '&lt;script&gt;&quot;&amp;&lt;/script&gt;');
  });
  it('非字符串输入返回空串', () => {
    assert.equal(escapeHtml(123 as unknown as string), '');
  });
});

describe('dom debounce/throttle', () => {
  it('debounce 在等待后仅执行一次', async () => {
    let count = 0;
    const fn = debounce(() => { count++; }, 20);
    fn(); fn(); fn();
    await new Promise(r => setTimeout(r, 60));
    assert.equal(count, 1);
  });

  it('throttle 限制执行频率', async () => {
    let count = 0;
    const fn = throttle(() => { count++; }, 30);
    fn(); fn(); fn();
    await new Promise(r => setTimeout(r, 60));
    assert.equal(count, 1);
  });
});

describe('settingsSaver.basicValidateConfig', () => {
  it('合法配置通过校验', () => {
    const result = basicValidateConfig(defaultConfig as Config);
    assert.equal(result.valid, true);
    assert.deepEqual(result.issues, []);
  });

  it('非法主题被拦截', () => {
    const cfg = mergeConfig(defaultConfig, { theme: 'neon' }) as Config;
    const result = basicValidateConfig(cfg);
    assert.equal(result.valid, false);
    assert.ok(result.issues.some(i => i.includes('主题')));
  });

  it('弹幕字体超出范围被拦截', () => {
    const cfg = mergeConfig(defaultConfig, { liveUI: { danmaku: { fontSize: 100 } } }) as Config;
    const result = basicValidateConfig(cfg);
    assert.equal(result.valid, false);
  });
});

describe('config.mergeConfig', () => {
  it('深度合并嵌套配置', () => {
    const merged = mergeConfig(defaultConfig, { videoUI: { showLikeButton: false } });
    assert.equal(merged.videoUI.showLikeButton, false);
    // 未覆盖字段保留默认
    assert.equal(merged.videoUI.showCommentButton, true);
  });

  it('合并后版本号保持', () => {
    const merged = mergeConfig(defaultConfig, { theme: 'dark' });
    assert.equal(merged.version, defaultConfig.version);
  });
});
