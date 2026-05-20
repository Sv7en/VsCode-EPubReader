# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VS Code extension called **EPUB Reader** (`publisher: sv7en`). It renders epub books inside a VS Code webview panel using the epub.js library. Books are stored as `.epub` files in the `book/` directory. The extension features a sidebar bookshelf, theme presets, chapter navigation, and i18n support.

## Commands

- **Debug extension**: Press F5 in VS Code (launches Extension Development Host via `.vscode/launch.json`)
- **Package extension**: `npm run package` (produces a `.vsix` file via `vsce`)

## Architecture

### Extension host side (Node.js)

- [extension.js](src/extension.js) — Entry point. Registers the sidebar bookshelf provider and reader webview panel. Wires up message handlers via `HostBridge`.
- [bookshelf.js](src/bookshelf.js) — `WebviewViewProvider` for the sidebar. Lists epub files, handles book-open, chapter-nav, and config messages.
- [host-bridge.js](src/host-bridge.js) — EventEmitter-like bridge for receiving messages from webviews. Listeners registered with `.on(command, callback)`. Callbacks receive `(message, done)`.
- [template.js](src/template.js) — Loads HTML templates, rewrites `@`-prefixed paths to webview URIs, substitutes `{{ key }}` placeholders.
- [storage.js](src/storage.js) — JSON file-based persistence backed by `src/data/storage.json`. Stores reading progress per book and user config.
- [i18n.js](src/i18n.js) — Localization module returning strings based on `vscode.env.language` (en, zh-cn, zh-tw).

### Webview side (browser)

- [webview-bridge.js](src/webview-bridge.js) — Client-side counterpart to `HostBridge`. Sends messages via `vscode.postMessage()`. Supports request/response via callback IDs. Exposed as `window.WebviewBridge`.
- [bookshelf.html](src/views/bookshelf.html) — Sidebar bookshelf UI. Lists books, shows chapter TOC from active reader, provides theme presets and settings.
- [reader.html](src/views/reader.html) — Reader panel. Renders epub content via epub.js. Supports keyboard (A/D), mouse wheel, and sidebar-driven chapter navigation.
- [reader.css](src/views/reader.css) — Reader-specific styles (page nav, progress indicator).
- [common.css](src/assets/common.css) — Shared styles for theme preset buttons.

### Message protocol

All messages use `{ command, cbid, ...data }` format. Commands follow `domain:action` naming:
- `bookshelf:*` — sidebar bookshelf commands (getBooks, openBook, gotoChapter, saveConfig)
- `reader:*` — reader panel commands (updateProgress, tocLoaded, updateTheme, clearToc, tocData)

### Resource path convention

In HTML templates, use `@relative/path` for resource references. `template.js` rewrites these to webview URIs at render time. Paths resolve relative to the HTML file's directory.

## Key conventions

- Plain JavaScript (no TypeScript compilation).
- Webviews use jQuery (`lib/jquery-3.3.1.min.js`) for DOM manipulation.
- Persistent state stored in `src/data/storage.json` (auto-migrates from old `src/utils/storageData.txt`).
- Books loaded from `book/` directory or a user-configured custom path (`reader.bookDirectory`).
- UI text is localized via `i18n.js` + `package.nls.json` / `package.nls.zh-cn.json`.
