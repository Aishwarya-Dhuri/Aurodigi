const express = require('express');
const XLSX = require('xlsx');
const _ = require('lodash');
const router = express.Router();

router.post('/dummyServer/**/insights/**', (req, res) => {
  console.log('reading insight : ' + req.url.substring(req.url.lastIndexOf('/') + 1));
  const dataXlFile = './dummyServer/json/commons/insights/data.xlsx';
  const sheetName = req.url.substring(req.url.lastIndexOf('/') + 1);
  const workbook = XLSX.readFile(dataXlFile);
  const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  const dataList = [];

  _.forEach(xlData, function (record) {
    dataList.push(record);
  });

  res.json({
    dataList: dataList,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

module.exports = router;
