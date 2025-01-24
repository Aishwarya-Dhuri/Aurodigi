var express = require('express');
var XLSX = require('xlsx');
var getAuthorizedList = require('../listingAPIs').getAuthorizedListRecords;
var getPendingList = require('../listingAPIs').getPendingListRecords;
var getViewData = require('../crudAPIs').getViewData;

var _ = require('lodash');

var router = express.Router();

router.post(
  '/dummyServer/json/payments/upi/pendingMoney/private/getAuthorizedList',
  (req, res) => {
    const authorizedList = getAuthorizedList(
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
          methodName: 'onLog',
          type: 'ICON',
          displayName: 'Log',
          icon: 'fa-book',
        },
        {
          index: 3,
          paramList: 'id',
          methodName: 'onDownload',
          type: 'ICON',
          displayName: 'Download',
          icon: 'fa-file-download',
        },
        {
          index: 6,
          displayName: 'Disable',
          type: 'ICON',
          icon: 'pi pi-lock',
          url: 'private/disable',
          methodName: 'disable',
          paramList: sheetName == 'id',
          color: 'warn',
        },
      ];

      return record;
    });

    res.json(authorizedList);
  },
);

router.post(
  '/dummyServer/json/payments/upi/pendingMoney/private/getProcessedList',
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
        }
      ];

      return record;
    });

    res.json(authorizedList);
  },
);

router.post(
  '/dummyServer/json/payments/upi/pendingMoney/private/getSpamList',
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

router.post(
  '/dummyServer/json/payments/upi/pendingMoney/private/getPendingList',
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

router.post(
  '/dummyServer/json/payments/upi/pendingMoney/private/getRecentList',
  (req, res) => {
    let pendingList = getPendingList(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    pendingList.data = pendingList.data.map((record) => {
      record['actions'] = [
        {
          index: 1,
          paramList: 'id',
          methodName: 'copy',
          type: 'ICON',
          displayName: 'Copy',
          icon: 'fa-copy',
        },
        {
          index: 2,
          paramList: 'id',
          methodName: 'edit',
          type: 'ICON',
          displayName: 'Edit',
          icon: 'fa-pencil',
        },
      ];

      return record;
    });

    res.json(pendingList);
  },
);

//Get LC Number
router.post(
  '/dummyServer/json/payments/upi/pendingMoney/private/getLCNumberList',
  (req, res) => {
    console.log('reading LC data');
    var dataXlFile = './dummyServer/json/trade/importTransactions/letterOfCredit/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    var dataList = [];
    _.forEach(xlData, function (record) {
      const filters = [{ name: 'id', value: record.id }];

      const lcDetails = getViewData(
        './dummyServer/json/trade/importTransactions/letterOfCredit/data.xlsx',
        filters,
      );

      dataList.push({
        id: record.id,
        beneficiaryName: record.beneficiaryName,
        enrichments: {
          ...lcDetails,
        },
      });
    });

    res.json({
      data: dataList,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

module.exports = router;
