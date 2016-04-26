/**
 * Created by gavin on 16/4/8.
 */

'use strict';
var events = require('./events.js').events;
var storage = require('./storage.js');
var fs = require('fs');
var path = require('path');
var request = require('request');
var build = require('./build.js')

module.exports.init = function (settings) {
  var authLevel = -1;
  module.exports.setAuthLevel = function(newAuthLevel) {
    if (newAuthLevel != authLevel) {
      var oldLevel = authLevel;
      authLevel = newAuthLevel;
      events.emit('auth level changed', oldLevel, authLevel);
    }
  }

  module.exports.checkToken = function () {
    if (!settings.token) {
      setAuthLevel(3);
      return;
    }
    var server = build.loadConfig().server.api;
    var url = server + 'api/check/token/?token=' + settings.token;
    request.get(url, function(error, response, body) {
        if (error) return console.log(error.stack);
        console.log("===== check result =====");
        console.log(body);
        var result = JSON.parse(body);
        var code = result.code;
        if (code == 0) {
            console.log('token正常:', result.data.phone);
            storage.setUser(result.data.phone);
            console.log('auth level:', result.data.auth_level);
            setAuthLevel(result.data.auth_level);
        } else {
            setAuthLevel(3);
        }
    });
  };

  module.exports.heartBeat = function() {
      if (authLevel == 0) {
          checkToken();
      }
  }

};
