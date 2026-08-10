// src/controllers/layoutHelpers.ts v2.1.0
// 布局控制器的纯函数逻辑。

import type { Layout } from './layoutDefaults';

// 收集所有布局规则涉及的全部选择器（去重）
export function collectAllSelectors(layouts: Record<string, Layout>): string[] {
  const allSelectors = new Set<string>();
  Object.values(layouts).forEach(layout => {
    layout.rules.forEach(rule => {
      if (rule.selector) {
        rule.selector.split(',').forEach(selector => {
          allSelectors.add(selector.trim());
        });
      }
    });
  });
  return Array.from(allSelectors);
}

// 将单个布局的规则应用到页面（委托 elementController 执行）
export async function applyLayoutRules(
  layout: Layout,
  elementController: {
    hideElement: (selector: string) => Promise<boolean>;
    modifyElementStyle: (selector: string, styles: Record<string, string>) => boolean;
  }
): Promise<void> {
  for (const rule of layout.rules) {
    if (rule.action === 'hide') {
      await elementController.hideElement(rule.selector);
    } else if (rule.styles) {
      elementController.modifyElementStyle(rule.selector, rule.styles);
    }
  }
}

// 校验保存布局的输入（名称非空、配置为对象），返回错误信息或 null
export function validateLayoutInput(
  layoutName: string,
  layoutConfig: Partial<Layout>
): string | null {
  if (!layoutName || typeof layoutName !== 'string' || layoutName.trim() === '') {
    return '布局名称不能为空';
  }
  if (!layoutConfig || typeof layoutConfig !== 'object') {
    return '布局配置必须是有效的对象';
  }
  return null;
}
