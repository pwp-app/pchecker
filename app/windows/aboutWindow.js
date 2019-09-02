const {
    BrowserWindow
} = require('electron');
const ipc = require('electron').ipcMain;
const app = require('electron').app;
const path = require('path');

var aboutWindow;

function createWindow(){
    var conf = {
        width: 580,
        height: 320,
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

    aboutWindow = new BrowserWindow(conf);

    var viewpath = path.resolve(__dirname, '../../public/about.html');
    aboutWindow.loadFile(viewpath);

    // event listener

    aboutWindow.on('closed', () => {
        aboutWindow = null;
    });

    aboutWindow.on('ready-to-show', () => {
        aboutWindow.show();
    });
}

var obj = {
    create: () => {
        if (aboutWindow != null){
            if (aboutWindow.isMinimized()) {
                aboutWindow.restore();
            }
            aboutWindow.focus();
        } else {
            createWindow();
        }
    }
};

module.exports = obj;