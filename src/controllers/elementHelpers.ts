// src/controllers/elementHelpers.ts v2.1.0
// 元素控制器相关的纯函数与类型（不依赖实例状态）。

import { getElement, getElements } from '../utils/dom';

export interface ElementInfo {
  id: string;
  selector: string;
  type: string;
  description: string;
}

export interface OriginalStyle {
  [key: string]: string;
}

// 解析选择器或元素为元素数组
export function resolveElements(selector: string | HTMLElement): HTMLElement[] {
  if (!selector) {
    return [];
  }

  if (typeof selector === 'string') {
    return getElements(selector);
  } else if (selector.nodeType === 1) {
    return [selector];
  }

  return [];
}

// 为元素生成可用选择器
export function generateSelector(element: HTMLElement): string {
  if (!element) return '';

  if (element.id) {
    return `#${element.id}`;
  }

  const specificClasses = Array.from(element.classList).filter(cls =>
    /^(btn|input|card|panel|container|video)/i.test(cls)
  );
  if (specificClasses.length > 0) {
    return `.${specificClasses[0]}`;
  }

  const tagName = element.tagName.toLowerCase();
  const siblings = element.parentNode ? Array.from(element.parentNode.children) : [];
  const index = siblings.indexOf(element);

  if (siblings.length > 1) {
    return `${tagName}:nth-child(${index + 1})`;
  }

  return tagName;
}

// 获取表单元素的关联标签文本
export function getElementLabel(element: HTMLElement): string | null {
  const id = element.id;
  if (id) {
    const label = getElement(`label[for="${id}"]`);
    if (label) return label.textContent.trim();
  }

  if (element.closest('label')) {
    return element.closest('label')!.textContent.trim();
  }

  return element.getAttribute('placeholder') || element.getAttribute('name') || null;
}

// 识别页面中的可操作元素（按钮/输入框/容器/视频）
export function collectInteractiveElements(): ElementInfo[] {
  try {
    const elements: ElementInfo[] = [];
    let elementId = 1;

    const buttons = getElements('button, [role="button"], .btn, .button, .action');
    buttons.forEach(button => {
      const selector = generateSelector(button);
      const description = button.textContent?.trim() || button.getAttribute('aria-label') || '按钮';
      elements.push({
        id: `btn_${elementId++}`,
        selector: selector,
        type: 'button',
        description: description
      });
    });

    const inputs = getElements('input, textarea, select');
    inputs.forEach(input => {
      const selector = generateSelector(input);
      const label = getElementLabel(input);
      elements.push({
        id: `input_${elementId++}`,
        selector: selector,
        type: 'input',
        description: label || '输入框'
      });
    });

    const containers = getElements('.container, .wrapper, .section, .card, .panel');
    containers.forEach(container => {
      const selector = generateSelector(container);
      elements.push({
        id: `container_${elementId++}`,
        selector: selector,
        type: 'container',
        description: `容器 - ${container.classList.value}`
      });
    });

    const videoElements = getElements('video, .video, .player');
    videoElements.forEach(video => {
      const selector = generateSelector(video);
      elements.push({
        id: `video_${elementId++}`,
        selector: selector,
        type: 'video',
        description: '视频元素'
      });
    });

    return elements;
  } catch {
    return [];
  }
}
