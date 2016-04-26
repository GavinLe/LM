/**
 * Created by gavin on 16/4/8.
 */

'use strict';
var request = require('request');
var ipc = require('electron').ipcRenderer;
var fs = require('fs');
var path = require('path');
var CONFIG_FILE = path.join(__dirname, '../../../resources/build.json');
console.log(CONFIG_FILE);
var buffer = {};
var ENV = ipc.sendSync('get ENV config');

var readConfig = function () {
  buffer = JSON.parse(fs.readFileSync(CONFIG_FILE).toString());
  var config = buffer.server[ENV];
  buffer.server = {};
  buffer.server = config;
  return buffer;
};
module.exports.readConfig = readConfig;

function buildAPI(server, path, method) {

  if (method == 'GET') {

    return function(params, successCallback, errorCallback) {
      var url = server + path + '?';

      for (var p in params) {
        var piece = p + '=' + encodeURI(params[p]) + '&';
        url += piece;
      }

      request.get(url, function(error, response, body) {
        if (error) return console.log(error.stack);
        var result = JSON.parse(body);

        console.log('=====================URL GET START============================');
        console.log(url);
        console.log(params);
        console.log('===============================================================');
        console.log(result);
        console.log('======================URL GET END =============================');

        var code = result.code;
        if (code == 0) {
          if (successCallback) {
            successCallback(result);
          }
        } else {
          if (errorCallback) {
            errorCallback(code, result);
          }
        }
      });
    }
  }

  if (method == 'POST') {

    return function(body, successCallback, errorCallback) {
      var url = server + path + '?';
      var opts = {
        url: url,
        method: 'POST',
        body: JSON.stringify(body),
        timeout: 20 * 1000,
      };
      var timeStart = new Date().getTime();
      console.log('====== POST send request');
      console.log(opts);
      request(opts, function(error, response, body) {
        if (error) {
          if (errorCallback) {
            errorCallback(-1, error);
          }
          console.log('======================OPTS START===========================');
          console.log(url);
          console.log(error);
          console.log('===========================================================');
          console.log(body);
          console.log(new Date().getTime() - timeStart);
          console.log('======================OPTS END==============================');
          return;
        }

        var result = JSON.parse(body);

        console.log('======================URL POST START ===========================');
        console.log(url);
        console.log(result);
        console.log(new Date().getTime() - timeStart);
        console.log('=======================URL POST END ==========================');

        var code = result.code;
        //delete result.code;

        if (code == 0) {
          if (successCallback) {
            successCallback(result);
          }
        } else {
          if (errorCallback) {
            errorCallback(code, result);
          }
        }
      });
    }

  }
}

var config = readConfig();
var serviceServer = config.server.api;

module.exports.send_sms = buildAPI(serviceServer, 'api/send/sms/', 'GET');
module.exports.sign_in_sms = buildAPI(serviceServer, 'api/sign/in/sms/', 'GET');
module.exports.sign_in_password = buildAPI(serviceServer, 'api/sign/in/password/', 'GET');
module.exports.check_token = buildAPI(serviceServer, 'api/check/token/', 'GET');
module.exports.set_password = buildAPI(serviceServer, 'api/set/password/', 'GET');
//module.exports.set_profile = buildAPI(serviceServer, 'api/set/profile/', 'GET');
//module.exports.get_profile = buildAPI(serviceServer, 'api/get/profile/', 'GET');
module.exports.sign_out = buildAPI(serviceServer, 'api/sign/out/', 'GET');
module.exports.buy_btn = buildAPI(serviceServer, 'api/buy/btn/', 'POST');
