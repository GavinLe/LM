
function SgFilterData(columns){

  this.columns = columns;
  this.filterValues = [];

  this.getFilterValues = function(colName) {
    var colValues = this._getColValues(colName);
    return colValues.values;
  };

  this._getColValues = function(colName) {
    var colValues = null;
    for (var i = 0; i < this.filterValues.length; i++) {
      if (colName === this.filterValues[i].colName) {
        colValues = this.filterValues[i];
        break;
      }
    }
    return colValues;
  };

  this.clear = function(colName, values) {
    this.filterValues = [];
  };

  this.clearColValues = function(colName) {
    for (var i = 0; i < this.filterValues.length; i++) {
      if (colName === this.filterValues[i].colName) {
        var values = this.filterValues[i].values;
        for (var i = 0, len = values.length; i < len; ++i) {
          values[i].count = 0;
        }
        break;
      }
    }
  };

  this.addColValues = function(colName, values) {
    var colValues = this._getColValues(colName);
    if (colValues === null) {
      var colValues = {
        colName: colName,
        values: [
          {key: '所有', count: 0, selected: 1}
        ],
      };
      this.filterValues.push(colValues);
    }

    var count = 0;
    for (var i = 0, len = values.length; i < len; ++i) {
      var v = values[i];

      var exist = false;
      for (var j = 0, len2 = colValues.values.length; j < len2; ++j) {
        if (colValues.values[j].key == v.key) {
          colValues.values[j].count = v.value;
          exist = true;
          break;
        }
      }
      if (!exist) {
        v.selected = 1;
        v.count = v.value;
        colValues.values.push(v);
      }
      count += v.value;
    }

    colValues.values[0].count += count;
  };

  this.addColValues2 = function(colName, values1, values2) {
    var colValues = {
      colName: colName,
      values: [
        {key: '所有', count: 0, selected:1}
      ],
    };
    this.filterValues.push(colValues);

    var count = 0;
    for (var i = 0, len = values1.length; i < len; ++i) {
      var v = values1[i];
      var cnt = values2[i];
      count += cnt;
      colValues.values.push({key: v, count: cnt, selected: 1});
    }
    colValues.values[0].count += count;
  };

  this._addColumnValue = function (colName, colValue, count) {
    var colValues = null;
    for (var i = 0; i < this.filterValues.length; i++) {
      if (colName === this.filterValues[i].colName) {
        colValues = this.filterValues[i];
        break;
      }
    }
    if (!colValues) {
      colValues = {
        colName: colName,
        values: [
          {key: '所有', count: 0, selected:1}
        ],
      };
      this.filterValues.push(colValues);
    }

    if (!colValue)
      return;

    var filterValue = null;
    for (var j = 0; j < colValues.values.length; j++) {
      if (colValues.values[j].key === colValue){
        filterValue = colValues.values[j];
        break;
      }
    }
    if (!filterValue) {
      filterValue = { key: colValue, count: 0, selected: 1 };
      colValues.values.push(filterValue);
    }
    filterValue.count += count;
    colValues.values[0].count += count;
  };

  return this;
}

function SgRowDataSource(data, columns){

  this.currentData = null;
  this.columns = columns;
  this.filterData = SgFilterData(columns);


  this.init = function(data, columns) {
    this.columns = columns;
    this.currentData = data;

    // raw filter
    //for (var i = 0, len = this.currentData.length; i < len; ++i) {
    //  var r = this.currentData[i];
    //
    //  for (var ci = 0; ci < this.columns.length; ci++) {
    //    var colName = this.columns[ci].data;
    //    var colValue = r[this.columns[ci].data];
    //
    //    this.filterData._addColumnValue(colName, colValue);
    //  }
    //}
    return;

    //this.currentData = JSON.parse(JSON.stringify(data));
  };

  this.getData = function () {
    return this.currentData;
  };

  this.getFilterValues = function (colName) {
    var colValues = this.filterData._getColValues(colName);
    return colValues.values;
  };

  this.init(data, columns);
  return this;
}


function SgDVDataSource(data, columns) {

  //var dv = require('../../libs/datavore/dv.js').dv;

  this.currentData = null;
  this.filterData = SgFilterData(columns);

  this.table = null;

  this.init = function (data, columns) {

    this.currentData = data;

    var column_data = {};
    for (var ci = 0; ci < this.columns.length; ci++) {
      var colName = this.columns[ci].data;
      var type = this.columns[ci].filter === "range" ? dv.type.numeric: dv.type.nominal;
      column_data[colName] = {name:colName, vals:[], type: type};
    }

    for (var i = 0, len = data.length;  i < len; ++i) {
      var r = data[i];
      for (var ci = 0; ci < this.columns.length; ci++) {
        var colName = this.columns[ci].data;
        var cd = column_data[colName];
        if (cd.type === dv.type.numeric)
          cd.vals.push(parseFloat(r[colName]));
        else
          cd.vals.push(r[colName]);
      }
    }

    console.time("init_dv_table");

    var table = dv.table();
    for (var ci = 0; ci < this.columns.length; ci++) {
      var colName = this.columns[ci].data;
      var cd = column_data[colName];
      table.addColumn(cd.name, cd.vals, cd.type);
    }
    this.table = table;
    console.timeEnd("init_dv_table");

    for (var ci = 0; ci < this.columns.length; ci++) {
      var colName = this.columns[ci].data;

      var filter_type = this.columns[ci].filter;
      if (filter_type != 'unique_select' && filter_type != 'unique_lamp')
        continue;

      var groups = table.query({dims:[ci], vals:[dv.count()]});

      this.filterData.addColValues2(colName, groups[0], groups[1]);
    }
  };

  this.getData = function () {
    return this.currentData;
  };

  this.getFilterValues = function (colName) {
    var colValues = this.filterData._getColValues(colName);
    return colValues.values;
  };

  this.init(data, columns);
  return this;
}

// 构建数据进本地数据库
function SgCFDataSource(data, columns) {

  //var crossfilter = require('../../icon/libs/crossfilter/crossfilter.js');

  this.currentData = null;
  this.originData = data;
  this.columns = columns.concat([{data: "width", type:'text', filter: 'range'},{data: "thick", type:'text', filter: 'range'}]);
  this.filterData = SgFilterData(this.columns);

  this.db = null;

  var fields = [  "origin_url",
    "res_status",
    "product_name",
    "manufacturer",
    "shop_sign",
    "spec",
    "weight",
    "warehouse_name",
    "price",
    "pack_code",
    "factory_res_code"];

  this.init = function (data) {
    console.log("datasource fuck ...");
    console.log(data);
    this.rebuildIndex(data);
  };

  this.rebuildIndex = function(data) {

    this.db = crossfilter.crossfilter(data);
    for (var ci = 0; ci < this.columns.length; ci++) {
      var colName = this.columns[ci].data;
      var filter_type = this.columns[ci].filter;
      if (filter_type != 'unique_select' && filter_type != 'unique_lamp')
        continue;

      var dim = this.db.dimension(function(d) { return d[colName]; });
      var colValues = dim.group().reduceCount().top(Infinity);

      this.filterData.clearColValues(colName);
      this.filterData.addColValues(colName, colValues);
      dim.dispose();
    }

    var dim = this.db.dimension(function(d) { return d.product_name; });
    dim.dispose();
    this.currentData = dim.filterAll().top(Infinity);
    $('#show_filter_count').empty().text(this.currentData.length);
    console.log('data count:', this.currentData.length);
  };

  this.getData = function () {
    return this.currentData;
  };

  this.getFilterValues = function (colName) {
    var colValues = this.filterData._getColValues(colName);
    return colValues.values;
  };

  this.getRangeValue = function (colName) {
    var fc = this.filterConditions[colName];
    return {min:fc.min, max: fc.max};
  };

  this.getSearchValue = function (colName) {
    var fc = this.filterConditions[colName];
    return fc.value;
  };

  this.filterConditions = {};

  this.initFilterConditions = function() {
    for (var ci = 0; ci < this.columns.length; ci++) {
      var col = this.columns[ci];
      var colName = col.data;
      var filter_type = col.filter;

      var type = 'none';
      if (filter_type === 'unique_select' || filter_type === 'unique_lamp') {
        type = 'unique';
        this.filterConditions[colName] = {name: colName, type: type, filter_values: []};
      } else if (filter_type === 'range' || filter_type === 'range_spec') {
        type = 'range';
        this.filterConditions[colName] = {name: colName, type: type, min: null, max: null};
      } else if (filter_type === 'search') {
        type = 'search';
        this.filterConditions[colName] = {name: colName, type: type, value: ""};
      }
      //else {
      //  this.filterConditions[colName] = {name: colName, type: type};
      //}
    }
  };

  this.initFilterConditions();

  this.getFilterConditionByColumn = function(colIndex) {
    var col = this.columns[colIndex];
    var colName = col.data;
    var fc = this.filterConditions[colName];
    return fc;
  };

  this.addUniqueFilter = function(colName, value) {
    var fc = this.filterConditions[colName];
    fc.filter_values.push(value);
  };

  this.removeUniqueFilter = function(colName, value) {
    var fc = this.filterConditions[colName];
    var index = fc.filter_values.indexOf(value);
    if (index >= 0) {
      fc.filter_values.splice(index, 1);
    }
  };

  this.addRangeFilter = function(colName, min, max) {
    var fc = this.filterConditions[colName];
    var filterChange = fc.min !== min || fc.max !== max;
    fc.min = min;
    fc.max = max;

    return filterChange;
  };

  this.removeRangeFilter = function(colName) {
    var fc = this.filterConditions[colName];
    fc.min = null;
    fc.max = null;
  };

  this.addSearchFilter = function(colName, value) {
    var fc = this.filterConditions[colName];
    var filterChange = fc.value != value;
    fc.value = value;

    return filterChange;
  };

  this.removeSearchFilter = function(colName) {
    var fc = this.filterConditions[colName];
    fc.value = null;
  };

  this.isColumnFiltered = function(colName) {
    var fc = this.filterConditions[colName];
    if (fc && fc.type && fc.type === "unique") {
      return fc.filter_values.length > 0;
    }
    else if (fc && fc.type && fc.type === "range") {
      return fc.min !== null || fc.max !== null;
    }
    else if (fc && fc.type && fc.type === "search") {
      return fc.value !== null && fc.value !== "";
    }
  };

  this.clearFilter = function(colIndex) {
    console.time("clear_filter");

    var col = this.columns[colIndex];
    var colName = col.data;
    var filter_type = col.filter;

    var hasChanged = false;

    if (filter_type === 'unique_select' || filter_type === 'unique_lamp') {
      hasChanged = this.runFilter(colIndex, [{colValue: '所有', 'selected': true}]) ? true: hasChanged;
    }
    else if (filter_type === 'range' || filter_type === 'range_spec') {
      hasChanged = this.runFilter(colIndex, {min: null, max: null}) ? true: hasChanged;
    }
    else if (filter_type === 'search') {
      hasChanged = this.runFilter(colIndex, {value: null}) ? true: hasChanged;
    }

    console.timeEnd("clear_filter");

    return hasChanged;
  };

  this.runFilter = function(colIndex, options, colName) {
    //console.time("pre_run_filter");

    // 根据 filter 列名查找 colIndex
    if (colName && colName != ''){
        for (var i = 0, len = this.columns.length; i < len; ++i){
            if (this.columns[i].data == colName){
                colIndex = i;
                break;
            }
        }
    }
    var col = this.columns[colIndex];
    var colName = col.data;

    var hasFilterChanged = false;

    var filter_type = col.filter;
    if (filter_type === 'unique_select' || filter_type === 'unique_lamp') {

      var colValues = this.filterData._getColValues(colName);

      var fc = this.filterConditions[colName];
      var oldFilterValues = fc.filter_values;
      fc.filter_values = [];

      for (var i = 0, len = colValues.values.length; i < len; ++i) {
        colValues.values[i].selected = true;

        for (var j = 0, len2 = options.length; j < len2; j++) {
          var colValue = options[j].colValue;
          var selected = options[j].selected;

          if (colValues.values[i].key == colValue ) { // remove || colValue === '所有' to fixed filter issue
            colValues.values[i].selected = selected;
            if (!selected) {
              this.addUniqueFilter(colName, colValues.values[i].key);
            } else {
              this.removeUniqueFilter(colName, colValues.values[i].key);
            }
          }
        }
      }

      // compare changing...
      hasFilterChanged = (oldFilterValues.sort().toString() != fc.filter_values.sort().toString());
    }
    else if (filter_type === 'range' || filter_type === 'range_spec') {
      hasFilterChanged = this.addRangeFilter(colName, options.min, options.max);
    }
    else if (filter_type === 'search') {
      hasFilterChanged = this.addSearchFilter(colName, options.value);
    }

    //console.timeEnd("pre_run_filter");

    if (!hasFilterChanged)
      return hasFilterChanged;

    console.time("run_filter");

    // apply filters
    console.time("filter_data");
    var filterRows = this.originData;
    for (var colName in this.filterConditions) {
      var f = this.filterConditions[colName];

      if (f.type == 'unique' && f.filter_values.length > 0){
        var fdb = crossfilter.crossfilter(filterRows);
        var dim = fdb.dimension(function(d) { return d[f.name]; });
        var filter = dim.filter(function(d) {
            return f.filter_values.indexOf(d) === -1;
        });
        filterRows = filter.top(Infinity);
        dim.dispose();
      }
      else if (f.type === 'range' && (f.min !== null || f.max !== null) ){
        // todo, not testing...
        var fdb = crossfilter.crossfilter(filterRows);
        var dim = fdb.dimension(function(d) { return d[f.name]; });
        //var filter = dim.filterRange([f.min, f.max])
        var filter = dim.filter(function(d) {
          if (f.min === null && f.max !== null){
            return parseFloat(d) <= parseFloat(f.max);
          }
          else if (f.min !== null && f.max === null){
            return parseFloat(d) >= parseFloat(f.min);
          }
          else if (f.min !== null && f.max !== null){
            return parseFloat(f.min) <= parseFloat(d) && parseFloat(d) <= parseFloat(f.max);
          }
        });
        filterRows = filter.top(Infinity);
        dim.dispose();
      }
      else if (f.type === 'search' && f.value !== null && f.value !== ""){
        var fdb = crossfilter.crossfilter(filterRows);
        var dim = fdb.dimension(function(d) { return d[f.name]; });
        var filter = dim.filter(function(d) { return d.toUpperCase().indexOf(f.value.toUpperCase()) >=0; });
        filterRows = filter.top(Infinity);
        dim.dispose();
      }
    }
    console.timeEnd("filter_data");

    this.rebuildIndex(filterRows);

    console.timeEnd("run_filter");

    return hasFilterChanged;
  };

  this.init(data, columns);
  return this;
}
