var express = require('express');

const fs = require('fs');
var router = express.Router();

router.post('/dummyServer/**', (req, res) => {
  var jsonFile = '.' + req.url + '.json';
  console.log('Reading Json File'.inverse + ' : ' + jsonFile);
  fs.readFile(jsonFile, function (err, data) {
    if (!err) {
      res.json(JSON.parse(data));
    } else {
      console.log(err);
      res.json({ responseStatus: { message: 'CAN`T READ FILE', status: '1' } });
    }
  });
});

module.exports = router;
