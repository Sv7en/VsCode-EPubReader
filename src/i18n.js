const en = {
    labelBookshelf: 'Bookshelf',
    labelToc: 'Chapters',
    labelTheme: 'Theme',
    labelFontSize: 'Size',
    labelFontColor: 'Font',
    labelBgColor: 'Background',
    themeDarkGreen: 'Dark Green',
    themeBright: 'Bright',
    themeParchment: 'Parchment',
    themeEyeCare: 'Eye-care',
    themeNight: 'Night',
    themeClassicYellow: 'Classic',
};

const zhCN = {
    labelBookshelf: '书架',
    labelToc: '目录',
    labelTheme: '主题',
    labelFontSize: '字号',
    labelFontColor: '字体色',
    labelBgColor: '背景色',
    themeDarkGreen: '暗绿',
    themeBright: '明亮',
    themeParchment: '羊皮纸',
    themeEyeCare: '护眼绿',
    themeNight: '夜间',
    themeClassicYellow: '古典黄',
};

const locales = { en, 'zh-cn': zhCN, 'zh-tw': zhCN };

function getLang() {
    try {
        return (require('vscode').env.language || 'en').toLowerCase();
    } catch (e) {
        return 'en';
    }
}

function getStrings() {
    const lang = getLang();
    if (locales[lang]) return locales[lang];
    const base = lang.split('-')[0];
    if (locales[base]) return locales[base];
    return en;
}

module.exports = { getStrings };
