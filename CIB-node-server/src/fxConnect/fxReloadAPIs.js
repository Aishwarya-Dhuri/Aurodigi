var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');

const getAllList = require('../listingAPIs').getAllListRecords;
const getViewData = require('../crudAPIs').getViewData;

var router = express.Router();

router.post('/dummyServer/json/fxConnect/fxCard/reload/private/getFxCardList', (req, res) => {
  var dataXlFile = './dummyServer/json/fxConnect/fxCard/buy/data.xlsx';
  var dataWorkbook = XLSX.readFile(dataXlFile);
  var data = XLSX.utils.sheet_to_json(dataWorkbook.Sheets['Sheet1']);

  const dataList = [];

  data
    .filter((d) => true)
    .forEach((d) => {
      dataList.push({
        id: d.id,
        displayName: d.id,
        enrichments: {
          balance: d.netTotal,
        },
      });
    });

  const response = {
    dataList: dataList,
    responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
  };

  res.json(response);
});

router.post('/dummyServer/json/fxConnect/reload/private/getTermsAndConditions', (req, res) => {
  var tncXlFile = './dummyServer/json/fxConnect/fxCard/reload/termsAndConditionsData.xlsx';
  var tncWorkbook = XLSX.readFile(tncXlFile);

  var tncData = XLSX.utils.sheet_to_json(tncWorkbook.Sheets['Sheet1']);

  const response = {
    dataList: tncData,
    responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
  };

  res.json(response);
});

router.post(
  '/dummyServer/json/fxConnect/reload/private/getSupportingDocumentsFields',
  (req, res) => {
    var supportingDocumentsFieldsXlFile =
      './dummyServer/json/fxConnect/fxCard/reload/fieldsData.xlsx';
    var supportingDocumentsFieldsWorkbook = XLSX.readFile(supportingDocumentsFieldsXlFile);

    var supportingDocumentsFieldsData = XLSX.utils.sheet_to_json(
      supportingDocumentsFieldsWorkbook.Sheets['Sheet1'],
    );

    const supportingDocumentsFields = [];

    supportingDocumentsFieldsData.forEach((sdf) => {
      let filters = [];
      filters.push({ name: 'id', value: sdf.id });

      const data = getViewData(supportingDocumentsFieldsXlFile, filters);

      supportingDocumentsFields.push(data);
    });

    const response = {
      dataList: supportingDocumentsFields,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    };

    res.json(response);
  },
);

module.exports = router;
