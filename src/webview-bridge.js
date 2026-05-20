function WebviewBridge(vscode) {
    this.vscode = vscode;
    this.callbacks = {};

    window.addEventListener('message', this.onMessage.bind(this));
}

WebviewBridge.prototype.onMessage = function(event) {
    const message = event.data;
    if (message.cbid && this.callbacks[message.cbid]) {
        this.callbacks[message.cbid](message);
        delete this.callbacks[message.cbid];
    }
}

WebviewBridge.prototype.emit = function(data, cb) {
    if (cb) {
        const cbid = Date.now() + '' + Math.round(Math.random() * 100000);
        this.callbacks[cbid] = cb;
        data.cbid = cbid;
    }
    this.vscode.postMessage(data);
}

window.WebviewBridge = WebviewBridge;
