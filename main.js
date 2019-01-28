const electron = require('electron');
const path = require('path');
const url = require('url');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

// listen for the app to be ready
app.on('ready', function() {
    // create new window
    mainWindow = new BrowserWindow({
        resizable: false, 
        resizable: false
    });
    // load the html file into the window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    // quit app on main window close
    mainWindow.on('close', function(){
        app.quit();
    })
    // build menu from template
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    // insert menu
    Menu.setApplicationMenu(mainMenu);
})

// handle createAddWindow

function createAddWindow() {
    // create new window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        resizable: false,
        title: 'Add Shopping List Item'
    });
    // load the html file into the window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    // garbage collection
    addWindow.on('close', function() {
        addWindow = null
    })
}

// catch item:add

ipcMain.on('item:add', function(e, item) {
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})

// create menu template

const menuTemplate = [
    {
        label: 'file',
        submenu: [
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
]
// add empty in front of menu on mac
if (process.platform == 'darwin') {
    menuTemplate.unshift({})
}

// add developer tools if not in production

if(process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Devetools',
                accelerator: process.platform === 'dawrwin'? 'Command+I': 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}