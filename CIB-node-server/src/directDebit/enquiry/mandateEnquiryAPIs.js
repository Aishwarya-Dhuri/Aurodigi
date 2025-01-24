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
const updateRecordInExcel = require('../../crudAPIs').updateRecordInExcel;
const deleteRecordInExcel = require('../../crudAPIs').deleteRecordInExcel;
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
  '/dummyServer/json/directDebit/enquiry/mandateEnquiry/private/getMandateHistory',
  (req, res) => {
    let filters = [];

    if (req.body.dataMap && req.body.dataMap.filters) {
      filters = req.body.dataMap.filters;
    } else if (req.body.filters) {
      filters = req.body.filters;
    }
    if (req.body.dataMap && req.body.dataMap.id) {
      filters.push({ name: 'id', value: req.body.dataMap.id });
    }

    const registrationDataFile =
      './dummyServer/json/directDebit/mandateManagement/registration/data.xlsx';

    const data = getViewData(registrationDataFile, filters);

    const dataList = [];

    data.lastAction.split(',').forEach((record) => {
      dataList.push({
        ...data,
        status: record,
      });
    });

    res.json({ dataList, responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/directDebit/enquiry/mandateEnquiry/private/getMandateEnquiryList',
  (req, res) => {
    const filters = req.body.dataMap.filters;

    const dataList = getAuthorizedListRecords(
      './dummyServer/json/directDebit/mandateManagement/registration/data.xlsx',
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
            displayName: 'HISTORY',
            type: 'ICON',
            icon: 'fa-history',
            url: '',
            methodName: 'onMandateHistory',
            paramList: 'id',
            color: null,
          },
          {
            index: 3,
            displayName: 'T',
            type: 'BUTTON',
            icon: '',
            url: '',
            methodName: 'onTransactionHistory',
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

module.exports = router;
