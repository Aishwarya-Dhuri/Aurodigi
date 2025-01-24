var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var router = express.Router();

//Get Fixed Deposit Data
router.post(
  '/dummyServer/json/accountServices/fixedDeposit/private/getFixedDepositList',
  (req, res) => {
    console.log('reading fixed deposit data');
    var dataXlFile = './dummyServer/json/accountServices/fixedDeposit/fdInitiation/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    var dataList = [];
    dataList = xlData.filter(
      (record) =>
        req.session?.userDetails?.loginPreferenceDetails &&
        ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
          record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
          (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
            record.corporateId == req.session?.userDetails?.corporateId)) &&
        record.enabled == 'Y' &&
        record.authorized == 'Y',
    );

    res.json({
      dataList: dataList,
      lastRow: dataList.length,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

//Get Fd Number
router.post(
  '/dummyServer/json/accountServices/fixedDeposit/private/getFDNumberList',
  (req, res) => {
    console.log('reading fixed deposit data');
    var dataXlFile = './dummyServer/json/accountServices/fixedDeposit/fdInitiation/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    var dataList = [];

    xlData
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.enabled == 'Y' &&
          record.authorized == 'Y',
      )
      .forEach((record) => {
        dataList.push({
          id: record.id,
          displayName: record.id,
          enrichments: {},
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

//Get Fd Summary Card Data
router.post(
  '/dummyServer/json/accountServices/fixedDeposit/private/getFDSummaryCardDataList',
  (req, res) => {
    console.log('reading fixed deposit data');
    var dataXlFile = './dummyServer/json/accountServices/fixedDeposit/fdInitiation/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    var dataList = [];

    let ongoingValue = 0;
    let closedValue = 0;

    const fdData = xlData.filter(
      (record) =>
        req.session?.userDetails?.loginPreferenceDetails &&
        ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
          record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
          (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
            record.corporateId == req.session?.userDetails?.corporateId)) &&
        record.enabled == 'Y' &&
        record.authorized == 'Y',
    );

    fdData.forEach((x) => {
      if (x.fdType === 'Ongoing') {
        ongoingValue += +x.maturityAmount;
      } else {
        closedValue += +x.maturityAmount;
      }
    });

    dataList.push(
      {
        id: 1,
        displayName: 'Ongoing FDs',
        enrichments: {
          total: fdData.filter((x) => x.fdType == 'ongoing').length,
          currentValue: ongoingValue,
          fdType: 'ongoing',
        },
      },
      {
        id: 2,
        displayName: 'Closed FDs',
        enrichments: {
          total: fdData.filter((x) => x.fdType == 'closed').length,
          currentValue: closedValue,
          fdType: 'closed',
        },
      },
    );

    res.json({
      dataList: dataList,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

module.exports = router;
