'use strict';

require('shelljs/global');
const pkg = require(`${__dirname}/../package.json`);
const version = require('./version').version;

var build_platform = ['win32-ia32','win32-x64']; // 'win32-x64','win32-ia32'

var zip_build = function(){
    for (var i = 0; i < build_platform.length; i++) {
        var platform = build_platform[i];
        console.log("####################################################");
        console.log("########## zip "+platform+".zip start.. ############");
        console.log("####################################################");
        cd(`build/release/v${version}/v${pkg.electronVersion}/`);
        mkdir('-p', `temp/${platform}/`);
        cp('-rf', `${platform}/`, `temp/${platform}/`);
        //cd(`temp/${platform}/resources/`);
        //mkdir('-p', `temp/${version}/`);
        //mv(`app/*`, `temp/${version}/`);
        //sed('-i', 'src', `${version}/src`, `./temp/${version}/package.json`);
        //mv(`temp/${version}/package.json`, `temp/`);
        //mv('temp/*', `app/`);
        //rm('-rf', './temp');
        cd(`../../../../`);
        cp('-rf','script/uninstall.exe', `build/release/v${version}/v${pkg.electronVersion}/temp/${platform}/`);
        cd(`build/release/v${version}/v${pkg.electronVersion}/temp/`);
        rm('-rf', `${platform}.zip`);
        exec(`zip -r --symlinks ../${platform}.zip ${platform}`);
        cd('../');
        rm('-rf', './temp');
        console.log("####################################################");
        console.log("########## zip "+platform+".zip success ############");
        console.log("####################################################");
    }
}
zip_build();
