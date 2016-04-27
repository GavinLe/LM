/**
 * Created by gavin on 16/4/18.
 */

'use strict';

require('shelljs/global');
const packager = require('electron-packager');
const pkg = require(`${__dirname}/../package.json`);
const devDeps = Object.keys(pkg.devDependencies);

const DEFAULT_OPTS = {
  dir:   './',
  name:  pkg.name,
  asar:  true,
  prune: true,
  out:   `build/v${pkg.version}`,
  'app-version': pkg.version,
  ignore: [
    '.DS_Store',
    '.git',
    '/packages($|/)',
    '/script($|/)',
    '/test($|/)',
  ].concat(devDeps.map(name => `/node_modules/${name}($|/)`)),
}

const pack = (platform, arch, callback) => {
  const opts = Object.assign({}, DEFAULT_OPTS, { platform, arch });
  packager(opts, (err, filepath) => {
    if (err) return console.error(err);
    console.log(`${platform}-${arch} finished!`);
  });
}

exec('rm -rf build');
pack('darwin', 'x64');
pack('win32',  'ia32');
pack('win32',  'x64');
