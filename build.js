const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// 创建输出目录
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 读取package.json信息
let pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

// 自动递增最小版本号
function incrementVersion(version) {
  const parts = version.split('.').map(Number);
  parts[parts.length - 1] += 1; // 递增最小版本号
  return parts.join('.');
}

// 更新版本号
pkg.version = incrementVersion(pkg.version);
// 写回package.json
fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(pkg, null, 2), 'utf8');
console.log(`版本号已更新至: ${pkg.version}`);

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
// @icon         https://www.douyin.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @updateURL    ${updateUrl}
// @downloadURL  ${updateUrl}
// @license      ${pkg.license}
// ==/UserScript==
/* eslint-disable */
// @ts-nocheck`;
}

// 读取文件内容
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return '';
  }
}

// 简化的代码处理函数，直接返回代码而不进行复杂处理
async function compressJS(jsCode) {
  try {
    // 最小化处理，避免引入语法错误
    console.log('直接使用原始代码结构，避免处理过程中引入语法错误');
    return jsCode;
  } catch (error) {
    console.error('代码处理错误:', error);
    console.log('返回原始代码');
    return jsCode;
  }
}

// 构建脚本
async function build() {
  console.log('开始构建...');
  
  try {
    // 读取所有JS文件
    console.log('正在读取文件...');
    const mainJS = readFile(path.join(__dirname, 'src', 'main.js'));
    const configJS = readFile(path.join(__dirname, 'src', 'config.js'));
    const uiManagerJS = readFile(path.join(__dirname, 'src', 'ui_manager.js'));
    const domUtilsJS = readFile(path.join(__dirname, 'src', 'utils', 'dom.js'));
    const storageUtilsJS = readFile(path.join(__dirname, 'src', 'utils', 'storage.js'));
    
    // 读取CSS文件
    const defaultCSS = readFile(path.join(__dirname, 'src', 'styles', 'default.css'));
    const darkCSS = readFile(path.join(__dirname, 'src', 'styles', 'dark.css'));
    
    console.log('文件读取完成，开始合并...');
    
    // 最安全的代码合并方式：使用简单字符串连接，避免任何可能引入语法错误的处理
    let combinedJS = "";
    
    // 添加分号和换行作为安全分隔符，确保模块间正确分隔
    const safeSeparator = ";\n\n// 模块分隔符\n\n";    
    
    console.log('开始合并代码...');
    
    // 1. CSS样式定义
    console.log('合并CSS样式定义...');
    combinedJS += "// CSS样式定义\n";
    combinedJS += "const defaultStyles = " + JSON.stringify(defaultCSS) + ";\n";
    combinedJS += "const darkStyles = " + JSON.stringify(darkCSS) + ";" + safeSeparator;
    
    // 2. 工具函数模块
    console.log('合并工具函数模块...');
    combinedJS += "// 工具函数模块\n";
    combinedJS += domUtilsJS.replace(/\s*$/, '') + safeSeparator;
    
    // 3. 存储工具模块
    console.log('合并存储工具模块...');
    combinedJS += "// 存储工具模块\n";
    combinedJS += storageUtilsJS.replace(/\s*$/, '') + safeSeparator;
    
    // 4. 配置管理模块
    console.log('合并配置管理模块...');
    combinedJS += "// 配置管理模块\n";
    combinedJS += configJS.replace(/\s*$/, '') + safeSeparator;
    
    // 5. UI管理器模块
    console.log('合并UI管理器模块...');
    combinedJS += "// UI管理器模块\n";
    combinedJS += uiManagerJS.replace(/\s*$/, '') + safeSeparator;
    
    // 6. 主脚本逻辑
    console.log('合并主脚本逻辑...');
    combinedJS += "// 主脚本逻辑\n";
    combinedJS += mainJS.replace(/\s*$/, '');
    
    console.log('代码合并完成！');
    
    // 生成最终脚本，使用简单的字符串连接
    const header = generateUserscriptHeader();
    const finalScript = header + "\n\n" + combinedJS;
    
    // 写入文件
    const outputPath = path.join(distDir, 'douyin_ui_customizer.user.js');
    fs.writeFileSync(outputPath, finalScript, 'utf8');
    
    console.log(`构建完成！输出文件：${outputPath}`);
  } catch (error) {
    console.error('构建过程中发生错误:', error);
    process.exit(1);
  }
}

// 执行构建
build().catch(error => {
  console.error('构建失败：', error);
  process.exit(1);
});