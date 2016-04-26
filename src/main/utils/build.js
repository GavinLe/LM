/**
 * Created by gavin on 16/4/8.
 */

'use strict';


var fs = require('fs');
var path = require('path');
var CONFIG_FILE = path.join(__dirname, '../env/build.json');

module.exports.loadConfig = function () {
  buffer = JSON.parse(fs.readFileSync(CONFIG_FILE).toString());
  var server = buffer.server[global.ENV];
  buffer.server = {};
  buffer.server = server;
  return buffer;
};
