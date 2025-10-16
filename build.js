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

// 压缩JavaScript
async function compressJS(jsCode) {
  try {
    const result = await minify(jsCode, {
      compress: {
        drop_console: false,
        drop_debugger: true
      },
      format: {
        comments: false
      }
    });
    return result.code || jsCode;
  } catch (error) {
    console.error('JS compression error:', error);
    return jsCode;
  }
}

// 构建脚本
async function build() {
  console.log('开始构建...');
  
  // 读取所有JS文件
  const mainJS = readFile(path.join(__dirname, 'src', 'main.js'));
  const configJS = readFile(path.join(__dirname, 'src', 'config.js'));
  const uiManagerJS = readFile(path.join(__dirname, 'src', 'ui_manager.js'));
  const domUtilsJS = readFile(path.join(__dirname, 'src', 'utils', 'dom.js'));
  const storageUtilsJS = readFile(path.join(__dirname, 'src', 'utils', 'storage.js'));
  
  // 读取CSS文件
  const defaultCSS = readFile(path.join(__dirname, 'src', 'styles', 'default.css'));
  const darkCSS = readFile(path.join(__dirname, 'src', 'styles', 'dark.css'));
  
  // 合并JS代码
  let combinedJS = `
    // CSS样式
    const defaultStyles = \`${defaultCSS.replace(/`/g, '\\`')}\`;
    const darkStyles = \`${darkCSS.replace(/`/g, '\\`')}\`;
    
    // 工具函数和基础模块
    ${domUtilsJS}
    ${storageUtilsJS}
    ${configJS}
    
    // 定义页面检测函数（提取自main.js，确保在UIManager前可用）
    function isVideoPage() {
      return location.pathname.includes('/video/') || 
             location.pathname === '/' || 
             location.pathname.includes('/user/');
    }
    
    function isLivePage() {
      return location.pathname.includes('/live/');
    }
    
    // 加载UI管理器和主脚本
    ${uiManagerJS}
    ${mainJS}
  `;
  
  // 压缩JS
  const compressedJS = await compressJS(combinedJS);
  
  // 生成最终脚本
  const finalScript = `${generateUserscriptHeader()}\n\n${compressedJS}`;
  
  // 写入文件
  const outputPath = path.join(distDir, 'douyin_ui_customizer.user.js');
  fs.writeFileSync(outputPath, finalScript, 'utf8');
  
  console.log(`构建完成！输出文件：${outputPath}`);
}

// 执行构建
build().catch(error => {
  console.error('构建失败：', error);
  process.exit(1);
});