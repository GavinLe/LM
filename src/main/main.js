/**
 * Created by gavin on 16/4/19.
 */
'use strict';

const electron = require('electron');
const app = electron.app;
const argv = require('yargs').argv;
global.ENV = argv.p..toUpperCase() || 'DEV';

var path = require('path');
var Tray = require('tray');
var Menu = require('menu');

//app.on('ready', createWindow);

app.on('ready', function (){
    console.log('ready ===== ');
    //createTray();
    events.emit('start');
});

// app.on('quit', function() {
//   settings.save();
//   console.log('用户设置已保存，退出应用。');
// });
//
// var shouldQuit = app.makeSingleInstance(function() {
//   return true;
// });
//
// if (shouldQuit) {
//   console.log("不允许重复打开");
//   app.quit();
// };

function createTray() {
  var tray = new Tray(path.join(__dirname, '../public/icon/icon.png'));
  var platform = process.platform;

  tray.on('click', function() {
    events.emit('tray click');
  });

  tray.on('right-click', function() {
    if (platform == 'win32') {
      var contextMenu = Menu.buildFromTemplate([{
        label: '退出',
        icon: path.join(__dirname, '../public/icon/exit.png'),
        click: function() {
          app.quit();
        }
      }]);
      tray.setContextMenu(contextMenu);
    };
  });

  tray.setToolTip('搜刚助手');
}

var mainEvents = require('mainEvents.js');
mainEvents.init();

// 读取用户设置
var settings = require('utils/settings.js');

var token = require('utils/token.js');
token.init(settings.loadConfig());

// 加载 account
var account = require('account/init.js');
account.init(settings.loadConfig());

// 加载 resource list
var resourceList = require('resource-list/init.js');
resourceList.init(settings.loadConfig());

ipcMain.on('get ENV config', function(event){
    event.returnValue = global.ENV;
});

console.log("start electron api ENV:", global.ENV, ':', build.data.server.api);
