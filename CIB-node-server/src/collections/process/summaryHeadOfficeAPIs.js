var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
const { getAllListRecords } = require('../../listingAPIs');

var router = express.Router();

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

router.post(
  '/dummyServer/json/collections/process/collectionSummaryHeadOffice/private/getAllList',
  (req, res) => {
    const dataList = getAllListRecords(
      './dummyServer/json/collections/process/collectionSummaryHeadOffice/data.xlsx',
      defaultReqModel,
      req.session.userDetails,
    ).data.map((record) => {
      return {
        ...record,
        actions: [
          {
            index: 1,
            displayName: 'Download',
            type: 'BUTTON',
            icon: '',
            url: '',
            methodName: 'onDownloadClick',
            paramList: 'id',
            color: 'primary'
          }
        ],
      };
    });
    let response = {
      data: dataList,
      lastRow: dataList.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    };

    res.json(response);
  },
);

module.exports = router;
