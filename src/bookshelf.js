const vscode = require('vscode');
const Fs = require('fs');
const HostBridge = require('./host-bridge');
const loadTemplate = require('./template');
const { getStrings } = require('./i18n');

class BookshelfProvider {
    constructor({ extensionPath, extensionContext, onOpenBook, getConfig, getBookDir, storage, onConfigChange, onGotoChapter }) {
        this._extensionPath = extensionPath;
        this._ctx = extensionContext;
        this._onOpenBook = onOpenBook;
        this._getConfig = getConfig;
        this._getBookDir = getBookDir;
        this._storage = storage;
        this._onConfigChange = onConfigChange;
        this._onGotoChapter = onGotoChapter;
        this._view = undefined;
    }

    resolveWebviewView(webviewView) {
        this._view = webviewView;

        const roots = [vscode.Uri.file(this._extensionPath)];
        const customDir = vscode.workspace.getConfiguration('reader').get('bookDirectory', '');
        if (customDir && Fs.existsSync(customDir)) {
            roots.push(vscode.Uri.file(customDir));
        }

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: roots,
        };

        const helper = new HostBridge(webviewView.webview, this._ctx);

        helper.on('bookshelf:getBooks', (data, done) => {
            Fs.readdir(this._getBookDir(), (err, files) => {
                done(files);
            });
        });

        helper.on('bookshelf:openBook', (data, done) => {
            this._onOpenBook(data.book);
            done();
        });

        helper.on('bookshelf:gotoChapter', (data, done) => {
            if (this._onGotoChapter) this._onGotoChapter(data.index);
            done();
        });

        helper.on('bookshelf:saveConfig', (data, done) => {
            this._storage.setItem('config', data.config);
            if (this._onConfigChange) this._onConfigChange(data.config);
            done();
        });

        this._render();
    }

    _render() {
        if (!this._view) return;
        const config = this._getConfig();
        this._view.webview.html = loadTemplate({
            rootPath: this._extensionPath,
            htmlPath: 'src/views/bookshelf.html',
            data: { ...config, ...getStrings() },
            webview: this._view.webview,
        });
    }

    refresh() {
        this._render();
    }

    postMessage(data) {
        if (this._view) {
            this._view.webview.postMessage(data);
        }
    }
}

module.exports = BookshelfProvider;
