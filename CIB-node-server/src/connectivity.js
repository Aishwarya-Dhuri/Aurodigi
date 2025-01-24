var express = require('express');
var router = express.Router();

router.get('/dummyServer/json/checkConnection', (req, res) => {
  console.log('connected');
  const response = {
    status: '1',
    responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
  };

  res.json(response);
});

module.exports = router;
