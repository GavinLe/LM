/**
 * Created by gavin on 16/4/8.
 */

'use strict';
var events = require('../utils/events.js').events;
var windows = require('../utils/window.js');

module.exports.init = function (settings) {

    events.on('open progress', function(){
		windows.open(
            'progress',
            'progress.html',
            true,
            {
                width:500,
                height:80,
                autoHideMenuBar: true,
                alwaysOnTop:true,
                minimizable: false,
                maximizable:false,
                closable: false
            }
        );
	});

    events.on('destroy progress', function(){
        windows.destroy('progress');
    });

    events.on('hide progress', function(){
        windows.hide('progress');
    });

};
