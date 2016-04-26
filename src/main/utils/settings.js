/**
 * Created by gavin on 16/4/8.
 */

'use strict';
var fs = require('fs');
var path = require('path');
var electron = require('electron');
var app = electron.app;
var CONFIG_FILE = path.join(app.getPath('userData'), 'settings.json');
var buffer = {};
module.exports.loadConfig = function () {
    if (fs.existsSync(CONFIG_FILE)) {
        buffer = JSON.parse(fs.readFileSync(CONFIG_FILE).toString());
    }
    return buffer;
};

module.exports.save = function () {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(buffer, null, 2));
};
