const XLSX = require('xlsx');
const express = require('express');
const moment = require('moment');
const getAuthorizedList = require('../../listingAPIs').getActiveListRecords;

const router = express.Router();

router.post(
  '/dummyServer/json/trade/importTransactions/billPaymentAndApplyFinance/private/getListingTabs',
  (req, res) => {
    const dataList = getData(req);

    res.json({
      data: [
        {
          id: 'overDue',
          displayName: 'Over Due',
          count: dataList.filter((record) => {
            const toDay = moment(new Date());
            const dueDate = moment(new Date(record.tradeBillDueDate));
            const dueDays = toDay.diff(dueDate, 'days');

            return dueDays > 0;
          }).length,
          colDefUrl:
            'trade/importTransactions/billPaymentAndApplyFinance/private/searchResultColDefs',
          rowDataUrl:
            'trade/importTransactions/billPaymentAndApplyFinance/private/getOverDueSearchResultDataList',
        },
        {
          id: 'dueToday',
          displayName: 'Due Today',
          count: dataList.filter((record) => {
            const toDay = moment(new Date());
            const dueDate = moment(new Date(record.tradeBillDueDate));
            const dueDays = toDay.diff(dueDate, 'days');

            return dueDays == 0;
          }).length,
          colDefUrl:
            'trade/importTransactions/billPaymentAndApplyFinance/private/searchResultColDefs',
          rowDataUrl:
            'trade/importTransactions/billPaymentAndApplyFinance/private/getDueTodaySearchResultDataList',
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
  '/dummyServer/json/trade/importTransactions/billPaymentAndApplyFinance/private/getBillPAymentApplyFinanceSearchResultTab',
  (req, res) => {
    const dataList = getData(req);

    const searchResultTab = {
      id: 'searchResults',
      displayName: 'Search Results',
      count: dataList.length,
      colDefUrl: 'trade/importTransactions/billPaymentAndApplyFinance/private/searchResultColDefs',
      rowDataUrl:
        'trade/importTransactions/billPaymentAndApplyFinance/private/getSearchResultDataList',
    };

    res.json({ searchResultTab });
  },
);

router.post(
  '/dummyServer/json/trade/importTransactions/billPaymentAndApplyFinance/private/getOverDueSearchResultDataList',
  (req, res) => {
    const dataList = getData(req).filter((record) => {
      const toDay = moment(new Date());
      const dueDate = moment(new Date(record.tradeBillDueDate));
      const dueDays = toDay.diff(dueDate, 'days');

      return dueDays > 0;
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
  '/dummyServer/json/trade/importTransactions/billPaymentAndApplyFinance/private/getDueTodaySearchResultDataList',
  (req, res) => {
    const dataList = getData(req).filter((record) => {
      const toDay = moment(new Date());
      const dueDate = moment(new Date(record.tradeBillDueDate));
      const dueDays = toDay.diff(dueDate, 'days');

      return dueDays == 0;
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
  '/dummyServer/json/trade/importTransactions/billPaymentAndApplyFinance/private/getSearchResultDataList',
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
  '/dummyServer/json/trade/importTransactions/billPaymentAndApplyFinance/private/getViewData',
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
        index: 0,
        paramList: 'id',
        methodName: 'view',
        type: 'ICON',
        displayName: 'View',
        icon: 'fa-eye',
      },
      {
        index: 1,
        paramList: 'id',
        methodName: 'create',
        type: 'ICON',
        displayName: 'Create',
        icon: 'fa-check-square',
      },
    ];
    if (record.billStatus === 'Pending Acceptance') {
      record['actions'].splice(1);
    }
    return record;
  });
};

router.post(
  '/dummyServer/json/trade/importTransactions/billPaymentAndApplyFinance/private/getRepairList',
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
