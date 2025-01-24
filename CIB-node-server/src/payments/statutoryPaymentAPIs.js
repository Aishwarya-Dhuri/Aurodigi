const express = require('express');
const _ = require('lodash');
const getAuthorizedListRecords = require('./../listingAPIs').getAuthorizedListRecords;

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

const router = express.Router();

router.post(
  '/dummyServer/json/payments/transactions/statutoryPayment/private/getAuthorizedList',
  (req, res) => {
    const response = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    response.data = response.data.map((record) => {
      const index = record.actions.findIndex((action) => action.methodName == 'disable');

      if (index !== -1) {
        record.actions.splice(index, 1);
      }

      record.actions.push({
        index: 8,
        displayName: 'Download',
        type: 'ICON',
        icon: 'far fa-arrow-to-bottom',
        url: '',
        methodName: 'statutoryPaymentDownload',
        paramList: 'id,institutionType',
        color: 'primary',
      });

      return record;
    });

    res.json(response);
  },
);

module.exports = router;
