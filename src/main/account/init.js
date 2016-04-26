/**
 * Created by gavin on 16/4/12.
 */
'use strict';


var account = require('./account.js');
var ipcEvents = require('./ipcEvents.js');

module.exports.init = function (settings) {
  ipcEvents.init(settings);
  account.init(settings);
  console.log('用户模块初始化完毕!');
};
