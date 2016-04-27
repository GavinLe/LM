'use strict';
var electron = require('electron');
var app = electron.app;
var ipc = electron.ipcMain;

var path = require('path');
var events = require('./utils/events.js').events;
var helper = require('./utils/helper.js');
var storage = require('./utils/storage.js');

module.exports.init = function(){

    ipc.on('downloadPDF', function(event, item){
        helper.downloadPDF(item, function(err){
              event.sender.send('downloadpdffailreply', err);
        }, function(result){
              event.sender.send('downloadpdfsuccessreply', result);
        });
    });

    ipc.on('open pdf', function(event, pdfPath){
        helper.open(pdfPath);
    });

    ipc.on('get user data', function (event) {
        console.log("function == user");
        event.returnValue = app.getPath('userData');
    });

    ipc.on('get ENV config', function(event){
        console.log("fuck get ENV")
        event.returnValue = global.ENV;
    });

    ipc.on('get user info', function(event){
        event.returnValue = storage.getUserInfo();
    });
};
