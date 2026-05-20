# EPUB Reader

[中文文档](README.md)

A VS Code extension for reading EPUB books directly in the editor.

github: https://github.com/Sv7en/VsCode-EPubReader.git

## Features

- **Sidebar Bookshelf** — Click the book icon in the activity bar to open the sidebar bookshelf, browse and open books anytime
- **6 Theme Presets** — One-click switch between dark green, bright, parchment, eye-care green, night mode, and classic yellow themes
- **Custom Colors** — Fine-tune font color, background color, and font size via color pickers
- **Reading Progress** — Automatically saves and restores reading position per book
- **Table of Contents** — Jump to any chapter from the dropdown in the reader toolbar
- **Keyboard Navigation** — Press `A` to go to previous page, `D` to go to next page
- **Mouse Wheel** — Scroll up/down to turn pages
- **Custom Book Directory** — Set a custom folder for your EPUB files via VS Code settings

## Usage

### Open the Bookshelf

Click the book icon in the left activity bar, or press `Ctrl+3` (`Cmd+3` on Mac) to focus the sidebar.

### Switch Themes

In the sidebar, click any theme preset button (each shows a color preview + name). Changes apply to the open reader immediately. You can also fine-tune colors using the font color and background color pickers below the presets.

### Custom Book Directory

By default, books are loaded from the extension's built-in `book/` folder. To use your own directory:

1. Open VS Code Settings (`Ctrl+,`)
2. Search for `EPUB Reader`
3. Set `reader.bookDirectory` to your EPUB folder path

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `A` | Previous page |
| `D` | Next page |
| `Ctrl+3` / `Cmd+3` | Open sidebar bookshelf |
| Mouse wheel up | Previous page |
| Mouse wheel down | Next page |

## Theme Presets

| Preset | Background | Font Color |
|--------|-----------|------------|
| Dark Green | `#1e1e1e` | `#6a9955` |
| Bright | `#ffffff` | `#000000` |
| Parchment | `#f5eddc` | `#5b4636` |
| Eye-care Green | `#c7edcc` | `#2b4c2b` |
| Night | `#000000` | `#888888` |
| Classic Yellow | `#e8d5b7` | `#3e3b36` |

## Configuration

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `reader.fontSize` | number | 14 | Reading font size (px) |
| `reader.fontColor` | string | `#6a9955` | Reading font color |
| `reader.backgroundColor` | string | `#1e1e1e` | Reading background color |
| `reader.bookDirectory` | string | `""` | Custom book folder path (empty = built-in `book/` folder) |
