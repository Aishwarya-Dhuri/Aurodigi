var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var moment = require('moment');
var getViewData = require('../crudAPIs').getViewData;
var addDataToExcel = require('../crudAPIs').addRecordInExcel;
var updateDataTInExcel = require('../crudAPIs').updateRecordInExcel;

var router = express.Router();

const defaultReqModel = {
  startRow: 0,
  endRow: 1,
  rowGroupCols: [],
  valueCols: [],
  pivotCols: [],
  pivotMode: false,
  groupKeys: [],
  filterModel: {},
  sortModel: [],
  entityName: '',
};

router.post('/dummyServer/json/dashboard/cxo/private/addReminder', (req, res) => {
  const user = req.session.userDetails.userId;

  const remindersDataFilePath =
    './dummyServer/json/commons/dashboardService/cxoDashboard/reminders/data.xlsx';

  const data = {
    userId: user,
    task: req.body.dataMap.task,
    dateTime: moment(
      req.body.dataMap.date + ' ' + req.body.dataMap.time,
      'DD-MMM-YYYY hh:mm',
    ).toString(),
  };

  const response = {
    data: addDataToExcel(remindersDataFilePath, data, req.session.userDetails),
  };

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

router.post('/dummyServer/json/dashboard/cxo/private/getReminders', (req, res) => {
  const user = req.session.userDetails.userId;

  const remindersDataFilePath =
    './dummyServer/json/commons/dashboardService/cxoDashboard/reminders/data.xlsx';

  const remindersWorkbook = XLSX.readFile(remindersDataFilePath);

  const data = XLSX.utils
    .sheet_to_json(remindersWorkbook.Sheets['Sheet1'])
    .filter(
      (record) =>
        record.userId == user &&
        new Date().toLocaleDateString() == new Date(record.dateTime).toLocaleDateString(),
    )
    .map((record) => {
      return record;
    });

  const response = { data, lastRow: data.length };

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

router.post('/dummyServer/json/dashboard/cxo/private/getTasks', (req, res) => {
  const user = req.session.userDetails.userId;

  const tasksDataFilePath =
    './dummyServer/json/commons/dashboardService/cxoDashboard/tasks/data.xlsx';

  const tasksWorkbook = XLSX.readFile(tasksDataFilePath);

  const data = XLSX.utils
    .sheet_to_json(tasksWorkbook.Sheets['Sheet1'])
    .filter((record) => record.userId == user)
    .map((record) => {
      const toDay = moment(new Date());
      const dueDate = moment(new Date(record.dueDate));
      const dueDays = toDay.diff(dueDate, 'days');

      record['dueDays'] = dueDays;
      record['status'] =
        dueDays < 0
          ? 'text-color-success'
          : dueDays > 0
          ? 'text-color-danger'
          : 'text-color-warning';
      return record;
    });

  const response = { data, lastRow: data.length };

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

router.post('/dummyServer/json/dashboard/cxo/private/getMiscellaneousData', (req, res) => {
  const miscellaneousDataFilePath =
    './dummyServer/json/commons/dashboardService/cxoDashboard/miscellaneous/data.xlsx';

  const overduePayablesFilters = [{ name: 'tab', value: 'Overdue Payables' }];
  const highValueTransactionsFilters = [{ name: 'tab', value: 'High Value Transactions' }];

  let overduePayables = { ...getViewData(miscellaneousDataFilePath, overduePayablesFilters) };

  overduePayables.products = overduePayables.products.map((product) => {
    product.rowData = product.rowData.map((data) => {
      data['action'] = [
        {
          index: 0,
          paramList: '',
          methodName: 'onView',
          type: 'ICON',
          icon: 'fa-eye',
          displayName: '',
        },
        {
          index: 1,
          paramList: '',
          methodName: 'onMail',
          type: 'ICON',
          icon: 'fa-envelope',
          displayName: '',
        },
      ];
      return data;
    });

    return product;
  });

  let highValueTransactions = {
    ...getViewData(miscellaneousDataFilePath, highValueTransactionsFilters),
  };

  highValueTransactions.products = highValueTransactions.products.map((product) => {
    product.rowData = product.rowData.map((data) => {
      data['action'] = [
        {
          index: 0,
          paramList: '',
          methodName: 'onView',
          type: 'ICON',
          icon: 'fa-eye',
          displayName: '',
        },
        {
          index: 1,
          paramList: '',
          methodName: 'onMail',
          type: 'ICON',
          icon: 'fa-envelope',
          displayName: '',
        },
      ];
      return data;
    });

    return product;
  });

  const data = {
    overduePayables,
    highValueTransactions,
  };

  const response = { data };

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

module.exports = router;
