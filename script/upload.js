'use strict';

require('shelljs/global');
const version = require('./version').version;
const pkg = require(`${__dirname}/../package.json`);

exec(`cd build && rm -rf ${pkg.name}-v${version}.tar.gz && tar -zcvf ${pkg.name}-v${version}.tar.gz ${pkg.name}`)

// exec(`cd build && rm -rf upload && mkdir upload && cp -rf ${pkg.name} ./upload && mv ./upload/${pkg.name} ./upload/${version} && mv ./upload/${version}/package.json ./upload/ && zip -r --symlinks ${pkg.name}-v${version}.zip upload`)

// TODO 上传到静态服务器
