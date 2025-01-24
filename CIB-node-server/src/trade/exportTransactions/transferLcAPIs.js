var express = require('express');
var router = express.Router();
var getAllList = require('../../listingAPIs').getAllListRecords;
var getAuthorizedListRecords = require('../../listingAPIs').getAuthorizedListRecords;

const defaultReqModel = {
  startRow: 0,
  endRow: 1,
  rowGroupCols: [],
  valueCols: [],
  pivotCols: [],
  pivotMode: false,
  groupKeys: [],
  filterModel: {},
  sortModel: [],
  entityName: '',
};

router.post(
  '/dummyServer/json/trade/exportTransactions/transferredLc/private/getAuthorizedList',
  (req, res) => {
    const authorizedList = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
      defaultReqModel
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
          methodName: 'onDownload',
          type: 'ICON',
          displayName: 'Download',
          icon: 'fa-file-download',
        }
      ];

      return record;
    });

    res.json(authorizedList);
  },
);


router.post(
  '/dummyServer/json/trade/exportTransactions/transferLc/private/getTransferLcListingTabs',
  (req, res) => {
    const allList = getAllList(
      './dummyServer/json/trade/importTransactions/letterOfCredit/data.xlsx',
      req.body,
      req.session.userDetails,
    );

    const listingTabs = {
      tabs: [
        {
          id: 'transferLcs',
          displayName: 'Transfer LCs',
          count: allList.lastRow,
          colDefUrl: 'trade/exportTransactions/advisedLc/private/advisedLcColDefs',
          rowDefUrl: 'trade/exportTransactions/transferLc/private/getTransferLcList',
        }
      ],
    };

    res.json(listingTabs);
  },
);

router.post(
  '/dummyServer/json/trade/exportTransactions/transferLc/private/getTransferLcList',
  (req, res) => {
    let allList = getAllList(
      './dummyServer/json/trade/importTransactions/letterOfCredit/data.xlsx',
      req.body,
      req.session.userDetails,
    );

    allList.data = allList.data.map((record) => {
      record['advisedLcRefNumber'] = record.id + 54321;
      record['lcAdvisingDate'] = record.modifiedSysOn;
      record['actions'] = [
        {
          index: 0,
          paramList: 'id',
          methodName: 'view',
          type: 'ICON',
          displayName: 'View',
          icon: 'fa-eye text-color-primary',
        },
        {
          index: 1,
          paramList: 'id',
          methodName: 'transfer',
          type: 'BUTTON',
          displayName: 'Transfer',
          icon: 'primary',
        }
      ];

      return record;
    });

    res.json(allList);
  },
);

router.post(
  '/dummyServer/json/trade/exportTransactions/transferLc/private/getTransferLcSearchResultTab',
  (req, res) => {
    let allList = getAllList(
      './dummyServer/json/trade/importTransactions/letterOfCredit/data.xlsx',
      req.body,
      req.session.userDetails,
    );

    const searchResultTab = {
      id: 'searchResults',
      displayName: 'Search Results',
      count: allList.lastRow,
      colDefUrl: 'trade/exportTransactions/transferLc/private/transferLcColDefs',
      rowDefUrl: 'trade/exportTransactions/transferLc/private/getSearchResults',
    };

    res.json({ searchResultTab });
  },
);

router.post(
  '/dummyServer/json/trade/exportTransactions/transferLc/private/getSearchResults',
  (req, res) => {
    let allList = getAllList(
      './dummyServer/json/trade/importTransactions/letterOfCredit/data.xlsx',
      req.body,
      req.session.userDetails,
    );

    allList.data = allList.data.map((record) => {
      record['advisedLcRefNumber'] = record.id + 54321;
      record['lcAdvisingDate'] = record.modifiedSysOn;
      record['actions'] = [
        {
          index: 0,
          paramList: 'id',
          methodName: 'view',
          type: 'ICON',
          displayName: 'View',
          icon: 'fa-eye text-color-primary',
        },
      ];

      return record;
    });

    res.json(allList);
  },
);

router.post(
  '/dummyServer/json/trade/exportTransactions/transferredLc/private/getRepairList',
  (req, res) => {
    let authorizedList = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
      defaultReqModel
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
