// tests/i18n.test.ts v2.1.0
import assert from 'node:assert/strict';
import { t, setLocale, getLocale, initI18n, getSupportedLocales } from '../src/i18n/index';

describe('i18n 国际化', () => {
  afterEach(() => setLocale('zh-CN'));

  it('默认语言为中文', () => {
    assert.equal(getLocale(), 'zh-CN');
    assert.equal(t('app.name'), '抖音界面定制工具');
  });

  it('切换英文返回对应文案', () => {
    setLocale('en-US');
    assert.equal(t('app.name'), 'Douyin UI Customizer');
  });

  it('缺失 key 回退到 key 本身', () => {
    assert.equal(t('missing.key'), 'missing.key');
  });

  it('英文缺失时回退中文', () => {
    setLocale('en-US');
    assert.equal(t('test.total'), '总计');
  });

  it('initI18n 不抛异常', () => {
    assert.doesNotThrow(() => initI18n());
  });

  it('支持中英文两种语言', () => {
    const locales = getSupportedLocales();
    assert.ok(locales.includes('zh-CN'));
    assert.ok(locales.includes('en-US'));
  });
});
