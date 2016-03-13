'use strict';

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = require('electron').ipcMain
const dialog = require('electron').dialog

require('crashreporter').configure({
    outDir: (__dirname + '/crash'),
    exitOnCrash: true,
    maxCrashFile: 5
})

var mainWindow = null

app.on('window-all-closed', () => {
    if(process.platform != 'darwin') {
        app.quit();
    }
})

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    mainWindow.setMenu(null)

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    var prefsWindow = new BrowserWindow({
        width: 600,
        height: 400,
        show: false
    })

    prefsWindow.loadURL('file://' + __dirname + '/app/prefs.html')

    ipcMain.on('asynchronous-message', (event, arg) => {
        switch(arg) {
            case 'show-open':
                dialog.showOpenDialog({
                    properties: [
                        'openFile',
                        'openDirectory',
                        'multiSelections'
                    ]
                })
                break
            case 'show-prefs':
                prefsWindow.show()
                prefsWindow.setMenu(null)
                break
            case 'app-quit':
                app.quit()
                break
            default:
                console.dir('ipcMain: unknown message - ' + arg)
        }
    });
});
