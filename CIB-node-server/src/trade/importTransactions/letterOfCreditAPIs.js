var express = require('express');

var getAuthorizedList = require('../../listingAPIs').getAuthorizedListRecords;
var getPendingList = require('../../listingAPIs').getPendingListRecords;

var router = express.Router();

router.post(
  '/dummyServer/json/trade/importTransactions/letterOfCredit/private/getAuthorizedList',
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
          paramList: 'id',
          color: 'warn',
        },
      ];

      return record;
    });

    res.json(authorizedList);
  },
);

router.post(
  '/dummyServer/json/trade/importTransactions/letterOfCredit/private/getRepairList',
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
  '/dummyServer/json/trade/importTransactions/letterOfCredit/private/getRecentList',
  (req, res) => {
    // const lcId = req.body.dataMap.id
    let pendingList = getPendingList(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
      // lcId
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
