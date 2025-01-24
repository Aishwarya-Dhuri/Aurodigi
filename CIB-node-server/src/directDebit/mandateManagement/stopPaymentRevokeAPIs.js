var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');

var getAuthorizedListRecords = require('../../listingAPIs').getAuthorizedListRecords;

var getActiveListRecords = require('../../listingAPIs').getActiveListRecords;
var getPendingListRecords = require('../../listingAPIs').getPendingListRecords;
var getAllListRecords = require('../../listingAPIs').getAllListRecords;
var getRejectedListRecords = require('../../listingAPIs').getRejectedListRecords;
var getDisabledListRecords = require('../../listingAPIs').getDisabledListRecords;

const getViewData = require('../../crudAPIs').getViewData;
const addRecordInExcel = require('../../crudAPIs').addRecordInExcel;
const updateWorkbook = require('../../crudAPIs').updateWorkbook;
const generateAuthorizeSheetData = require('../../crudAPIs').generateAuthorizeSheetData;

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
  '/dummyServer/json/directDebit/mandateManagement/stopPaymentRevoke/private/authorize',
  (req, res) => {
    var dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
    var existingWb = XLSX.readFile(dataXlFile);

    var sheets = generateAuthorizeSheetData(req.session.userDetails, req.body.dataMap, existingWb);
    updateWorkbook(existingWb, sheets, dataXlFile);

    let filters = [];
    if (req.body.dataMap && req.body.dataMap.filters) {
      filters = req.body.dataMap.filters;
    } else if (req.body.filters) {
      filters = req.body.filters;
    }
    if (req.body.dataMap && req.body.dataMap.id) {
      filters.push({ name: 'id', value: req.body.dataMap.id });
    }

    const data = getViewData(dataXlFile, filters);

    const registrationDataFile =
      './dummyServer/json/directDebit/mandateManagement/registration/private/data.xlsx';

    const newRecord = addRecordInExcel(registrationDataFile, data, req.session.userDetails);

    var registrationWb = XLSX.readFile(registrationDataFile);

    var registrationSheets = generateAuthorizeSheetData(
      req.session.userDetails,
      { id: newRecord },
      registrationWb,
    );

    updateWorkbook(registrationWb, registrationSheets, registrationDataFile);

    res.json({ responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/directDebit/mandateManagement/stopPaymentRevoke/private/getStopPaymentRevokeList',
  (req, res) => {
    const filters = req.body.dataMap.filters;

    const dataList = getAuthorizedListRecords(
      './dummyServer/json/directDebit/mandateManagement/stopPaymentRequest/data.xlsx',
      defaultReqModel,
      req.session.userDetails,
    ).data.map((record) => {
      return {
        ...record,
        productCodeName: record.productCode + ' - ' + record.productName,
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
            displayName: 'REVOKE',
            type: 'BUTTON',
            icon: '',
            url: '',
            methodName: 'onStopPaymentRevoke',
            paramList: 'id',
            color: null,
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
  '/dummyServer/json/directDebit/mandateManagement/stopPaymentRevoke/private/getActiveList',
  (req, res) => {
    res.json(
      updateActions(
        getActiveListRecords(
          '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
          req.body,
          req.session.userDetails,
        ),
      ),
    );
  },
);

router.post(
  '/dummyServer/json/directDebit/mandateManagement/stopPaymentRevoke/private/getPendingList',
  (req, res) => {
    res.json(
      updateActions(
        getPendingListRecords(
          '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
          req.body,
          req.session.userDetails,
        ),
      ),
    );
  },
);

router.post(
  '/dummyServer/json/directDebit/mandateManagement/stopPaymentRevoke/private/getAuthorizedList',
  (req, res) => {
    res.json(
      updateActions(
        getAuthorizedListRecords(
          '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
          req.body,
          req.session.userDetails,
        ),
      ),
    );
  },
);

router.post(
  '/dummyServer/json/directDebit/mandateManagement/stopPaymentRevoke/private/getRejectedList',
  (req, res) => {
    res.json(
      updateActions(
        getRejectedListRecords(
          '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
          req.body,
          req.session.userDetails,
        ),
      ),
    );
  },
);

router.post(
  '/dummyServer/json/directDebit/mandateManagement/stopPaymentRevoke/private/getDisabledList',
  (req, res) => {
    res.json(
      updateActions(
        getDisabledListRecords(
          '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
          req.body,
          req.session.userDetails,
        ),
      ),
    );
  },
);

router.post(
  '/dummyServer/json/directDebit/mandateManagement/stopPaymentRevoke/private/getAllList',
  (req, res) => {
    res.json(
      updateActions(
        getAllListRecords(
          '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
          req.body,
          req.session.userDetails,
        ),
      ),
    );
  },
);

const updateActions = (responseList) => {
  responseList.data = responseList.data.map((record) => {
    const actions = record.actions.filter((action) => action.displayName != 'Edit');

    return {
      ...record,
      actions: actions,
    };
  });

  return responseList;
};

module.exports = router;
