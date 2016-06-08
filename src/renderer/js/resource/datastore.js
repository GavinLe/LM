
var fs = require("fs");
var path = require("path");


function SgResourceDataStore() {

    this.getResourceHeaders = function(callback) {
        $.get(API_URL+ 'api/resource/get_header_list/')
          .success(function (data) {
            var headers = JSON.parse(data).data;
            for (var i = 0, len = headers.length; i < len; ++i) {
              headers[i]['hasNewResource'] = false;
            }

            if (callback) callback(headers);
          });
    };

    this.getProviderResourceHeaders = function(callback) {
        $.get(API_URL+ 'api/company/get_header_list/')
          .success(function (data) {
            console.log(data);
            var headers = data.data;
            for (var i = 0, len = headers.length; i < len; ++i) {
              headers[i]['hasNewResource'] = false;
            }

            if (callback) callback(headers);
          });
    };

    this.getResource = function(resourceId, callback) {

        var file_path = path.join(window.userData, resourceId + '.json');

        console.log(file_path);
        // read cache
        fs.readFile(file_path, 'utf-8', function (err, data) {
          if (!err) {
            // return cache
            if (callback) callback(JSON.parse(data));
            return;
          }

          // fetch from server
          $.post(API_URL + 'api/resource/fetch-json-file2/', {resource_id: resourceId, q: ''})
            .success(function (result) {
              var file_data = result.data.file_stream;

              // save to cache
              fs.writeFile(file_path, JSON.stringify(file_data), function (err) {
                if (err) {
                  return console.error(err);
                }
              });

              if (callback) callback(file_data);
            });
        });
    };

    this.isResourceAvailable = function(resourceId, callback) {
      //check file existing
        var file_path = path.join(window.userData, resourceId + '.json');;
        fs.stat(file_path, function (err, stats) {
          if (callback) {
            return callback(!err);
          }
        });
    };

    return this;
};
