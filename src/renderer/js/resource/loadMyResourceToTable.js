/**
 * Created by gavin on 24/5/25.
 */

'use strict';
function loadMyResoucesToTable(id, data) {

  // 显示的列
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

  var table_columns = [
      {data: "product_name", type: "text", filter: 'unique_select', placeholder:'此项为必填,请重新上传数据', placeholderCellClassName:'bm-red'},
      {data: "shop_sign", renderer: trademarkButton, filter: 'search', placeholder:'此项为必填,请重新上传数据', placeholderCellClassName:'bm-red'},
      {data: "manufacturer", type: "text", filter: 'unique_select', placeholder:'此项为必填,请重新上传数据', placeholderCellClassName:'bm-red'},
      {data: "spec", type: "text", filter:'range_spec', placeholder:'此项为必填,请重新上传数据', placeholderCellClassName:'bm-red'},
      {data: "weight",  type: "numeric",format:'0.00', filter: 'range', placeholder:'此项为必填,请重新上传数据', placeholderCellClassName:'bm-red'},
      {data: "provider_name", renderer: providerNameLink, filter: 'unique_select', placeholder:'此项为必填,请重新上传数据', placeholderCellClassName:'bm-red'},
      {data: "warehouse_name", type: "text", renderer: warehouseButton, filter: 'unique_select', placeholder:'此项为必填,请重新上传数据', placeholderCellClassName:'bm-red'},
      {data: "price", type: "numeric",format:'0,00', filter: 'range', placeholder:'此项为必填,请重新上传数据', placeholderCellClassName:'bm-red'},
      {data: "pack_code", type: "text", filter: 'search', placeholder:'此项为必填,请重新上传数据', placeholderCellClassName:'bm-red'},
      {data: "factory_res_code", renderer: FactoryResCodeRenderer, filter: 'search', placeholder:'此项为必填,请重新上传数据', placeholderCellClassName:'bm-red'},
      {data: "res_status", renderer: ResStatus, filter: 'unique_lamp', placeholder:'此项为必填,请重新上传数据', placeholderCellClassName:'bm-red'},
      {data: "note", renderer: "text", filter: 'search'},
      {data: "origin_url", renderer: BuyButton, filter: 'none',},
  ];

  var col_widths = [80, 80, 80, 80, 80, 130, 120, 80, 80, 120, 80, 300, 50];

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
    height: '1000',
    maxRows: 30,
    rowHeaders: true,
    columnSorting: true,
    sortIndicator: true,
    autoColumnSize: {"samplingRatio": 23},
    manualRowResize: true,
    manualColumnResize: true,
    manualRowMove: true,
    manualColumnMove: true,
    //copyable: false,
    //copyPaste: false,
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
    if (value && value.length > 0) {
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
    if (value && value.length > 0){
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
    // Handsontable.Dom.addEvent(span, 'click', function (e){
    //     e.preventDefault();
    //     var rowData = hot.getDataAtRow(row);
    //      var params = {
    //         product_name: rowData[0],
    //         shop_sign: rowData[1],
    //         spec: rowData[3],
    //         manufacturer: rowData[2],
    //         weight: rowData[4],
    //         warehouse: rowData[6],
    //         pack_code: rowData[8]
    //     };
    //     tools.realProviderSearch(params);
    //     //log_service.trackEvent('TABLE', '仓库查看', {value: value});
    //     //return tools.warehouseSearch(a.text, true);
    // });
    Handsontable.Dom.empty(td);
    td.appendChild(span);
  }

  function warehouseButton(instance, td, row, col, prop, value, cellProperties){
    if (value && value.length > 0) {
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
    if (value && value.length > 0) {
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
    if (value && value.length > 0) {
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

  function notEmptyValidator(instance, td, row, col, prop, value, cellProperties){
    var span;
    if (value && value.length > 0){
        // render as text
        Handsontable.renderers.TextRenderer.apply(this, arguments);
    }else{
        span = document.createElement('span');
        span.innerText="此列不允许为空, 请修改execl数据重新上传";
        span.style="color:red";
        Handsontable.Dom.empty(td);
        td.appendChild(span);
    }
  }
  return hot;
}
module.exports.loadMyResoucesToTable = loadMyResoucesToTable;
