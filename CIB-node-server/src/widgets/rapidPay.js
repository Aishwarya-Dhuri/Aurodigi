var express = require('express');
var fs = require('fs');


var router = express.Router();

router.post('/dummyServer/json/dashboard/widgets/private/getPaymentMethod', (req, res) => {

  const data = JSON.parse(fs.readFileSync('./dummyServer/json/widgets/rapidPayPaymentMethod.json', 'utf8'));

  res.json({
    data,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

module.exports = router;
