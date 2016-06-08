

$(document).ready(function(){

    var localInfo = Object.assign({}, userInfo, {filters:[], products:[]});

    var init = function(){
        var ci = localInfo.companyInfo;
        if(ci.status == 'VERIFIED'){
            $('#company-name').text(ci.company_name !=''? ci.company_name: '--');
            $('#company-site').text(ci.company_url != '' ? ci.company_url :'--');

            $('.verified').removeClass('hidden');
            $('.unverified').addClass('hidden');

            if(ci.site_resource == 'OPEN'){
                $('#site-resource').html('<a>已开通</a>');
            }else{
                $('#site-resource').html('<a>未开通</a>');
            }
            // todo  get filter append localInfo
            loading.showLoading();
            api.setting_get_filter(
                {token: localInfo.token},
                function (result) {
                    loading.hideLoading();
                    var rs = result;
                    if (rs.code == 0){
                        // 显示filter

                        for (var i = 0; i < rs.data.category_list.length; i++) {
                            var item = rs.data.category_list[i];
                            var obj = {
                                id: '',
                                product_name:''
                            }
                            obj.id = item.category_id;
                            obj.product_name = item.category_name;
                            localInfo['products'].push(obj);
                        }

                        for (var i = 0; i < rs.data.filters_list.length; i++) {
                            var item = rs.data.filters_list[i];
                            var obj = {
                                id: '',
                                product_id:'',
                                product_name:'',
                                add_price:'',
                                create_time:'',
                                public_price:''
                            }
                            obj.id = item.id;
                            obj.product_id = item.category_id;
                            obj.product_name = item.category_name;
                            obj.add_price = item.add_price;
                            obj.public_price = item.show_or_hide_price;
                            obj.create_time = item.create_time;
                            localInfo['filters'].push(obj);
                        }
                        showFilters()
                    }else{
                        notie.alert(3, result.message);
                    }
                },
                function (code, err) {
                    loading.hideLoading();
                    notie.alert(3, err.message);
                });
        }else{
            $('.unverified').removeClass('hidden');
            $('.verified').addClass('hidden');
        }

    }

    function showUserPhone(userInfo){
        var phone = userInfo.phone;
        $('#settings-phone').text(phone);
    };

    function updatePassword(userId, password){
    };

    // 删除
    $('.filter-table').on('click','.removeFilter', function(self){
        var tr = $(self.currentTarget).parent().parent();
        var id = $(tr).attr('id');
        api.setting_delete_filter({'company_filters_id': id},
            function(data){
                loading.hideLoading();
                var rs = data;
                if (rs.code == 0){
                    $(tr).remove();
                    var product_name = '';
                    // remove data on filters
                    for (var i = 0; i < localInfo.filters.length; i++) {
                        if (localInfo.filters[i]['id'] == id){
                            product_name = localInfo.filters[i]['product_name'];
                            localInfo.filters.splice(i, 1);
                        }
                    }
                    notie.alert(1, '删除过滤条件成功，品种为'+ product_name);
                }else{
                    notie.alert(3, result.message);
                }
            }, function(code, err){
                loading.hideLoading();
                notie.alert(3, err.message);
            })
    });

    // 新增
    $('#addFilter').on('click', function(){
        var filter_item = {
            product_id: $('#productSelect').find("option:selected").val(),
            product_name: $("#productSelect").find("option:selected").text(),
            public_price: $('.company-filter input[name=price]:checked').val(),
            add_price: $('.company-filter input[name=add_price]').val() || 0,
            create_time: new Date(),
            id: '',
        }


        if (_.isEmpty(filter_item.product_id)){
            notie.alert(2, '请选择资源品种');
            return;
        }
        if (_.isEmpty(filter_item.public_price)){
            notie.alert(2, '请选择价格调整');
            return;
        }
        if(filter_item.public_price == 'show' && _.isEmpty(filter_item.add_price)){
            notie.alert(2, '公布价格时、请输入要调整的价格');
            return;
        }
        var isAdd = false;
        for (var i = 0; i < localInfo.filters.length; i++) {
            if (localInfo.filters[i]['product_name'] == filter_item.product_name){
                isAdd = true;
            }
        }
        if (isAdd){
            notie.alert(2, '一种品种只能设置一种规则, 请核对品种: ' + filter_item.product_name);
        }else{
            var params = Object.assign({}, filter_item, {token:localInfo.token})
            api.setting_insert_filter(
                params,
                function(result){
                    loading.hideLoading();
                    filter_item.id = result.data.id;
                    filter_item.create_time = result.data.create_time;
                    filter_item.add_price = result.data.add_price;
                    // add filter
                    localInfo.filters.push(filter_item);
                    // append tr
                    addFilterTrHtml(filter_item);
                    notie.alert(2, "保存成功");
                }, function(code, err){
                    loading.hideLoading();
                    notie.alert(3, "保存失败" + err.message);
                })
        }

    });


    function addFilterTrHtml(obj){
        var self = Object.assign({}, obj);
        if (self.public_price == 'HIDE'){
            self.add_price = '面议';
        }
        $('.company-filter tbody').append(
            '<tr id="' + obj.id + '"><td align="center">'+obj.product_name+'</td><td align="center">' + obj.add_price + '</td><td align="center">'+ obj.create_time +'</td><td align="center"><a class="removeFilter">删除</a></td></tr>'
            )
    }

    // 显示 filter
    function showFilters(){
        var products = localInfo.products;
        var filters = localInfo.filters;

        for (p of products){
            $('.company-filter select').append('<option value ="'+p.id+'">'+p.product_name+'</option>')
        };

        for (f in filters){
            addFilterTrHtml(filters[f]);
        };

        $('.company-filter').removeClass('hidden');
    };

    //showUserPhone(userInfo);
    //showCompanyInfo(userInfo.companyInfo);

    init();

});
