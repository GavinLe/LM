/**
 * Created by gavin on 16/3/25.
 */


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
          loading.showLoading();
          console.log('send msg pdf');
          ipc.send('downloadPDF', params);
          ipc.on('downloadpdfsuccessreply', function (event, arg) {
              loading.hideLoading();
              ipc.send('open pdf', arg);
              ipc.removeListener('downloadpdfsuccessreply', arguments.callee);
          });
          ipc.on('downloadpdffailreply', function (event, message) {
              loading.hideLoading();
              notie.alert(2, '下载失败' + message);
              ipc.removeListener('downloadpdffailreply', arguments.callee);
          });
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
        log_service.trackEvent('真实货主查询', 'click_query');
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

        log_service.trackEvent('真实货主查询', 'click_query');
    });

    /**
     *  绑定弹框显示材质查询
     */
    $('#showtrademarkDialog').on('click', function(){
        $('#tdName').val('');
        $('#trademarkBody').empty();
        $('#trademarkSearch .trademarkBtn ').removeClass('hide');
        $('#trademarkSearch').modal({backdrop:true});

        log_service.trackEvent('牌号查询', 'click_query');
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

        log_service.trackEvent('仓库查询', 'click_query');
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

        log_service.trackEvent('供应商查询', 'click_query');
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

    $('.sg-helper').on('click','#showContactBtn', function(){
        var list = $(this).data('contacts').split(';');
    });

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

    loadResources();



});




