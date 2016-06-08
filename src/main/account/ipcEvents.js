/**
 * Created by gavin on 16/4/12.
 */

'use strict';
var path = require('path');
var ipc = require('electron').ipcMain;
var tk = require('../utils/token.js');
var windows = require('../utils/window.js');
var events = require('../utils/events.js').events;

module.exports.init = function (settings) {
  ipc.on('get token', function(event) {
    event.returnValue = settings.token;
  });


  ipc.on('sign out', function(event) {
    delete settings.token;
    events.emit('sign out');
    //tk.checkToken();

  });

  ipc.on('sign in', function(event, token) {
    //tk.setToken(token);
    settings.token = token;
    tk.checkToken();
  });


  ipc.on('set password success', function(event) {
    tk.checkToken();
  });


  ipc.on('set profile success', function(event) {
    tk.checkToken();
  });


  ipc.on('change user profile', function(event) {
    windows.open('resetprofile', 'reset_profile.html', 'account', 'children');
  });

  ipc.on('change password', function(event) {
    windows.open('settings', 'reset_password.html', 'account', 'children');
  });

  ipc.on('user settings', function(event){
    windows.open('settings', 'account\/user_settings.html', true, {width: 800, height:550});
  });
};
