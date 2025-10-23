const fs = require('fs');
const path = require('path');

// 读取package.json获取版本信息
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

// 日志函数
function log(message, level = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const levelPrefix = level.toUpperCase().padStart(5);
  console.log(`[${timestamp}] [${levelPrefix}] ${message}`);
}

// 检查文件是否存在
function checkFileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    log(`错误：文件不存在: ${filePath}`, 'error');
    return false;
  }
}

// 读取文件内容
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`错误：读取文件失败: ${filePath}`, 'error');
    process.exit(1);
  }
}

// 生成油猴脚本头部
function generateUserscriptHeader() {
  return `// ==UserScript==
// @name         抖音UI定制器
// @namespace    https://github.com/sutchan/douyin_tool
// @version      ${pkg.version}
// @description  自定义抖音界面，提供暗黑模式和UI调整
// @author       Sut
// @match        https://www.douyin.com/*
// @match        https://www.douyin.com
// @match        https://www.douyin.com/search/*
// @match        https://www.douyin.com/user/*
// @match        https://www.douyin.com/video/*
// @match        https://www.douyin.com/live/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// ==/UserScript==`;
}

// 构建脚本
async function build() {
  const startTime = Date.now();
  log('开始构建...');
  
  try {
    // 检查必要的文件是否存在
    log('正在检查必要文件...', 'verbose');
    const requiredFiles = [
      path.join(__dirname, 'src', 'main.js'),
      path.join(__dirname, 'src', 'config.js'),
      path.join(__dirname, 'src', 'ui_manager.js'),
      path.join(__dirname, 'src', 'utils', 'dom.js'),
      path.join(__dirname, 'src', 'utils', 'storage.js'),
      path.join(__dirname, 'src', 'styles', 'default.css'),
      path.join(__dirname, 'src', 'styles', 'dark.css')
    ];
    
    for (const file of requiredFiles) {
      if (!checkFileExists(file)) {
        process.exit(1);
      }
    }
    
    // 读取所有JS文件
    log('正在读取文件...');
    const mainJS = readFile(path.join(__dirname, 'src', 'main.js'));
    const configJS = readFile(path.join(__dirname, 'src', 'config.js'));
    const uiManagerJS = readFile(path.join(__dirname, 'src', 'ui_manager.js'));
    const domUtilsJS = readFile(path.join(__dirname, 'src', 'utils', 'dom.js'));
    const storageUtilsJS = readFile(path.join(__dirname, 'src', 'utils', 'storage.js'));
    
    // 读取CSS文件
    const defaultCSS = readFile(path.join(__dirname, 'src', 'styles', 'default.css'));
    const darkCSS = readFile(path.join(__dirname, 'src', 'styles', 'dark.css'));
    
    log('文件读取完成，开始合并...');
    
    // 合并代码
    let combinedJS = "";
    
    // 1. CSS样式定义
    log('合并CSS样式定义...', 'verbose');
    combinedJS += "// CSS样式定义\n";
    // 使用更安全的方式处理CSS内容
    const cleanCSS = (css) => {
      return css
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n');
    };
    
    combinedJS += "const defaultStyles = '" + cleanCSS(defaultCSS) + "';\n";
    combinedJS += "const darkStyles = '" + cleanCSS(darkCSS) + "';\n\n";
    
    // 2. 工具函数模块
    log('合并工具函数模块...', 'verbose');
    combinedJS += "// 工具函数模块\n" + domUtilsJS + "\n\n";
    
    // 3. 存储工具模块
    log('合并存储工具模块...', 'verbose');
    combinedJS += "// 存储工具模块\n" + storageUtilsJS + "\n\n";
    
    // 4. 配置管理模块
    log('合并配置管理模块...', 'verbose');
    combinedJS += "// 配置管理模块\n" + configJS + "\n\n";
    
    // 5. UI管理器模块
    log('合并UI管理器模块...', 'verbose');
    combinedJS += "// UI管理器模块\n" + uiManagerJS + "\n\n";
    
    // 6. 主脚本逻辑
    log('合并主脚本逻辑...', 'verbose');
    combinedJS += "// 主脚本逻辑\n";
    // 提取main.js中油猴脚本元数据之后的内容
    let mainJSContent = mainJS;
    const metaEndIndex = mainJS.indexOf('// ==/UserScript==');
    if (metaEndIndex !== -1) {
      mainJSContent = mainJS.substring(metaEndIndex + 17);
    }
    // 更新版本号
    const updatedMainJS = mainJSContent.replace(/const CURRENT_VERSION = '[^']+'/, `const CURRENT_VERSION = '${pkg.version}'`);
    combinedJS += updatedMainJS;
    
    log('代码合并完成！');
    
    // 生成最终脚本
    const header = generateUserscriptHeader();
    let finalScript = header + "\n\n" + combinedJS;
    
    // 简单的语法修复
    finalScript = finalScript.replace(/\{\s*,/g, '{');
    finalScript = finalScript.replace(/const DEFAULT_CONFIG = \{,/g, 'const DEFAULT_CONFIG = {');
    finalScript = finalScript.replace(/\}\s*function loadConfig/g, '};\nfunction loadConfig');
    // 修复孤立的等号
    finalScript = finalScript.replace(/^\s*=\s*$/gm, '');
    // 确保模块导出语句后的代码正确
    finalScript = finalScript.replace(/export default UIManager;\s*=\s*/g, 'export default UIManager;\n')
    
    // 写入文件
    const outputPath = path.join(__dirname, 'dist', 'douyin_ui_customizer.user.js');
    try {
      fs.writeFileSync(outputPath, finalScript, 'utf8');
      log(`文件写入成功：${outputPath}`);
      
      // 验证输出文件大小
      const stats = fs.statSync(outputPath);
      log(`输出文件大小：${(stats.size / 1024).toFixed(2)} KB`, 'verbose');
      
      // 语法检查
      log('正在验证生成文件的语法...');
      try {
        // 使用更安全的方式进行语法检查
        const { execSync } = require('child_process');
        execSync(`node -c "${outputPath}"`, { stdio: 'ignore' });
        log('语法检查通过！文件没有语法错误。');
      } catch (error) {
        log('警告：生成的文件存在语法错误！', 'warn');
        log('请使用 `node -c dist/douyin_ui_customizer.user.js` 检查具体错误', 'warn');
      }
      
    } catch (error) {
      log(`错误：写入文件失败: ${error.message}`, 'error');
      process.exit(1);
    }
    
    const endTime = Date.now();
    log(`构建完成！耗时：${((endTime - startTime) / 1000).toFixed(3)} 秒`);
    log(`构建详情：版本 ${pkg.version}, 生产模式: false`);
    
  } catch (error) {
    log(`构建过程中发生错误: ${error.message}`, 'error');
    process.exit(1);
  }
}

// 执行构建
build();