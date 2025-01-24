var express = require('express');
const fs = require('fs');
var XLSX = require('xlsx');
var _ = require('lodash');
const { filter } = require('lodash');
var router = express.Router();
var FakeServer = require('../fakeServer').FakeServer;

router.post(
  '/dummyServer/json/vam/vamSetup/virtualAccountIssuance/private/getVAIssuanceSummary',
  (req, res) => {
    // CIB-node-server/dummyServer/json/vam/vamSetup/virtualAccountIssuance
    var dataFilePath = './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx';
    var workbook = XLSX.readFile(dataFilePath);
    let reqModel = req.body;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
    var dataList = [];
    for (let index in xlData) {
      dataList.push(recursiveView(xlData[index], workbook, xlData[index].id));
    }
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }
    dataList = dataList.filter((data) => data.corporateId === corporateId);

    var randomNo = Math.floor(Math.random() * 100 + 1);
    function getPercent(total) {
      return (randomNo * total) / 100;
    }
    var accountDataList = [];
    dataList.forEach((data, index) => {
      var accountId = data.corporateAccountId;
      var ccy = 'MYR';
      try {
        const accNo = data.corporateAccount.trim();
        ccy = accNo.substring(accNo.indexOf('-') + 1);
      } catch (e) {
        console.log('ERROR CCY', e);
      }
      data.utilizedLimit = getPercent(parseFloat(data.subEntityAllocatedLimit));
      var accIndex = accountDataList.findIndex((a) => a.accountId === accountId);
      if (accIndex !== -1) {
        accountDataMap = accountDataList[accIndex];
        accountDataMap.subEnitiesData.push(data);
      } else {
        var accountDataMap = {};
        accountDataMap.accountId = accountId;
        accountDataMap.account = data.corporateAccount;
        accountDataMap.accountCurrency = ccy;

        accountDataMap.insights = {};
        accountDataMap.subEnitiesData = [];

        accountDataMap.subEnitiesData.push(data);
        accountDataList.push(accountDataMap);
      }
    });
    var corporateAllocatedLimit = 0;
    accountDataList.forEach((account) => {
      var totalAllocatedLimitFor = 0;
      account.subEnitiesData.forEach((subEntity) => {
        totalAllocatedLimitFor += parseFloat(subEntity.subEntityAllocatedLimit);
      });
      account.totalAllocatedLimit = totalAllocatedLimitFor;
      account.totalUtilizedLimit = getPercent(totalAllocatedLimitFor);

      corporateAllocatedLimit += account.totalAllocatedLimit;
    });
    var corporateUtilizedLimit = getPercent(corporateAllocatedLimit);
    var dataMap = { corporateAllocatedLimit, corporateUtilizedLimit, accountDataList };

    res.json({ dataMap, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

function recursiveView(viewData, workbook, id) {
  _.forEach(_.keys(viewData), function (key) {
    if (viewData[key] == '[object Array]') {
      viewData[key] = _.filter(XLSX.utils.sheet_to_json(workbook.Sheets[key]), function (o) {
        return o.mstId == id;
      });
      _.forEach(viewData[key], function (child) {
        child = recursiveView(child, workbook, child.id);
      });
    }
  });
  return viewData;
}

router.post(
  '/dummyServer/json/vam/vamSetup/virtualAccountIssuance/private/getGroupCorporateData',
  (req, res) => {
    var groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
    var groupWorkbook = XLSX.readFile(groupXlFile);

    var corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    var corporateMainWorkbook = XLSX.readFile(corporateXlFile);

    let reqModel = req.body;
    var groupXlData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['Sheet1']);
    var corporateGroupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

    var corporateMainData = XLSX.utils.sheet_to_json(corporateMainWorkbook.Sheets['Sheet1']);
    var accountsXlData = XLSX.utils.sheet_to_json(corporateMainWorkbook.Sheets['accounts']);

    var virtualAccountIssuanceWorkbook = XLSX.readFile(
      './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx',
    );
    var vaXLData = XLSX.utils.sheet_to_json(virtualAccountIssuanceWorkbook.Sheets['Sheet1']);
    var vaIssuanceDataList = [];
    for (let index in vaXLData) {
      vaIssuanceDataList.push(
        recursiveView(vaXLData[index], virtualAccountIssuanceWorkbook, vaXLData[index].id),
      );
    }

    var userDetails = req.session.userDetails;
    var groupId = req.session.userDetails.groupId;
    var groupData = groupXlData.filter((group) => group.id === groupId);

    var dataMap = {};
    if (groupData) {
      dataMap = groupData[0];
    }
    var groupCorporateList = corporateGroupData.filter((corp) => corp.mstId === dataMap.id);

    var response = {};

    var corporateList = [];
    for (var corporateMainObj of corporateMainData) {
      for (var corporate of groupCorporateList) {
        if (corporateMainObj.id === corporate.corporateId) {
          corporateList.push(corporateMainObj);
        }
      }
    }
    dataMap.corporateList = corporateList;

    corporateList.map((corp) => {
      var accountsList = accountsXlData.filter((account) => account.mstId === corp.id);
      // {accountNo,sunEntity,VA}
      corp.noOfSunEntityInCorporate = 0;
      corp.summaryData = [];
      for (var acc of accountsList) {
        var accData = {};
        var sunEntityList = vaIssuanceDataList.filter((va) => va.corporateAccountId === acc.id);
        accData.accountNo = acc.accountNo;
        accData.noOfSunEntityInAccount = sunEntityList.length;
        corp.noOfSunEntityInCorporate += sunEntityList.length;
        var vaCount = 0;
        sunEntityList.forEach((subEntity, index) => {
          if (subEntity.vAIssuanceAccountDetList && subEntity.vAIssuanceAccountDetList.length > 0) {
            vaCount += subEntity.vAIssuanceAccountDetList.length;
          }
        });
        accData.noOfVA = vaCount;
        corp.summaryData.push(accData);
      }
      corp.noOfAccounts = accountsList.length;
      // corp.noOfSubEntities = sunEntityList.length;

      return corp;
    }); //vaIssuanceDataList

    response = { dataMap };

    res.json({
      response,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/vam/vamSetup/vaLimitEnhancement/private/getLimitEnhancementData',
  (req, res) => {
    // CIB-node-server/dummyServer/json/vam/vamSetup/virtualAccountIssuance
    var dataFilePath = './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx';
    var workbook = XLSX.readFile(dataFilePath);
    let reqModel = req.body;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    var vaIssuanceList = [];
    for (let index in xlData) {
      vaIssuanceList.push(recursiveView(xlData[index], workbook, xlData[index].id));
    }
    var corporateId = '';
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }
    vaIssuanceList = vaIssuanceList.filter((data) => data.corporateId === corporateId);
    let dataList = [];
    let lastRow = 0;
    let index = 0;
    for (let vaIssuanceObj of vaIssuanceList) {
      for (let vaData of vaIssuanceObj.vAIssuanceAccountDetList) {
        let data = {};
        data = vaData;
        // data.id = vaIssuanceObj.id;
        data.corporateCode = vaIssuanceObj.corporateCode;
        data.corporateId = vaIssuanceObj.corporateId;
        data.corporateAccountId = vaIssuanceObj.corporateAccountId;
        data.corporateAccount = vaIssuanceObj.corporateAccount;
        data.subEntityName = vaIssuanceObj.subEntityName;
        data.vaIssuanceId = vaIssuanceObj.id; //vaIssuanceId (parent id)
        data.actions = getActions();
        dataList.push(data);
      }
    }
    dataList = _.sortBy(dataList, ['vaExpiryDate']);
    var response = { data: dataList, lastRow: dataList.length };

    res.json({ ...response, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

function getActions() {
  return [
    {
      index: 1,
      displayName: 'View',
      type: 'ICON',
      icon: 'pi pi-eye',
      url: 'route~view',
      methodName: 'view',
      paramList: 'id',
      color: null,
    },
    {
      index: 2,
      displayName: 'Edit',
      type: 'ICON',
      icon: 'pi pi-pencil',
      url: 'route~edit',
      methodName: 'edit',
      paramList: 'id',
      color: 'primary',
    },
  ];
}

router.post(
  '/dummyServer/json/vam/vamSetup/vaLimitEnhancement/private/getVaAccountData',
  (req, res) => {
    var dataFilePath = './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx';
    var workbook = XLSX.readFile(dataFilePath);
    let reqModel = req.body;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['vAIssuanceAccountDetList']);

    /*var vaIssuanceList = [];
    for(let index in xlData){
        vaIssuanceList.push(recursiveView(xlData[index], workbook, xlData[index].id));
    }*/
    var corporateId = '';
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }
    let id = req.body.dataMap.id;
    xlData = xlData.filter((data) => data.id === id);
    // let dataList = [];

    var response = xlData[0];

    res.json({ ...response, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

module.exports = router;
