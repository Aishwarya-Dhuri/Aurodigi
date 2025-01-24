var express = require('express');
var XLSX = require('xlsx');
var router = express.Router();
var _ = require('lodash');
var getAuthorizedListRecords = require('./listingAPIs').getAuthorizedListRecords;

//Get Widget Data
router.post(
  '/dummyServer/json/setup/security/corporateUser/private/getUserDataList',
  (req, res) => {
    const dataFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';

    var workbook = XLSX.readFile(dataFilePath);

    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    var response = {};
    var dataList = [];
    var filteredData;
    if (req.body.dataMap.isLock) {
      filteredData = excelData.filter((response) => response.isLock === req.body.dataMap.isLock);
    } else {
      filteredData = excelData;
    }
    _.forEach(filteredData, function (record) {
      dataList.push({
        id: record.id,
        displayName: record.userId,
        enrichments: {
          lastLoginDateTime: record.lastLoginDateTime,
          userName: record.firstName,
        },
      });
    });
    response.dataList = dataList;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post('/dummyServer/json/setup/securityBank/bankUser/private/getUserDataList', (req, res) => {
  const dataFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';

  var workbook = XLSX.readFile(dataFilePath);

  const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  var response = {};
  var dataList = [];
  var filteredData;
  if (req.body.dataMap.isLock) {
    filteredData = excelData.filter((response) => response.isLock === req.body.dataMap.isLock);
  } else {
    filteredData = excelData;
  }
  _.forEach(filteredData, function (record) {
    dataList.push({
      id: record.loginId,
      displayName: record.loginId,
      enrichments: {
        lastLoginDateTime: record.lastLoginDateTime,
        userName: record.firstName,
      },
    });
  });
  response.dataList = dataList;

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

router.post(
  '/dummyServer/json/setup/security/corporateProfile/private/getProfileNameList',
  (req, res) => {
    const defaultReqModel = {
      endRow: 10,
      entityName: '',
      filterModel: {},
      groupKeys: [],
      pivotCols: [],
      pivotMode: false,
      rowGroupCols: [],
      sortModel: [],
      startRow: 0,
      valueCols: [],
    };

    var profileData = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      defaultReqModel,
      req.body,
      req.session.userDetails,
    );

    var dataList = [];
    profileData.data
      .filter((record) => {
        let condition = record.lastAction.indexOf('Authorized') !== -1;

        console.log(req.body);

        if (req.body?.dataMap?.groupProfile) {
          condition = condition && record.profileType == 'Generic';
        } else {
          condition =
            condition &&
            ((record.profileType == 'Corporate Wise' &&
              record.corporateId == req.session.userDetails.corporateId) ||
              record.profileType == 'Generic');
        }
        return condition;
      })
      .forEach((record) => {
        dataList.push({
          id: record.id,
          displayName: record.profileName,
        });
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
