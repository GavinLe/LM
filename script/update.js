'use strict';

const dialog = electron.dialog;

var path = require('path');
var fs = require('fs');
var unzip = require('unzip');
var request = require('request');
var exec = require("child_process").exec

var conf = require('../package.json');

var versionUrl = conf.versionUrl;
var downloadUrl = conf.downloadUrl;
var currentVersion = conf.version;

function update(){
  
  // 检查版本是否是最新版本
  var platform = process.platform;
  
  if( platform == 'drawin' || platform != 'win64') {
    request.post({
      url: versionUrl,
      body: currentVersion
    }, function(err, res, body){

      if(!err || res.statusCode==200){
        var info = JSON.parse(body);
        
        if (!info.code) {
          dialog.showMessageBox({
            type: 'question', 
            buttons: ['否', '是'],
            message: '有最新版本是否更新?',
            title: '检查版本',
            noLink: false
          }, function(res){
            if (res) {

              // //下载zip文件,解压，解压完后把zip文件,在原来的应用目录下增加新版本目录
              // request.post({url: downloadUrl}).on('response', function(res){
              //   if (res.statusCode==200){

              //     var unzipPath = path.join(__dirname, '../../'+info.data);
                  
              //     var appPath = path.join(unzipPath, 'app/'+info.data);
              //     var pgPath = path.join(unzipPath, 'app/package.json');
              //     var oldAppPath = path.join(unzipPath, info.data);
              //     var oldPgPath = path.join(unzipPath, 'package.json');
                  
              //     res.pipe(unzip.Extract({ path: unzipPath })).on('close', function(err){
                    
              //       fs.mkdirSync(oldAppPath);

              //       fs.rename(appPath, oldAppPath, function(){
              //         var crs = fs.createReadStream(pgPath);
              //         var cws = fs.createWriteStream(oldPgPath)
              //         crs.pipe(cws).on('close', function(err){
              //           if(!err){

              //             if(fs.existsSync(file)){
              //               fs.unlinkSync(unzipPath)
              //             }
              //             //提示用户重新打开
              //             dialog.showMessageBox({
              //               type: 'question', 
              //               buttons: ['否', '是'],
              //               message: '更新完成,如果需要使用新版本,请重新打开',
              //               title: '更新',
              //               defaultId: 0,
              //               cancelId: 1,
              //               noLink: false
              //             }, function(res){

              //               if (res) {
              //                 app.quit();
              //               }
              //             });
              //           }else{
              //             dialog.showErroeBox('更新失败', err);
              //           }
              //         });
              //       });
              //     });
              //   }else{
              //     dialog.showErroeBox('更新失败', res.statusCode);
              //   }
              // });
            }
          });
        }
      }
    });
  }
}