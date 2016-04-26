/**
 * Created by gavin on 16/4/8.
 */

'use strict';

var build = require('./build.js');
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');

build.load();
build.report();


var currentUser = '';

function setUser(phone) {
  currentUser = phone;
}
module.exports.setUser = setUser;


function readJSON(p) {
  var filepath = path.join(getUserRoot(), p);

  if (!fs.existsSync(filepath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(filepath));
}
module.exports.readJSON = readJSON;


function writeJSON(p, obj) {
  writeBuffer(p, JSON.stringify(obj));
}
module.exports.writeJSON = writeJSON;


function writeBuffer(p, buffer, options) {
  var filepath = path.join(getUserRoot(), p);
  ensurePath(path.dirname(filepath));
  fs.writeFileSync(filepath, buffer, options);
}
module.exports.writeBuffer = writeBuffer;


function open(p) {
  var filepath = path.join(getUserRoot(), p);
  if (process.platform == 'darwin') {
    child_process.spawn('open', [filepath]);
  } else {
    child_process.spawn('start', [filepath]);
  }
}
module.exports.open = open;


function getPath(p) {
  var filepath = path.join(getUserRoot(), p, 'txt.txt');
  var userPath = path.dirname(filepath);
  ensurePath(userPath);
  return userPath;
}
module.exports.getPath = getPath
  /////////////////////////////////////////////

function getUserRoot() {
  var rootPath;
  if (process.platform == 'darwin') {
    rootPath = path.resolve(build.data.userRoot);
  } else {
    // TODO：对于windows读取注册表
    rootPath = 'C:\\Banma';
  }

  return path.join(rootPath, currentUser);
}


function ensurePath(p) {

  if (fs.existsSync(p)) {
    return;
  }

  ensurePath(path.dirname(p));
  fs.mkdirSync(p);
}