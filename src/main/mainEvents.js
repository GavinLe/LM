'use strict';
const app = electron.app;
var path = require('path');
var ipc = require('electron').ipcMain;
var events = require('utils/events.js').events;
var helper = require('utils/helper.js');

module.exports.init = function () {
  ipc.on('downloadPDF', function(event, item){
      helper.downloadPDF(item,
          function(err){
              event.sender.send('downloadpdffailreply', err);
          }, function(result){
              event.sender.send('downloadpdfsuccessreply', result);
          });
  });

  ipc.on('open pdf', function(event, pdfPath){
      helper.open(pdfPath);
  });

  ipc.on('get user data', function(event){
      console.log( app.getPath('userData'));
      event.returnValue = app.getPath('userData');
  });

})
