const getAllListRecords = require('../../../listingAPIs').getAllListRecords;
const _ = require('lodash');
const express = require('express');
const XLSX = require('xlsx');

const router = express.Router();

const defaultReqModel = {
  startRow: 0,
  endRow: 10000,
  rowGroupCols: [],
  valueCols: [],
  pivotCols: [],
  pivotMode: false,
  groupKeys: [],
  filterModel: {},
  sortModel: [],
  entityName: '',
};

router.post('/dummyServer/json/setup/process/interfaceConfiguration/getAllCount', (req, res) => {
  const workbook = XLSX.readFile(
    '.' + req.url.substring(0, req.url.indexOf('private')) + 'listingTypes.xlsx',
  );
  console.log(
    'getAllCount : ' + '.' + req.url.substring(0, req.url.indexOf('private')) + 'listingTypes.xlsx',
  );

  let response = {};
  response.dataList = XLSX.utils.sheet_to_json(workbook.Sheets['listingTypes']);

  response.dataList.forEach((list) => {
    delete list.checkboxSelection;
    const dataFileUrl = '.' + req.url.substring(0, req.url.indexOf('private'));
    if (list.rowDataUrl == 'getAllList') {
      list.count = getAllListRecords(
        dataFileUrl + '/data.xlsx',
        defaultReqModel,
        req.session.userDetails,
      ).lastRow;
    }
  });
  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
  res.json(response);
});

router.post(
  '/dummyServer/json/setup/process/interfaceConfiguration/private/getAllList',
  (req, res) => {
    const dataFileUrl = '.' + req.url.substring(0, req.url.indexOf('private'));

    let response = getAllListRecords(
      dataFileUrl + '/data.xlsx',
      defaultReqModel,
      req.session.userDetails,
    );

    response.data = response.data.map((data) => {
      data.actions = [
        {
          index: 1,
          displayName: 'View',
          type: 'ICON',
          icon: 'fa-eye',
          url: 'route~view',
          methodName: 'view',
          paramList: 'id',
          color: 'primary',
        },
        {
          index: 2,
          displayName: 'Edit',
          type: 'ICON',
          icon: 'fa-pencil',
          url: 'route~edit',
          methodName: 'edit',
          paramList: 'id',
          color: 'primary',
        },
        {
          index: 3,
          displayName: 'Log',
          type: 'BUTTON',
          icon: '',
          url: 'route~log',
          methodName: 'log',
          paramList: 'id',
          color: 'primary',
        },
      ];

      return data;
    });

    res.json(response);
  },
);

module.exports = router;
