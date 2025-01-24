var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');

var router = express.Router();

router.post(
  '/dummyServer/json/commons/dashboardService/defaultDashboard/private/getWidgetData',
  (req, res) => {
    const moduleName = req.body.dataMap.moduleName.replace(/ /g, '').toLowerCase();
    const dataFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
    var workbook = XLSX.readFile(dataFilePath);

    let response = { dataList: [] };
    response.dataList = XLSX.utils.sheet_to_json(
      workbook.Sheets[moduleName === 'setup' ? 'commons' : moduleName],
    );
    response.dataList = _.filter(response.dataList, function (w) {
      return (
        (req.session.userDetails.requestBy == 'BANK' && w.isApplicableForBBE) ||
        (req.session.userDetails.requestBy == 'CORPORATE' && w.isApplicableForCFE)
      );
    });

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/commons/dashboardService/defaultDashboard/private/getCorporateWidgetData',
  (req, res) => {
    const moduleName = req.body.dataMap.moduleName.replace(/ /g, '').toLowerCase();
    const dataFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
    var workbook = XLSX.readFile(dataFilePath);

    let response = { dataList: [] };
    response.dataList = XLSX.utils.sheet_to_json(
      workbook.Sheets[moduleName === 'setup' ? 'commons' : moduleName],
    );
    response.dataList = _.filter(response.dataList, function (w) {
      return (
        (req.session.userDetails.requestBy == 'BANK' && w.isApplicableForBBE) ||
        (req.session.userDetails.requestBy == 'CORPORATE' && w.isApplicableForCFE)
      );
    });

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post('/dummyServer/json/dashboard/private/getGroupBalance', (req, res) => {
  let groupId = '1';

  if (req.body?.dataMap?.groupId) {
    groupId = req.body.dataMap.groupId;
  } else if (req.session?.userDetails?.groupId) {
    groupId = req.session.userDetails.groupId;
  }

  var groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
  var groupWorkbook = XLSX.readFile(groupXlFile);

  var groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

  var corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
  var corporateWorkbook = XLSX.readFile(corporateXlFile);

  var corporateXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['Sheet1']);
  var accountsXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['accounts']);

  var totalBalance = 0;
  var totalLimit = 0;
  var totalPayables = 0;
  var totalReceivables = 0;

  groupData
    .filter((record) => record.mstId == groupId)
    .forEach((record) => {
      const corporateData = corporateXlData.find((corp) => corp.id == record.corporateId);

      if (corporateData) {
        accountsXlData
          .filter(
            (acc) =>
              acc.mstId === corporateData.id &&
              acc.lastAction.indexOf('Authorized') !== -1 &&
              ['CURRENT', 'SAVING'].includes(acc.accountType),
          )
          .forEach((acc) => {
            totalBalance += acc.balance;
            totalLimit += acc.odLimit;
            totalPayables += acc.totalPayable;
            totalReceivables += acc.totalReceivable;
          });
      }
    });

  res.json({
    data: {
      totalBalance,
      totalLimit,
      totalPayables,
      totalReceivables,
    },
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

router.post('/dummyServer/json/dashboard/private/getCorporateBalance', (req, res) => {
  const corporateId = req.body.dataMap.corporateId;

  var corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

  var corporateWorkbook = XLSX.readFile(corporateXlFile);

  var accountsXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['accounts']);

  var totalBalance = 0;
  var totalLimit = 0;
  var totalPayables = 0;
  var totalReceivables = 0;

  accountsXlData
    .filter(
      (acc) =>
        acc.mstId == corporateId &&
        acc.lastAction.indexOf('Authorized') !== -1 &&
        ['CURRENT', 'SAVING'].includes(acc.accountType),
    )
    .forEach((acc) => {
      totalBalance += acc.balance;
      totalLimit += acc.odLimit;
      totalPayables += acc.totalPayable;
      totalReceivables += acc.totalReceivable;
    });

  res.json({
    data: {
      totalBalance,
      totalLimit,
      totalPayables,
      totalReceivables,
    },
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

module.exports = router;
