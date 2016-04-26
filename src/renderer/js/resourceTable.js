
function loadTable(id, data) {
  var table_headers = [
      "品种",
      "牌号",
      "钢厂",
      "规格",
      "重量",
      "供应商",
      "仓库",
      "价格",
      "捆包号",
      "钢厂资源号",
      "验灯",
      "备注",
      "操作",
  ];

  // filter definition:
  // none
  // range, range_spec
  // unique_lamp, unique_select,
  // search,

    //品种：单选
    //灯：单选
    //材质：输入框search
    //钢厂：单选
    //规格：厚度 - 范围，宽度-范围
    //重量：范围
    //价格：范围
    //仓库：单选
    //捆包号：输入框search
    //钢厂资源号：输入框search

  var table_columns = [
      {data: "product_name", type: "text", filter: 'unique_select'},
      {data: "shop_sign", renderer: trademarkButton, filter: 'search'},
      {data: "manufacturer", type: "text", filter: 'unique_select'},
      {data: "spec", type: "text", filter:'range_spec'},
      {data: "weight",  type: "numeric",format:'0.00', filter: 'range'},
      {data: "provider_name", renderer: providerNameLink, filter: 'unique_select'},
      {data: "warehouse_name", type: "text", renderer: warehouseButton, filter: 'unique_select'},
      {data: "price", type: "numeric",format:'0,00', filter: 'range'},
      {data: "pack_code", type: "text", filter: 'search'},
      {data: "factory_res_code", renderer: FactoryResCodeRenderer, filter: 'search'},
      {data: "res_status", renderer: ResStatus, filter: 'unique_lamp'},
      {data: "note", renderer: "text", filter: 'search'},
      {data: "origin_url", renderer: BuyButton, filter: 'none'},
  ];

  var col_widths = [60, 80, 80, 80, 60, 130, 120, 60, 60, 80, 60, 200, 50];

  console.time("init_datasource");
  var sgdataSource = SgCFDataSource(data, table_columns);
  console.timeEnd("init_datasource");

  var container = document.getElementById(id);

  var hot = new Handsontable(container, {
    type: 'numeric',
    columns: table_columns,
    colHeaders: table_headers,
    colWidths: col_widths,
    data: sgdataSource.getData(),
    stretchH: "all",
    width: "100%",
    autoWrapRow: true,
    height: 600,
    maxRows: 30,
    rowHeaders: true,
    columnSorting: true,
    sortIndicator: true,
    autoColumnSize: {"samplingRatio": 23},
    manualRowResize: true,
    manualColumnResize: true,
    manualRowMove: true,
    manualColumnMove: true,
    copyable: false,
    copyPaste: false,
    currentRowClassName:"select-row-color",
    //fixedRowsTop: 1,   // 固定行
    //fixedColumnsLeft: 1,  // 固定列

    afterGetColHeader: function (col, TH) {
      if (col < 0) return;

      FilterCtrl(this, col, TH, sgdataSource, table_columns);
    },
    cells: function (row, col, prop) {
      var cellProperties = {readOnly: true};
      return cellProperties;
    }
  });

  function FactoryResCodeRenderer (instance, td, row, col, prop, value, cellProperties) {
    if (value.length > 0) {
      var a = document.createElement('A');
      a.href='javascript:;';
      a.innerText = value;
      a.title= value;
      a.className='ellipsis mw-60';
      Handsontable.Dom.addEvent(a, 'click', function (e){
        e.preventDefault(); // prevent selection quirk
        log_service.trackEvent('TABLE', '钢厂资源查看', {value: value});
        return tools.guaranteeSearch(a.text, true);
      });
      Handsontable.Dom.empty(td);
      td.appendChild(a);
    }
    else {
      // render as text
      Handsontable.renderers.TextRenderer.apply(this, arguments);
    }
    return td;
  }

  function buyBtn(value) {
      // shell => index window.shell= electron.shell
      shell.openExternal(value);
    }

  function BuyButton(instance, td, row, col, prop, value, cellProperties){
    var a;
    if (value.length > 0){
      a = document.createElement('a');
      a.href  =  value;
      a.textContent="购买";
      a.className="buy-link";
      Handsontable.Dom.addEvent(a, 'click', function (e){
        e.preventDefault(); // prevent selection quirk
        log_service.trackEvent('TABLE', '购买', {value: value});
        api.buy_btn(
            {url: value},
            function(result){
                return buyBtn(result.data);
            }, function(code, err){
                notie.alert(3, err.message);
            });
      });
      Handsontable.Dom.empty(td);
      td.appendChild(a);
    }else{
      // render as text
      Handsontable.renderers.TextRenderer.apply(this, arguments);
    }
  }

  function ResStatus(instance, td, row, col, prop, value, cellProperties){
    var span = document.createElement('SPAN');
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
    span.className=classColor;
    Handsontable.Dom.empty(td);
    td.appendChild(span);
  }

  function warehouseButton(instance, td, row, col, prop, value, cellProperties){
    if (value.length > 0) {
      var a = document.createElement('A');
      a.href='javascript:;';
      a.innerText = value;
      a.className = 'ellipsis';
      a.title= value;
      Handsontable.Dom.addEvent(a, 'click', function (e){
        e.preventDefault(); // prevent selection quirk
        log_service.trackEvent('TABLE', '仓库查看', {value: value});
        return tools.warehouseSearch(a.text, true);
      });
      Handsontable.Dom.empty(td);
      td.appendChild(a);
    }
    else {
      // render as text
      Handsontable.renderers.TextRenderer.apply(this, arguments);
    }
    return td;
  }

  function trademarkButton(instance, td, row, col, prop, value, cellProperties){
    if (value.length > 0) {
      var a = document.createElement('A');
      a.href='javascript:;';
      a.innerText = value;
      a.title= value;
      a.className='ellipsis mw-60';
      Handsontable.Dom.addEvent(a, 'click', function (e){
        e.preventDefault(); // prevent selection quirk

        log_service.trackEvent('TABLE', '牌号查看', {value: value});

        return tools.trademarkSearch(a.text, true);
      });
      Handsontable.Dom.empty(td);
      td.appendChild(a);
    }
    else {
      // render as text
      Handsontable.renderers.TextRenderer.apply(this, arguments);
    }
    return td;
  }

  function providerNameLink(instance, td, row, col, prop, value, cellProperties){
    if (value.length > 0) {
      var a = document.createElement('A');
      a.href='javascript:;';
      a.innerText = value;
      a.className = 'ellipsis';
      a.title= value;
      Handsontable.Dom.addEvent(a, 'click', function (e){
        e.preventDefault(); // prevent selection quirk
        console.log(a.text);
        log_service.trackEvent('TABLE', '供应商查看', {value: value});
        return tools.providerSearch(a.text, true);
      });
      Handsontable.Dom.empty(td);
      td.appendChild(a);
    }
    else {
      // render as text
      Handsontable.renderers.TextRenderer.apply(this, arguments);
    }
    return td;
  }

  return hot;
}

/*
 function bindDumpButton() {
 if (typeof Handsontable === "undefined") {
 return;
 }

 Handsontable.Dom.addEvent(document.body, 'click', function (e) {

 var element = e.target || e.srcElement;

 if (element.nodeName == "BUTTON" && element.name == 'dump') {
 var name = element.getAttribute('data-dump');
 var instance = element.getAttribute('data-instance');
 var hot = window[instance];
 console.log('data of ' + name, hot.getData());
 }
 });
 }

 bindDumpButton();
 //**/
