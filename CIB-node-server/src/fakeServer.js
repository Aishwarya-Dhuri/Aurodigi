var alasql = require('alasql');

exports.FakeServer = function FakeServer(allData) {
  alasql.options.cache = false;

  return {
    getData: function (request) {
      var results = executeQuery(request);
      var count = executeCountQuery(request);
      return {
        success: true,
        data: results.map((d) => {
          if (!d.status) {
            const status =
              d.lastAction && d.lastAction.split(' ')[d.lastAction.split(' ').length - 1];

            d.status = status == 'create' ? 'Pending' : status;
          }

          return d;
        }),
        lastRow: count,
      };
    },
  };

  function executeQuery(request) {
    var sql = buildSql(request);
    console.log('[FakeServer] - about to execute query:', sql);
    return alasql(sql, [allData]);
  }

  function executeCountQuery(request) {
    var sql = buildCountSql(request);
    console.log('[FakeServer] - about to execute query:', sql);
    return alasql(sql, [allData]).length;
  }

  function buildSql(request) {
    return (
      selectSql(request) +
      ' FROM ?' +
      whereSql(request) +
      groupBySql(request) +
      orderBySql(request) +
      limitSql(request)
    );
  }

  function buildCountSql(request) {
    return 'SELECT * FROM ?' + whereSql(request) + groupBySql(request) + orderBySql(request);
  }

  function selectSql(request) {
    var rowGroupCols = request.rowGroupCols;
    var valueCols = request.valueCols;
    var groupKeys = request.groupKeys;

    if (isDoingGrouping(rowGroupCols, groupKeys)) {
      var rowGroupCol = rowGroupCols[groupKeys.length];
      var colsToSelect = [rowGroupCol.id];

      valueCols.forEach(function (valueCol) {
        colsToSelect.push(valueCol.aggFunc + '(' + valueCol.id + ') AS ' + valueCol.id);
      });

      return 'SELECT ' + colsToSelect.join(', ');
    }

    return 'SELECT *';
  }

  function whereSql(request) {
    var rowGroups = request.rowGroupCols;
    var groupKeys = request.groupKeys;
    var filterModel = request.filterModel;
    var whereParts = [];

    if (groupKeys) {
      groupKeys.forEach(function (key, i) {
        var value = typeof key === 'string' ? "'" + key + "'" : key;

        whereParts.push(rowGroups[i].id + ' = ' + value);
      });
    }

    if (filterModel) {
      Object.keys(filterModel).forEach(function (key) {
        var item = filterModel[key];
        switch (item.filterType) {
          case 'text':
            whereParts.push(createFilterSql(textFilterMapper, key, item));
            break;
          case 'number':
            whereParts.push(createFilterSql(numberFilterMapper, key, item));
            break;
          default:
            console.log('unknown filter type: ' + item.filterType);
            break;
        }
      });
    }

    if (whereParts.length > 0) {
      return ' WHERE ' + whereParts.join(' AND '); // + ' AND ' + request.listWhere;
    } /*else {
              return ' WHERE ' + request.listWhere;
          }*/

    return '';
  }

  function createFilterSql(mapper, key, item) {
    if (item.operator) {
      var condition1 = mapper(key, item.condition1);
      var condition2 = mapper(key, item.condition2);
      return '(' + condition1 + ' ' + item.operator + ' ' + condition2 + ')';
    }
    return mapper(key, item);
  }

  function textFilterMapper(key, item) {
    switch (item.type) {
      case 'equals':
        return key + " = '" + item.filter + "'";
      case 'notEqual':
        return key + "' != '" + item.filter + "'";
      case 'contains':
        return key + " LIKE '%" + item.filter + "%'";
      case 'notContains':
        return key + " NOT LIKE '%" + item.filter + "%'";
      case 'startsWith':
        return key + " LIKE '" + item.filter + "%'";
      case 'endsWith':
        return key + " LIKE '%" + item.filter + "'";
      default:
        console.log('unknown text filter type: ' + item.type);
    }
  }

  function numberFilterMapper(key, item) {
    switch (item.type) {
      case 'equals':
        return key + ' = ' + item.filter;
      case 'notEqual':
        return key + ' != ' + item.filter;
      case 'greaterThan':
        return key + ' > ' + item.filter;
      case 'greaterThanOrEqual':
        return key + ' >= ' + item.filter;
      case 'lessThan':
        return key + ' < ' + item.filter;
      case 'lessThanOrEqual':
        return key + ' <= ' + item.filter;
      case 'inRange':
        return '(' + key + ' >= ' + item.filter + ' and ' + key + ' <= ' + item.filterTo + ')';
      default:
        console.log('unknown number filter type: ' + item.type);
    }
  }

  function groupBySql(request) {
    var rowGroupCols = request.rowGroupCols;
    var groupKeys = request.groupKeys;

    if (isDoingGrouping(rowGroupCols, groupKeys)) {
      var rowGroupCol = rowGroupCols[groupKeys.length];

      return ' GROUP BY ' + rowGroupCol.id;
    }

    return '';
  }

  function orderBySql(request) {
    var sortModel = request.sortModel;

    if (sortModel.length === 0) return '';

    var sorts = sortModel.map(function (s) {
      return s.colId + ' ' + s.sort.toUpperCase();
    });

    return ' ORDER BY ' + sorts.join(', ');
  }

  function limitSql(request) {
    if (request.endRow == null || request.startRow == null) {
      return '';
    }

    var blockSize = request.endRow - request.startRow;

    return ' LIMIT ' + (blockSize + 1) + ' OFFSET ' + request.startRow;
  }

  function isDoingGrouping(rowGroupCols, groupKeys) {
    // we are not doing grouping if at the lowest level
    return rowGroupCols.length > groupKeys.length;
  }

  function getLastRowIndex(request, results) {
    if (!results || results.length === 0) {
      return null;
    }

    var currentLastRow = request.startRow + results.length;

    return currentLastRow <= request.endRow ? currentLastRow : -1;
  }
};