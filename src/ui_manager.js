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
    
    // 隐藏/显示点赞按钮
    this.toggleElement('.like-button', videoUI.showLikeButton);
    
    // 隐藏/显示评论按钮
    this.toggleElement('.comment-button', videoUI.showCommentButton);
    
    // 隐藏/显示分享按钮
    this.toggleElement('.share-button', videoUI.showShareButton);
    
    // 隐藏/显示作者信息
    this.toggleElement('.author-info', videoUI.showAuthorInfo);
    
    // 隐藏/显示音乐信息
    this.toggleElement('.music-info', videoUI.showMusicInfo);
    
    // 隐藏/显示描述
    this.toggleElement('.video-description', videoUI.showDescription);
    
    // 隐藏/显示推荐
    this.toggleElement('.video-recommendations', videoUI.showRecommendations);
    
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
    
    // 隐藏/显示礼物
    this.toggleElement('.gift-animation, .gift-container', liveUI.showGifts);
    
    // 隐藏/显示弹幕
    this.toggleElement('.danmaku-container', liveUI.showDanmaku);
    
    // 隐藏/显示推荐
    this.toggleElement('.live-recommendations', liveUI.showRecommendations);
    
    // 隐藏/显示广告
    this.toggleElement('.live-ads', liveUI.showAds);
    
    // 隐藏/显示统计信息
    this.toggleElement('.live-stats', liveUI.showStats);
    
    // 自定义弹幕样式
    if (liveUI.danmaku) {
      this.customizeDanmaku(liveUI.danmaku);
    }
    
    // 应用自定义布局
    this.applyLayout('live', liveUI.layout);
  }

  /**
   * 切换元素的显示/隐藏
   * @param {string} selector - CSS选择器
   * @param {boolean} show - 是否显示
   */
  toggleElement(selector, show) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (show) {
        element.style.display = '';
        element.style.visibility = 'visible';
      } else {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
      }
    });
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
      this.config.general.autoPlay = panel.getElementById('autoPlay').checked;
      this.config.general.autoScroll = panel.getElementById('autoScroll').checked;
      this.config.general.keyboardShortcuts = panel.getElementById('keyboardShortcuts').checked;
      this.config.general.notifications = panel.getElementById('notifications').checked;
      
      // 保存短视频设置
      if (!this.config.videoUI) {
        this.config.videoUI = {};
      }
      this.config.videoUI.showLikeButton = panel.getElementById('showLikeButton').checked;
      this.config.videoUI.showCommentButton = panel.getElementById('showCommentButton').checked;
      this.config.videoUI.showShareButton = panel.getElementById('showShareButton').checked;
      this.config.videoUI.showAuthorInfo = panel.getElementById('showAuthorInfo').checked;
      this.config.videoUI.showMusicInfo = panel.getElementById('showMusicInfo').checked;
      this.config.videoUI.showDescription = panel.getElementById('showDescription').checked;
      this.config.videoUI.showRecommendations = panel.getElementById('showRecommendations').checked;
      
      if (!this.config.videoUI.controlBar) {
        this.config.videoUI.controlBar = {};
      }
      this.config.videoUI.controlBar.show = panel.getElementById('controlBarShow').checked;
      this.config.videoUI.controlBar.autoHide = panel.getElementById('controlBarAutoHide').checked;
      this.config.videoUI.controlBar.position = panel.getElementById('controlBarPosition').value;
      
      // 保存直播间设置
      if (!this.config.liveUI) {
        this.config.liveUI = {};
      }
      this.config.liveUI.showGifts = panel.getElementById('showGifts').checked;
      this.config.liveUI.showDanmaku = panel.getElementById('showDanmaku').checked;
      this.config.liveUI.showRecommendations = panel.getElementById('showRecommendations').checked;
      this.config.liveUI.showAds = panel.getElementById('showAds').checked;
      this.config.liveUI.showStats = panel.getElementById('showStats').checked;
      
      if (!this.config.liveUI.danmaku) {
        this.config.liveUI.danmaku = {};
      }
      this.config.liveUI.danmaku.fontSize = parseInt(panel.getElementById('danmakuFontSize').value);
      this.config.liveUI.danmaku.color = panel.getElementById('danmakuColor').value;
      this.config.liveUI.danmaku.opacity = parseFloat(panel.getElementById('danmakuOpacity').value);
      this.config.liveUI.danmaku.speed = panel.getElementById('danmakuSpeed').value;
      
      // 保存配置
      saveConfig(this.config);
      
      // 应用新设置
      injectStyles(this.config.theme);
      
      if (isVideoPage()) {
        this.applyVideoCustomizations();
      }
      if (isLivePage()) {
        this.applyLiveCustomizations();
      }
      
      // 显示保存成功提示
      this.showNotification('设置已成功保存！', 'success');
    } catch (error) {
      console.error('保存设置失败:', error);
      this.showNotification('保存设置失败，请重试', 'error');
    }
  }
}