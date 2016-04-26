var fs = require('fs');
var path = require('path');
var request = require('request');
var child_process = require('child_process');

var dateFormat = function (datetime, format) {
    datetime = new Date(datetime);
    var date = {
        "M+": datetime.getMonth() + 1,
        "d+": datetime.getDate(),
        "h+": datetime.getHours(),
        "m+": datetime.getMinutes(),
        "s+": datetime.getSeconds(),
        "q+": Math.floor((datetime.getMonth() + 3) / 3),
        "S+": datetime.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (datetime.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

module.exports.dateFormat = dateFormat;

var downloadPDF = function (item, errorCallBack, successCallBack) {
    try{
        var pdfPath = path.join(__dirname,'../../', require('./../../package.json').app.pdf);
        console.log("download pdf"+ pdfPath);
        console.log(pdfPath);
        ensurePath(pdfPath);
        var filename = item.order_num + '_' + item.wid + '_' + dateFormat(new Date(), 'yyyyMMddhhmmss') + '.pdf';
        request.post({
            url: item.download_pdf_url,
            formData: item.download_pdf_body
        }).on('response', function (response) {
            if (response.statusCode !== 200) {
                return errorCallBack(response.responseText);
            }
            var writeStream = fs.createWriteStream(path.join(pdfPath, filename));
            response.on('error', errorCallBack);
            writeStream.on('error', errorCallBack);
            response.on('end', function () {
                successCallBack(path.join(pdfPath, filename));
            });
            response.pipe(writeStream);
        });
    }catch(e){
        errorCallBack(e);
    }
};
module.exports.downloadPDF = downloadPDF;

function open(p) {
    if (process.platform == 'darwin') {
        child_process.spawn('open', [p]);
    } else {
        child_process.spawn('explorer.exe', [path.join(p)]);
    }
}
module.exports.open = open;

function ensurePath(p) {

  if (fs.existsSync(p)) {
    return;
  }

  ensurePath(path.dirname(p));
  fs.mkdirSync(p);
}