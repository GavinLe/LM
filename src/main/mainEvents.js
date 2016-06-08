'use strict';
var electron = require('electron');
var app = electron.app;
var ipc = electron.ipcMain;

var path = require('path');
var events = require('./utils/events.js').events;
var storage = require('./utils/storage.js');
var windows = require('./utils/window.js');


module.exports.init = function(){


    ipc.on('get ENV config', function(event){
        event.returnValue = global.ENV;
    });

    ipc.on('get user info', function(event){
        event.returnValue = storage.getUserInfo();
    });
};
