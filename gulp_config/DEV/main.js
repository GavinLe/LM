'use strict';
/**
 * Created by gavin on 16/4/19.
 */
var electron = require('electron');
var app = electron.app;
global.ENV = 'DEV';

var events = require('./utils/events.js').events;
var update = require('./utils/update.js');

app.on('window-all-close', function(){
    app.quit();
});


app.on('ready', function (){
    update.update();
    //events.emit('start');
});
app.on('quit', function() {
    settings.save();
    console.log('用户设置已保存，退出应用。');
});

var mainEvents = require('./mainEvents.js');
mainEvents.init();

// 读取用户设置
var settings = require('./utils/settings.js');
var settingConfig = settings.loadConfig();

var token = require('./utils/token.js');
token.init(settingConfig);

// 加载 account
var account = require('./account/init.js');
account.init(settingConfig);

// 加载 resource list
var resourceList = require('./resource-list/init.js');
resourceList.init(settingConfig);

// 加载 auto update
var autoUpdate = require('./auto-update/init.js');
autoUpdate.init(settingConfig);

events.on('check token error', function(){
    app.quit();
});

events.on('sign out', function(){
	app.quit();
});

events.on('network connection failure', function(event, msg){
	const dialog = require('electron').dialog;
	dialog.showErrorBox('网络故障', '网络连接已断开，请检查网络配置.')
})

console.log("start electron api ENV:", global.ENV);
