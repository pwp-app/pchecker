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
let feedUrl = `http://update.backrunner.top/` + appName + `/${process.platform}/`;

if (isOS64) {
    feedUrl += `x64`;
}

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
        mainWindow.focus();
    }
});

// main window

function createMainWindow() {

    // conf of main window

    var conf = {
        width: 600,
        height: 360,
        minWidth: 420,
        minHeight: 280,
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

    if (indebug) {
        mainWindow.webContents.openDevTools();
    }

    //load index page

    let viewpath = path.resolve(__dirname, './public/index.html');
    mainWindow.loadFile(viewpath);

    //event listener

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();

        // main window ipc

        ipc.on('mainwindow-reload', () => {
            mainWindow.reload();
        });

        ipc.on('openAboutWindow', () => {
            aboutWindow.create();
        });

    });

    mainWindow.on('closed', () => {
        app.quit();
    });
}