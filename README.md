# 抖音Web端界面UI定制工具

## 项目简介
这是一个基于油猴脚本的抖音Web端界面UI定制工具，可以帮助用户自定义抖音短视频和直播间的界面元素，实现界面净化、功能增强等效果。

## 功能特性

### 短视频界面定制
- 隐藏/显示点赞、评论、分享按钮
- 自定义视频播放控制栏样式
- 隐藏/显示作者信息和头像
- 调整界面元素布局
- 自定义背景色和主题

### 直播间界面定制
- 隐藏/显示礼物动画和特效
- 自定义弹幕样式和显示位置
- 隐藏/显示直播间推荐和广告
- 调整直播画面比例和大小

### 通用功能
- 界面元素拖拽重排
- 样式自定义（颜色、字体、大小等）
- 配置导出和导入
- 暗黑模式支持

## 安装方法

1. 安装油猴浏览器扩展：
   - Chrome/Edge: [Tampermonkey](https://www.tampermonkey.net/)
   - Firefox: [Greasemonkey](https://addons.mozilla.org/zh-CN/firefox/addon/greasemonkey/)

2. 点击[此处](https://github.com/SutChan/douyin_tool/raw/main/dist/douyin_ui_customizer.user.js)安装脚本

## 使用说明

1. 安装完成后访问[抖音网页版](https://www.douyin.com/)
2. 点击油猴扩展图标，选择本脚本的设置选项
3. 在弹出的设置面板中根据需要调整各种界面元素
4. 点击保存按钮，设置将立即生效

## 自定义开发

### 项目结构
```
src/
  ├── main.js         # 主脚本入口
  ├── config.js       # 配置管理
  ├── ui_manager.js   # UI元素管理
  ├── styles/
  │   ├── default.css # 默认样式
  │   └── dark.css    # 暗黑模式样式
  └── utils/
      ├── dom.js      # DOM操作工具
      └── storage.js  # 本地存储工具
dist/                 # 构建输出目录
build.js              # 构建脚本
package.json          # 项目配置
```

### 开发步骤
1. 克隆项目：`git clone https://github.com/SutChan/douyin_tool.git`
2. 安装依赖：`npm install`
3. 修改源代码
4. 构建脚本：`npm run build`
5. 测试脚本：在油猴中安装`dist/douyin_ui_customizer.user.js`

## 许可证
MIT

## 作者
SutChan