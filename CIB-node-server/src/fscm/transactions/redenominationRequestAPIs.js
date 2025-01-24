var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
const { getViewData } = require('../../crudAPIs');
var getAuthorizedListRecords = require('../../listingAPIs').getAuthorizedListRecords;

const addDataToExcel = require('../../crudAPIs').addRecordInExcel;
const deleteRecordInExcel = require('../../crudAPIs').deleteRecordInExcel;

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

var router = express.Router();

router.post(
  '/dummyServer/json/fscm/transactions/redenominationRequest/private/getAcceptedAuthorizedInvoice',
  (req, res) => {
    const dataXlFile = './dummyServer/json/fscm/transactions/invoiceAcceptance/data.xlsx';

    let filters = [];
    if (req.body.dataMap && req.body.dataMap.filters) {
      filters = req.body.dataMap.filters;
    } else if (req.body.filters) {
      filters = req.body.filters;
    }
    if (req.body.dataMap && req.body.dataMap.id) {
      filters.push({ name: 'id', value: req.body.dataMap.id });
    }

    res.json({ ...getViewData(dataXlFile, filters), responseStatus: { message: '', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/redenominationRequest/private/getRedenominationRequestList',
  (req, res) => {
    const filters = req.body.dataMap.filters;
    const dataList = getAuthorizedListRecords(
      './dummyServer/json/fscm/transactions/invoiceAcceptance/data.xlsx',
      defaultReqModel,
      req.session.userDetails,
    ).data.map((record) => {
      return {
        ...record,
        actions: [
          {
            index: 1,
            displayName: 'REDENOMINATION',
            type: 'BUTTON',
            icon: '',
            url: '',
            methodName: 'onRedenomination',
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

module.exports = router;
