var express = require('express');
var getAuthorizedListRecords = require('./listingAPIs').getAuthorizedListRecords;

var router = express.Router();

//Get
router.post(
  '/dummyServer/json/rms/transactions/undoReconciliation/private/getSearchData',
  (req, res) => {
    const defaultReqModel = {
      endRow: 10,
      entityName: '',
      filterModel: {},
      groupKeys: [],
      pivotCols: [],
      pivotMode: false,
      rowGroupCols: [],
      sortModel: [],
      startRow: 0,
      valueCols: [],
    };
    res.json(
      getAuthorizedListRecords(
        // '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
        './dummyServer/json/rms/transactions/manualReconciliation/data.xlsx',
        defaultReqModel,
        req.body,
        req.session.userDetails,
      ),
    );
  },
);

module.exports = router;
