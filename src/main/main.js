'use strict';
/**
 * Created by gavin on 16/4/19.
 */
var electron = require('electron');
var app = electron.app;
var argv = require('yargs').argv;
var events = require('./utils/events.js').events;
console.log(argv.p.toUpperCase());
global.ENV = argv.p.toUpperCase() || 'DEV';

app.on('ready', function (){
    events.emit('start');
});

var mainEvents = require('./mainEvents.js');
mainEvents.init();

// 读取用户设置
var settings = require('./utils/settings.js');

var token = require('./utils/token.js');
token.init(settings.loadConfig());

// 加载 account
var account = require('./account/init.js');
account.init(settings.loadConfig());

// 加载 resource list
var resourceList = require('./resource-list/init.js');
resourceList.init(settings.loadConfig());

ipcMain.on('get ENV config', function(event){
    event.returnValue = global.ENV;
});
console.log("start electron api ENV:", global.ENV);
