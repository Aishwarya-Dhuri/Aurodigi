var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var router = express.Router();

router.post('/dummyServer/json/selfOnboardingService/private/getAllCount', (req, res) => {
  console.log('selfOnboardingService getAllCount');
  res.json({
    responseStatus: { message: '', status: '0' },
    entityName: 'SELFONBOARDING',
    access: ['VIEW', 'DATA-ENTRY', 'AUTHORIZE', 'ENABLE-DISABLE', 'EXECUTE'],
    listCount: [
      { displayName: 'New Registration', recordCount: 3, url: 'getNewRegList' },
      { displayName: 'On-Hold', recordCount: 1, url: 'getOnHoldList' },
      { displayName: 'Verified', recordCount: 2, url: 'getVerifiedList' },
      { displayName: 'Rejected', recordCount: 1, url: 'getRejectList' },
      { displayName: 'Registered', recordCount: 3, url: 'getAuthorizeList' },
    ],
    entityIdentifier: '',
    loggable: false,
  });
});

router.post('/dummyServer/json/selfOnboardingService/private/get*List', (req, res) => {
  var dataXlFile = './dummyServer/json/self-onboarding/data.xlsx';
  var listType = req.url.substring(req.url.lastIndexOf('/') + 1);
  console.log('reading selfOnboardingService excel for : ' + listType);
  var workbook = XLSX.readFile(dataXlFile);
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['companyInformation']);
  var response = {};
  var dataList = [];
  var links = [];
  _.forEach(xlData, function (r) {
    if (listType == 'getNewRegList' && r.status == 'New Request') {
      dataList.push([
        r.mstId.toString(),
        r.mstId.toString(),
        r.requestType,
        r.customerId ? r.customerId.toString() : '-',
        r.companyName.toString(),
        r.mobileNumber.toString(),
        r.emailId.toString(),
        r.modifiedSysOn.toString(),
        r.status,
      ]);
      links.push([
        {
          index: 1,
          displayName: 'View',
          icon: 'fa fa-eye',
          url: null,
          onClick: 'view(' + r.mstId.toString() + ')',
        },
        {
          index: 2,
          displayName: 'Edit',
          icon: 'fa fa-pencil',
          url: null,
          onClick: 'edit(' + r.mstId.toString() + ')',
        },
      ]);
    } else if (listType == 'getOnHoldList' && r.status == 'On Hold') {
      dataList.push([
        r.mstId.toString(),
        r.mstId.toString(),
        r.requestType,
        r.customerId ? r.customerId.toString() : '-',
        r.companyName.toString(),
        r.mobileNumber.toString(),
        r.emailId.toString(),
        r.modifiedSysOn.toString(),
        r.status,
      ]);
      links.push([
        {
          index: 1,
          displayName: 'View',
          icon: 'fa fa-eye',
          url: null,
          onClick: 'view(' + r.mstId.toString() + ')',
        },
        {
          index: 2,
          displayName: 'Edit',
          icon: 'fa fa-pencil',
          url: null,
          onClick: 'edit(' + r.mstId.toString() + ')',
        },
      ]);
    } else if (listType == 'getVerifiedList' && r.status == 'Verified') {
      dataList.push([
        r.mstId.toString(),
        r.mstId.toString(),
        r.requestType,
        r.customerId ? r.customerId.toString() : '-',
        r.companyName.toString(),
        r.mobileNumber.toString(),
        r.emailId.toString(),
        r.modifiedSysOn.toString(),
        r.status,
      ]);
      links.push([
        {
          index: 1,
          displayName: 'View',
          icon: 'fa fa-eye',
          url: null,
          onClick: 'view(' + r.mstId.toString() + ')',
        },
        {
          index: 2,
          displayName: 'Edit',
          icon: 'fa fa-pencil',
          url: null,
          onClick: 'edit(' + r.mstId.toString() + ')',
        },
      ]);
    } else if (listType == 'getRejectList' && r.status == 'Rejected') {
      dataList.push([
        r.mstId.toString(),
        r.mstId.toString(),
        r.requestType,
        r.customerId ? r.customerId.toString() : '-',
        r.companyName.toString(),
        r.mobileNumber.toString(),
        r.emailId.toString(),
        r.modifiedSysOn.toString(),
        r.status,
      ]);
      links.push([
        {
          index: 1,
          displayName: 'View',
          icon: 'fa fa-eye',
          url: null,
          onClick: 'view(' + r.mstId.toString() + ')',
        },
        {
          index: 2,
          displayName: 'Edit',
          icon: 'fa fa-pencil',
          url: null,
          onClick: 'edit(' + r.mstId.toString() + ')',
        },
      ]);
    } else if (listType == 'getAuthorizeList' && r.status == 'Registered') {
      dataList.push([
        r.mstId.toString(),
        r.mstId.toString(),
        r.requestType,
        r.customerId ? r.customerId.toString() : '-',
        r.companyName.toString(),
        r.mobileNumber.toString(),
        r.emailId.toString(),
        r.modifiedSysOn.toString(),
        r.status,
      ]);
      links.push([
        {
          index: 1,
          displayName: 'View',
          icon: 'fa fa-eye',
          url: null,
          onClick: 'view(' + r.mstId.toString() + ')',
        },
      ]);
    }
  });
  dataList = dataList.slice(
    parseInt(req.body.pageNumber) * 10 - 10,
    parseInt(req.body.pageNumber) * 10,
  );
  links = links.slice(parseInt(req.body.pageNumber) * 10 - 10, parseInt(req.body.pageNumber) * 10);
  response.dataList = dataList;
  response.links = links;
  response.responseStatus = { message: '', status: '0' };
  response.entityName = 'SELFONBOARDING';
  response.access = ['VIEW', 'DATA-ENTRY', 'AUTHORIZE', 'ENABLE-DISABLE', 'EXECUTE'];
  response.headers = [
    { displayName: 'Id', type: 'String', isDisplay: 'N' },
    { displayName: 'Request No', type: 'String', isDisplay: 'Y' },
    { displayName: 'Request Type', type: 'String', isDisplay: 'Y' },
    { displayName: 'CID', type: 'String', isDisplay: 'Y' },
    { displayName: 'Corporate Name', type: 'String', isDisplay: 'Y' },
    { displayName: 'Mobile No', type: 'String', isDisplay: 'Y' },
    { displayName: 'Email ID', type: 'String', isDisplay: 'Y' },
    { displayName: 'Date Time', type: 'String', isDisplay: 'Y' },
    { displayName: 'Status', type: 'String', isDisplay: 'Y' },
  ];
  response.filters = [
    { displayName: 'Request No', name: 'RequestNo', type: 'String' },
    { displayName: 'CID', name: 'CID', type: 'String' },
    { displayName: 'Corporate Name', name: 'CorporateName', type: 'String' },
    { displayName: 'Status', name: 'Status', type: 'String' },
  ];
  res.json(response);
});

module.exports = router;
