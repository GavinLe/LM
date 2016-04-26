/**
 * Created by gavin on 16/4/12.
 */
'use strict';

var ipcEvents = require('./ipcEvents.js');

module.exports.init = function (settings) {
    ipcEvents.init(settings);
    console.log('home 资源单模块初始化完毕!');
};