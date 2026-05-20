const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} param0 
 */
function getWebViewContent({ rootPath, htmlPath, data, webview }) {
    const resourcePath = path.join(rootPath, htmlPath);
    const dirPath = path.dirname(resourcePath);
    let html
    try {
        html = fs.readFileSync(resourcePath, 'utf-8');
    } catch (error) {
        html = error.toString();
    }
    html = html.replace(/(@)(.+?)"/g, (m, $1, $2) => {
        const uri = vscode.Uri.file(path.resolve(dirPath, $2));
        return webview.asWebviewUri(uri).toString() + '"';
    });

    if (data) {
        html = html.replace(/(\{\{)(.+?)(\}\})/g, (m, $1, $2) => {
        return data[$2.trim()];
        });
    }

    return html;
};

module.exports = getWebViewContent;