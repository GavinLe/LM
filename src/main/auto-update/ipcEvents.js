/**
 * Created by gavin on 16/4/12.
 */

'use strict';
var ipc = require('electron').ipcMain;
var update = require('../utils/update.js');

module.exports.init = function (settings) {
    ipc.on('progress precent', function(event){
        var precent = update.precent;
        event.returnValue = precent;
        if (precent == 100) {
            event.sender.send('download ok');
        }
    })
};
