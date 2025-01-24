var express = require('express');
const fs = require('fs');
var XLSX = require('xlsx');
var _ = require('lodash');
const { filter } = require('lodash');
var router = express.Router();
var FakeServer = require('../fakeServer').FakeServer;

router.post(
  '/dummyServer/json/accountServices/creditCard/creditCardControls/private/getAuthorizedList',
  (req, res) => {
    let userDetails = req.session.userDetails;
    let dataFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
    console.log('creditCardControls dataFilePath ', dataFilePath);
    let reqModel = req.body;
    var workbook = XLSX.readFile(dataFilePath);
    var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    var fakeServer = FakeServer(excelData);
    if (!reqModel.sortModel) reqModel.sortModel = [];
    if (reqModel.sortModel.length == 0)
      reqModel.sortModel.push({ sort: 'desc', colId: 'modifiedSysOn' });
    if (!reqModel.filterModel) reqModel.filterModel = {};

    if (
      req.session?.userDetails?.loginPreferenceDetails &&
      req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group'
    ) {
      reqModel.filterModel.groupId = {
        filterType: 'number',
        type: 'equals',
        filter: req.session?.userDetails?.loginPreferenceDetails?.groupId,
      };
    }
    if (
      req.session?.userDetails?.loginPreferenceDetails &&
      req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group'
    ) {
      reqModel.filterModel.corporateId = {
        filterType: 'number',
        type: 'equals',
        filter: req.session?.userDetails?.corporateId,
      };
    }

    reqModel.filterModel.enabled = { filterType: 'text', type: 'equals', filter: 'Y' };
    reqModel.filterModel.authorized = { filterType: 'text', type: 'equals', filter: 'Y' };

    response = fakeServer.getData(reqModel);

    _.forEach(response.data, function (row) {
      row.actions = [
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
      ];

      if (!row.requestBy || row.requestBy == userDetails.requestBy) {
        row.actions.push({
          index: 2,
          displayName: 'Edit',
          type: 'ICON',
          icon: 'pi pi-pencil',
          url: 'route~edit',
          methodName: 'edit',
          paramList: 'id',
          color: 'primary',
        });
      }
    });
    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
    return res.json(response);
  },
);

//Get Fixed Deposit Data
router.post('/dummyServer/json/accountServices/creditCard/private/getCreditCards', (req, res) => {
  console.log('reading getCreditCards data');
  var dataFilePath = './dummyServer/json/accountServices/creditCard/data.xlsx';
  var workbook = XLSX.readFile(dataFilePath);
  let reqModel = req.body;
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
  var dataList = [];
  for (let index in xlData) {
    dataList.push(recursiveView(xlData[index], workbook, xlData[index].id));
  }
  var fakeServer = FakeServer(dataList);
  if (!reqModel.sortModel) reqModel.sortModel = [];
  if (reqModel.sortModel.length == 0)
    reqModel.sortModel.push({ sort: 'desc', colId: 'modifiedSysOn' });
  if (!reqModel.filterModel) reqModel.filterModel = {};

  if (
    req.session?.userDetails?.loginPreferenceDetails &&
    req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group'
  ) {
    reqModel.filterModel.groupId = {
      filterType: 'number',
      type: 'equals',
      filter: req.session?.userDetails?.loginPreferenceDetails?.groupId,
    };
  }
  if (
    req.session?.userDetails?.loginPreferenceDetails &&
    req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group'
  ) {
    reqModel.filterModel.corporateId = {
      filterType: 'number',
      type: 'equals',
      filter: req.session?.userDetails?.corporateId,
    };
  }
  reqModel.filterModel.enabled = { filterType: 'text', type: 'equals', filter: 'Y' };
  reqModel.filterModel.authorized = { filterType: 'text', type: 'equals', filter: 'Y' };

  response = fakeServer.getData(reqModel);

  response.data = response.data.map((data) => {
    return {
      ...data,
      creditCardLimit: data.cardLimit,
      availableLimit: Math.abs(data.cardLimit - data.minDueAmount * 20),
      totalAmountDue: data.minDueAmount * 20,
      minAmountDue: data.minDueAmount,
      totalOutstandingAmount: data.outStandingAmount,
    };
  });

  res.json({ ...response, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
});
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
module.exports = router;
