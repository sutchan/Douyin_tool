// src/ui_manager/injectStyles.ts v2.1.0
// UIManager 注入的面板/按钮基础样式（纯函数）。

const CUSTOMIZER_CSS = `
  .dy-settings-panel { position: fixed; top: 20px; right: 20px; width: 340px; max-height: 90vh;
    overflow-y: auto; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 9999; padding: 16px; font-family: -apple-system, sans-serif; }
  .dy-settings-panel h2 { margin: 0 0 12px; font-size: 18px; }
  .dy-settings-panel .dy-section { border-bottom: 1px solid #eee; padding: 10px 0; }
  .dy-settings-panel label { display: block; margin: 6px 0; font-size: 13px; }
  .dy-toggle-btn { position: fixed; top: 60px; right: 20px; z-index: 9998; background: #fe2c55;
    color: #fff; border: none; border-radius: 20px; padding: 8px 14px; cursor: pointer; font-size: 13px; }
`;

// 注入自定义器基础样式（幂等）
export function injectCustomizerStyles(): void {
  if (document.getElementById('douyin-customizer-styles')) return;
  const style = document.createElement('style');
  style.id = 'douyin-customizer-styles';
  style.textContent = CUSTOMIZER_CSS;
  document.head.appendChild(style);
}
