var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var router = express.Router();

router.post('/dummyServer/json/setup/generalMasters/currency/private/currencyList', (req, res) => {
  console.log('reading currency');
  var dataXlFile = './dummyServer/json/setup/generalMasters/currency/data.xlsx';
  var workbook = XLSX.readFile(dataXlFile);
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['sheet1']);
  var dataList = [];
  _.forEach(xlData, function (record) {
    if (record.lastAction.indexOf('Authorized') !== -1) {
      dataList.push({
        // id: record.id,
        id: record.currencyCode,
        displayName: record.currencyCode,
        enrichments: {
          currencyDecimal: record.currencyDecimal,
          flag: record.flag,
          currencyDesc: record.currencyDesc,
          fxRateToBase: record.fxRateToBase,
        },
      });
    }
  });
  res.json({
    dataList: dataList,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

module.exports = router;
