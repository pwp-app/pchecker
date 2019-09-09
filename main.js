// requirements
const {
    app,
    BrowserWindow
} = require('electron');
const ipc = require('electron').ipcMain;
const storage = require('electron-json-storage');
const path = require('path');

// load window

const aboutWindow = require('./app/windows/aboutWindow');

// global const
const appName = 'pchecker';

// flags
global.indebug = true; // debug flag
global.isOS64 = true; // OS flag

// global vars
var mainWindow;

// single intance lock
const singleInstanceLock = app.requestSingleInstanceLock();
if (!singleInstanceLock) {
    app.exit();
}

// auto updater
const {
    autoUpdater
} = require('electron-updater');
let feedUrl = `http://update.backrunner.top/` + appName + `/${process.platform}`;

if (isOS64) {
    feedUrl += `/x64`;
}

let checkForUpdates = () => {

    let sendUpdateMessage = (message, data) => {
        win.webContents.send('update-message', {
            message,
            data
        });
    };

    autoUpdater.setFeedURL(feedUrl);
    autoUpdater.autoDownload = false;

    ipc.on('downloadNow', function() {
        autoUpdater.downloadUpdate();
    });

    autoUpdater.on('error', function(message) {
        sendUpdateMessage('error', message);
    });

    autoUpdater.on('checking-for-update', function(message) {
        sendUpdateMessage('checking-for-update', message);
    });

    autoUpdater.on('update-available', function(message) {
        sendUpdateMessage('update-available', message);
    });

    autoUpdater.on('update-not-available', function(message) {
        sendUpdateMessage('update-not-available', message);
    });

    autoUpdater.on('download-progress', function(progressObj) {
        sendUpdateMessage('downloadProgress', progressObj);
    });

    autoUpdater.on('update-downloaded', () => {
        sendUpdateMessage('update-downloaded');
    });

    autoUpdater.checkForUpdates();
};

// app

app.on('ready', () => {
    createMainWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('second-instance', () => {
    if (mainWindow != null) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.focus();
    } else {
        createMainWindow();
    }
});

// main window

function createMainWindow() {

    // conf of main window

    var conf = {
        width: 620,
        height: 320,
        resizable: false,
        maximizable: false,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    };

    // titlebar

    if (process.platform == 'darwin')
        conf.titleBarStyle = 'hiddenInset';
    else
        conf.frame = false;

    mainWindow = new BrowserWindow(conf);

    //load index page

    let viewpath = path.resolve(__dirname, './public/index.html');
    mainWindow.loadFile(viewpath);

    //event listener

    mainWindow.on('ready-to-show', () => {

        mainWindow.show();
        checkForUpdates();

        // main window ipc

        ipc.on('mainwindow-reload', () => {
            mainWindow.reload();
        });

        ipc.on('openAboutWindow', () => {
            aboutWindow.create();
        });

        ipc.on('app-quitNow', ()=>{
            app.quit();
        });

    });

    mainWindow.on('closed', () => {
        app.quit();
    });
}