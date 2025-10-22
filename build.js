const fs = require('fs');
const path = require('path');

// 构建配置选项
const BUILD_OPTIONS = {
  production: process.argv.includes('--production'),
  skipVersionIncrement: process.argv.includes('--skip-version'),
  verbose: process.argv.includes('--verbose')
};

// 日志函数
function log(message, level = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  if (level === 'error') {
    console.error(`[${timestamp}] [ERROR] ${message}`);
  } else if (level === 'warn') {
    console.warn(`[${timestamp}] [WARN] ${message}`);
  } else if (BUILD_OPTIONS.verbose || level === 'info') {
    console.log(`[${timestamp}] [INFO] ${message}`);
  }
}

// 创建输出目录
const distDir = path.join(__dirname, 'dist');
try {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    log(`创建输出目录: ${distDir}`);
  } else {
    // 清理之前的构建文件
    log('清理之前的构建文件...');
    const files = fs.readdirSync(distDir);
    files.forEach(file => {
      const filePath = path.join(distDir, file);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
        log(`已删除: ${file}`, 'verbose');
      }
    });
  }
} catch (error) {
  log(`创建或清理输出目录时出错: ${error.message}`, 'error');
  process.exit(1);
}

// 读取package.json信息
let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
} catch (error) {
  log(`读取package.json文件时出错: ${error.message}`, 'error');
  process.exit(1);
}

// 自动递增最小版本号
function incrementVersion(version) {
  const parts = version.split('.').map(Number);
  parts[parts.length - 1] += 1; // 递增最小版本号
  return parts.join('.');
}

// 更新版本号（如果未跳过）
if (!BUILD_OPTIONS.skipVersionIncrement) {
  const oldVersion = pkg.version;
  pkg.version = incrementVersion(pkg.version);
  // 写回package.json
  try {
    fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(pkg, null, 2), 'utf8');
    log(`版本号已从 ${oldVersion} 更新至: ${pkg.version}`);
  } catch (error) {
    log(`写入package.json文件时出错: ${error.message}`, 'error');
    process.exit(1);
  }
} else {
  log(`跳过版本号更新，当前版本: ${pkg.version}`, 'info');
}

// 生成油猴脚本头部
function generateUserscriptHeader() {
  const updateUrl = 'https://github.com/SutChan/douyin_tool/raw/main/dist/douyin_ui_customizer.user.js';
  return `// ==UserScript==
// @name         ${pkg.name}
// @namespace    https://github.com/SutChan/douyin_tool
// @version      ${pkg.version}
// @description  ${pkg.description}
// @author       ${pkg.author}
// @match        https://www.douyin.com/*
// @match        https://*.douyin.com/*
// @match        http://www.douyin.com/*
// @match        http://*.douyin.com/*
// @match        https://www.tiktok.com/*
// @match        https://*.tiktok.com/*
// @match        http://www.tiktok.com/*
// @match        http://*.tiktok.com/*
// @icon         https://www.douyin.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @updateURL    ${updateUrl}
// @downloadURL  ${updateUrl}
// @license      ${pkg.license}
// @run-at       document-start
// ==/UserScript==
/* eslint-disable */
// @ts-nocheck`;
}

// 检查文件是否存在的辅助函数
function checkFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    log(`错误：找不到必要的文件 ${filePath}`, 'error');
    return false;
  }
  return true;
}

// 读取文件内容
function readFile(filePath) {
  try {
    log(`正在读取文件: ${path.basename(filePath)}`, 'verbose');
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`读取文件 ${filePath} 时出错: ${error.message}`, 'error');
    return '';
  }
}

// 代码处理函数，移除模块间的重复声明并在生产模式下进行轻量级清理
function processJS(jsCode) {
  // 移除所有的require语句和import语句，因为我们是直接合并代码而不是模块化加载
  // 但保留export语句，因为这些会在构建过程中被正确处理
  let processedCode = jsCode
    .replace(/const\s*{[^}]+}\s*=\s*require\(['"][^'"]+['"]\);/g, '')
    .replace(/import\s*{[^}]+}\s*from\s*['"][^'"]+['"];/g, '');
  
  // 移除文件末尾的export语句，因为我们直接合并代码，不需要导出
  processedCode = processedCode.replace(/\/\/\s*导出模块中的所有函数\s*\nexport\s*{[^}]+}\s*;/g, '');
  
  // 在生产模式下进行轻量级清理，避免过度压缩导致语法错误
  if (BUILD_OPTIONS.production) {
    log('正在清理代码...', 'verbose');
    
    // 1. 移除多行注释（小心处理，避免破坏正则表达式中的注释）
    // 使用更安全的多行注释移除方式
    const lines = processedCode.split('\n');
    const cleanLines = [];
    let inMultiLineComment = false;
    
    for (let line of lines) {
      let cleanLine = line;
      
      // 处理多行注释
      if (inMultiLineComment) {
        const endCommentIndex = cleanLine.indexOf('*/');
        if (endCommentIndex !== -1) {
          cleanLine = cleanLine.substring(endCommentIndex + 2);
          inMultiLineComment = false;
        } else {
          // 整个行都是注释的一部分，跳过
          continue;
        }
      }
      
      // 查找单行注释，但不处理代码中间的注释
      const singleLineCommentIndex = cleanLine.indexOf('//');
      if (singleLineCommentIndex !== -1) {
        // 检查是否在字符串内部
        const beforeComment = cleanLine.substring(0, singleLineCommentIndex);
        const singleQuotesCount = (beforeComment.match(/'/g) || []).length;
        const doubleQuotesCount = (beforeComment.match(/"/g) || []).length;
        
        // 如果不在字符串内部，移除注释
        if (singleQuotesCount % 2 === 0 && doubleQuotesCount % 2 === 0) {
          cleanLine = cleanLine.substring(0, singleLineCommentIndex);
        }
      }
      
      // 查找新的多行注释开始
      const startCommentIndex = cleanLine.indexOf('/*');
      if (startCommentIndex !== -1) {
        // 检查是否在字符串内部
        const beforeComment = cleanLine.substring(0, startCommentIndex);
        const singleQuotesCount = (beforeComment.match(/'/g) || []).length;
        const doubleQuotesCount = (beforeComment.match(/"/g) || []).length;
        
        if (singleQuotesCount % 2 === 0 && doubleQuotesCount % 2 === 0) {
          const endCommentIndex = cleanLine.indexOf('*/', startCommentIndex + 2);
          if (endCommentIndex !== -1) {
            // 同一行内有注释结束
            cleanLine = cleanLine.substring(0, startCommentIndex) + cleanLine.substring(endCommentIndex + 2);
          } else {
            // 多行注释开始
            cleanLine = cleanLine.substring(0, startCommentIndex);
            inMultiLineComment = true;
          }
        }
      }
      
      if (cleanLine.trim()) {
        cleanLines.push(cleanLine);
      }
    }
    
    processedCode = cleanLines.join('\n');
    
    // 2. 移除行尾空白
    processedCode = processedCode.replace(/\s+$/gm, '');
  }
  
  return processedCode;
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
    
    // 最安全的代码合并方式：使用简单字符串连接，避免任何可能引入语法错误的处理
    let combinedJS = "";
    
    // 改进的安全模块合并方式
    function safeAppendModule(code, moduleContent) {
      // 处理代码，移除重复的require语句
      let processedContent = processJS(moduleContent);
      // 确保代码块以分号结束，避免模块间语法错误
      let safeContent = processedContent.trim();
      // 如果最后一个非空白字符不是分号或大括号，添加分号
      const lastNonWhitespace = safeContent.replace(/\s+$/, '');
      const lastChar = lastNonWhitespace.charAt(lastNonWhitespace.length - 1);
      if (lastChar !== ';' && lastChar !== '}' && lastChar !== ']') {
        safeContent += ';';
      }
      return code + safeContent + '\n\n// 模块分隔符\n\n';
    }
    
    log('开始合并代码...');
    
    // 1. CSS样式定义
    log('合并CSS样式定义...', 'verbose');
    combinedJS += "// CSS样式定义\n";
    combinedJS += "const defaultStyles = " + JSON.stringify(defaultCSS) + ";\n";
    combinedJS += "const darkStyles = " + JSON.stringify(darkCSS) + ";\n\n";
    
    // 2. 工具函数模块
    log('合并工具函数模块...', 'verbose');
    combinedJS += "// 工具函数模块\n";
    combinedJS = safeAppendModule(combinedJS, domUtilsJS);
    
    // 3. 存储工具模块
    log('合并存储工具模块...', 'verbose');
    combinedJS += "// 存储工具模块\n";
    combinedJS = safeAppendModule(combinedJS, storageUtilsJS);
    
    // 4. 配置管理模块
    log('合并配置管理模块...', 'verbose');
    combinedJS += "// 配置管理模块\n";
    combinedJS = safeAppendModule(combinedJS, configJS);
    
    // 5. UI管理器模块
    log('合并UI管理器模块...', 'verbose');
    combinedJS += "// UI管理器模块\n";
    combinedJS = safeAppendModule(combinedJS, uiManagerJS);
    
    // 6. 主脚本逻辑 - 只合并main.js中油猴元数据之后的内容
    log('合并主脚本逻辑...', 'verbose');
    combinedJS += "// 主脚本逻辑\n";
    // 提取main.js中油猴脚本元数据之后的内容
    let mainJSContent = mainJS;
    const metaEndIndex = mainJS.indexOf('// ==/UserScript==');
    if (metaEndIndex !== -1) {
      mainJSContent = mainJS.substring(metaEndIndex + 17); // 17是"// ==/UserScript=="的长度
    }
    // 清理内容，移除开头可能的等号或其他无效字符
    mainJSContent = mainJSContent.trim();
    if (mainJSContent && mainJSContent.charAt(0) === '=') {
      mainJSContent = mainJSContent.substring(1).trim();
    }
    // 移除main.js中的require语句
    mainJSContent = mainJSContent.replace(/const\s*{[^}]+}\s*=\s*require\(['"][^'"]+['"]\);/g, '');
    // 更新版本号
    const updatedMainJS = mainJSContent.replace(/const CURRENT_VERSION = '[^']+'/, `const CURRENT_VERSION = '${pkg.version}'`);
    combinedJS += updatedMainJS.replace(/\s*$/, '');
    
    log('代码合并完成！');
    
    // 生成最终脚本，使用简单的字符串连接
    const header = generateUserscriptHeader();
    const finalScript = header + "\n\n" + combinedJS;
    
    // 写入文件
    const outputPath = path.join(distDir, 'douyin_ui_customizer.user.js');
    try {
      fs.writeFileSync(outputPath, finalScript, 'utf8');
      log(`文件写入成功：${outputPath}`);
      
      // 验证输出文件大小
      const stats = fs.statSync(outputPath);
      log(`输出文件大小：${(stats.size / 1024).toFixed(2)} KB`, 'verbose');
      
      // 验证语法
      log('正在验证生成文件的语法...');
      const { execSync } = require('child_process');
      try {
        execSync(`node -c "${outputPath}"`, { stdio: 'ignore' });
        log('语法验证通过！');
      } catch (error) {
        log('警告：生成的文件存在语法错误！', 'warn');
        log('请使用 `node -c dist/douyin_ui_customizer.user.js` 检查具体错误', 'warn');
      }
    } catch (error) {
      log(`写入文件时出错：${error.message}`, 'error');
      process.exit(1);
    }
    
    const endTime = Date.now();
    log(`构建完成！耗时：${(endTime - startTime) / 1000} 秒`);
    log(`构建详情：版本 ${pkg.version}, 生产模式: ${BUILD_OPTIONS.production}`);
  } catch (error) {
    log(`构建过程中发生错误: ${error.message}`, 'error');
    if (BUILD_OPTIONS.verbose) {
      log(error.stack, 'error');
    }
    process.exit(1);
  }
}

// 执行构建
build().catch(error => {
  log(`构建失败：${error.message}`, 'error');
  if (BUILD_OPTIONS.verbose) {
    log(error.stack, 'error');
  }
  process.exit(1);
});