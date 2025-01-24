var express = require('express');
const fs = require('fs');
var XLSX = require('xlsx');
var _ = require('lodash');
var router = express.Router();

router.post('/dummyServer/**/getGenericFilters', (req, res) => {
  var jsonFile = '.' + req.url + '/' + req.body.entityName + '.json';

  console.log('Reading getGenericFilters Json File : ' + req.body.entityName);

  fs.readFile(jsonFile, function (err, fileData) {
    if (!err) {
      const data = JSON.parse(fileData);

      data.genericFilterAttributes = data.genericFilterAttributes.sort((a, b) => {
        return b.mandatory - a.mandatory;
      });

      res.json(data);
    } else {
      res.json({ responseStatus: { message: 'CAN`T READ GENERIC FILTER FILE', status: '1' } });
    }
  });
});

router.post('/dummyServer/**/getCriterias', (req, res) => {
  var workbook = XLSX.readFile(
    '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
  );
  var allData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  allData = allData.reverse();
  var response = { responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } };
  response.dataMap = { SearchCriteria: [] };
  response.dataMap.SearchCriteria = _.filter(allData, function (record) {
    return (
      record.entityName == req.body.dataMap.entityName &&
      record.criteriaType == req.body.dataMap.criteriaType
    );
  });
  res.json(response);
});

module.exports = router;
