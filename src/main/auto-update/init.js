/**
 * Created by gavin on 16/4/12.
 */
'use strict';
var ipcEvents = require('./ipcEvents.js');
var update = require('./update.js');
module.exports.init = function (settings) {
    ipcEvents.init(settings);
    update.init(settings);
};
