/**
 * Created by gavin on 16/4/12.
 */

'use strict';
var path = require('path');
var tk = require('../token.js');
var ipc = require('electron').ipcMain;
var windows = require('../window.js');

module.exports.init = function (settings) {
  ipc.on('get token', function(event) {
    event.returnValue = settings.token;
  });


  ipc.on('sign out', function(event) {
    console.log('====ipc: sign out =====');
    delete settings.token;
    tk.checkToken();
  });

  ipc.on('sign in', function(event, token) {
    console.log('====ipc: sign in =====');
    console.log(token);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>');
    settings.token = token;
    tk.checkToken();
  });


  ipc.on('set password success', function(event) {
    console.log('====ipc: set password success =====');
    tk.checkToken();
  });


  ipc.on('set profile success', function(event) {
    console.log('====ipc: set profile success =====');
    tk.checkToken();
  });


  ipc.on('change user profile', function(event) {
    windows.open('resetprofile', 'reset_profile.html', 'account', 'children');
  });

  ipc.on('change password', function(event) {
    windows.open('settings', 'reset_password.html', 'account', 'children');
  });
};