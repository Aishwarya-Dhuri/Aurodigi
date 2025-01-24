var express = require('express');
var getAuthorizedList = require('../../listingAPIs').getAuthorizedListRecords;

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
  '/dummyServer/json/trade/termsAndCondition/private/getTermsAndConditionList',
  (req, res) => {
    let authorizedList = getAuthorizedList(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      { ...defaultReqModel, ...req.body },
      req.session.userDetails,
    );

    authorizedList.data = authorizedList.data.filter(
      (record) => record.type === req.body.filterModel.type.filter,
    );

    res.json({
      data: authorizedList.data,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

module.exports = router;
