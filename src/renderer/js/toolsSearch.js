/**
 * Created by gavin on 16/3/25.
 */

;(function($, notie){

    function specialCharactersHandle(str, replaceStr) {
        replaceStr = replaceStr || '';
        var pattern = new RegExp("/[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]/im");
        var rs = '';
        for (var i = 0; i < str.length; i++) {
            rs = rs + str.substr(i, 1).replace(pattern, replaceStr);
        }
        return rs;
    }

    function getResStatusClass(value){
        var classColor = 'circle ';
        if(value == 3){
            classColor += ' red';
        }else if(value==2){
            classColor += ' yellow';
        }else if(value==5){
            classColor += ' blue';
        }else if(value==1){
            classColor += ' green';
        }else if(value == 0){
            classColor += ' white';
        }
        return classColor;
    }

    function realProviderSearch(params){
        var url = API_URL + 'api/search/real/provider/';
        loading.showLoading();
        $.post(url, params)
            .success(function (result) {
                loading.hideLoading();
                if (result.code == 0) {
                    if (result.data){

                        // 解析模板
                        $('.realProviderSearchParams').addClass('hide');
                        $('#realityProvider').val(result.data.provider_name);

                    }else{
                        notie.alert(3, '没查到符合条件的数据');
                    }
                } else {
                    notie.alert(3,result.message);
                }
            })
            .error(function(err){
                loading.hideLoading();
                console.log(err);
                notie.alert(3,'未知错误');
            });
    }

    function warehouseSearch (name, isShowBtn){
        name = specialCharactersHandle(name, ' ');
        var url = API_URL + 'api/search/warehouse/';
        loading.showLoading();
        $.post(url, {search_name: name})
            .success(function (data) {
                loading.hideLoading();
                data = JSON.parse(data);
                if (data.code == 0) {
                    if (data.data) {
                        // 解析模板
                        var template = $('#warehouseTrTemplate').html();
                        Mustache.parse(template);
                        var rendered = Mustache.render(template, data);
                        if (isShowBtn == true) {
                            $('#warehouseSearch .warehouseBtn ').addClass('hide');
                        }
                        $('#warehouse').empty().html(rendered);
                        $('#warehouseSearch').modal({backdrop:true});
                    }else{
                        notie.alert(3, '没查到符合条件的数据');
                    }
                } else {
                    notie.alert(3,data.message);
                }
            })
            .error(function(err){
                loading.hideLoading();
                notie.alert(3,'未知错误');
            });
    }

    function trademarkSearch(key, isShowBtn){
        key = specialCharactersHandle(key, ' ');
        var url = API_URL + 'api/search/trademark/';
        loading.showLoading();
        var params = {search_name: key.toUpperCase()};
        $.post(url, params)
            .success(function (result) {
                loading.hideLoading();
                if (result.code == 0) {
                    if (result.data){
                        // 解析模板
                        var template = $('#trademarkTrTemplate').html();
                        Mustache.parse(template);
                        var rendered = Mustache.render(template, result);
                        if (isShowBtn == true){
                            $('#trademarkSearch .trademarkBtn ').addClass('hide');
                        }
                        $('#trademarkBody ').empty().html(rendered);
                        $('#trademarkSearch').modal({backdrop:true});

                    }else{
                        notie.alert(3, '没查到符合条件的数据');
                    }
                } else {
                    notie.alert(3,data.message);
                }
            })
            .error(function(err){
                loading.hideLoading();
                console.log(err);
                notie.alert(3,'未知错误');
            });
    }

    function providerSearch(name, isShowBtn){
        name = specialCharactersHandle(name, ' ');
        var url = API_URL + 'api/search/provider/';
        loading.showLoading();
        var params = {search_name: name};
        $.post(url, params)
            .success(function (result) {
                loading.hideLoading();
                if (result.code == 0) {
                    if (result.data){
                        // 解析模板
                        var template = $('#providerNameTrTemplate').html();
                        Mustache.parse(template);
                        var rendered = Mustache.render(template, result);
                        if (isShowBtn == true) {
                            $('#providerNameSearch .providerNameBtn ').addClass('hide');
                        }
                        $('#providerNameBody').empty().html(rendered);
                        $('#providerNameSearch').modal({backdrop:true});
                    }else{
                        notie.alert(3, '没查到符合条件的数据');
                    }
                } else {
                    notie.alert(3,data.message);
                }
            })
            .error(function(err){
                loading.hideLoading();
                console.log(err);
                notie.alert(3,'未知错误');
            });
    }

    function guaranteeSearch(key, isShowBtn){
        key = specialCharactersHandle(key, ' ');
        var params = {factory_res_code: key};
        loading.showLoading();
        $.post(API_URL + 'api/search/warranty/', params)
            .success( function (data) {
                loading.hideLoading();
                if (data.code == 0) {
                    // handle data
                    if (data.data){
                        data.data.forEach(function (item) {
                            item['bodyFunc'] = function () {
                                return JSON.stringify(item.download_pdf_body);
                            }
                        });
                        // 解析模板
                        var template = $('#trTemplate').html();
                        Mustache.parse(template);
                        var rendered = Mustache.render(template, data);
                        $('#resCodeBody').empty().html(rendered);
                        if (isShowBtn == true) {
                            $('#resCodeDialog .guarantee').addClass('hide');
                        }
                        $('#resCodeDialog').modal({backdrop: true});
                    }else{
                        notie.alert(2, '没有找到相关数据');
                    }

                } else if (data.code >= 100) {
                    notie.alert(3,data.message);
                }
            })
            .error(function(err){
                loading.hideLoading();
                console.log(err);
                notie.alert(3,'未知错误');
            });
    }

    function statusSearch(params){
        var url = API_URL + 'api/check/goods/single/';
        loading.showLoading();
        $.post(url, params)
            .success(function (result) {
                loading.hideLoading();
                if (result.code == 0) {
                    if (result.data){
                        var statusClass = getResStatusClass(result.data.res_status);
                        $('#cgResStatus').addClass(statusClass);
                    }else{
                        notie.alert(3, '没查到符合条件的数据');
                    }
                } else {
                    notie.alert(3,data.message);
                }
            })
            .error(function(err){
                loading.hideLoading();
                console.log(err);
                notie.alert(3,'未知错误');
            });
    }

    window.tools = {
        trademarkSearch:trademarkSearch,
        warehouseSearch:warehouseSearch,
        providerSearch:providerSearch,
        realProviderSearch:realProviderSearch,
        guaranteeSearch:guaranteeSearch,
        statusSearch:statusSearch,
        specialCharactersHandle:specialCharactersHandle
    };
})(jQuery, notie);
