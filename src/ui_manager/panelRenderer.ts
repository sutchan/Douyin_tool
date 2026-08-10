// src/ui_manager/panelRenderer.ts v2.1.0
// 设置面板的 DOM 渲染逻辑，拆分自 ui_manager.ts，保持单一职责。

import type { Config } from '../config';
import type { UIManager } from '../ui_manager';
import { t } from '../i18n';

// 构建带语义化 id 的区块容器
export function buildSection(id: string, heading: string, content: HTMLElement): HTMLElement {
  const section = document.createElement('div');
  section.id = `dy-section-${id}`;
  section.className = 'dy-section';
  const h = document.createElement('h3');
  h.id = `dy-section-${id}-title`;
  h.textContent = heading;
  section.appendChild(h);
  section.appendChild(content);
  return section;
}

export function buildCheckbox(id: string, labelText: string, checked: boolean): HTMLElement {
  const label = document.createElement('label');
  label.id = `dy-checkbox-${id}`;
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = id;
  input.checked = checked;
  label.appendChild(input);
  label.appendChild(document.createTextNode(labelText));
  return label;
}

export function buildThemeSection(config: Config): HTMLElement {
  const wrap = document.createElement('div');
  wrap.id = 'dy-theme-wrap';
  ['light', 'dark'].forEach(value => {
    const label = document.createElement('label');
    label.id = `dy-theme-label-${value}`;
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'theme';
    input.value = value;
    input.checked = config.theme === value;
    label.appendChild(input);
    label.appendChild(document.createTextNode(value === 'light' ? t('theme.light') : t('theme.dark')));
    wrap.appendChild(label);
  });
  return wrap;
}

export function buildVideoSection(config: Config): HTMLElement {
  const wrap = document.createElement('div');
  wrap.id = 'dy-video-wrap';
  const items: [string, string][] = [
    ['miniPlayer', t('settings.miniPlayer')],
    ['hideTopBar', t('settings.hideTopBar')],
    ['hideSidebar', t('settings.hideSidebar')],
    ['hideComments', t('settings.hideComments')],
    ['autoPlay', t('settings.autoPlay')],
    ['autoMute', t('settings.autoMute')],
  ];
  items.forEach(([key, label]) => {
    wrap.appendChild(buildCheckbox(key, label, Boolean(config[key as keyof Config])));
  });
  return wrap;
}

export function buildLiveSection(config: Config): HTMLElement {
  const wrap = document.createElement('div');
  wrap.id = 'dy-live-wrap';
  const items: [string, string][] = [
    ['hideLiveTopBar', t('settings.hideLiveTopBar')],
    ['hideLiveGift', t('settings.hideLiveGift')],
    ['hideLiveChat', t('settings.hideLiveChat')],
  ];
  items.forEach(([key, label]) => {
    wrap.appendChild(buildCheckbox(key, label, Boolean(config[key as keyof Config])));
  });
  return wrap;
}

export function buildCustomSection(config: Config): HTMLElement {
  const wrap = document.createElement('div');
  wrap.id = 'dy-custom-wrap';
  const stylesLabel = document.createElement('label');
  stylesLabel.id = 'dy-custom-styles-label';
  stylesLabel.textContent = t('settings.customStyles');
  const stylesArea = document.createElement('textarea');
  stylesArea.id = 'advanced-customCSS';
  stylesArea.value = config.customStyles || '';
  stylesArea.rows = 4;
  stylesArea.style.cssText = 'width:100%;font-family:monospace;';
  stylesLabel.appendChild(stylesArea);
  wrap.appendChild(stylesLabel);
  return wrap;
}

export function buildTestingSection(config: Config): HTMLElement {
  const wrap = document.createElement('div');
  wrap.id = 'dy-testing-wrap';
  const autoApplyLabel = document.createElement('label');
  autoApplyLabel.id = 'dy-testing-autoapply-label';
  const autoApplyInput = document.createElement('input');
  autoApplyInput.type = 'checkbox';
  autoApplyInput.id = 'autoApply';
  autoApplyInput.checked = Boolean(config.autoApply);
  autoApplyLabel.appendChild(autoApplyInput);
  autoApplyLabel.appendChild(document.createTextNode(t('settings.testing.autoApply')));
  wrap.appendChild(autoApplyLabel);

  const testBtn = document.createElement('button');
  testBtn.id = 'dy-run-test-btn';
  testBtn.textContent = t('settings.testing.autoTest');
  testBtn.style.cssText = 'margin-top:8px;width:100%;background:#333;color:#fff;border:none;border-radius:4px;padding:8px;cursor:pointer;';
  wrap.appendChild(testBtn);
  return wrap;
}

// 渲染面板整体内容
export function renderSettingsPanel(panel: HTMLElement, uiManager: UIManager): void {
  panel.innerHTML = '';
  const title = document.createElement('h2');
  title.id = 'dy-panel-title';
  title.textContent = t('settings.title');
  panel.appendChild(title);

  const closeBtn = document.createElement('button');
  closeBtn.id = 'dy-panel-close';
  closeBtn.textContent = t('settings.close');
  closeBtn.style.cssText = 'position:absolute;top:8px;right:8px;border:none;background:none;cursor:pointer;font-size:18px;';
  closeBtn.addEventListener('click', () => {
    if (uiManager.getSettingsPanel()) uiManager.getSettingsPanel()!.style.display = 'none';
  });
  panel.appendChild(closeBtn);

  const config = uiManager.getConfig();
  panel.appendChild(buildSection('theme', t('settings.theme'), buildThemeSection(config)));
  panel.appendChild(buildSection('video', t('settings.miniPlayer'), buildVideoSection(config)));
  panel.appendChild(buildSection('live', t('settings.hideLiveTopBar'), buildLiveSection(config)));
  panel.appendChild(buildSection('custom', t('settings.customStyles'), buildCustomSection(config)));
  panel.appendChild(buildSection('testing', t('settings.testing.title'), buildTestingSection(config)));

  const testBtn = panel.querySelector('#dy-run-test-btn') as HTMLButtonElement | null;
  if (testBtn) {
    testBtn.addEventListener('click', async () => {
      testBtn.disabled = true;
      const status = panel.querySelector('#dy-test-status');
      try {
        const result = await uiManager.runAutoTest();
        const msg = result.success ? t('test.passed') : t('test.failed');
        if (status) status.textContent = `${msg} (${result.steps.length})`;
      } catch (e) {
        if (status) status.textContent = t('test.failed');
      } finally {
        testBtn.disabled = false;
      }
    });
  }
  const statusEl = document.createElement('div');
  statusEl.id = 'dy-test-status';
  statusEl.style.cssText = 'margin-top:6px;font-size:12px;color:#666;';
  panel.appendChild(statusEl);

  const saveBtn = document.createElement('button');
  saveBtn.id = 'dy-save-btn';
  saveBtn.textContent = t('settings.save');
  saveBtn.style.cssText = 'margin-top:12px;width:100%;background:#fe2c55;color:#fff;border:none;border-radius:4px;padding:10px;cursor:pointer;';
  saveBtn.addEventListener('click', async () => {
    const current = uiManager.getSettingsPanel();
    if (current) {
      const { saveSettings } = await import('./settingsSaver');
      await saveSettings(uiManager, current);
    }
  });
  panel.appendChild(saveBtn);
}
