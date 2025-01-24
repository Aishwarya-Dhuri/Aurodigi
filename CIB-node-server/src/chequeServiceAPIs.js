var express = require('express');
var getAuthorizedListRecords = require('./listingAPIs').getAuthorizedListRecords;

var router = express.Router();

//Get
router.post(
  '/dummyServer/json/accountServices/chequeServices/chequeDataService/private/getChequeData',
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
        '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
        defaultReqModel,
        req.body,
        req.session.userDetails,
      ),
    );
  },
);

module.exports = router;
