var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var router = express.Router();

router.post(
  '/dummyServer/json/setup/securityBank/bankProfile/private/dropdown/profileList',
  (req, res) => {
    var dataXlFile = './dummyServer/json/setup/securityBank/bankProfile/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
    var dataList = [];
    _.forEach(xlData, function (record) {
      if (record.lastAction.indexOf('Authorized') !== -1) {
        dataList.push({
          id: record.id,
          displayName: record.profileCode,
          enrichments: {
            profileName: record.profileName,
          },
        });
      }
    });
    res.json({
      dataList: dataList,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

module.exports = router;
