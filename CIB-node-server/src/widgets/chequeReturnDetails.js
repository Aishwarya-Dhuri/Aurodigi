var express = require('express');
var fs = require('fs');
var XLSX = require('xlsx');

var router = express.Router();

router.post('/dummyServer/json/dashboard/widgets/private/getChequeReturnDetails', (req, res) => {
  let chequeReturnDetails = [];

  fs.readFile('./dummyServer/json/widgets/chequeReturnDetails.json', function (err, data) {
    if (!err) {
      chequeReturnDetails = data;
    } else {
      console.log(err);
      res.json({ responseStatus: { message: 'CAN`T READ FILE', status: '1' } });
      return;
    }
  });

  const type = req.body.dataMap.type;

  const curDate = new Date().getTime();

  chequeReturnDetails.filter((crd) => {
    const date = new Date(d.liquidationDate).getTime();
    return crd;
  });

  res.json({
    data,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

module.exports = router;
