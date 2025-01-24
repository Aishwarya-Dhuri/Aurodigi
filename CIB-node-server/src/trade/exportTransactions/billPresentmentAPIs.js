var express = require('express');

var getAuthorizedList = require('../../listingAPIs').getAuthorizedListRecords;
var getPendingList = require('../../listingAPIs').getPendingListRecords;

var router = express.Router();

router.post(
  '/dummyServer/json/trade/exportTransactions/billPresentment/private/getRepairList',
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
  '/dummyServer/json/trade/exportTransactions/billPresentment/private/getRecentList',
  (req, res) => {
    let pendingList = getPendingList(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    pendingList.data = pendingList.data.map((record) => {
      record['actions'] = [
        {
          index: 0,
          paramList: 'id',
          methodName: 'history',
          type: 'ICON',
          displayName: 'History',
          icon: 'fas fa-history',
        },
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

module.exports = router;
