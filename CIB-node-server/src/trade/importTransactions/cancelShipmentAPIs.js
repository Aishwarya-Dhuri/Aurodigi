var express = require('express');

var getAuthorizedListRecords = require('../../listingAPIs').getAuthorizedListRecords;

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
  '/dummyServer/json/trade/importTransactions/cancelShipment/private/getAuthorizedList',
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
  '/dummyServer/json/trade/importTransactions/cancelShipment/private/getCancellationList',
  (req, res) => {
    const filters = req.body.dataMap.filters;

    const dataList = getAuthorizedListRecords(
      './dummyServer/json/trade/importTransactions/shippingGuarantee/data.xlsx',
      defaultReqModel,
      req.session.userDetails,
    ).data.map((record) => {
      return {
        ...record,
        actions: [
          {
            index: 1,
            displayName: 'VIEW',
            type: 'ICON',
            icon: 'fa-eye',
            url: '',
            methodName: 'onView',
            paramList: 'id',
            color: null,
          },
          {
            index: 2,
            displayName: 'CANCEL',
            type: 'BUTTON',
            icon: '',
            url: '',
            methodName: 'onCancelMandate',
            paramList: 'id',
            color: 'primary',
          },
        ],
      };
    });

    let response = {
      dataList,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/trade/importTransactions/cancelShipment/private/getRepairList',
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
