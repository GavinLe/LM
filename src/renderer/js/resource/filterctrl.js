
function FilterCtrl(hot, colIndex, parent, datasource, table_columns) {

  this.hot = hot;
  this.ds = datasource;
  this.table_columns = table_columns;
  this.colIndex = colIndex;

  this.filterButton = null;
  this.filterWindow = null;

  this.init = function(hot, colIndex, parent) {
    var header = this.table_columns[colIndex];
    if (header.filter === 'none'){
      return;
    }

    this.filterButton = this.createFilterButton(hot, colIndex, parent);
  };

  this.createFilterButton = function(instance, col, parent) {
    var button = document.createElement('BUTTON');
    button.innerHTML = '\u25BC';
    button.className = 'filterButton';
    this.refreshFilterButtonStatus(button, col);

    this.createFilterControl(button, col);

    if (parent.firstChild.lastChild.nodeName === 'BUTTON') {
      parent.firstChild.removeChild(parent.firstChild.lastChild);
    }
    parent.firstChild.appendChild(button);
    parent.style['white-space'] = 'normal';

    return button;
  };

  this.refreshFilterButtonStatus = function(button, colIndex) {
    var colName = this.table_columns[colIndex].data;
    var filtered = datasource.isColumnFiltered(colName);
    if (filtered) {
      button.className = "filterButton filtered";
    }
    else
      button.className = "filterButton";
  };

  this.createFilterControl = function(button, colIndex) {

    var _this = this;
    Handsontable.Dom.addEvent(button, 'click', function (event) {

      // build a filter div
      var filterType = _this.table_columns[colIndex].filter;

      log_service.trackEvent('FILTER', 'click_filter_btn',
                              {col: _this.table_columns[colIndex].data, type: filterType});

      if (filterType === 'unique_select') {
        var filterCtrl = _this.buildUniqueSelectFilterCtrl(colIndex);
      }
      else if (filterType === 'unique_lamp') {
        var filterCtrl = _this.buildLampFilterCtrl(colIndex);
      }
      else if (filterType === 'range') {
        var filterCtrl = _this.buildRangeFilterCtrl(colIndex);
      }
      else if (filterType === 'range_spec') {
        var filterCtrl = _this.buildRangeSpecFilterCtrl(colIndex);
      }
      else if (filterType === 'search') {
        var filterCtrl = _this.buildSearchFilterCtrl(colIndex);
      }
      else {
        console.assert("unknown filter type.", filterType);
      }

      _this.filterWindow = filterCtrl;

      document.body.appendChild(filterCtrl);

      event.preventDefault();
      event.stopImmediatePropagation();

      // hide all other filter controls
      var allFilterCtrls = document.querySelectorAll('.filterCtrl');
      for (var i = 0, len = allFilterCtrls.length; i < len; i++) {
        allFilterCtrls[i].style.display = 'none';
      }
      filterCtrl.style.display = 'block';

      // show filter to the correct position
      var position = button.getBoundingClientRect();
      filterCtrl.style.top = (position.top + (window.scrollY || window.pageYOffset)) + 2 + 'px';
      if (colIndex >= 11){
          filterCtrl.style.left = (position.left - 150) + 'px';
      }else{
          filterCtrl.style.left = (position.left) + 'px';
      }
      var removeFilterCtrl = function (event) {
        if (!filterCtrl.contains(event.target)) {
          if (filterCtrl.parentNode) {
            filterCtrl.parentNode.removeChild(filterCtrl);
            // 控件失去焦点,过滤数据
            filterCtrl.doFilter();

            log_service.trackEvent('FILTER', 'remove_filter_ctrl',
              {col: _this.table_columns[colIndex].data, type: filterType});
          }
        }
      };

      Handsontable.Dom.removeEvent(document, 'click', removeFilterCtrl);
      Handsontable.Dom.addEvent(document, 'click', removeFilterCtrl);
    });
  };

  this.buildUniqueSelectFilterCtrl = function(colIndex) {
    var div = document.createElement('DIV');
    div.className = 'filterCtrl';

    var divMenu = document.createElement('DIV');
    divMenu.className="hidden-overflow-x";
    div.appendChild(divMenu);

    var menu = document.createElement('UL');
    divMenu.appendChild(menu);

    var colName = this.table_columns[colIndex].data;
    var allCheckbox = [];
    var allDescs = [];
    var values = this.ds.getFilterValues(colName);
    for (var i = 0, len = values.length; i < len; i++) {
      var value = values[i].key + "(" + values[i].count + ")";

      var item = document.createElement('LI');

      // create the necessary elements
      var label = document.createElement("label");
      var description = document.createTextNode(value);
      var checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.name = values[i].key;
      checkbox.value = values[i].key;
      checkbox.checked = values[i].selected;

      label.appendChild(checkbox);
      label.appendChild(description);
      item.appendChild(label);

      checkbox.data = {'colValue': values[i]};

      menu.appendChild(item);

      allCheckbox.push(checkbox);
      allDescs.push(description);
    }

    var hr = document.createElement('HR');
    hr.className="mb-5";
    div.appendChild(hr);

    var btn1 = document.createElement('BUTTON');
    btn1.textContent="确定";
    btn1.className="btn btn-default btn-xs btn-confirm";
    div.appendChild(btn1);

    var btn = document.createElement('BUTTON');
    btn.textContent="清除";
    btn.className="btn btn-default btn-xs btn-clear";
    div.appendChild(btn);

    var getOptions = function() {
      var options = [];
      for (var i = 0, len = allCheckbox.length; i < len; ++i) {
        if (!allCheckbox[i].checked){
            options.push({colValue: allCheckbox[i].value, selected: false});
        }
      }
      return options;
    };

    div.doFilter = function() {
      var hasChanged = datasource.runFilter(colIndex, getOptions());

      if (hasChanged) {
        hot.updateSettings({
          data: datasource.getData()
        });
      }
    };

    // 确定
    Handsontable.Dom.addEvent(btn1, 'click', function (event) {
      // filter data
      var hasChanged = datasource.runFilter(colIndex, getOptions());

      if (hasChanged) {
        hot.updateSettings({
          data: datasource.getData()
        });
      }

      // since the div is not closed, need to update checkbox text manually
      var values = datasource.getFilterValues(colName);
      for (var i = 0, len = values.length; i < len; i++) {
        var value = values[i].key + "(" + values[i].count + ")";

        var desc = allDescs[i];
        if (desc)
          desc.textContent = value;
      }

      log_service.trackEvent('FILTER', 'confirm_filter', {col: colName, type: 'unique_select'});
    });

    // 清除
    Handsontable.Dom.addEvent(btn, 'click', function (event) {
      if (datasource.clearFilter(colIndex) ) {
        hot.updateSettings({ data: datasource.getData() });
      }

      for (var i = 0, len = allCheckbox.length; i < len; ++i) {
        allCheckbox[i].checked = true;
      }

      // since the div is not closed, need to update checkbox text manually
      var values = datasource.getFilterValues(colName);
      for (var i = 0, len = values.length; i < len; i++) {
        var value = values[i].key + "(" + values[i].count + ")";

        var desc = allDescs[i];
        if (desc)
          desc.textContent = value;
      }
      log_service.trackEvent('FILTER', 'clear_filter', {col: colName, type: 'unique_select'});
    });

    // if click the checkbox in the div, then do the filter...
    Handsontable.Dom.addEvent(div, 'click', function (event) {
      if (event.target.type == 'checkbox') {
        var checked = event.target.checked;
        var colValue = event.target.data.colValue.key;

        if (colValue == '所有') {
          for (var i = 0, len = allCheckbox.length; i < len; ++i) {
            allCheckbox[i].checked = checked;
          }
        }
      }
    });

    return div;
  };

  this.buildRangeFilterCtrl = function(colIndex) {
    // get value
    var colName = this.table_columns[colIndex].data;
    var range = this.ds.getRangeValue(colName);

    // set range
    //datasource.runFilter(colIndex, {min: min, max: max});

    var div = document.createElement('DIV');
    div.className = 'filterCtrl';

    // min
    var input1 = document.createElement('INPUT');
    input1.className = 'form-control input-sm select-input1';
    input1.type="text";
    input1.placeholder="范围下限";
    input1.value= range.min || null;
    div.appendChild(input1);

    // max
    var input2 = document.createElement('INPUT');
    input2.className = 'form-control input-sm select-input2';
    input2.type="text";
    input2.placeholder="范围上限";
    input2.value= range.max || null;
    div.appendChild(input2);

    var hr = document.createElement('HR');
    hr.className="mb-5";
    div.appendChild(hr);

    // 创建输入框
    //return this.buildUniqueSelectFilterCtrl(colIndex);
    var btn1 = document.createElement('BUTTON');
    btn1.textContent="确定";
    btn1.className="btn btn-default btn-xs btn-confirm";
    div.appendChild(btn1);

    var btn = document.createElement('BUTTON');
    btn.textContent="清除";
    btn.className="btn btn-default btn-xs btn-clear ";
    div.appendChild(btn);

    div.doFilter = function() {
      if (datasource.runFilter(colIndex, getRangeValue()) ) {
        hot.updateSettings({ data: datasource.getData() });
      }
    };

    var getRangeValue = function (){
        var option = {min:null, max: null};
        option.min = $(div).find(".select-input1").val() || null;
        option.max = $(div).find(".select-input2").val() || null;
        return option;
    };
     // 确定
    Handsontable.Dom.addEvent(btn1, 'click', function (event) {
      // filter data
      var option =  getRangeValue();
      if (datasource.runFilter(colIndex, option) ) {
        hot.updateSettings({data: datasource.getData()});
      }
      log_service.trackEvent('FILTER', 'confirm_filter', {col: colName, type: 'range'});
    });

    // 清除
    Handsontable.Dom.addEvent(btn, 'click', function (event) {
      if (datasource.clearFilter(colIndex) ) {
        hot.updateSettings({ data: datasource.getData() });
      }

      input2.value = null;
      input1.value = null;
      log_service.trackEvent('FILTER', 'clear_filter', {col: colName, type: 'range'});
    });

    return div;
  };

  this.buildRangeSpecFilterCtrl = function(colIndex) {
    var colName = this.table_columns[colIndex].data;

    var rangeThick = this.ds.getRangeValue('thick');
    var rangeWidth = this.ds.getRangeValue('width');
    // 根据 厚度/宽度 输入值两个字段过滤, 对应datasource里的两个字段
    //datasource.runFilter(colIndexOfHeight, {min: min, max: max});
    //datasource.runFilter(colIndexOfWidth, {min: min, max: max});

    var div = document.createElement('DIV');
    div.className = 'filterCtrl';
    // 厚度
    // min
    var label1 = document.createElement("label");
    label1.innerText="厚度";
    var input1 = document.createElement('INPUT');
    input1.className = 'form-control input-sm select-input1';
    input1.type="text";
    input1.placeholder="范围下限";
    input1.value= rangeThick.min || null;

    div.appendChild(label1);
    div.appendChild(input1);

    // max
    var input2 = document.createElement('INPUT');
    input2.className = 'form-control input-sm select-input2';
    input2.type="text";
    input2.placeholder="范围上限";
    input2.value= rangeThick.max || null;
    div.appendChild(input2);

    // 宽度
    var label2 = document.createElement("label");
    label2.innerText="宽度";
    var input3 = document.createElement('INPUT');
    input3.className = 'form-control input-sm select-input3';
    input3.type="text";
    input3.placeholder="范围下限";
    input3.value= rangeWidth.min || null;
    div.appendChild(label2);
    div.appendChild(input3);

    // max
    var input4 = document.createElement('INPUT');
    input4.className = 'form-control input-sm select-input4';
    input4.type="text";
    input4.placeholder="范围上限";
    input4.value= rangeWidth.max || null;
    div.appendChild(input4);

    var hr = document.createElement('HR');
    hr.className="mb-5";
    div.appendChild(hr);

    // 创建输入框
    //return this.buildUniqueSelectFilterCtrl(colIndex);
    var btn1 = document.createElement('BUTTON');
    btn1.textContent="确定";
    btn1.className="btn btn-default btn-xs btn-confirm";
    div.appendChild(btn1);

    var btn = document.createElement('BUTTON');
    btn.textContent="清除";
    btn.className="btn btn-default btn-xs btn-clear ";
    div.appendChild(btn);

    div.doFilter = function() {
      if (datasource.runFilter(null, getRangeSpecValue('thick'), 'thick')
        || datasource.runFilter(null, getRangeSpecValue('width'), 'width') ) {
        hot.updateSettings({ data: datasource.getData() });
      }
    };

    var getRangeSpecValue = function (type){
        var option = {min:null, max: null};
        if (type == 'thick' ){
            option.min = $(div).find(".select-input1").val() || null;
            option.max = $(div).find(".select-input2").val() || null;
        }else if (type == 'width'){
            option.min = $(div).find(".select-input3").val() || null;
            option.max = $(div).find(".select-input4").val() || null;
        }
        return option;
    };
     // 确定
    Handsontable.Dom.addEvent(btn1, 'click', function (event) {
      // filter data
      if (datasource.runFilter(null, getRangeSpecValue('thick'), 'thick')
        || datasource.runFilter(null, getRangeSpecValue('width'), 'width') ) {

        hot.updateSettings({ data: datasource.getData() });
      }
      log_service.trackEvent('FILTER', 'confirm_filter', {col: colName, type: 'range_spec'});
    });

    // 清除
    Handsontable.Dom.addEvent(btn, 'click', function (event) {
      if (datasource.clearFilter(colIndex) ) {
        hot.updateSettings({ data: datasource.getData() });
      }

      input2.value = null;
      input1.value = null;
      input3.value = null;
      input4.value = null;

      log_service.trackEvent('FILTER', 'clear_filter', {col: colName, type: 'range_spec'});
    });

    return div;
  };

  this.buildSearchFilterCtrl = function(colIndex) {
    // get value
    var colName = this.table_columns[colIndex].data;
    var searchVal = this.ds.getSearchValue(colName);

    // set range
    //datasource.runFilter(colIndex, {value: searchString});

    var div = document.createElement('DIV');
    div.className = 'filterCtrl';

    // input
    var input = document.createElement('INPUT');
    input.className = 'form-control input-sm';
    input.type="text";
    input.placeholder="请输入要查询的内容";
    input.value= searchVal || null;
    div.appendChild(input);

    var hr = document.createElement('HR');
    hr.className="mb-5";
    div.appendChild(hr);

    // 创建输入框
    //return this.buildUniqueSelectFilterCtrl(colIndex);
    var btn1 = document.createElement('BUTTON');
    btn1.textContent="确定";
    btn1.className="btn btn-default btn-xs btn-confirm";
    div.appendChild(btn1);

    var btn = document.createElement('BUTTON');
    btn.textContent="清除";
    btn.className="btn btn-default btn-xs btn-clear ";
    div.appendChild(btn);

    div.doFilter = function() {
      if (datasource.runFilter(colIndex, {value: getInputValue()}) ) {
        hot.updateSettings({ data: datasource.getData() });
      }
    };

    var getInputValue = function (){
        return $(div).find("input").val();
    };
     // 确定
    Handsontable.Dom.addEvent(btn1, 'click', function (event) {
      // filter data
      var searchString = getInputValue();
      if (datasource.runFilter(colIndex, {value: searchString}) ) {
        hot.updateSettings({ data: datasource.getData() });
      }
      log_service.trackEvent('FILTER', 'confirm_filter', {col: colName, type: 'search'});
    });

    // 清除
    Handsontable.Dom.addEvent(btn, 'click', function (event) {
      if (datasource.clearFilter(colIndex) ) {
        hot.updateSettings({ data: datasource.getData() });
      }
      input.value = null;

      log_service.trackEvent('FILTER', 'clear_filter', {col: colName, type: 'search'});
    });

    return div;
  };

  this.buildLampFilterCtrl = function(colIndex) {

    function getResStatusClass(value){
        var classColor = 'circle circle-small';
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

    var div = document.createElement('DIV');
    div.className = 'filterCtrl';

    var divMenu = document.createElement('DIV');
    div.appendChild(divMenu);

    var menu = document.createElement('UL');
    divMenu.appendChild(menu);

    var colName = this.table_columns[colIndex].data;
    var allCheckbox = [];
    var allDescs = [];
    var values = this.ds.getFilterValues(colName);
    for (var i = 0, len = values.length; i < len; i++) {
      var isNumber = !isNaN(parseInt(values[i].key,10));
      var value = isNumber? "(" + values[i].count + ")" : values[i].key + "(" + values[i].count + ")" ;
      var item = document.createElement('LI');

      // create the necessary elements
      var label = document.createElement("label");
      var span = '' ;
      if (isNumber){
        span = document.createElement('span');
        span.className = getResStatusClass(parseInt(values[i].key, 10));
      }
      var description = document.createTextNode(value);
      var checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.name = values[i].key;
      checkbox.value = values[i].key;
      checkbox.checked = values[i].selected;

      label.appendChild(checkbox);
      if (isNumber){
          label.appendChild(span);
      }
      label.appendChild(description);
      item.appendChild(label);

      checkbox.data = {'colValue': values[i]};

      menu.appendChild(item);

      allCheckbox.push(checkbox);
      allDescs.push(description);
    }

    var hr = document.createElement('HR');
    hr.className="mb-5";
    div.appendChild(hr);

    var btn1 = document.createElement('BUTTON');
    btn1.textContent="确定";
    btn1.className="btn btn-default btn-xs btn-confirm";
    div.appendChild(btn1);

    var btn = document.createElement('BUTTON');
    btn.textContent="清除";
    btn.className="btn btn-default btn-xs btn-clear";
    div.appendChild(btn);

    var getOptions = function() {
      var options = [];
      for (var i = 0, len = allCheckbox.length; i < len; ++i) {
        if (!allCheckbox[i].checked)
          options.push({colValue: allCheckbox[i].value, selected: false});
      }
      return options;
    };

    div.doFilter = function() {
      if (datasource.runFilter(colIndex, getOptions()) ) {
        hot.updateSettings({ data: datasource.getData() });
      }
    };

    // 确定
    Handsontable.Dom.addEvent(btn1, 'click', function (event) {
      // filter data
      if (datasource.runFilter(colIndex, getOptions()) ) {
        hot.updateSettings({ data: datasource.getData() });
      }

      // since the div is not closed, need to update checkbox text manually
      var values = datasource.getFilterValues(colName);
      for (var i = 0, len = values.length; i < len; i++) {
        var value = values[i].key + "(" + values[i].count + ")";

        var desc = allDescs[i];
        if (desc)
          desc.textContent = value;
      }

      log_service.trackEvent('FILTER', 'confrim_filter', {col: colName, type: 'lamp_select'});
    });

    // 清除
    Handsontable.Dom.addEvent(btn, 'click', function (event) {
      if (datasource.clearFilter(colIndex) ) {
        hot.updateSettings({ data: datasource.getData() });
      }

      for (var i = 0, len = allCheckbox.length; i < len; ++i) {
        allCheckbox[i].checked = true;
      }

      // since the div is not closed, need to update checkbox text manually
      var values = datasource.getFilterValues(colName);
      for (var i = 0, len = values.length; i < len; i++) {
        var value = values[i].key + "(" + values[i].count + ")";

        var desc = allDescs[i];
        if (desc)
          desc.textContent = value;
      }

      log_service.trackEvent('FILTER', 'clear_filter', {col: colName, type: 'lamp_select'});
    });

    // if click the checkbox in the div, then do the filter...
    Handsontable.Dom.addEvent(div, 'click', function (event) {
      if (event.target.type == 'checkbox') {
        var checked = event.target.checked;
        var colValue = event.target.data.colValue.key;

        if (colValue == '所有') {
          for (var i = 0, len = allCheckbox.length; i < len; ++i) {
            allCheckbox[i].checked = checked;
          }
        }
      }
    });

    return div;
  };

  this.init(hot, colIndex, parent);
  return this;
}
