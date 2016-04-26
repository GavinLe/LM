/**
 * Created by gavin on 16/4/18.
 */

'use strict';

require('shelljs/global');
const fs = require('fs');

const json = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`));
exports.version = json['version'];
