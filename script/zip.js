'use strict';

require('shelljs/global');
const pkg = require(`${__dirname}/../package.json`);
const version = require('./version').version;

exec(`cd build/v${version} && zip -r --symlinks ${pkg.name}-darwin-x64.zip ${pkg.name}-v${version}-darwin-x64`)
exec(`cd build/v${version} && zip -r --symlinks ${pkg.name}-win32-x64.zip ${pkg.name}-v${version}-win32-x64`)
exec(`cd build/v${version} && zip -r --symlinks ${pkg.name}-win32-ia32.zip ${pkg.name}-v${version}-win32-ia32`)
