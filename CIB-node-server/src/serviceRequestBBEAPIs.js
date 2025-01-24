var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var FakeServer = require('./fakeServer').FakeServer;

var router = express.Router();

router.post('/dummyServer/json/sr/private/getAllCount', (req, res) => {
  console.log('srService getAllCount');
  res.json({
    responseStatus: { message: '', status: '0' },
    entityName: 'SR',
    access: ['VIEW', 'DATA-ENTRY', 'AUTHORIZE', 'ENABLE-DISABLE', 'EXECUTE'],
    listCount: [
      { displayName: 'Review', recordCount: 10, url: 'getAuthorizedList' },
      { displayName: 'Pending', recordCount: 10, url: 'getPendingList' },
      { displayName: 'Rejected', recordCount: 2, url: 'getRejectedList' },
      { displayName: 'Disabled', recordCount: 2, url: 'getDisabledList' },
    ],
    entityIdentifier: '',
    loggable: false,
  });
});

router.post('/dummyServer/json/sr/private/get*List', (req, res) => {
  var workbook = XLSX.readFile('./dummyServer/json/sr/data.xlsx');
  var fakeServer = FakeServer(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
  req.body.sortModel = [];
  req.body.sortModel.push({ sort: 'desc', colId: 'modifiedSysOn' });
  var listType = req.url.substring(req.url.lastIndexOf('/') + 1);
  if (!req.body.filterModel) req.body.filterModel = {};
  // req.body.startRow = ((parseInt(req.body.pageNumber)) * 10) - 10, (parseInt(req.body.pageNumber)) * 10;
  // req.body.endRow = ((parseInt(req.body.pageNumber)) * 10) - 10, (parseInt(req.body.pageNumber)) * 10;
  console.log('body', req.body);
  req.body = {
    ...req.body,
    ...{
      startRow: 0,
      endRow: 10,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: {},
      sortModel: [],
      entityName: '',
    },
  };
  //conditional filter
  switch (listType) {
    case 'getPendingList':
      req.body.filterModel.authorized = { filterType: 'text', type: 'equals', filter: 'N' };
      req.body.filterModel.lastAction = {
        filterType: 'text',
        type: 'notContains',
        filter: 'Rejected',
      };
      break;

    case 'getAuthorizedList':
      req.body.filterModel.enabled = { filterType: 'text', type: 'equals', filter: 'Y' };
      req.body.filterModel.authorized = { filterType: 'text', type: 'equals', filter: 'Y' };
      break;

    case 'getRejectedList':
      req.body.filterModel.lastAction = {
        filterType: 'text',
        type: 'contains',
        filter: 'Rejected',
      };
      break;

    case 'getDisabledList':
      req.body.filterModel.enabled = { filterType: 'text', type: 'equals', filter: 'N' };
      req.body.filterModel.authorized = { filterType: 'text', type: 'equals', filter: 'Y' };
      break;
  }

  response = fakeServer.getData(req.body);
  var data = {};
  data.dataList = [];
  var links = [];
  data.headers = [
    { displayName: 'Id', type: 'String', isDisplay: 'N' },
    { displayName: 'SR Class', type: 'String', isDisplay: 'Y' },
    { displayName: 'SR Type', type: 'String', isDisplay: 'Y' },
    { displayName: 'SR Sub Type', type: 'String', isDisplay: 'Y' },
    { displayName: 'Last Action', type: 'String', isDisplay: 'Y' },
  ];
  data.filters = [
    { displayName: 'SR Class', name: 'srClass', type: 'String' },
    { displayName: 'SR Type', name: 'srType', type: 'String' },
    { displayName: 'SR Sub Type', name: 'srSubType', type: 'String' },
    { displayName: 'Unique Identifier No', name: 'Status', type: 'String' },
  ];

  _.forEach(response.data, function (r, i) {
    data.dataList.push([r.id, r.srClass, r.srType, r.srSubType, r.lastAction]);
    switch (listType) {
      case 'getPendingList':
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
            displayName: 'Edit',
            icon: 'fa fa-pencil',
            url: null,
            onClick: "edit('" + r.id + "')",
          },
          {
            index: 5,
            displayName: 'Delete',
            icon: 'fa fa-times-circle-o',
            url: null,
            onClick: "delete('" + r.id + "')",
          },
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
        ]);
        break;

      case 'getAuthorizedList':
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
            displayName: 'Edit',
            icon: 'fa fa-pencil',
            url: null,
            onClick: "edit('" + r.id + "')",
          },
          {
            index: 3,
            displayName: 'Disable',
            icon: '',
            url: null,
            onClick: "disable('" + r.id + "')",
          },
        ]);
        break;

      case 'getRejectedList':
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
        break;

      case 'getDisabledList':
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
            displayName: 'Enable',
            icon: 'fa fa-check-circle-o',
            url: null,
            onClick: "enable('" + r.id + "')",
          },
        ]);
        break;
    }
  });
  data.links = links;
  data.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
  res.json(data);
});

module.exports = router;
