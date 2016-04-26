/**
 * Created by gavin on 16/4/8.
 */

'use strict';
var events = require('../utils/events.js').events;
var windows = require('../utils/window.js');
var tk = require('../utils/token.js');

module.exports.init = function (settings) {

    events.on('auth level changed', function (oldAuthLevel, newAuthLevel) {
        console.log('用户登录级别变化', oldAuthLevel, '==>', newAuthLevel);
        if (newAuthLevel == 0) {
            windows.open('home', 'home.html', true, { width: 1100, height: 600 });
            //windows.open('test', 'test.html', true, { width: 1100, height: 600 });
            windows.close('account');
        } else if (newAuthLevel == 1) {
            windows.open('account', 'set_password.html');
        } else if (newAuthLevel == 2) {
            windows.open('account', 'set_profile.html');
        } else {
            windows.open('account', 'sign_in.html');
        }
    });


    events.on('start', function () {
        console.log("====== app start =====");
        tk.checkToken();
        // 15s一次的token检查
        setInterval(tk.heartBeat, 15 * 1000);
    });

};
