/**
 * Created by gavin on 16/4/8.
 */

'use strict';

var events = require('events');

var mainEvents = new events.EventEmitter();

module.exports.events = mainEvents;