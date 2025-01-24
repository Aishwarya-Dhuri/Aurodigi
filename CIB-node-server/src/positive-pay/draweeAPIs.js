const express = require('express');
const XLSX = require('xlsx');
const _ = require('lodash');

const getAllListRecords = require('../listingAPIs').getAllListRecords;

const router = express.Router();

const defaultReqModel = {
  startRow: 0,
  endRow: 100,
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
  '/dummyServer/json/positivePay/transactions/drawee/private/getDraweeList',
  (req, res) => {
    const dataList = getAllListRecords(
      './dummyServer/json/positivePay/transactions/drawee/data.xlsx',
      defaultReqModel,
      req.session.userDetails,
    ).data.map((data) => {
      return {
        ...data,
      };
    });

    res.send({
      dataList,
      lastRow: dataList.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

module.exports = router;
