# 抖音UI定制器版本历史

## 2.2.0 (2026-08-10)

- **重构（refactor）**: 继续拆分超 200 行文件为单一职责子模块
  - `config.ts` → `configCore.ts`、`configDefaults.ts`（配置核心逻辑与默认项抽离）
  - `controllers/elementController.ts` → `controllers/elementHelpers.ts`
  - `controllers/layoutController.ts` → `controllers/layoutDefaults.ts`、`controllers/layoutHelpers.ts`
  - `styles/theme.ts` → `styles/defaultThemes.ts`、`styles/themeIO.ts`、`styles/themeManager.ts`、`styles/themeOperations.ts`、`styles/themeTypes.ts`
  - `ui_manager.ts` → `ui_manager/customAsset.ts`、`ui_manager/injectStyles.ts`
  - `utils/autoExecutor.ts` → `utils/autoExecutorClicker.ts`、`utils/autoExecutorDetection.ts`、`utils/autoExecutorTypes.ts`
  - `utils/performance.ts` → `utils/performanceMonitor.ts`、`utils/performanceReporting.ts`、`utils/performanceTypes.ts`
- **规范（style）**: 主文件仅保留编排逻辑，re-export 子模块，导出契约稳定
- **chore**: 同步所有文件版本号至 v2.2.0

## 2.1.0 (2026-08-10)

- **重构（refactor）**: 统一单一入口，消除 `main.ts` 与 `index.ts` 双入口重复初始化冲突
  - `main.ts` 改为单例初始化（DOMContentLoaded 一次性触发，移除 setInterval 轮询与重复执行）
  - `index.ts` 降级为纯库 re-export，不再初始化或重复暴露全局对象
- **新增（feat）**: 国际化（i18n）系统，支持中文 / English 界面实时切换
  - 新增 `src/i18n` 模块，集中字典 + `t()`/`setLocale()`，所有 UI 文案接入
- **重构（refactor）**: 拆分超 200 行文件为合理模块，单一职责
  - `ui_manager.ts` → `ui_manager/panelRenderer.ts`、`ui_manager/themeApplier.ts`、`ui_manager/settingsSaver.ts`
  - `utils/dom.ts`(433行) → `dom/cache.ts`、`dom/events.ts`、`dom/factory.ts`、`dom/styleOps.ts`
  - `utils/autoExecutor.ts`(372行) → `autoExecutor/helpers.ts`
- **修复（fix）**: 消除 UI 重复创建（移除冗余固定面板，统一悬浮按钮 + 弹窗模式）
- **修复（fix）**: 类型与一致性错误
  - `config.ts` 修正 `.ts` 扩展名 import、移除不存在的 `getNestedItem/setNestedItem` 引用、版本号从 `version.ts` 导入
  - `types/index.ts` 的 `AppConfig` 扩展为权威配置类型，统一 `Config` 与之对齐
- **安全（fix）**: 自定义脚本/样式注入加固
  - 自定义 CSS 改用 `textContent` 注入，避免 `innerHTML` 注入
  - 自定义脚本禁止 `eval`/`Function`/`innerHTML`/`document.write`，仅允许远程 `<script src>` 或受控内联
  - `storage.ts` 在非浏览器环境安全降级为内存存储（规避 `localStorage` ReferenceError）
- **修复（fix）**: 移除 `autoExecutor` 中的 `as any`，改为类型安全判断
- **规范（style）**: 所有 UI 容器补充语义化 `id`（面板、悬浮按钮、区块、复选框、保存按钮等）
- **chore**: 新增集中版本管理 `src/version.ts`；同步所有文件版本号至 v2.1.0
- **test**: 新增 jest 测试套件（`tests/*.test.ts`），覆盖 i18n / config / storage / utils / version 核心逻辑
- 对齐 `openspec` 规范文档版本至 2.1.0

## 2.0.4 (2026-06-08)

- 修复 README.md 徽章链接语法错误
- 完善徽章链接，添加可点击跳转功能
- 同步所有文件版本号至 v2.0.4

## 2.0.3 (2026-06-08)

- 统一项目文档编码为 UTF-8
- 完善 README 文档结构，增加徽章和版本信息
- 更新构建流程，将构建输出目录改为 `build/`
- 优化项目文件组织，清理不必要的测试和构建产物
- 更新所有版本号至 v2.0.3
- 增强项目规范文档

## 2.0.2

- TypeScript 类型定义迁移完成
- 新增完整的类型安全支持
- 优化配置管理系统，增加配置迁移功能
- 新增性能监控和日志系统优化
- 新增高级弹幕设置功能（最大行数、位置控制）
- 完善测试框架和测试用例
- 更新构建系统，支持 TypeScript 构建

## 2.0.1

- 修复 TypeScript 构建问题
- 优化错误处理和日志系统
- 改进配置导入导出功能

## 2.0.0

- 完整的 TypeScript 重构
- 重写架构，模块化设计
- 新增事件驱动系统
- 完整的类型系统
- 增强的配置管理和迁移
- 新的用户界面设计

## 1.2.0

- 新增控制器模块（elementController, layoutController）
- 新增UI组件系统（面板拖拽、设置面板、视频/直播间定制）
- 新增工具函数（autoExecutor, dom, eventEmitter, logger, performance, storage）
- 新增主题系统（浅色/深色/极简主题支持）
- 新增布局管理模块
- 新增类型定义文件（TypeScript迁移中）
- 新增测试目录和测试用例
- 新增TypeScript迁移计划文档
- 优化性能监控和日志系统
- 完善弹幕样式自定义功能（字体、颜色、透明度、速度、位置）
- 增加音量控制功能

## 1.1.0

- 统一项目文档编码为UTF-8无BOM，换行符为Unix LF
- 修复文档中的乱码问题
- 更新并规范化所有文档结构
- 新增文档规范和术语表
- 完善API文档和功能说明文档
- 优化README文档结构，适合GitHub展示
- 增加技术架构说明
- 合并重复的更新日志条目

## 1.0.2 - 1.0.146

- 修复项目源代码中的语法错误和规范问题

## 1.0.1

- 修复项目源代码中的导入错误、日志使用错误和缩进问题，确保代码规范一致性

## 1.0.0

- 初始版本发布
