'use strict';

const dialog = require('electron').dialog;
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var request = require('request');
var app = require('electron').app;
var events = require('./events.js').events;
var tarball = require('tarball-extract');
var build = require('./build.js').loadConfig();
var packageJson = require('../../../package.json');

var conf = build.server;
var versionUrl = conf.api + conf.CHECK_VERSION_URL;
var currentVersion = packageJson.version;

var precent = 0

function update(){
    var platform = process.platform;
    if( platform == 'win32' || platform == 'win64'){
        request.post(
            {
                url: versionUrl,
                form: {'version':currentVersion}
            },
            function(err, res, body){
                if (err) {
                    events.emit('start');
                }else if (res.statusCode != undefined && 200 == res.statusCode ){
                    var info = JSON.parse(body);
                    if (0 == info.code && info.data != undefined && info.data.version != currentVersion){
                        events.emit('open progress');
                        var url = conf.api + info.data.url;
                        var filename = info.data.filename
                        // 下载zip文件,解压，解压完后把zip文件,在原来的应用目录下增加新版本目录
                        request.get({url: url}).on('response', function(res){
                            var targzPath = path.join(__dirname, '../../../../'+filename);
                            var write = fs.createWriteStream(targzPath);
                            var dest = path.join(__dirname, '../../../../');
                            var sourcePath = path.join(dest, 'sgzs');
                            var destPath = path.join(dest, 'app');
                            var nowLength = 0
                            var totalSize = res.headers['content-length'];
                            res.on('data', function(chunk){
                                nowLength += chunk.length;
                                precent = Math.ceil((nowLength / totalSize) * 100);
                                module.exports.precent = precent;
                                if (write.write(chunk)===false){
                                    res.pause();
                                }
                            });

                            write.on('drain', function() {
                                res.resume();
                            });

                            res.on('end', function(){
                                write.end();
                                tarball.extractTarball(
                                    targzPath, dest,
                                    function(err){
                                        if (err){
                                            dialog.showErrorBox('更新失败', '删除文件出错');
                                            app.quit();
                                        }else{
                                            fse.copySync(sourcePath, destPath, {clobber: true});
                                            fse.removeSync(targzPath);
                                            fse.removeSync(sourcePath);
                                            events.emit('hide progress');
                                            dialog.showMessageBox(
                                                {
                                                    type: 'question',
                                                    buttons: ['是'],
                                                    message: '请重新打开应用程序',
                                                    title: '更新完成',
                                                    noLink: false
                                                }, function(res){
                                                    events.emit('destroy progress');
                                                });
                                        }
                                    });
                            });
                        });
                    }else{
                        events.emit('start');
                    }
                }else {
                    events.emit('start');
                }
            })
    }else{
        events.emit('start');
    }
}

module.exports.update = update;
module.exports.precent = precent;
