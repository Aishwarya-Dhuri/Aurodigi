const express = require('express');
const _ = require('lodash');
let XLSX = require('xlsx');

const addRecordInExcel = require('./../crudAPIs').addRecordInExcel;
const getPendingListRecords = require('./../listingAPIs').getPendingListRecords;
const getAuthorizedListRecords = require('./../listingAPIs').getAuthorizedListRecords;
const getRejectedListRecords = require('./../listingAPIs').getRejectedListRecords;
const getDisabledListRecords = require('./../listingAPIs').getDisabledListRecords;
const getViewData = require('./../crudAPIs').getViewData;
const deleteRecordInExcel = require('./../crudAPIs').deleteRecordInExcel;
const updateRecordInExcel = require('./../crudAPIs').updateRecordInExcel;
const authorize = require('./../crudAPIs').authorize;
const updateWorkbook = require('./../crudAPIs').updateWorkbook;
const generateDisableSheetData = require('./../crudAPIs').generateDisableSheetData;
const generateRejectSheetData = require('./../crudAPIs').generateRejectSheetData;

const router = express.Router();

router.post(
  '/dummyServer/json/payments/transactions/templateManagement/private/create',
  (req, res) => {
    const dataXlFile =
      './dummyServer/json/payments/transactions/singlePaymentRequest/templateData.xlsx';
    const data = addRecordInExcel(dataXlFile, req.body, req.session.userDetails);
    res.json({
      dataMap: { id: data.id },
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/templateManagement/private/getAllCount',
  (req, res) => {
    var workbook = XLSX.readFile(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'listingTypes.xlsx',
    );
    console.log(
      'getAllCount : ' +
        '.' +
        req.url.substring(0, req.url.indexOf('private')) +
        'listingTypes.xlsx',
    );

    var response = {};
    response.dataList = XLSX.utils.sheet_to_json(workbook.Sheets['listingTypes']);
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
    response.dataList.forEach((list) => {
      delete list.checkboxSelection;
      let dataFileUrl = './dummyServer/json/payments/transactions/singlePaymentRequest';
      if (list.rowDataUrl == 'getPendingList') {
        list.count = getPendingListRecords(
          dataFileUrl + '/templateData.xlsx',
          defaultReqModel,
          req.session.userDetails,
        ).lastRow;
      } else if (list.rowDataUrl == 'getAuthorizedList') {
        list.count = getAuthorizedListRecords(
          dataFileUrl + '/templateData.xlsx',
          defaultReqModel,
          req.session.userDetails,
        ).lastRow;
      } else if (list.rowDataUrl == 'getRejectedList') {
        list.count = getRejectedListRecords(
          dataFileUrl + '/templateData.xlsx',
          defaultReqModel,
          req.session.userDetails,
        ).lastRow;
      } else if (list.rowDataUrl == 'getDisabledList') {
        list.count = getDisabledListRecords(
          dataFileUrl + '/templateData.xlsx',
          defaultReqModel,
          req.session.userDetails,
        ).lastRow;
      }
    });
    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/templateManagement/private/getPendingList',
  (req, res) => {
    const dataXlFile =
      './dummyServer/json/payments/transactions/singlePaymentRequest/templateData.xlsx';
    const response = getPendingListRecords(dataXlFile, req.body, req.session.userDetails);
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/templateManagement/private/getAuthorizedList',
  (req, res) => {
    const dataXlFile =
      './dummyServer/json/payments/transactions/singlePaymentRequest/templateData.xlsx';
    const response = getAuthorizedListRecords(dataXlFile, req.body, req.session.userDetails);
    response.data = response.data.map((record) => {
      const index = record.actions.findIndex((action) => action.methodName == 'edit');

      if (index !== -1) {
        record.actions.splice(index, 1);
      }
      return record;
    });
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/templateManagement/private/getRejectedList',
  (req, res) => {
    const dataXlFile =
      './dummyServer/json/payments/transactions/singlePaymentRequest/templateData.xlsx';
    const response = getRejectedListRecords(dataXlFile, req.body, req.session.userDetails);
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/templateManagement/private/getDisabledList',
  (req, res) => {
    const dataXlFile =
      './dummyServer/json/payments/transactions/singlePaymentRequest/templateData.xlsx';
    const response = getDisabledListRecords(dataXlFile, req.body, req.session.userDetails);
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/templateManagement/private/view',
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
    const dataXlFile =
      './dummyServer/json/payments/transactions/singlePaymentRequest/templateData.xlsx';
    const viewData = getViewData(dataXlFile, filters);
    res.json({ ...viewData, responseStatus: { message: '', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/templateManagement/private/update',
  (req, res) => {
    const dataXlFile =
      './dummyServer/json/payments/transactions/singlePaymentRequest/templateData.xlsx';
    const data = updateRecordInExcel(dataXlFile, req.body, req.session.userDetails);
    res.json({
      dataMap: { id: data.id, data },
      responseStatus: { message: 'MSG_KEY_UPDATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/templateManagement/private/delete',
  (req, res) => {
    const dataXlFile =
      './dummyServer/json/payments/transactions/singlePaymentRequest/templateData.xlsx';
    deleteRecordInExcel(dataXlFile, req.body.dataMap.id);
    res.json({ responseStatus: { message: 'MSG_KEY_DELETION_SUCCESSFUL', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/templateManagement/private/authorize',
  (req, res) => {
    const dataXlFile =
      './dummyServer/json/payments/transactions/singlePaymentRequest/templateData.xlsx';
    authorize(dataXlFile, req.session.userDetails, req.body, XLSX.readFile(dataXlFile));
    res.json({ responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/templateManagement/private/reject',
  (req, res) => {
    let dataXlFile =
      './dummyServer/json/payments/transactions/singlePaymentRequest/templateData.xlsx';
    let existingWb = XLSX.readFile(dataXlFile);

    let sheets = generateRejectSheetData(req.session.userDetails, req.body.dataMap, existingWb);
    updateWorkbook(existingWb, sheets, dataXlFile);

    res.json({ responseStatus: { message: 'MSG_KEY_REJECTION_SUCCESSFUL', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/templateManagement/private/disable',
  (req, res) => {
    let dataXlFile =
      './dummyServer/json/payments/transactions/singlePaymentRequest/templateData.xlsx';
    let existingWb = XLSX.readFile(dataXlFile);

    let sheets = generateDisableSheetData(req.session.userDetails, req.body.dataMap, existingWb);
    updateWorkbook(existingWb, sheets, dataXlFile);

    res.json({ responseStatus: { message: 'MSG_KEY_REJECTION_SUCCESSFUL', status: '0' } });
  },
);

module.exports = router;
