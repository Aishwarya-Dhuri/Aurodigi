var express = require('express');

var addRecordInExcel = require('../../crudAPIs').addRecordInExcel;
var deleteRecordInExcel = require('../../crudAPIs').deleteRecordInExcel;
var updateRecordInExcel = require('../../crudAPIs').updateRecordInExcel;

var router = express.Router();

router.post('/dummyServer/json/trade/exportMaster/beneficiary/private/create', (req, res) => {
  const dataXlFile = './dummyServer/json/trade/beneficiary/data.xlsx';
  const data = addRecordInExcel(dataXlFile, req.body, req.userDetails);
  res.json({
    dataMap: { id: data.id },
    responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
  });
});

router.post('/dummyServer/json/trade/exportMaster/beneficiary/private/delete', (req, res) => {
  const dataXlFile = './dummyServer/json/trade/beneficiary/data.xlsx';
  deleteRecordInExcel(dataXlFile, req.body.id);
  delete req.body.id;
});

router.post('/dummyServer/json/trade/exportMaster/beneficiary/private/update', (req, res) => {
  const dataXlFile = './dummyServer/json/trade/beneficiary/data.xlsx';
  const data = updateRecordInExcel(dataXlFile, req.body, req.userDetails);
  res.json({
    dataMap: { id: data.id },
    responseStatus: { message: 'MSG_KEY_UPDATE_SUCCESSFUL', status: '0' },
  });
});

module.exports = router;
