/**
 * Created by gavin on 16/3/25.
 */
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var request = require('request');

$(document).ready(function(){

    // 加载 dialog 模板
    //$("#includedContent").load("../tpl/dialog.html");

    /**
     * 绑定下载pdf事件
     */
    $('#includedContent').on('click','.downloadPDF', function (){

        var res_code = $(this).data('wid');
        var order_num = $(this).data('order_num');
        var url = $(this).data('url');
        var body = $(this).data('body');
        var params = {
          wid:res_code,
          order_num:order_num,
          download_pdf_url:url,
          download_pdf_body:body
        };

        log_service.trackEvent('质保书下载', 'click_query', {'res_code': res_code, 'order_num':order_num});
        var dialog = remote.dialog;
        var pdfPathList = null;
        if (_.isEmpty(pdfPathList)){
            pdfPathList = dialog.showOpenDialog({
                title:'质保书保存位置',
                defaultPath:remote.app.getPath('desktop'),
                filters: [{ name: 'pdf', extensions:['pdf']}],
                properties: [ 'openFile', 'openDirectory' ]}
            )
        }else{
            notie.alert(2, "窗口已被打开,请选择文件。");
        }
        if (pdfPathList.length > 0){
            try{
                loading.showLoading();
                var pdfSavePath = pdfPathList[0];
                var filename = params.order_num + '_' + params.wid + '_' + BMUtils.dateFormat(new Date(), 'yyyyMMddhhmmss') + '.pdf';
                request.post({
                  url: params.download_pdf_url,
                  formData: params.download_pdf_body
                }).on('response', function (response) {
                    loading.hideLoading();
                    if (response.statusCode !== 200) {
                        notie.alert(3, '下载失败' + response.responseText);
                        return;
                    }
                    var writeStream = fs.createWriteStream(path.join(pdfSavePath, filename));
                    response.on('error', function(err){
                        notie.alert(3, '下载失败' + response.responseText);
                        return;
                    });
                    writeStream.on('error', function(err){
                        notie.alert(3, '下载失败' + response.responseText);
                        return;
                    });
                    response.on('end', function () {
                        notie.alert(1, '下载成功' + filename);
                    });
                    response.pipe(writeStream);
                });
            }catch(e){
                loading.hideLoading();
                notie.alert(3, '下载失败' + e);
            }
        }
    });

    /**
     *  绑定弹框显示货物状态查询
     */
    $('#showStatusDialog').on('click', function(){
        $('#cgProduct').val('');  // 设置 为空
        $('#cgShopSign').val('');
        $('#cgSpec').val('');
        $('#cgManufacturer').val('');
        $('#cgWeight').val('');
        $('#cgWarehouse').val('');
        $('#cgPackCode').val('');
        $('#cgProviderName').val('');
        $('#cgResStatus').attr('class', '');
        $('#statusSearch').modal({backdrop:true});

        log_service.trackEvent('验灯', 'click_query');
    });

    /**
     * 货物状态弹出框查询按钮绑定事件
     */
    $('#includedContent').on('click','#statusSearchBtn', function(){
        var product = $('#cgProduct').val();
        if (_.isEmpty(product)){
            notie.alert(2, '请输入品种');
            return;
        }
        var shopSign = $('#cgShopSign').val();
        if (_.isEmpty(shopSign)){
            notie.alert(2, '请输入材质');
            return;
        }
        var spec = $('#cgSpec').val();
        if (_.isEmpty(spec)){
            notie.alert(2, '请输入规格');
            return;
        }
        var manufacturer = $('#cgManufacturer').val();
        if (_.isEmpty(manufacturer)){
            notie.alert(2, '请输入钢厂');
            return;
        }
        var weight = $('#cgWeight').val();
        if (_.isEmpty(weight)){
            notie.alert(2, '请输入重量');
            return;
        }
        var warehouse = $('#cgWarehouse').val();
        if (_.isEmpty(warehouse)){
            notie.alert(2, '请输入仓库');
            return;
        }
        var providerName = $('#cgProviderName').val();
        if (_.isEmpty(providerName)){
            notie.alert(2, '请输入货主名称');
            return;
        }

        var packCode = $('#cgPackCode').val();

        var params = {
            product_name: product,
            shop_sign: shopSign,
            spec: spec,
            manufacturer: manufacturer,
            weight: weight,
            warehouse: warehouse,
            provider_name: providerName,
            pack_code: packCode
        };
        tools.statusSearch(params);
    });

    /**
     *  绑定弹框显示质保书查询
     */
    $('#showGuaranteeDialog').on('click', function(){
        $('#resSodeBody').empty(); // 清空上次查询的数据
        $('#resCodeDialog .guarantee input[name="guarantee"]').val('');
        $('#resCodeDialog .guarantee').removeClass('hide');
        $('#resCodeDialog').modal({backdrop:true});

        log_service.trackEvent('质保书查询', 'click_query');
    });

    /**
     * 质保书弹出框查询按钮绑定事件
     */
    $('#includedContent').on('click','#guaranteeSearchBtn', function(){
        var searchValue = $('#resCodeDialog .guarantee input[name="guarantee"]').val();
        if (_.isEmpty(searchValue)){
            notie.alert(2,'请输入查询条件');
            return;
        }
        tools.guaranteeSearch(searchValue);
    });

    /**
     *  绑定弹框显示真实货主查询
     */
    $('#showRealyProviderDialog').on('click', function(){
        $('#spProduct').val('');  // 设置 为空
        $('#spShopSign').val('');
        $('#spSpec').val('');
        $('#spManufacturer').val('');
        $('#spWeight').val('');
        $('#spWarehouse').val('');
        $('#spPackCode').val('');
        $('#realityProvider').val('');
        $('#realProviderSearch').modal({backdrop:true});
        $('.realProviderSearchParams').removeClass('hide');
    });

    /**
     * 真实货主弹出框查询按钮绑定事件
     */
    $('#includedContent').on('click','#realProviderSearchBtn', function(){
        var product = $('#spProduct').val();
        if (_.isEmpty(product)){
            notie.alert(2, '请输入品种');
            return;
        }
        var shopSign = $('#spShopSign').val();
        if (_.isEmpty(shopSign)){
            notie.alert(2, '请输入材质');
            return;
        }
        var spec = $('#spSpec').val();
        if (_.isEmpty(spec)){
            notie.alert(2, '请输入规格');
            return;
        }
        var manufacturer = $('#spManufacturer').val();
        if (_.isEmpty(manufacturer)){
            notie.alert(2, '请输入钢厂');
            return;
        }
        var weight = $('#spWeight').val();
        if (_.isEmpty(weight)){
            notie.alert(2, '请输入重量');
            return;
        }
        var warehouse = $('#spWarehouse').val();
        if (_.isEmpty(warehouse)){
            notie.alert(2, '请输入仓库');
            return;
        }
        var packCode = $('#spPackCode').val();


        var params = {
            product_name: product,
            shop_sign: shopSign,
            spec: spec,
            manufacturer: manufacturer,
            weight: weight,
            warehouse: warehouse,
            pack_code: packCode
        };
        tools.realProviderSearch(params);

        //log_service.trackEvent('真实货主查询', 'click_query');
    });

    /**
     *  绑定弹框显示材质查询
     */
    $('#showtrademarkDialog').on('click', function(){
        $('#tdName').val('');
        $('#trademarkBody').empty();
        $('#trademarkSearch .trademarkBtn ').removeClass('hide');
        $('#trademarkSearch').modal({backdrop:true});

        //log_service.trackEvent('牌号查询', 'click_query');
    });

    /**
     * 材质弹出框查询按钮绑定事件
     */
    $('#includedContent').on('click','#trademarkSearchBtn', function(){
        var name = $('#tdName').val();
        if (_.isEmpty(name)){
            notie.alert(2,'请输入查询条件');
            return;
        }
        tools.trademarkSearch(name);
    });

    /**
     *  绑定弹框显示仓库查询
     */
    $('#showWarehouseSearchDialog').on('click', function(){
        $("#warehouseSearch input[name='warehouse']").val('');
        $('#warehouseSearch .warehouseBtn').removeClass('hide');
        $('#warehouse').empty();
        $('#warehouseSearch').modal({backdrop:true});

        //log_service.trackEvent('仓库查询', 'click_query');
    });

    /**
     * 仓库弹出框查询按钮绑定事件
     */
    $('#includedContent').on('click', '#warehouseSearchBtn', function(){
        var searchValue = $("#warehouseSearch input[name='warehouse']").val();
        if (_.isEmpty(searchValue)){
            notie.alert(2,'请输入查询条件');
            return;
        }
        tools.warehouseSearch(searchValue);
    });

    /**
     *  绑定弹框显示供应商查询
     */
    $('#showProviderSearchDialog').on('click', function(){
        $('#pnProviderName').val('');
        $('#providerNameSearch .providerNameBtn').removeClass('hide');
        $('#providerNameBody').empty();
        $('#providerNameSearch').modal({backdrop:true});

        //log_service.trackEvent('供应商查询', 'click_query');
    });

    /**
     * 供应商弹出框查询按钮绑定事件
     */
    $('#includedContent').on('click', '#providerSearchBtn', function(){
        var name = $('#pnProviderName').val();
        if (_.isEmpty(name)){
            notie.alert(2, '请输入供应商名称');
            return;
        }
        tools.providerSearch(name);
    });

    /**
     * 用户设置windows窗口
     */
    $('#openUserSettings').on('click', function(){
        ipc.send('user settings');
    });

    $('.sg-helper').on('click','#showContactBtn', function(){
        var list = $(this).data('contacts').split(';');
    });

    $('#quitBtn').on('click', function(){
        ipc.send('sign out');
    });


    // 获取本地资源单显示
    $('.sg-helper').on('click','#addMyResource',function(){
        var dialog = remote.dialog;
        var execlFilePath = null;
        if (_.isEmpty(execlFilePath)){
            execlFilePath = dialog.showOpenDialog({
                title:'请选择execl文件',
                defaultPath:remote.app.getPath('desktop'),
                filters: [{ name: 'execl', extensions:['xls', 'xlsx']}],
                properties: [ 'openFile']}
            )
        }else{
            notie.alert(2, "窗口已被打开,请选择文件。");
        }

        // 多文件 、多个sheet 获取数据预览
        var transformResult = [];
        if (execlFilePath && execlFilePath.length >= 1){
            for (var i = 0, len = execlFilePath.length; i < len; i++) {
                var itemWorkbook = XLSX.readFile(execlFilePath[i]);
                itemWorkbook.SheetNames.forEach(function(sheetName) {
                    var sheetData = XLSX.utils.sheet_to_json(itemWorkbook.Sheets[sheetName]);
                    for (var k = 0, len = sheetData.length; k < len; k++) {
                        // execl 和显示的key 转换
                        var item = {
                            'product_name': sheetData[k]['品种'] || '',
                            'shop_sign': sheetData[k]['牌号'] || '',
                            'manufacturer': sheetData[k]['钢厂'] || '',
                            'spec': sheetData[k]['规格'] || '',
                            'weight': sheetData[k]['重量'] || '',
                            'provider_name': sheetData[k]['供应商'] || '',
                            'warehouse_name': sheetData[k]['仓库'] || '',
                            'price': sheetData[k]['价格'] || '',
                            'pack_code': sheetData[k]['捆包号'] || '',
                            'factory_res_code': sheetData[k]['钢厂资源号'] || '',
                            'res_status': sheetData[k]['灯'] || '',
                            'note': sheetData[k]['备注'] || '',
                            'origin_url': sheetData[k]['地址'] || ''
                        }
                        transformResult.push(item);
                    }
                });
            }
            // 清除本次选择的窗口
            execlFilePath = null;
            //loadMyResources(null, transformResult);
            var filePath = path.join(remote.app.getPath('userData'), userInfo.companyInfo.id + '.json');
            fs.writeFile(filePath, JSON.stringify(transformResult) , 'utf8', function(err){
                if (err) throw err;
                var inp = fs.createReadStream(filePath);
                var outFile = fs.createWriteStream(filePath+'.gz');
                var gzip = zlib.createGzip();
                inp.pipe(gzip).pipe(outFile);
                // 显示 资源
                isUploaded = false;
                showMyResource();
            });
        }

    });

    // 显示我的资源
    $('#showMyResource > a').on('click', function(){
        showMyResource();
    });

    $('.sg-helper').on('click','#uploadMyResource',function(){
        saveMyResource();
    })

    $('.sg-helper').on('click', '#downloadSGZS' , function(){
        var dialog = remote.dialog;
        var execlSavePath = dialog.showSaveDialog({
            title:'文件保存的位置',
            defaultPath:remote.app.getPath('desktop'),
            filters: [{ name: 'execl', extensions:['xls', 'xlsx']}]
        });
        request(API_URL + '/static/sg_tmpl/sgzs_resource.xls').pipe(fs.createWriteStream(execlSavePath));
    })

    //获取最新的资源单
    function getMyResource(){
        var param ={
            company_id: userInfo.companyInfo.id
        }
        loading.showLoading();
        api.getMyResource(
            param,
            function (result) {
                loading.hideLoading();
                var rs = result;
                if (rs.code == 0){
                    //Save File to local
                    var filePath = path.join(remote.app.getPath('userData'), userInfo.companyInfo.id + '.json');
                    fs.writeFile(filePath, JSON.stringify(rs.data) , 'utf8', function(err){
                        if (err) throw err;
                        var inp = fs.createReadStream(filePath);
                        var outFile = fs.createWriteStream(filePath+'.gz');
                        var gzip = zlib.createGzip();
                        inp.pipe(gzip).pipe(outFile);
                        // 显示 资源
                        isUploaded=true;
                        showMyResource();
                    });

                }else{
                    showMyResource();
                }
            },
            function (code, err) {
                loading.hideLoading();
            })
    }

    //保存客户自己上传的资源
    function saveMyResource(){
        var param ={
            user_id: userInfo.user_id,
            company_id: userInfo.companyInfo.id
        }
        var check = $('.bm-red');
        if (check.length > 0){
            notie.alert(2, '数据存在问题, 请修改数据重新加载');
        }else{
            var filePath = path.join(remote.app.getPath('userData') , userInfo.companyInfo.id + '.json.gz');
            api.saveMyResource(
                param,
                filePath,
                function (result) {
                    loading.hideLoading();
                    var rs = result;
                    if (rs.code == 0){
                        notie.alert(1, "资源上传成功");
                        $('#providerInfo').empty();
                        isUploaded = true;
                        loadProviderResources();  // 刷新供应商资源
                    }else{
                        notie.alert(3, result.message);
                    }
                },
                function (code, err) {
                    loading.hideLoading();
                    notie.alert(3, err.message);
                })
        }
    }

    // 显示 我的资源
    function showMyResource(){
        fs.readFile(path.join(remote.app.getPath('userData') , userInfo.companyInfo.id + '.json') , 'utf-8', function (err, data) {
            $('#example1').empty();
            if (err != null) {
                // 未上传 并且 未预览过
                var tmpl = '<a id="addMyResource" class="btn btn-default" role="button">添加资源单预览</a><p>预览必须使用搜刚助手提供的模板, 如果您还未有模板请点击<a id="downloadSGZS">此处</a>下载</p>';

                $('#providerInfo').empty().html(tmpl);
            }else{
                if(isUploaded==false){
                    // 未上传
                    var tmpl = '<p> 当前资源为预览资源并未上传, 仅自己可见。 如需跟多人可见, 请上传。'
                    + '<a id="uploadMyResource" class="btn btn-default" role="button">上传资源</a>'
                    + '&nbsp;<a id="addMyResource" class="btn btn-default" role="button">重新加载</a>'
                    + '</p>';
                    $('#providerInfo').empty().html(tmpl);
                }else{
                    // 已上传
                    var tmpl = '<p> 当前资源为最近上传资源, 如需更新点击更新资源。'
                    + '<a id="addMyResource" class="btn btn-default" role="button">更新资源</a>'
                    + '</p>';
                    $('#providerInfo').empty().html(tmpl);
                }
                loadMyResources(null, JSON.parse(data));
            }
        })
    }

    function updateResource (headers, ds) {
        ds.getResourceHeaders(function (h) {
            var new_headers = h;
            for (var i = 0; i < headers.length; i++) {
                for (var j = 0; j < new_headers.length; j++) {
                    // 比较 new_headers_list和headers_list相同的provider_name的resource_id是否相同
                    if (headers[i].provider_name == new_headers[j].provider_name
                        && headers[i].resource_id != new_headers[j].resource_id) {
                        var row = new_headers[j];
                        var ele = $('#' + headers[i].resource_id);
                        $(ele).find('span[name="provider_name"]').attr({
                            'sid': new_headers[j].resource_id,
                            'sold_id': headers[i].resource_id
                        });
                        $(ele).find('span[name="badge"]').removeClass('badge-normal').addClass('badge-update');

                        $(ele).find('span[name="provider_name"]').unbind();
                        $(ele).find('span[name="provider_name"]').bind('click',{'sid': new_headers[j].resource_id, 'sold_id': headers[i].resource_id, 'row': row}, function (e) {
                            console.log('update resource');
                            var sid = e.data.sid;
                            var el = $('#' + e.data.sold_id);
                            // 当前资源单不可点击
                            el.addClass('disabled');
                            $(el).find('span[name="provider_name"]').addClass('disabled').removeClass('bm-pointer');
                            ds.getResource(sid, function (data) {
                                el.removeClass('disabled');
                                $(el).find('span[name="provider_name"]').removeClass('disabled').addClass('bm-pointer');
                                $(el).find('span[name="badge"]').removeClass('badge-update').addClass('badge-normal').empty().html(e.data.row.total_count);
                                $(el).find('span[name="provider_name"]').unbind('click');

                                // 显示供应商信息
                                var template_provider = $('#providerInfoTemplate').html();
                                Mustache.parse(template_provider);
                                var rendered_provider = Mustache.render(template_provider, e.data.row);
                                $('#providerInfo').empty().html(rendered_provider);
                                // 激活当前资源单
                                $(el).siblings().removeClass('active select-li-bgc');
                                $(el).addClass('active select-li-bgc');

                                // 显示 资源内容
                                var hot = null;
                                console.log("resource" + row.resource_id + " clicked.");
                                if (hot != null) {
                                    hot.destroy();
                                    console.log("resource" + row.resource_id + " destroyed.");
                                }
                                hot = loadTable('example1', data);
                                log_service.trackEvent('RESOURCE', 'click-item', {'resource_id': e.data.row.resource_id});
                            });
                        })
                    }
                }
            }
        })
    }

    function initCheckTimer(headers, ds) {
      setInterval(function(){
        updateResource(headers, ds);
      }, 1000*60*5); // 1000*60*5
    }
    /**
    * 加载SHGT资源单
    */
    function loadResources() {
      var $res = $('#oyResouces');
      var datastore = SgResourceDataStore();

      datastore.getResourceHeaders(function(headers) {

        // timer to check resource status
        initCheckTimer(headers, datastore);

        // 显示菜单栏
        var template = $('#resourcesLiTemplate').html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, {data: headers});
        $res.empty().html(rendered);

        var global_hot = null;

        // 取资源
        headers.forEach(function (row) {
            var $r = $('#'+ row.resource_id);

            datastore.getResource(row.resource_id, function(data){
              $r.removeClass('disabled');
              $($r).find('span[name="provider_name"]').removeClass('disabled').addClass('bm-pointer');
              $($r).find('span[name="provider_name"]').unbind();
              $($r).find('span[name="provider_name"]').click(function () {
                // 显示供应商信息
                var template_provider = $('#providerInfoTemplate').html();
                Mustache.parse(template_provider);
                var rendered_provider = Mustache.render(template_provider, row);
                $('#providerInfo').empty().html(rendered_provider);

                // 激活当前资源单
                $($r).siblings().removeClass('active select-li-bgc');
                $($r).addClass('active select-li-bgc');

                // 显示 资源内容
                var hot = global_hot;
                console.log("resource" + row.resource_id + " clicked.");
                if (hot != null) {
                    hot.destroy();
                    console.log("resource" + row.resource_id + " destroyed.");
                }
                global_hot = loadTable('example1', data);
                log_service.trackEvent('RESOURCE', 'click-item', {'resource_id': row.resource_id});
              });
          });
        });
      });
    }

    /**
    * 加载 贸易商资源单
    */
    function loadProviderResources(){
        var $res = $('#providerResource');
        var datastore = SgResourceDataStore();

        datastore.getProviderResourceHeaders(function(headers) {
          // timer to check resource status
          initCheckTimer(headers, datastore);

          // 显示菜单栏
          var template = $('#resourcesLiTemplate').html();
          Mustache.parse(template);
          var rendered = Mustache.render(template, {data: headers});
          $res.empty().html(rendered);

          var global_hot = null;

          // 取资源
          headers.forEach(function (row) {
              var $r = $('#'+ row.resource_id);

              datastore.getResource(row.resource_id, function(data){
                $r.removeClass('disabled');
                $($r).find('span[name="provider_name"]').removeClass('disabled').addClass('bm-pointer');
                $($r).find('span[name="provider_name"]').unbind();
                $($r).find('span[name="provider_name"]').click(function () {
                  // 显示供应商信息
                  var template_provider = $('#providerInfoTemplate').html();
                  Mustache.parse(template_provider);
                  var rendered_provider = Mustache.render(template_provider, row);
                  $('#providerInfo').empty().html(rendered_provider);

                  // 激活当前资源单
                  $($r).siblings().removeClass('active select-li-bgc');
                  $($r).addClass('active select-li-bgc');

                  // 显示 资源内容
                  var hot = global_hot;
                  console.log("resource" + row.resource_id + " clicked.");
                  if (hot != null) {
                      hot.destroy();
                      console.log("resource" + row.resource_id + " destroyed.");
                  }
                  global_hot = loadTable('example1', data);
                  log_service.trackEvent('RESOURCE', 'click-item', {'resource_id': row.resource_id});
                });
            });
          });
        });
    }

    /**
    * 加载自己的资源
    */
    function loadMyResources(targerId, data){
        targerId = targerId || example1;
        //TODO 加载自己的资源
        var lmrt = require('../js/resource/loadMyResourceToTable.js');
        lmrt.loadMyResoucesToTable('example1', data);
    };

    /**
    *  上传资源单
    */

    function init(){
        // load ouye 资源
        loadResources();
        loadProviderResources();
        if (userInfo.role == 'ADMIN'){
            // show my 资源
            $('.is-admin').removeClass('hide');
            // load my 资源
            getMyResource();
        }

    }

    // 是否已上传过文件
    var isUploaded = false;
    init();

});
