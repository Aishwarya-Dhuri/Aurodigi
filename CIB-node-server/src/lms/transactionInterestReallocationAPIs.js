var express = require('express');
var XLSX = require('xlsx');

const getAuthorizedListRecords = require('./../listingAPIs').getAuthorizedListRecords;

var router = express.Router();

router.post(
  '/dummyServer/json/lms/generalMaster/interestReallocation/private/getAccountStructureList',
  (req, res) => {
    var accountStructureXlFile = './dummyServer/json/lms/corporate/accountStructure/data.xlsx';
    var accountStructureWorkbook = XLSX.readFile(accountStructureXlFile);

    const accountStructureData = XLSX.utils.sheet_to_json(
      accountStructureWorkbook.Sheets['Sheet1'],
    );

    const dataList = [];

    accountStructureData
      .filter(
        (accountStructure) => accountStructure.corporateId == req.session.userDetails.corporateId,
      )
      .forEach((accountStructure) => {
        dataList.push({
          id: accountStructure.id,
          displayName: accountStructure.structureName,
          enrichments: {
            structureName: accountStructure.structureName,
            mainAccountNo: accountStructure.mainAccountNo,
            bank: accountStructure.bank,
            country: accountStructure.country,
            currency: accountStructure.currency,
            accType: accountStructure.accType,
            type: accountStructure.type,
            accountType: accountStructure.accountType,
            sweepType: accountStructure.sweepType,
            executionSequence: accountStructure.executionSequence,
          },
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

router.post(
  '/dummyServer/json/lms/generalMaster/interestReallocation/private/getSubRuleList',
  (req, res) => {
    var subRuleXlFile = './dummyServer/json/lms/generalMaster/interestReallocation/dropdowns.xlsx';
    var subRuleWorkbook = XLSX.readFile(subRuleXlFile);

    const subRuleData = XLSX.utils.sheet_to_json(subRuleWorkbook.Sheets['subRule']);

    console.log(subRuleData);

    const dataList = [];

    subRuleData
      .filter((subRules) => subRules.reallocationRule == req.body.dataMap.id)
      .forEach((subRules) => {
        dataList.push({ id: subRules.id, displayName: subRules.displayName });
      });

    res.json({
      dataList: dataList,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/lms/generalMaster/interestReallocation/private/getAuthorizedList',
  (req, res) => {
    const response = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    response.data = response.data.map((record) => {
      let index = record.actions.findIndex((action) => action.methodName == 'edit');

      if (index !== -1) {
        record.actions.splice(index, 1);
      }

      // index = record.actions.findIndex((action) => action.methodName == 'disable');

      // if (index !== -1) {
      //   record.actions.splice(index, 1);
      // }

      return record;
    });

    res.json(response);
  },
);

module.exports = router;
