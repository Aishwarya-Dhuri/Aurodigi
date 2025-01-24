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
  '/dummyServer/json/directDebit/enquiry/debitEnquiry/private/getDebitEnquiryList',
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
