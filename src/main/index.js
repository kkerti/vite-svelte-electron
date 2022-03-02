// This file is the entry point for the Electron application.

const { app, BrowserWindow } = require('electron');
const { serial } = require('./serialport.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    'minHeight': 500,
    'minWidth': 800,
    backgroundColor: '#1e2628',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      backgroundThrottling: false
    },
  });

  serial.mainWindow = mainWindow

  require('@electron/remote/main').initialize();
  require("@electron/remote/main").enable(mainWindow.webContents);

  if (process.env.NODE_ENV !== 'development') {
    // Load production build
    mainWindow.loadFile(`${__dirname}/renderer/dist/index.html`)
  } else {
    // Load vite dev server page 
    console.log('Development mode')
    mainWindow.loadURL('http://localhost:3000/');
  }
}

app.whenReady()
  .then(() => {
    createWindow()

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})