const Fs = require('fs');
const Path = require('path');

class Storage {
    constructor({ rootPath }) {
        this.dataStoragePath = Path.join(rootPath, 'src/data/storage.json');
        const legacyPath = Path.join(rootPath, 'src/utils/storageData.txt');

        if (!Fs.existsSync(this.dataStoragePath) && Fs.existsSync(legacyPath)) {
            const dir = Path.dirname(this.dataStoragePath);
            if (!Fs.existsSync(dir)) Fs.mkdirSync(dir, { recursive: true });
            Fs.renameSync(legacyPath, this.dataStoragePath);
        }

        try {
            let data = Fs.readFileSync(this.dataStoragePath, 'utf8');
            if (!data) data = '{}';
            this._data = JSON.parse(data);
        } catch (error) {
            this._data = {};
        }
    }

    setItem(key, value) {
        this._data[key] = value;
        this._save();
    }

    getItem(key) {
        return this._data[key];
    }

    removeItem(key) {
        delete this._data[key];
        this._save();
    }

    _save() {
        const dir = Path.dirname(this.dataStoragePath);
        if (!Fs.existsSync(dir)) Fs.mkdirSync(dir, { recursive: true });
        const data = JSON.stringify(this._data);
        Fs.writeFileSync(this.dataStoragePath, data);
    }
}

module.exports = Storage;
