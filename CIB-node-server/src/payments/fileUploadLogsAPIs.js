const express = require('express');
const XLSX = require('xlsx');
const _ = require('lodash');
const router = express.Router();

const getViewData = require('../crudAPIs').getViewData;
const getAllListRecords = require('./../listingAPIs').getAllListRecords;

const reqModel = {
  endRow: 10000,
  entityName: 'BBULKPAYMENTREQUEST',
  filterModel: {},
  groupKeys: [],
  pivotCols: [],
  pivotMode: false,
  rowGroupCols: [],
  sortModel: [],
  startRow: 0,
  valueCols: [],
};

router.post(
  '/dummyServer/json/payments/transactions/fileUploadLog/private/getAllList',
  (req, res) => {
    let data = [];

    if (req.body.dataMap[0].value == 'Payment Request') {
      const records = getAllListRecords(
        './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx',
        reqModel,
        req.session.userDetails,
      );
      data = records.data
        .filter((record) => record.initiateType == 'upload')
        .map((record) => {
          return {
            id: record.id,
            batchNo: record.id,
            channel: record.channel ? record.channel : 'H2H',
            paymentType: '',
            uploadFileName: record.fileName,
            uploadedDateTime: record.uploadDate,
            status: record.status,
            action: '',
          };
        });
    } else if (req.body.dataMap[0].value == 'Bill Payment') {
      const records = getAllListRecords(
        './dummyServer/json/payments/billPayments/billPaymentUpload/data.xlsx',
        reqModel,
        req.session.userDetails,
      );
      data = records.data
        .filter((record) => true)
        .map((record) => {
          return {
            id: record.id,
            batchNo: record.id,
            channel: record.channel ? record.channel : 'H2H',
            paymentType: '',
            uploadFileName: record.fileName,
            uploadedDateTime: record.uploadDate,
            status: record.status,
            action: '',
          };
        });
    } else if (req.body.dataMap[0].value == 'WPS') {
      const records = getAllListRecords(
        './dummyServer/json/payments/transactions/wpsPayment/data.xlsx',
        reqModel,
        req.session.userDetails,
      );
      data = records.data
        .filter((record) => record.initiateType == 'upload')
        .map((record) => {
          return {
            id: record.id,
            batchNo: record.id,
            channel: record.channel ? record.channel : 'H2H',
            paymentType: '',
            uploadFileName: record.fileName,
            uploadedDateTime: record.uploadDate,
            status: record.status,
            action: '',
          };
        });
    }

    res.send({
      data: data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

module.exports = router;
