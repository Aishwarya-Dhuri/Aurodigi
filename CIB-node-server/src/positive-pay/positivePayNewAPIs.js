var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');

const addDataToExcel = require('../crudAPIs').addRecordInExcel;
const deleteRecordInExcel = require('../crudAPIs').deleteRecordInExcel;

var router = express.Router();

router.post(
  '/dummyServer/json/positivePay/transactions/positivePayNew/private/getRecentCheques',
  (req, res) => {
    res.send({ data: [], responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

module.exports = router;
