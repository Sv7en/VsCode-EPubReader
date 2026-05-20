const vscode = require('vscode');
const Fs = require('fs');
const Path = require('path');

const HostBridge = require('./host-bridge');
const loadTemplate = require('./template');
const Storage = require('./storage');
const BookshelfProvider = require('./bookshelf');
const { getStrings } = require('./i18n');

let currentPanel = null;
let storage = null;

function activate(context) {

    const getBookDir = () => {
        const cfg = vscode.workspace.getConfiguration('reader');
        const customDir = cfg.get('bookDirectory', '');
        if (customDir && Fs.existsSync(customDir)) {
            return customDir;
        }
        return Path.join(context.extensionPath, 'book');
    };

    const getConfig = () => {
        const cfg = vscode.workspace.getConfiguration('reader');
        const defaults = {
            fontSize: cfg.get('fontSize', 14),
            fontColor: cfg.get('fontColor', '#6a9955'),
            backgroundColor: cfg.get('backgroundColor', '#1e1e1e'),
        };
        if (!storage) return defaults;
        const saved = storage.getItem('config');
        return saved ? { ...defaults, ...saved } : defaults;
    };

    const getLocalResourceRoots = () => {
        const roots = [vscode.Uri.file(context.extensionPath)];
        const customDir = vscode.workspace.getConfiguration('reader').get('bookDirectory', '');
        if (customDir && Fs.existsSync(customDir)) {
            roots.push(vscode.Uri.file(customDir));
        }
        return roots;
    };

    const openReader = (bookName) => {
        const columnToShowIn = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : vscode.ViewColumn.One;

        if (currentPanel) {
            currentPanel.reveal(columnToShowIn);
        } else {
            currentPanel = vscode.window.createWebviewPanel(
                'reader', bookName, columnToShowIn,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    localResourceRoots: getLocalResourceRoots(),
                }
            );
            currentPanel.onDidDispose(() => {
                currentPanel = null;
                bookshelfProvider.postMessage({ command: 'reader:clearToc' });
            }, null, context.subscriptions);
        }

        currentPanel.title = bookName.replace(/\.epub$/i, '');

        const helper = new HostBridge(currentPanel.webview, context);

        const bookDir = getBookDir();
        const book = storage.getItem(bookName) || { bookName };
        book.progress = book.progress || 0;
        const config = getConfig();
        const param = {
            bookPath: currentPanel.webview.asWebviewUri(vscode.Uri.file(Path.join(bookDir, bookName))).toString(),
            ...book,
            ...config,
            ...getStrings(),
        };
        currentPanel.webview.html = loadTemplate({
            rootPath: context.extensionPath,
            htmlPath: 'src/views/reader.html',
            data: param,
            webview: currentPanel.webview,
        });

        helper.on('reader:updateProgress', (data, done) => {
            const b = storage.getItem(data.book) || { bookName: data.book };
            b.progress = data.progress || b.progress;
            b.cfi = data.cfi;
            storage.setItem(data.book, b);
            bookshelfProvider.postMessage({ command: 'reader:progressChanged', progress: data.progress });
        });

        helper.on('reader:tocLoaded', (data, done) => {
            bookshelfProvider.postMessage({ command: 'reader:tocData', toc: data.toc });
        });

        helper.on('bookshelf:saveConfig', (data, done) => {
            storage.setItem('config', data.config);
        });
    };

    storage = new Storage({ rootPath: context.extensionPath });

    const notifyReaderConfig = (config) => {
        if (currentPanel) {
            currentPanel.webview.postMessage({ command: 'reader:updateTheme', config });
        }
    };

    const bookshelfProvider = new BookshelfProvider({
        extensionPath: context.extensionPath,
        extensionContext: context,
        onOpenBook: openReader,
        getConfig,
        getBookDir,
        storage,
        onConfigChange: notifyReaderConfig,
        onGotoChapter: (index) => {
            if (currentPanel) {
                currentPanel.webview.postMessage({ command: 'bookshelf:gotoChapter', index });
            }
        },
    });
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('reader.bookshelf', bookshelfProvider)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.openReader', () => {
            vscode.commands.executeCommand('workbench.view.extension.reader');
        })
    );
}

exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
