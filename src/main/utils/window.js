/**
 * Created by gavin on 16/4/8.
 */

'use strict';
var path = require('path');
var BrowserWindow = require('browser-window');
var build = require('./build.js');
build.load();

var all = {};
module.exports.all = all;

// 获取渲染页面的绝对路径
var rootPath = path.resolve(path.join(__dirname, '../../render/tpl'));
var windowOptions = {width: 800, height:600};

module.exports.open = function (name, html, app, optinon) {
  optinon =  Object.assign(windowOptions, optinon);
  if (!all[name]){
    var newWindow = new BrowserWindow(optinon);
    if (build.data.server.debug) {
        newWindow.openDevTools();
    }
    all[name] = newWindow;
  };
  if (app == undefined || app == null){
      html = path.join(name, html);
  }
  var windowUrl = 'file://' + path.join(rootPath, html);
  console.log('window render html:' + windowUrl);
  all[name].loadURL(windowUrl);
};


module.exports.close = function (name) {
  if (all[name]) {
    all[name].hide();
  }
};
