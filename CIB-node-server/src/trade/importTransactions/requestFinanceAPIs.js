var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');

var getAuthorizedList = require('../../listingAPIs').getAuthorizedListRecords;
var router = express.Router();

router.post(
  '/dummyServer/json/trade/importTransactions/requestFinance/private/getDealNoDataList',
  (req, res) => {
    console.log('reading Exchange Details data');
    const dataXlFile =
      './dummyServer/json/trade/importTransactions/requestFinance/exchangeDetails.xlsx';
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
  '/dummyServer/json/trade/importTransactions/requestFinance/private/getForwardNoDataList',
  (req, res) => {
    console.log('reading Exchange Details data');
    const dataXlFile =
      './dummyServer/json/trade/importTransactions/requestFinance/exchangeDetails.xlsx';
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

router.post(
  '/dummyServer/json/trade/importTransactions/requestFinance/private/getRepairList',
  (req, res) => {
    let authorizedList = getAuthorizedList(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    authorizedList.data = authorizedList.data.map((record) => {
      record['actions'] = [
        {
          index: 1,
          paramList: 'id',
          methodName: 'view',
          type: 'ICON',
          displayName: 'View',
          icon: 'fa-eye',
        },
        {
          index: 2,
          paramList: 'id',
          methodName: 'repair',
          type: 'BUTTON',
          displayName: 'REPAIR',
          icon: '',
        },
        {
          index: 3,
          paramList: 'id',
          methodName: 'accept',
          type: 'BUTTON',
          displayName: 'ACCEPT',
          icon: '',
        },
      ];

      return record;
    });

    res.json(authorizedList);
  },
);

module.exports = router;
