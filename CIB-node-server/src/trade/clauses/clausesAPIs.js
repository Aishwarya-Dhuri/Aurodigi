var express = require('express');
var getViewData = require('../../crudAPIs').getViewData;

var router = express.Router();

router.post('/dummyServer/json/trade/clauses/private/getClausesDataList', (req, res) => {
  const filters = [{ name: 'PRODUCTTYPE', value: req.body.productType }];
  let getClauses = getViewData('./dummyServer/json/trade/clauses/data.xlsx', filters);
  const filteredData = getClauses.documentMapingDET.filter((res) => res.ISBILL === 'Y');

  res.json({
    dataList: filteredData,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

module.exports = router;
