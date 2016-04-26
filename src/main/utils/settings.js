/**
 * Created by gavin on 16/4/8.
 */

'use strict';

var fs = require('fs');
var path = require('path');
const app = electron.app;

var CONFIG_FILE = path.join(app.getPath('userData'));
console.log('setting path:' + CONFIG_FILE);
var buffer = {};


module.exports.load = function () {
  if (fs.existsSync(CONFIG_FILE)) {
    buffer = JSON.parse(fs.readFileSync(CONFIG_FILE).toString());
  }
  module.exports.data = buffer;
};


module.exports.save = function () {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(buffer, null, 2));
};


module.exports.report = function () {
  console.log('=========== 用户设置 ============');
  if (!buffer.token) {
    console.log('用户未登录');
  } else {
    console.log('用户已登陆, token: ', buffer.token);
  }
  console.log('********************************');
};
