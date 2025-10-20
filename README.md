# 抖音Web端界面UI定制工具

## 项目简介
这是一个基于油猴脚本的抖音Web端界面UI定制工具，可以帮助用户自定义抖音短视频和直播间的界面元素，实现界面净化、功能增强等效果，提供更舒适的观看体验。

## 功能特性

### 短视频界面定制
- 隐藏/显示点赞、评论、分享按钮
- 自定义视频播放控制栏样式
- 隐藏/显示作者信息和头像
- 隐藏/显示音乐信息和视频描述
- 调整界面元素布局
- 自定义背景色和主题

### 直播间界面定制
- 隐藏/显示礼物动画和特效（增强版，支持隐藏所有礼物相关元素）
- 自定义弹幕样式（字体大小、颜色、透明度、速度）
- 隐藏/显示直播间推荐和广告
- 隐藏/显示直播间统计信息
- 调整直播画面比例和大小

### 通用功能
- 设置面板拖拽功能（支持自由拖动调整位置）
- 界面元素拖拽重排
- 样式自定义（颜色、字体、大小等）
- 配置导出和导入
- 暗黑模式支持
- 优雅的设置保存提示（右侧滑入式通知）
- 配置错误处理和提示
- 自动版本更新检查
- 设置保存后即时应用UI更改

## 安装方法

### 方法一：通过Tampermonkey官方页面一键导入
1. 确保已安装油猴浏览器扩展：
   - Chrome/Edge: [Tampermonkey](https://www.tampermonkey.net/)
   - Firefox: [Greasemonkey](https://addons.mozilla.org/zh-CN/firefox/addon/greasemonkey/)
2. 点击以下按钮：
   <a href="https://www.tampermonkey.net/script_installation.php#url=https://github.com/SutChan/douyin_tool/raw/main/dist/douyin_ui_customizer.user.js" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; font-size: 16px; border-radius: 5px; margin: 10px 0; font-weight: bold;">🔄 一键安装脚本 🔄</a>
3. 油猴扩展会自动弹出安装确认窗口，点击安装即可

### 方法二：本地一键导入（适合本地开发）
1. 确保已安装油猴浏览器扩展：
   - Chrome/Edge: [Tampermonkey](https://www.tampermonkey.net/)
   - Firefox: [Greasemonkey](https://addons.mozilla.org/zh-CN/firefox/addon/greasemonkey/)
2. 运行构建命令生成最新脚本：`npm run build`
3. 双击打开项目根目录下的`install.html`文件
4. 在打开的页面中点击「一键导入到油猴」按钮
5. 油猴扩展会自动弹出安装确认窗口，点击安装即可

### 方法三：本地构建（推荐）
1. 克隆项目：`git clone https://github.com/SutChan/douyin_tool.git`
2. 安装依赖：`npm install`
3. 构建脚本：`npm run build`
4. 在油猴中安装生成的脚本：打开`dist/douyin_ui_customizer.user.js`文件并复制内容，然后在油猴扩展中创建新脚本并粘贴

### 方法四：直接使用
1. 安装油猴浏览器扩展：
   - Chrome/Edge: [Tampermonkey](https://www.tampermonkey.net/)
   - Firefox: [Greasemonkey](https://addons.mozilla.org/zh-CN/firefox/addon/greasemonkey/)
2. 在油猴扩展中创建新脚本
3. 运行项目的构建命令：`npm run build`
4. 打开生成的`dist/douyin_ui_customizer.user.js`文件，复制全部内容到油猴新脚本中
5. 保存并启用脚本

## 使用说明

1. 安装完成后访问[抖音网页版](https://www.douyin.com/)
2. 点击油猴扩展图标，选择本脚本的设置选项
3. 在弹出的设置面板中根据需要调整各种界面元素
4. 点击保存按钮，将显示优雅的保存成功通知，设置立即生效

### 使用技巧

#### 礼物隐藏功能
要完全隐藏直播间中的礼物内容：
1. 进入设置面板的「直播间设置」标签页
2. 取消勾选「显示礼物动画」选项
3. 点击保存按钮
此设置会隐藏所有礼物相关元素，包括礼物动画、礼物区、礼物按钮等，提供更干净的观看体验。

#### 配置管理
- 使用「导出配置」按钮保存您的个性化设置
- 通过「导入配置」按钮在不同浏览器或设备间恢复设置
- 如遇界面异常，可点击「重置」按钮恢复默认配置

## 注意事项

- 由于抖音可能会更新其网页结构，某些功能可能需要定期更新以保持兼容性
- 部分高级自定义功能可能需要浏览器权限
- 修改源代码后，务必重新构建并更新油猴脚本以应用更改

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
      ├── dom.js      # DOM操作工具函数
      └── storage.js  # 本地存储工具函数
dist/                 # 构建输出目录
docs/                 # 文档目录
  ├── README.md           # 文档目录说明
  ├── 6a_workflow_rules.md # 6A工作流规则
  ├── development_guide.md # 开发指南
  ├── api_documentation.md # API文档
  ├── user_guide.md        # 用户指南
  ├── contributing_guide.md # 贡献指南
  └── CHANGELOG.md         # 更新日志
build.js              # 构建脚本（支持自动版本号递增）
package.json          # 项目配置和依赖
README.md             # 项目说明文档
```

### 开发说明

#### 自动版本号递增
项目构建脚本已配置为自动递增最小版本号（patch version）。每次运行构建命令时，`package.json`中的版本号最后一位会自动加1，确保每次构建都有唯一的版本标识。

#### 构建过程
1. 安装依赖：`npm install`
2. 构建脚本：`npm run build`
3. 构建完成后，会在`dist`目录生成更新后的脚本文件

#### 项目特点
- 模块化设计，各功能组件独立分离
- 完善的错误处理和兼容性处理
- 自动化的版本管理
- 清晰的代码注释和文档

### 开发步骤
1. 克隆项目：`git clone https://github.com/SutChan/douyin_tool.git`
2. 安装依赖：`npm install`
3. 修改源代码
4. 构建脚本：`npm run build`
5. 测试脚本：在油猴中安装`dist/douyin_ui_customizer.user.js`

### 详细文档
更多详细文档请查看项目的[docs目录](docs/README.md)，包括：

- [开发指南](docs/development_guide.md) - 详细的开发环境搭建和开发流程说明
- [API文档](docs/api_documentation.md) - 核心函数和类的使用说明
- [用户指南](docs/user_guide.md) - 详细的安装、配置和使用指南
- [贡献指南](docs/contributing_guide.md) - 如何为项目做贡献
- [更新日志](docs/CHANGELOG.md) - 版本历史和功能变更记录

## 许可证
MIT

## 作者
SutChan

## 更新日志

### 最新版本
- 增强版礼物隐藏功能，支持隐藏更多礼物相关元素
- 新增优雅的右侧滑入式通知系统
- 添加配置错误处理和提示
- 优化代码结构和性能