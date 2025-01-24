var express = require('express');

var getAllList = require('../../listingAPIs').getAllListRecords;
var getAuthorizedList = require('../../listingAPIs').getAuthorizedListRecords;
var getPendingList = require('../../listingAPIs').getPendingListRecords;

var router = express.Router();

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
  '/dummyServer/json/trade/importTransactions/letterOfCreditAmend/private/getRepairList',
  (req, res) => {
    let authorizedList = getAuthorizedList(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body ? req.body : defaultReqModel,
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
  '/dummyServer/json/trade/importTransactions/letterOfCreditAmend/private/getRecentList',
  (req, res) => {
    let pendingList = getPendingList(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body ? req.body : defaultReqModel,
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

router.post(
  '/dummyServer/json/trade/importTransactions/letterOfCreditAmend/private/searchDataList',
  (req, res) => {
    let pendingList = getAllList(
      './dummyServer/json/trade/importTransactions/letterOfCredit/data.xlsx',
      req.body ? req.body : defaultReqModel,
      req.session.userDetails,
    );

    pendingList.data = pendingList.data.map((record) => {
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
          methodName: 'amend',
          type: 'BUTTON',
          displayName: 'AMEND',
          icon: '',
        },
        {
          index: 2,
          paramList: 'id',
          methodName: 'cancel',
          type: 'BUTTON',
          displayName: 'CANCEL',
          icon: '',
        }
      ];

      return record;
    });

    res.json(pendingList);
  },
);

module.exports = router;
