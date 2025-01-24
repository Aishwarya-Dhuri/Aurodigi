var express = require('express');
var XLSX = require('xlsx');
var getViewData = require('./crudAPIs').getViewData;
var generateUpdateSheetData = require('./crudAPIs').generateUpdateSheetData;
var _ = require('lodash');
var router = express.Router();

router.post(
  '/dummyServer/json/approveSelfServiceRequestService/private/getAllCount',
  (req, res) => {
    console.log('approveSelfServiceRequestService getAllCount');
    res.json({
      responseStatus: { message: '', status: '0' },
      entityName: 'APPROVESELFSERVICEREQUEST',
      access: ['VIEW', 'DATA-ENTRY', 'AUTHORIZE', 'ENABLE-DISABLE'],
      listCount: [
        { displayName: 'Review', recordCount: 0, url: 'getAuthorizedList' },
        { displayName: 'Pending', recordCount: 0, url: 'getPendingList' },
        { displayName: 'Rejected', recordCount: 0, url: 'getRejectedList' },
        { displayName: 'UnProcessed', recordCount: 0, url: 'getUnprocessedList' },
      ],
      entityIdentifier: '',
      loggable: false,
    });
  },
);
//approveSelfServiceRequestService/private/getAuthorizedList
router.post('/dummyServer/json/approveSelfServiceRequestService/private/get*List', (req, res) => {
  var listType = req.url.substring(req.url.lastIndexOf('/') + 1);
  console.log('reading service-request excel for : ' + listType);
  var workbook = XLSX.readFile('./dummyServer/json/service-request/data.xlsx');
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  var response = {};
  var dataList = [];
  var links = [];
  _.forEach(xlData, function (r) {
    const id = r.id.toString();
    const srClass = r.srClass;
    const srType = r.srType;
    const modifiedSysOn = r.modifiedSysOn ? r.modifiedSysOn.toString() : '-';
    const corporateName = r.corporateName;
    const corporateCode = r.corporateCode ? r.corporateCode.toString() : '-';
    const srSubType = r.srSubType;
    if (listType == 'getUnprocessedList' && !r.status) {
      // && r.status == 'Unprocessed'
      dataList.push([
        id,
        id,
        srClass,
        srType,
        modifiedSysOn,
        corporateName,
        corporateCode,
        '-',
        srSubType,
      ]);
      links.push([
        {
          index: 1,
          displayName: 'View',
          icon: 'fa fa-eye',
          url: null,
          onClick: 'view(' + r.id.toString() + ')',
        },
        {
          index: 2,
          displayName: 'Update',
          icon: '',
          url: null,
          onClick: 'edit(' + r.id.toString() + ')',
        },
      ]);
    } else if (
      listType == 'getPendingList' &&
      r.status &&
      r.authorized === 'N' &&
      !r.rejectReason
    ) {
      dataList.push([
        id,
        id,
        srClass,
        srType,
        modifiedSysOn,
        corporateName,
        corporateCode,
        '-',
        srSubType,
      ]);
      var allLink = [
        {
          index: 1,
          displayName: 'View',
          icon: 'fa fa-eye',
          url: null,
          onClick: "view('" + r.id + "')",
        },
        {
          index: 2,
          displayName: 'Edit',
          icon: 'fa fa-pencil',
          url: null,
          onClick: "edit('" + r.id + "')",
        },
      ];
      if (r.status === 'CLOSED') {
        allLink = [
          ...allLink,
          {
            index: 3,
            displayName: 'Authorize',
            icon: 'fa fa-check green',
            url: null,
            onClick: "authorize('" + r.id + "')",
          },
          {
            index: 4,
            displayName: 'Reject',
            icon: 'fa fa-times red',
            url: null,
            onClick: "reject('" + r.id + "')",
          },
        ];
      }
      links.push(allLink);
    } else if (listType == 'getRejectedList' && r.rejectReason) {
      dataList.push([
        id,
        id,
        srClass,
        srType,
        modifiedSysOn,
        corporateName,
        corporateCode,
        '-',
        srSubType,
      ]);
      links.push([
        {
          index: 1,
          displayName: 'View',
          icon: 'fa fa-eye',
          url: null,
          onClick: "view('" + r.id + "')",
        },
        {
          index: 2,
          displayName: 'Resubmit',
          icon: 'fa fa-paper-plane-o',
          url: null,
          onClick: "resubmit('" + r.id + "')",
        },
        {
          index: 3,
          displayName: 'AcceptRejection',
          icon: '',
          url: null,
          onClick: "acceptReject('" + r.id + "')",
        },
      ]);
    } else if (listType == 'getAuthorizedList' && r.authorized == 'Y') {
      dataList.push([
        id,
        id,
        srClass,
        srType,
        modifiedSysOn,
        corporateName,
        corporateCode,
        '-',
        srSubType,
      ]);
      links.push([
        {
          index: 1,
          displayName: 'View',
          icon: 'fa fa-eye',
          url: null,
          onClick: 'view(' + r.id.toString() + ')',
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
  response.entityName = 'APPROVESELFSERVICEREQUEST';
  response.access = ['VIEW', 'DATA-ENTRY', 'AUTHORIZE', 'ENABLE-DISABLE', 'EXECUTE'];
  response.headers = [
    { displayName: 'Id', type: 'String', isDisplay: 'N' },
    { displayName: 'Reference No.', type: 'String', isDisplay: 'Y' },
    { displayName: 'Product', type: 'String', isDisplay: 'Y' },
    { displayName: 'Service Type', type: 'String', isDisplay: 'Y' },
    { displayName: 'Request Date', type: 'Date', isDisplay: 'Y' },
    { displayName: 'Corporate Name', type: 'String', isDisplay: 'Y' },
    { displayName: 'Corporate Code', type: 'String', isDisplay: 'Y' },
    { displayName: 'Request By', type: 'String', isDisplay: 'Y' },
    { displayName: 'Module Name', type: 'String', isDisplay: 'Y' },
  ];
  response.filters = [
    { displayName: 'Reference No.', name: 'referenceNo', type: 'String' },
    { displayName: 'Product', name: 'productType', type: 'String' },
    { displayName: 'Service Type', name: 'requestType', type: 'String' },
    { displayName: 'Corporate Name', name: 'corporateName', type: 'String' },
    { displayName: 'Corporate Code', name: 'corporateCode', type: 'String' },
    { displayName: 'Module Name', name: 'cashProProductName', type: 'String' },
  ];
  res.json(response);
});

router.post('/dummyServer/json/approveSelfServiceRequestService/private/view', (req, res) => {
  let filters = [];
  if (req.body.dataMap && req.body.dataMap.filters) {
    filters = req.body.dataMap.filters;
  } else if (req.body.filters) {
    filters = req.body.filters;
  }
  if (req.body.dataMap && req.body.dataMap.id) {
    filters.push({ name: 'id', value: req.body.dataMap.id });
  }
  res.json(getViewData('./dummyServer/json/service-request/data.xlsx', filters));
});
/*
router.post('/dummyServer/json/approveSelfServiceRequestService/private/update', (req, res) => {
    var dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
    var existingWb = XLSX.readFile(dataXlFile);

    var sheets = generateUpdateSheetData(req.session.userDetails, req.body, existingWb);
    updateWorkbook(existingWb, sheets, dataXlFile);

    res.json({
        dataMap: { id: req.body.id },
        responseStatus: { message: 'MSG_KEY_UPDATE_SUCCESSFUL', status: '0' },
    });
});*/

module.exports = router;
