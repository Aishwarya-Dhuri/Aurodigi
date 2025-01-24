var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var router = express.Router();

router.post('/dummyServer/**/dropdown/**', (req, res) => {
  console.log('reading dropdown : ' + req.url.substring(req.url.lastIndexOf('/') + 1));
  var dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'dropdowns.xlsx';
  var sheetName = req.url.substring(req.url.lastIndexOf('/') + 1);
  var workbook = XLSX.readFile(dataXlFile);
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  var dataList = [];
  _.forEach(xlData, function (record) {
    var tempRecord = {
      id: record.id,
      displayName: record.displayName,
    };
    var enrichments = {};
    _.forEach(_.keys(record), function (field) {
      if (field != 'id' && field != 'displayName') {
        enrichments[field] = record[field];
      }
    });
    tempRecord.enrichments = enrichments;
    dataList.push(tempRecord);
  });
  res.json({
    dataList: dataList,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});
module.exports = router;
