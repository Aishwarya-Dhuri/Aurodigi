const express = require('express');
const XLSX = require('xlsx');
const _ = require('lodash');
const multer = require('multer');

const addRecordInExcel = require('../crudAPIs').addRecordInExcel;
const getViewData = require('../crudAPIs').getViewData;
const getCorporateData = require('../crudAPIs').getCorporateData;

const getActiveListRecords = require('./../listingAPIs').getActiveListRecords;
const getPendingListRecords = require('./../listingAPIs').getPendingListRecords;
const getAuthorizedListRecords = require('./../listingAPIs').getAuthorizedListRecords;
const getRejectedListRecords = require('./../listingAPIs').getRejectedListRecords;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Saving Files : ' + file.originalname);
    cb(null, 'dummyServer/uploadedFiles/billUpload');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    cb(null, 'sys_' + Date.now() + '_' + name);
  },
});

const router = express.Router();

router.post(
  '/dummyServer/json/payments/billPayments/billPaymentUpload/private/create',
  multer({ storage: storage }).single('billPaymentFile'),
  (req, res) => {
    const file = req.file;

    req.body.supportingDocument = JSON.parse(req.body.supportingDocument);

    req.body.filePath = './' + file.path;
    req.body.fileFormat = file.type;
    req.body.fileName = file.filename;

    const workbook = XLSX.readFile(req.body.filePath);
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
    const consumerData = XLSX.utils.sheet_to_json(workbook.Sheets['consumerDetails']);

    console.log(xlData, req.body);

    let totalBillAmount = 0;

    consumerData.forEach((record) => {
      totalBillAmount += +record.billAmount;
    });

    req.body.totalBillAmount = totalBillAmount;
    req.body.noOfBills = consumerData.length;

    req.body.uploadDate = new Date().toDateString();

    req.body.corporateReference = req.session.userDetails.corporateCode;
    req.body.corporateCode = req.session.userDetails.corporateCode;
    req.body.corporateName = req.session.userDetails.corporateName;

    const dataXlFile = './dummyServer/json/payments/billPayments/billPaymentUpload/data.xlsx';

    req.body.requestBy =
      req.session && req.session.userDetails?.requestBy ? req.session.userDetails?.requestBy : '';
    if (
      req.session &&
      req.session.userDetails &&
      req.session.userDetails?.requestBy == 'CORPORATE'
    ) {
      if (req.session.userDetails?.loginPreferenceDetails?.loginType == 'group') {
        req.body.groupId = req.body.groupId
          ? req.body.groupId
          : req.session?.userDetails?.loginPreferenceDetails?.groupId;
        req.body.groupId = parseInt(req.body.groupId.toString());
      }
      const corporateId = req.body.corporateId
        ? req.body.corporateId
        : req.session?.userDetails?.corporateId;

      const corporateData = getCorporateData(corporateId);

      req.body.corporateId = corporateId;
      req.body.corporateCode = corporateData ? corporateData.corporateCode : '';
      req.body.corporateName = corporateData ? corporateData.corporateName : '';

      req.body.corporateId = parseInt(corporateId.toString());
    }

    const data = addRecordInExcel(
      dataXlFile,
      {
        ...req.body,
        billerName: xlData[0].billerName,
        product: xlData[0].product,
        category: xlData[0].category,
      },
      req.session.userDetails,
    );

    res.json({
      dataMap: { id: data.id, data },
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payments/billPayments/billPaymentUpload/private/view',
  (req, res) => {
    const dataXlFile = './dummyServer/json/payments/billPayments/billPaymentUpload/data.xlsx';

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

    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets['consumerDetails']);

    viewData['bills'] = xlData.map((record) => {
      return {
        ...record,
        product: viewData.product,
        actions: [
          {
            index: 0,
            paramList:
              'id,corporateName,consumerName,billAmount,paymentAmount,accountNo,billDate,dueDate,consumerNo,ref2',
            methodName: 'onViewBill',
            type: 'ICON',
            displayName: 'View',
            icon: 'fa-eye',
          },
        ],
      };
    });

    res.json({ ...viewData, responseStatus: { message: '', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/payments/billPayments/billPaymentUpload/private/getActiveList',
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
  '/dummyServer/json/payments/billPayments/billPaymentUpload/private/getPendingList',
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
  '/dummyServer/json/payments/billPayments/billPaymentUpload/private/getAuthorizedList',
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
  '/dummyServer/json/payments/billPayments/billPaymentUpload/private/getRejectedList',
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
