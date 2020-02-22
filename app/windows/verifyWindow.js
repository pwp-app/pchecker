const {
    BrowserWindow
} = require('electron');
const ipc = require('electron').ipcMain;
const path = require('path');

var verifyWindow;
var hash;

function createWindow() {
    var conf = {
        width: 580,
        height: 108,
        resizable: false,
        minimizable: false,
        maximazable: false,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    };

    if (process.platform == 'darwin')
        conf.titleBarStyle = 'hiddenInset';
    else
        conf.frame = false;

    verifyWindow = new BrowserWindow(conf);

    var viewpath = path.resolve(__dirname, '../../public/verfiy.html');
    verifyWindow.loadFile(viewpath);

    verifyWindow.on('closed', () => {
        verifyWindow = null;
    });

    verifyWindow.on('ready-to-show', () => {
        verifyWindow.show();
        verifyWindow.webContents.send('hash-init', hash);
        ipc.once('i18n-inited', () => {
            verifyWindow.show();
        });
    });
}

const obj = {
    create: (hash) => {
        if (verifyWindow != null) {
            if (verifyWindow.isMinimized()) {
                verifyWindow.restore();
            }
            verifyWindow.focus();
        } else {
            createWindow(hash);
        }
    },
};

module.exports = obj;