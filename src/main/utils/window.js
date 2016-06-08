/**
 * Created by gavin on 16/4/8.
 */

'use strict';
var path = require('path');
var BrowserWindow = require('electron').BrowserWindow;
var url = require('url');
var build = require('./build.js');

var all = {};
module.exports.all = all;

var rootPath = path.resolve(path.join(__dirname, '../../renderer/tpl/'));
var windowOptions = {width: 900, height: 600, show: false ,autoHideMenuBar: true};

module.exports.open = function (name, html, app, optinon) {
    optinon =  Object.assign({},windowOptions, optinon);
    if (name == 'account' && all[name]!=undefined){
        console.log("not create ...");
    }else{
        var newWindow = new BrowserWindow(optinon);
        if (build.loadConfig().server.debug) {
            newWindow.openDevTools();
        }
        all[name] = newWindow;
        console.log("create window..." + all[name]);
    }

    if (app == undefined || app == null){
        html = path.join(name, html);
    }
    var windowUrl = '';
    if (optinon && optinon.args){
        var args_str = '';
        for (var p in optinon.args) {
            var piece = p + '=' + encodeURI(optinon.args[p]) + '&';
            args_str += piece;
        }
        windowUrl = url.format({
            protocol: 'file',
            pathname: path.join(rootPath, html),
            slashes: true,
            hash: args_str
        });
    }else{
        windowUrl = 'file://' + path.join(rootPath, html);
    }
    console.log('window render html:' + windowUrl);
    all[name].loadURL(windowUrl);
    all[name].show();
};


module.exports.close = function (name) {
    if (all[name]) {
        //console.log("close window:", name);
        all[name].close();
    }
};

module.exports.hide = function (name) {
    if (all[name]) {
        //console.log("hide window:", name);
        all[name].hide();
    }
};

module.exports.destroy = function (name) {
    if (all[name]) {
        //console.log("destroy window:", name);
        all[name].hide();
        all[name].destroy();
        delete all[name]
    }
};
