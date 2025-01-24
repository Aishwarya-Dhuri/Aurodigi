var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');

var router = express.Router();

router.post(
  '/dummyServer/json/trade/exportTransactions/requestFinance/private/getDealNoDataList',
  (req, res) => {
    console.log('reading Exchange Details data');
    const dataXlFile =
      './dummyServer/json/trade/exportTransactions/requestFinance/exchangeDetails.xlsx';
    const workbook = XLSX.readFile(dataXlFile);
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets['dealNoDataList']);

    const dataList = xlData;

    res.json({
      data: dataList,
      lastRow: dataList.length,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/trade/exportTransactions/requestFinance/private/getForwardNoDataList',
  (req, res) => {
    console.log('reading Exchange Details data');
    const dataXlFile =
      './dummyServer/json/trade/exportTransactions/requestFinance/exchangeDetails.xlsx';
    const workbook = XLSX.readFile(dataXlFile);
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets['forwardNoDataList']);

    const dataList = xlData;

    res.json({
      data: dataList,
      lastRow: dataList.length,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

module.exports = router;
