const XLSX = require('xlsx');
const express = require('express');
const moment = require('moment');
const getAuthorizedList = require('../../listingAPIs').getActiveListRecords;

const router = express.Router();

router.post(
  '/dummyServer/json/trade/importTransactions/billAcceptance/private/getListingTabs',
  (req, res) => {
    const dataList = getData(req);

    res.json({
      data: [
        {
          id: 'allDueBills',
          displayName: 'All Due Bills',
          count: dataList.length,
          colDefUrl: 'trade/importTransactions/billAcceptance/private/searchResultColDefs',
          rowDataUrl:
            'trade/importTransactions/billAcceptance/private/getAllDueBillsSearchResultDataList',
        },
        {
          id: 'rejectedBills',
          displayName: 'Rejected Bills',
          count: dataList.filter((record) => {
            if (record.billStatus === 'Rejected') {
              return record;
            }
          }).length,
          colDefUrl: 'trade/importTransactions/billAcceptance/private/rejectedResultColDefs',
          rowDataUrl:
            'trade/importTransactions/billAcceptance/private/getRejectedBillsSearchResultDataList',
        },
      ],
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
      lastRow: dataList.length,
    });
  },
);

router.post(
  '/dummyServer/json/trade/importTransactions/billAcceptance/private/getBillAcceptanceSearchResultTab',
  (req, res) => {
    const dataList = getData(req);

    const searchResultTab = {
      id: 'searchResults',
      displayName: 'Search Results',
      count: dataList.length,
      colDefUrl: 'trade/importTransactions/billAcceptance/private/searchResultColDefs',
      rowDataUrl: 'trade/importTransactions/billAcceptance/private/getSearchResultDataList',
    };
    res.json({ searchResultTab });
  },
);

router.post(
  '/dummyServer/json/trade/importTransactions/billAcceptance/private/getAllDueBillsSearchResultDataList',
  (req, res) => {
    const dataList = getData(req);

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
  '/dummyServer/json/trade/importTransactions/billAcceptance/private/getRejectedBillsSearchResultDataList',
  (req, res) => {
    const dataList = getData(req).filter((record) => {
      if (record.billStatus === 'Rejected') {
        return record;
      }
    });

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
  '/dummyServer/json/trade/importTransactions/billAcceptance/private/getSearchResultDataList',
  (req, res) => {
    const dataList = getData(req);

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
  '/dummyServer/json/trade/importTransactions/billAcceptance/private/getViewData',
  (req, res) => {
    const dataList = getData(req);

    res.json({
      data: dataList.find((record) => record.id == req.body.dataMap.id),
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

const getData = (req) => {
  console.log('reading search result data');
  const dataXlFile =
    '.' + req.url.substring(0, req.url.indexOf('private')) + 'searchResultData.xlsx';
  const workbook = XLSX.readFile(dataXlFile);
  const xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

  return xlData.map((record) => {
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
        methodName: 'accept',
        type: 'BUTTON',
        displayName: 'ACCEPT',
        icon: '',
      },
      {
        index: 3,
        paramList: 'id',
        methodName: 'reject',
        type: 'BUTTON',
        displayName: 'REJECT',
        icon: '',
      },
    ];
    if (record.billStatus === 'Rejected') {
      record['actions'].splice(1, 2);
    }
    return record;
  });
};

router.post(
  '/dummyServer/json/trade/importTransactions/billAcceptance/private/getRepairList',
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
