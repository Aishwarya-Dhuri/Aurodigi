const express = require('express');
const XLSX = require('xlsx');
const multer = require('multer');
const getViewData = require('./../../crudAPIs').getViewData;
const addRecordInExcel = require('./../../crudAPIs').addRecordInExcel;
const authorize = require('./../../crudAPIs').authorize;
const generateAuthorizeSheetData = require('./../../crudAPIs').generateAuthorizeSheetData;
const updateWorkbook = require('./../../crudAPIs').updateWorkbook;
const getPendingListRecords = require('./../../listingAPIs').getPendingListRecords;
const getAuthorizedListRecords = require('./../../listingAPIs').getAuthorizedListRecords;
const getDisabledListRecords = require('./../../listingAPIs').getDisabledListRecords;

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'dummyServer/uploadedFiles/receiptUpload');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    cb(null, 'sys_' + Date.now() + '_' + name);
  },
});

router.post(
  '/dummyServer/json/rms/transactions/receiptUpload/private/create',
  multer({ storage: storage }).single('uploadDocuments'),
  (req, res) => {
    const file = req.file;

    req.body.filePath = './' + file.path;
    req.body.fileFormat = file.type;
    req.body.fileName = file.filename;
    const dataXlFile = './dummyServer/json/rms/transactions/receiptUpload/data.xlsx';
    const data = addRecordInExcel(dataXlFile, req.body, req.session.userDetails);
    res.json({
      dataMap: { data },
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post('/dummyServer/json/rms/transactions/receiptUpload/private/view', (req, res) => {
  const dataXlFile = './dummyServer/json/rms/transactions/receiptUpload/data.xlsx';

  let filters = [];
  if (req.body.dataMap && req.body.dataMap.filters) {
    filters = req.body.dataMap.filters;
  } else if (req.body.filters) {
    filters = req.body.filters;
  }
  if (req.body.dataMap && req.body.dataMap.id) {
    filters.push({ name: 'id', value: req.body.dataMap.id });
  }

  let receiptUploadviewData = getViewData(dataXlFile, filters);

  const workbook = XLSX.readFile(receiptUploadviewData.filePath);
  const uploadedReceiptData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
  receiptUploadviewData['uploadedFilesList'] = uploadedReceiptData;
  res.json({ ...receiptUploadviewData, responseStatus: { message: '', status: '0' } });
});

router.post('/dummyServer/json/rms/transactions/receiptUpload/private/authorize', (req, res) => {
  //Authorize Receipt Upload
  const dataXlFile = './dummyServer/json/rms/transactions/receiptUpload/data.xlsx';
  authorize(dataXlFile, req.session.userDetails, req.body, XLSX.readFile(dataXlFile));

  const filters = [];
  req.body.dataMap.ids.forEach((id) => {
    filters.push({ name: 'id', value: id });
  });
  //get All Data from Uploaded Receipt
  const viewData = getViewData(dataXlFile, filters);
  const workbook = XLSX.readFile(viewData.filePath);
  const uploadedData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

  //Add Authorized data in Receipt Entry
  const receiptEntryDataXlFile = './dummyServer/json/rms/transactions/receiptEntry/data.xlsx';
  uploadedData.forEach((record) => {
    const uploadedDataFilters = [];
    uploadedDataFilters.push({ name: 'id', value: record.id });

    //Read uploaded Data
    const uploadedViewRecord = getViewData(viewData.filePath, uploadedDataFilters);
    delete uploadedViewRecord.id;

    // Add each record in excel
    const receiptEntryData = addRecordInExcel(
      receiptEntryDataXlFile,
      uploadedViewRecord,
      req.session.userDetails,
    );

    //Add record in Authorized List
    const existingWb = XLSX.readFile(receiptEntryDataXlFile);
    const sheets = generateAuthorizeSheetData(
      req.session.userDetails,
      { ids: [receiptEntryData.id] },
      existingWb,
    );
    updateWorkbook(existingWb, sheets, receiptEntryDataXlFile);
  });

  res.json({ responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
});

router.post(
  '/dummyServer/json/rms/transactions/receiptUpload/private/getPendingList',
  (req, res) => {
    const response = getPendingListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );
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
  '/dummyServer/json/rms/transactions/receiptUpload/private/getAuthorizedList',
  (req, res) => {
    const response = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );
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
  '/dummyServer/json/rms/transactions/receiptUpload/private/getDisabledList',
  (req, res) => {
    const response = getDisabledListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );
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

module.exports = router;
