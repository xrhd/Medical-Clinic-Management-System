const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let win

app.on('ready', createWindow)

function createWindow () {
    win = new BrowserWindow({width:800, height:600})

    win.loadURL(url.format({
        pathname:path.join(__dirname, '../www/index.html'),
        protocol: 'file',
        slashes:true
    }))
}

app.on('closed', () => {
    win = null
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if(win === null) {
        createWindow()
    }
})