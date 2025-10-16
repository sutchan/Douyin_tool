/**
 * UI管理器模块
 * 负责处理界面定制和设置面板
 */

class UIManager {
  /**
   * 构造函数
   * @param {Object} config - 配置对象
   */
  constructor(config) {
    this.config = config;
    this.settingsPanel = null;
  }

  /**
   * 应用短视频界面定制
   */
  applyVideoCustomizations() {
    console.log('应用短视频界面定制');
    
    if (!this.config.videoUI) return;
    
    const { videoUI } = this.config;
    
    // 隐藏/显示点赞按钮（使用多种策略）
    this.toggleElement(() => {
      // 1. 首先尝试通过可能的点赞图标查找
      const heartIcons = this.findElementsByStructure({
        tagName: 'svg',
        attributes: { viewBox: '0 0 1024 1024' }
      });
      
      if (heartIcons.length > 0) {
        // 找到包含点赞图标的元素，返回其父元素
        return heartIcons.map(icon => icon.closest('div') || icon);
      }
      
      // 2. 通过类名模式匹配
      return this.findElementsByClassPattern(/like|heart/i);
    }, videoUI.showLikeButton);
    
    // 隐藏/显示评论按钮
    this.toggleElement(() => {
      const commentElements = this.findElementsByStructure({
        tagName: 'div',
        children: [{
          tagName: 'svg',
          attributes: { viewBox: '0 0 1024 1024' }
        }]
      });
      
      if (commentElements.length > 0) {
        return commentElements;
      }
      
      return this.findElementsByClassPattern(/comment|discuss/i);
    }, videoUI.showCommentButton);
    
    // 隐藏/显示分享按钮
    this.toggleElement(() => {
      const shareElements = this.findElementsByStructure({
        tagName: 'div',
        children: [{
          tagName: 'svg',
          attributes: { viewBox: '0 0 1024 1024' }
        }]
      });
      
      if (shareElements.length > 0) {
        return shareElements.filter(el => {
          // 尝试排除已找到的点赞和评论按钮
          const text = el.textContent.toLowerCase();
          return text.includes('share') || text.includes('分享');
        });
      }
      
      return this.findElementsByClassPattern(/share|forward/i);
    }, videoUI.showShareButton);
    
    // 隐藏/显示作者信息
    this.toggleElement(() => {
      // 查找包含头像的元素，通常是作者信息
      const avatarElements = this.findElementsByStructure({
        tagName: 'img',
        attributes: { class: /avatar|user/i }
      });
      
      if (avatarElements.length > 0) {
        return avatarElements.map(img => img.closest('div') || img);
      }
      
      return this.findElementsByClassPattern(/author|user|avatar/i);
    }, videoUI.showAuthorInfo);
    
    // 隐藏/显示音乐信息
    this.toggleElement(() => {
      // 查找包含音乐相关文本或图标的元素
      const musicElements = this.findElementsByStructure({
        text: '音乐'
      });
      
      if (musicElements.length > 0) {
        return musicElements.map(el => el.closest('div') || el);
      }
      
      return this.findElementsByClassPattern(/music|sound/i);
    }, videoUI.showMusicInfo);
    
    // 隐藏/显示描述
    this.toggleElement(() => {
      // 查找包含长文本的元素，可能是视频描述
      const textElements = document.body.querySelectorAll('div');
      const descriptions = Array.from(textElements).filter(el => {
        return el.textContent.length > 20 && 
               el.textContent.length < 200 && 
               !el.querySelector('img') &&
               !el.querySelector('video');
      });
      
      if (descriptions.length > 0) {
        return descriptions;
      }
      
      return this.findElementsByClassPattern(/desc|description|content/i);
    }, videoUI.showDescription);
    
    // 隐藏/显示推荐
    this.toggleElement(() => {
      // 查找可能包含推荐内容的容器
      const recommendationContainers = this.findElementsByStructure({
        tagName: 'div',
        children: [{
          tagName: 'video'
        }]
      });
      
      if (recommendationContainers.length > 0) {
        return recommendationContainers;
      }
      
      return this.findElementsByClassPattern(/recommend|suggest|related/i);
    }, videoUI.showRecommendations);
    
    // 自定义控制栏
    if (videoUI.controlBar) {
      this.customizeControlBar(videoUI.controlBar);
    }
    
    // 应用自定义布局
    this.applyLayout('video', videoUI.layout);
  }

  /**
   * 应用直播间界面定制
   */
  applyLiveCustomizations() {
    console.log('应用直播间界面定制');
    
    if (!this.config.liveUI) return;
    
    const { liveUI } = this.config;
    
    // 隐藏/显示礼物（添加更多可能的礼物相关选择器）
    this.toggleElement(() => {
      // 查找动画元素，可能是礼物特效
      const animatedElements = this.findElementsByStructure({
        attributes: { class: /animation|effect|gift/i }
      });
      
      if (animatedElements.length > 0) {
        return animatedElements;
      }
      
      // 查找可能包含礼物的容器
      const giftContainers = document.body.querySelectorAll('div');
      const potentialGifts = Array.from(giftContainers).filter(el => {
        // 礼物通常有特定的动画样式
        const style = window.getComputedStyle(el);
        return style.animationName !== 'none' || 
               style.transform !== 'none';
      });
      
      return potentialGifts.length > 0 ? potentialGifts : 
             this.findElementsByClassPattern(/gift|present|reward/i);
    }, liveUI.showGifts);
    
    // 隐藏/显示弹幕
    this.toggleElement(() => {
      // 查找可能包含弹幕的元素
      const bulletElements = document.body.querySelectorAll('div');
      const potentialBullets = Array.from(bulletElements).filter(el => {
        // 弹幕通常是半透明覆盖层
        const style = window.getComputedStyle(el);
        return style.position === 'absolute' && 
               style.pointerEvents === 'none' &&
               style.zIndex > 0;
      });
      
      if (potentialBullets.length > 0) {
        return potentialBullets;
      }
      
      // 备用方案：通过类名模式匹配
      return this.findElementsByClassPattern(/danmu|bullet|comment|danmaku/i);
    }, liveUI.showDanmaku);
    
    // 隐藏/显示推荐
    this.toggleElement(() => {
      // 查找可能包含推荐内容的容器
      const recommendationContainers = this.findElementsByStructure({
        tagName: 'div',
        children: [{
          tagName: 'img'
        }]
      });
      
      if (recommendationContainers.length > 0) {
        return recommendationContainers;
      }
      
      return this.findElementsByClassPattern(/recommend|suggest|related|live-recommend/i);
    }, liveUI.showRecommendations);
    
    // 隐藏/显示广告
    this.toggleElement(() => {
      // 查找可能是广告的元素
      const adElements = this.findElementsByStructure({
        text: /广告|推广|ad|promotion/i
      });
      
      if (adElements.length > 0) {
        return adElements.map(el => el.closest('div') || el);
      }
      
      return this.findElementsByClassPattern(/ad|advertisement|promotion|广告/i);
    }, liveUI.showAds);
    
    // 隐藏/显示统计信息
    this.toggleElement(() => {
      // 查找可能包含数字的元素，可能是统计信息
      const numberElements = document.body.querySelectorAll('div');
      const potentialStats = Array.from(numberElements).filter(el => {
        return /\d+/.test(el.textContent);
      });
      
      if (potentialStats.length > 0) {
        return potentialStats;
      }
      
      return this.findElementsByClassPattern(/stat|count|number|view/i);
    }, liveUI.showStats);
    
    // 自定义弹幕样式
    if (liveUI.danmaku) {
      this.customizeDanmaku(liveUI.danmaku);
    }
    
    // 应用自定义布局
    this.applyLayout('live', liveUI.layout);
  }

  /**
   * 切换元素的显示/隐藏
   * @param {string|Function} selectorOrFinder - CSS选择器或元素查找函数
   * @param {boolean} show - 是否显示
   */
  toggleElement(selectorOrFinder, show) {
    let elements = [];
    
    // 检查参数类型
    if (typeof selectorOrFinder === 'function') {
      try {
        // 如果是函数，则调用它来查找元素
        elements = selectorOrFinder();
      } catch (e) {
        console.error('查找元素函数执行失败:', e);
        return;
      }
    } else {
      // 如果是选择器字符串，则使用querySelectorAll
      elements = document.querySelectorAll(selectorOrFinder);
    }
    
    // 确保elements是数组
    if (!Array.isArray(elements)) {
      elements = Array.from(elements);
    }
    
    // 处理元素显示/隐藏
    elements.forEach(function(element) {
      if (element && element.style) {
        if (show) {
          element.style.display = '';
          element.style.visibility = 'visible';
        } else {
          element.style.display = 'none';
          element.style.visibility = 'hidden';
        }
      }
    });
  }
  
  /**
   * 基于结构特征查找元素
   * @param {Object} options - 查找选项
   * @returns {HTMLElement[]} 找到的元素数组
   */
  findElementsByStructure(options) {
    const result = [];
    
    // 根据选项执行不同的查找策略
    if (options.text) {
      // 通过文本内容查找
      const allElements = document.body.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.textContent.includes(options.text)) {
          result.push(el);
        }
      });
    }
    
    if (options.tagName) {
      // 通过标签名初步筛选
      const elements = document.body.querySelectorAll(options.tagName);
      
      // 如果提供了属性，则进一步筛选
      if (options.attributes) {
        elements.forEach(el => {
          let match = true;
          for (const [attr, value] of Object.entries(options.attributes)) {
            if (!el.hasAttribute(attr) || 
                (value && el.getAttribute(attr) !== value)) {
              match = false;
              break;
            }
          }
          if (match) result.push(el);
        });
      } else {
        // 没有属性筛选，直接添加
        result.push(...Array.from(elements));
      }
    }
    
    // 如果提供了子元素结构条件
    if (options.children) {
      const candidates = result.length > 0 ? result : document.body.querySelectorAll('*');
      const filtered = [];
      
      candidates.forEach(parent => {
        let match = true;
        for (const childCriteria of options.children) {
          const selector = childCriteria.tagName;
          let found = false;
          
          // 优化查找逻辑，使用for循环替代forEach以便找到匹配后立即跳出
          const children = parent.querySelectorAll(selector);
          for (let i = 0; i < children.length && !found; i++) {
            const child = children[i];
            // 检查子元素的条件
            let childMatch = true;
            if (childCriteria.text && !child.textContent.includes(childCriteria.text)) {
              childMatch = false;
            }
            
            if (childCriteria.attributes) {
              for (const [attr, value] of Object.entries(childCriteria.attributes)) {
                if (!child.hasAttribute(attr) || 
                    (value && child.getAttribute(attr) !== value)) {
                  childMatch = false;
                  break;
                }
              }
            }
            
            if (childMatch) {
              found = true;
            }
          }
          
          if (!found) {
            match = false;
            break;
          }
        });
        
        if (match) filtered.push(parent);
      });
      
      return filtered;
    }
    
    return result;
  }
  
  /**
   * 查找符合模式的类名
   * @param {RegExp} pattern - 类名匹配模式
   * @param {string} tagName - 可选的标签名限制
   * @returns {HTMLElement[]} 匹配的元素数组
   */
  findElementsByClassPattern(pattern, tagName = '*') {
    const elements = document.querySelectorAll(tagName);
    const result = [];
    
    elements.forEach(el => {
      if (el.className && pattern.test(el.className)) {
        result.push(el);
      }
    });
    
    return result;
  }

  /**
   * 自定义控制栏
   * @param {Object} controlBarConfig - 控制栏配置
   */
  customizeControlBar(controlBarConfig) {
    const controlBar = document.querySelector('.video-control-bar');
    if (!controlBar) return;
    
    // 显示/隐藏控制栏
    if (!controlBarConfig.show) {
      controlBar.style.display = 'none';
      return;
    }
    
    // 设置控制栏位置
    if (controlBarConfig.position) {
      controlBar.style.position = 'absolute';
      switch (controlBarConfig.position) {
        case 'top':
          controlBar.style.top = '0';
          controlBar.style.bottom = 'auto';
          break;
        case 'bottom':
          controlBar.style.bottom = '0';
          controlBar.style.top = 'auto';
          break;
        default:
          controlBar.style.bottom = '0';
      }
    }
    
    // 自动隐藏功能（需要额外的事件监听）
    if (controlBarConfig.autoHide) {
      // 实现自动隐藏逻辑
    }
  }

  /**
   * 自定义弹幕样式
   * @param {Object} danmakuConfig - 弹幕配置
   */
  customizeDanmaku(danmakuConfig) {
    // 添加弹幕样式
    const styleId = 'douyin-danmaku-custom-styles';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    let css = '';
    
    if (danmakuConfig.fontSize) {
      css += `.danmaku { font-size: ${danmakuConfig.fontSize}px !important; }`;
    }
    
    if (danmakuConfig.color) {
      css += `.danmaku { color: ${danmakuConfig.color} !important; }`;
    }
    
    if (danmakuConfig.opacity) {
      css += `.danmaku { opacity: ${danmakuConfig.opacity} !important; }`;
    }
    
    if (danmakuConfig.speed) {
      // 根据速度设置动画时长
      let duration = 6; // 默认6秒
      switch (danmakuConfig.speed) {
        case 'fast':
          duration = 3;
          break;
        case 'slow':
          duration = 10;
          break;
        default:
          duration = 6;
      }
      css += `.danmaku { animation-duration: ${duration}s !important; }`;
    }
    
    styleElement.textContent = css;
  }

  /**
   * 应用自定义布局
   * @param {string} type - 类型（video或live）
   * @param {string} layout - 布局名称
   */
  applyLayout(type, layout) {
    if (!layout || layout === 'default') return;
    
    // 根据不同类型和布局应用相应的样式
    // 这里可以扩展更多布局选项
    console.log(`应用${type}布局：${layout}`);
  }

  /**
   * 显示设置面板
   */
  showSettingsPanel() {
    // 如果设置面板已存在，先移除
    if (this.settingsPanel) {
      this.settingsPanel.remove();
    }
    
    // 创建设置面板
    this.settingsPanel = this.createSettingsPanel();
    document.body.appendChild(this.settingsPanel);
  }

  /**
   * 创建设置面板
   * @returns {HTMLElement} 设置面板元素
   */
  createSettingsPanel() {
    const panel = document.createElement('div');
    panel.className = 'douyin-ui-customizer-panel';
    panel.innerHTML = `
      <div class="panel-header">
        <h2>抖音UI定制设置</h2>
        <button class="close-btn">×</button>
      </div>
      <div class="panel-content">
        <div class="settings-tabs">
          <button class="tab-btn active" data-tab="general">通用设置</button>
          <button class="tab-btn" data-tab="video">短视频设置</button>
          <button class="tab-btn" data-tab="live">直播间设置</button>
          <button class="tab-btn" data-tab="import-export">导入导出</button>
        </div>
        
        <div class="tab-content active" id="general-tab">
          ${this.createGeneralSettings()}
        </div>
        
        <div class="tab-content" id="video-tab">
          ${this.createVideoSettings()}
        </div>
        
        <div class="tab-content" id="live-tab">
          ${this.createLiveSettings()}
        </div>
        
        <div class="tab-content" id="import-export-tab">
          ${this.createImportExportSettings()}
        </div>
      </div>
      <div class="panel-footer">
        <button class="save-btn">保存设置</button>
        <button class="reset-btn">重置为默认</button>
      </div>
    `;
    
    // 添加事件监听
    this.setupSettingsPanelEvents(panel);
    
    return panel;
  }

  /**
   * 设置设置面板的事件监听
   * @param {HTMLElement} panel - 设置面板元素
   */
  setupSettingsPanelEvents(panel) {
    // 关闭按钮
    panel.querySelector('.close-btn').addEventListener('click', () => {
      panel.remove();
    });
    
    // 标签切换
    panel.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        // 移除所有活跃状态
        panel.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // 设置当前活跃状态
        btn.classList.add('active');
        panel.querySelector(`#${tabId}-tab`).classList.add('active');
      });
    });
    
    // 保存按钮
    panel.querySelector('.save-btn').addEventListener('click', () => {
      this.saveSettings(panel);
    });
    
    // 重置按钮
    panel.querySelector('.reset-btn').addEventListener('click', () => {
      if (confirm('确定要重置所有设置吗？')) {
        this.config = resetConfig();
        panel.remove();
        location.reload();
      }
    });
    
    // 添加拖动功能
    this.makePanelDraggable(panel);
  }
  
  /**
   * 使设置面板可拖动
   * @param {HTMLElement} panel - 设置面板元素
   */
  makePanelDraggable(panel) {
    const header = panel.querySelector('.panel-header');
    let isDragging = false;
    let offsetX, offsetY;
    
    // 鼠标按下事件
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      
      // 计算鼠标相对于面板左上角的偏移量
      const panelRect = panel.getBoundingClientRect();
      offsetX = e.clientX - panelRect.left;
      offsetY = e.clientY - panelRect.top;
      
      // 设置面板为绝对定位（如果还不是）
      if (panel.style.position !== 'fixed') {
        panel.style.position = 'fixed';
      }
      
      // 添加拖拽时的视觉效果
      header.style.cursor = 'grabbing';
    });
    
    // 鼠标移动事件（添加到document以允许鼠标移出面板时仍能拖动）
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      // 计算新位置
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;
      
      // 限制在视口范围内
      const panelRect = panel.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      newX = Math.max(0, Math.min(newX, viewportWidth - panelRect.width));
      newY = Math.max(0, Math.min(newY, viewportHeight - panelRect.height));
      
      // 更新面板位置
      panel.style.left = `${newX}px`;
      panel.style.top = `${newY}px`;
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    });
    
    // 鼠标释放事件
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = 'grab';
      }
    });
    
    // 初始化光标样式
    header.style.cursor = 'grab';
    
    // 阻止鼠标按下时的文本选择
    header.addEventListener('selectstart', (e) => {
      e.preventDefault();
    });
  }

  /**
   * 创建通用设置内容
   * @returns {string} HTML字符串
   */
  createGeneralSettings() {
    return `
      <div class="setting-group">
        <h3>主题设置</h3>
        <label>
          <input type="radio" name="theme" value="light" ${this.config.theme === 'light' ? 'checked' : ''}>
          浅色主题
        </label>
        <label>
          <input type="radio" name="theme" value="dark" ${this.config.theme === 'dark' ? 'checked' : ''}>
          深色主题
        </label>
      </div>
      
      <div class="setting-group">
        <h3>播放设置</h3>
        <label>
          <input type="checkbox" id="autoPlay" ${this.config.general?.autoPlay ? 'checked' : ''}>
          自动播放视频
        </label>
        <label>
          <input type="checkbox" id="autoScroll" ${this.config.general?.autoScroll ? 'checked' : ''}>
          自动滚动到下一个视频
        </label>
      </div>
      
      <div class="setting-group">
        <h3>功能设置</h3>
        <label>
          <input type="checkbox" id="keyboardShortcuts" ${this.config.general?.keyboardShortcuts ? 'checked' : ''}>
          启用键盘快捷键
        </label>
        <label>
          <input type="checkbox" id="notifications" ${this.config.general?.notifications ? 'checked' : ''}>
          启用通知提醒
        </label>
      </div>
    `;
  }

  /**
   * 创建短视频设置内容
   * @returns {string} HTML字符串
   */
  createVideoSettings() {
    return `
      <div class="setting-group">
        <h3>显示元素</h3>
        <label>
          <input type="checkbox" id="showLikeButton" ${this.config.videoUI?.showLikeButton ? 'checked' : ''}>
          显示点赞按钮
        </label>
        <label>
          <input type="checkbox" id="showCommentButton" ${this.config.videoUI?.showCommentButton ? 'checked' : ''}>
          显示评论按钮
        </label>
        <label>
          <input type="checkbox" id="showShareButton" ${this.config.videoUI?.showShareButton ? 'checked' : ''}>
          显示分享按钮
        </label>
        <label>
          <input type="checkbox" id="showAuthorInfo" ${this.config.videoUI?.showAuthorInfo ? 'checked' : ''}>
          显示作者信息
        </label>
        <label>
          <input type="checkbox" id="showMusicInfo" ${this.config.videoUI?.showMusicInfo ? 'checked' : ''}>
          显示音乐信息
        </label>
        <label>
          <input type="checkbox" id="showDescription" ${this.config.videoUI?.showDescription ? 'checked' : ''}>
          显示视频描述
        </label>
        <label>
          <input type="checkbox" id="showRecommendations" ${this.config.videoUI?.showRecommendations ? 'checked' : ''}>
          显示推荐视频
        </label>
      </div>
      
      <div class="setting-group">
        <h3>控制栏设置</h3>
        <label>
          <input type="checkbox" id="controlBarShow" ${this.config.videoUI?.controlBar?.show ? 'checked' : ''}>
          显示控制栏
        </label>
        <label>
          <input type="checkbox" id="controlBarAutoHide" ${this.config.videoUI?.controlBar?.autoHide ? 'checked' : ''}>
          自动隐藏控制栏
        </label>
        <label>
          <select id="controlBarPosition">
            <option value="bottom" ${this.config.videoUI?.controlBar?.position === 'bottom' ? 'selected' : ''}>底部</option>
            <option value="top" ${this.config.videoUI?.controlBar?.position === 'top' ? 'selected' : ''}>顶部</option>
          </select>
          控制栏位置
        </label>
      </div>
    `;
  }

  /**
   * 创建直播间设置内容
   * @returns {string} HTML字符串
   */
  createLiveSettings() {
    return `
      <div class="setting-group">
        <h3>显示元素</h3>
        <label>
          <input type="checkbox" id="showGifts" ${this.config.liveUI?.showGifts ? 'checked' : ''}>
          显示礼物动画
        </label>
        <label>
          <input type="checkbox" id="showDanmaku" ${this.config.liveUI?.showDanmaku ? 'checked' : ''}>
          显示弹幕
        </label>
        <label>
          <input type="checkbox" id="showRecommendations" ${this.config.liveUI?.showRecommendations ? 'checked' : ''}>
          显示推荐直播
        </label>
        <label>
          <input type="checkbox" id="showAds" ${this.config.liveUI?.showAds ? 'checked' : ''}>
          显示广告
        </label>
        <label>
          <input type="checkbox" id="showStats" ${this.config.liveUI?.showStats ? 'checked' : ''}>
          显示统计信息
        </label>
      </div>
      
      <div class="setting-group">
        <h3>弹幕设置</h3>
        <label>
          <input type="number" id="danmakuFontSize" min="12" max="36" value="${this.config.liveUI?.danmaku?.fontSize || 16}">
          字体大小（px）
        </label>
        <label>
          <input type="color" id="danmakuColor" value="${this.config.liveUI?.danmaku?.color || '#FFFFFF'}">
          字体颜色
        </label>
        <label>
          <input type="range" id="danmakuOpacity" min="0.1" max="1" step="0.1" value="${this.config.liveUI?.danmaku?.opacity || 0.8}">
          透明度: <span id="opacityValue">${this.config.liveUI?.danmaku?.opacity || 0.8}</span>
        </label>
        <label>
          <select id="danmakuSpeed">
            <option value="slow" ${this.config.liveUI?.danmaku?.speed === 'slow' ? 'selected' : ''}>慢速</option>
            <option value="medium" ${this.config.liveUI?.danmaku?.speed === 'medium' ? 'selected' : ''}>中速</option>
            <option value="fast" ${this.config.liveUI?.danmaku?.speed === 'fast' ? 'selected' : ''}>快速</option>
          </select>
          弹幕速度
        </label>
      </div>
    `;
  }

  /**
   * 创建导入导出设置内容
   * @returns {string} HTML字符串
   */
  createImportExportSettings() {
    return `
      <div class="setting-group">
        <h3>导出配置</h3>
        <button id="exportBtn">导出配置</button>
        <p>点击按钮导出当前配置到JSON文件</p>
      </div>
      
      <div class="setting-group">
        <h3>导入配置</h3>
        <input type="file" id="importFile" accept=".json">
        <button id="importBtn">导入配置</button>
        <p>选择JSON配置文件并点击导入</p>
      </div>
    `;
  }

  /**
   * 显示提示消息
   * @param {string} message - 提示消息内容
   * @param {string} type - 提示类型：success, error, info
   */
  showNotification(message, type = 'success') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `douyin-ui-customizer-notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '6px',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: '999999',
      opacity: '0',
      transform: 'translateX(100%)',
      transition: 'all 0.3s ease-out',
      backgroundColor: type === 'success' ? '#52c41a' : 
                       type === 'error' ? '#ff4d4f' : '#1890ff',
      maxWidth: '300px',
      wordWrap: 'break-word'
    });
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
      Object.assign(notification.style, {
        opacity: '1',
        transform: 'translateX(0)'
      });
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
      Object.assign(notification.style, {
        opacity: '0',
        transform: 'translateX(100%)'
      });
      
      // 移除元素
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  /**
   * 保存设置
   * @param {HTMLElement} panel - 设置面板元素
   */
  saveSettings(panel) {
    try {
      // 保存通用设置
      this.config.theme = panel.querySelector('input[name="theme"]:checked').value;
      
      if (!this.config.general) {
        this.config.general = {};
      }
      this.config.general.autoPlay = panel.querySelector('#autoPlay').checked;
      this.config.general.autoScroll = panel.querySelector('#autoScroll').checked;
      this.config.general.keyboardShortcuts = panel.querySelector('#keyboardShortcuts').checked;
      this.config.general.notifications = panel.querySelector('#notifications').checked;
      
      // 保存短视频设置
      if (!this.config.videoUI) {
        this.config.videoUI = {};
      }
      this.config.videoUI.showLikeButton = panel.querySelector('#showLikeButton').checked;
      this.config.videoUI.showCommentButton = panel.querySelector('#showCommentButton').checked;
      this.config.videoUI.showShareButton = panel.querySelector('#showShareButton').checked;
      this.config.videoUI.showAuthorInfo = panel.querySelector('#showAuthorInfo').checked;
      this.config.videoUI.showMusicInfo = panel.querySelector('#showMusicInfo').checked;
      this.config.videoUI.showDescription = panel.querySelector('#showDescription').checked;
      this.config.videoUI.showRecommendations = panel.querySelector('#showRecommendations').checked;
      
      if (!this.config.videoUI.controlBar) {
        this.config.videoUI.controlBar = {};
      }
      this.config.videoUI.controlBar.show = panel.querySelector('#controlBarShow').checked;
      this.config.videoUI.controlBar.autoHide = panel.querySelector('#controlBarAutoHide').checked;
      this.config.videoUI.controlBar.position = panel.querySelector('#controlBarPosition').value;
      
      // 保存直播间设置
      if (!this.config.liveUI) {
        this.config.liveUI = {};
      }
      this.config.liveUI.showGifts = panel.querySelector('#showGifts').checked;
      this.config.liveUI.showDanmaku = panel.querySelector('#showDanmaku').checked;
      this.config.liveUI.showRecommendations = panel.querySelector('#showRecommendations').checked;
      this.config.liveUI.showAds = panel.querySelector('#showAds').checked;
      this.config.liveUI.showStats = panel.querySelector('#showStats').checked;
      
      if (!this.config.liveUI.danmaku) {
        this.config.liveUI.danmaku = {};
      }
      this.config.liveUI.danmaku.fontSize = parseInt(panel.querySelector('#danmakuFontSize').value);
      this.config.liveUI.danmaku.color = panel.querySelector('#danmakuColor').value;
      this.config.liveUI.danmaku.opacity = parseFloat(panel.querySelector('#danmakuOpacity').value);
      this.config.liveUI.danmaku.speed = panel.querySelector('#danmakuSpeed').value;
      
      // 保存配置
      saveConfig(this.config);
      
      // 为确保配置完全保存，添加一个小延迟后再应用设置
      setTimeout(() => {
        // 应用新设置
        injectStyles(this.config.theme);
        
        // 强制重新应用UI定制
        if (isVideoPage()) {
          // 清除现有样式并重新应用
          const customStyle = document.getElementById('douyin-ui-customizer-custom');
          if (customStyle) {
            customStyle.remove();
          }
          this.applyVideoCustomizations();
        }
        if (isLivePage()) {
          // 清除现有样式并重新应用
          const customStyle = document.getElementById('douyin-ui-customizer-custom');
          if (customStyle) {
            customStyle.remove();
          }
          this.applyLiveCustomizations();
        }
        
        // 显示保存成功提示
        this.showNotification('设置已成功保存并应用！', 'success');
        
        // 延迟关闭设置面板
        setTimeout(() => {
          panel.remove();
        }, 300);
      }, 100);
    } catch (error) {
      console.error('保存设置失败:', error);
      this.showNotification('保存设置失败，请重试', 'error');
    }
  }
}