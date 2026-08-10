// src/utils/dom/events.ts v2.1.0
// 事件绑定辅助函数（add/remove/delegate），拆分自 dom.ts

import logger from '../logger';

export function addEvent(
  element: EventTarget,
  eventType: string,
  handler: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions | boolean
): void {
  try {
    if (element && 'addEventListener' in element) {
      element.addEventListener(eventType, handler, options);
    }
  } catch (error) {
    logger.error(`添加事件监听器失败 (${eventType}):`, error);
  }
}

export function removeEvent(
  element: EventTarget,
  eventType: string,
  handler: EventListenerOrEventListenerObject,
  options?: EventListenerOptions | boolean
): void {
  try {
    if (element && 'removeEventListener' in element) {
      element.removeEventListener(eventType, handler, options);
    }
  } catch (error) {
    logger.error(`移除事件监听器失败 (${eventType}):`, error);
  }
}

export function delegateEvent<K extends keyof HTMLElementEventMap>(
  parent: HTMLElement,
  eventType: K,
  selector: string,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void
): void {
  try {
    parent.addEventListener(eventType, (e) => {
      const target = e.target as HTMLElement | null;
      if (target && 'closest' in target) {
        const matchedTarget = target.closest<HTMLElement>(selector);
        if (matchedTarget) {
          handler.call(matchedTarget, e);
        }
      }
    });
  } catch (error) {
    logger.error(`事件委托失败 (${eventType}):`, error);
  }
}
