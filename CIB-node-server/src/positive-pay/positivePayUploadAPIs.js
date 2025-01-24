const express = require('express');
const XLSX = require('xlsx');
const _ = require('lodash');
const multer = require('multer');

const addRecordInExcel = require('../crudAPIs').addRecordInExcel;
const getViewData = require('../crudAPIs').getViewData;

const getActiveListRecords = require('./../listingAPIs').getActiveListRecords;
const getPendingListRecords = require('./../listingAPIs').getPendingListRecords;
const getAuthorizedListRecords = require('./../listingAPIs').getAuthorizedListRecords;
const getRejectedListRecords = require('./../listingAPIs').getRejectedListRecords;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Saving Files : ' + file.originalname);
    cb(null, 'dummyServer/uploadedFiles/bulkChequeUpload');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    cb(null, 'sys_' + Date.now() + '_' + name);
  },
});

const router = express.Router();

router.post(
  '/dummyServer/json/positivePay/transactions/positivePayUpload/private/create',
  multer({ storage: storage }).single('bulkChequeFile'),
  (req, res) => {
    const file = req.file;

    req.body.chequeImages = JSON.parse(req.body.chequeImages);

    req.body.filePath = './' + file.path;
    req.body.fileFormat = file.type;
    req.body.fileName = file.filename;

    const workbook = XLSX.readFile(req.body.filePath);
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    let totalAmount = 0;

    xlData.forEach((record) => {
      totalAmount += +record.chequeAmount;
    });

    req.body.totalAmount = totalAmount;
    req.body.noOfCheques = xlData.length;

    req.body.uploadDate = new Date().toDateString();

    req.body.corporateReference = req.session.userDetails.corporateCode;
    req.body.corporateCode = req.session.userDetails.corporateCode;
    req.body.corporateName = req.session.userDetails.corporateName;

    const dataXlFile = './dummyServer/json/positivePay/transactions/positivePayUpload/data.xlsx';

    if (req.body.draftId) {
      deleteRecordInExcel(
        './dummyServer/json/positivePay/transactions/positivePayUpload/draftData.xlsx',
        req.body.draftId,
      );

      delete req.body.draftId;
    }

    req.body.requestBy =
      req.session && req.session.userDetails?.requestBy ? req.session.userDetails?.requestBy : '';
    if (
      req.session &&
      req.session.userDetails &&
      req.session.userDetails?.requestBy == 'CORPORATE'
    ) {
      req.body.corporateId = req.session.userDetails.corporateId;
    }

    const data = addRecordInExcel(dataXlFile, req.body, req.session.userDetails);

    res.json({
      dataMap: { data },
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/positivePay/transactions/positivePayUpload/private/view',
  (req, res) => {
    const dataXlFile = './dummyServer/json/positivePay/transactions/positivePayUpload/data.xlsx';

    let filters = [];
    if (req.body.dataMap && req.body.dataMap.filters) {
      filters = req.body.dataMap.filters;
    } else if (req.body.filters) {
      filters = req.body.filters;
    }
    if (req.body.dataMap && req.body.dataMap.id) {
      filters.push({ name: 'id', value: req.body.dataMap.id });
    }

    let viewData = getViewData(dataXlFile, filters);

    const workbook = XLSX.readFile(viewData.filePath);

    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    viewData['chequeData'] = xlData.map((record) => {
      const chequeImage = viewData.chequeImages.find((ci) => ci.fileName == record.chequeFileName);

      return {
        ...record,
        chequeImage: chequeImage ? [chequeImage] : [],
        chequeImageUrl: chequeImage ? chequeImage.chequeImageUrl : '',
      };
    });

    res.json({ ...viewData, responseStatus: { message: '', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/positivePay/transactions/positivePayUpload/private/viewTransaction',
  (req, res) => {
    const dataXlFile = './dummyServer/json/positivePay/transactions/positivePayUpload/data.xlsx';

    let filters = [];
    if (req.body.dataMap && req.body.dataMap.filters) {
      filters = req.body.dataMap.filters;
    } else if (req.body.filters) {
      filters = req.body.filters;
    }
    if (req.body.dataMap && req.body.dataMap.id) {
      filters.push({ name: 'id', value: req.body.dataMap.id });
    }

    let viewData = getViewData(dataXlFile, filters);

    const transactionFilters = [
      {
        name: 'id',
        value: req.body.dataMap.transactionId,
      },
    ];

    const transactionData = getViewData(viewData.filePath, transactionFilters);

    res.json({ ...transactionData, responseStatus: { message: '', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/positivePay/transactions/positivePayUpload/private/getActiveList',
  (req, res) => {
    const response = getActiveListRecords(
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
  '/dummyServer/json/positivePay/transactions/positivePayUpload/private/getPendingList',
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
  '/dummyServer/json/positivePay/transactions/positivePayUpload/private/getAuthorizedList',
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
  '/dummyServer/json/positivePay/transactions/positivePayUpload/private/getRejectedList',
  (req, res) => {
    const response = getRejectedListRecords(
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
