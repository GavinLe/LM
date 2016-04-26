/**
 * Created by gavin on 16/4/8.
 */

'use strict';
var path = require('path');
var BrowserWindow = require('browser-window');
var build = require('./build.js');

var all = {};
module.exports.all = all;

var rootPath = path.resolve(path.join(__dirname, '../../renderer/tpl/'));
var windowOptions = {width: 800, height:600};

module.exports.open = function (name, html, app, optinon) {
    optinon =  Object.assign(windowOptions, optinon);
    if (!all[name]){
        var newWindow = new BrowserWindow(optinon);
        if (build.loadConfig().server.debug) {
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
