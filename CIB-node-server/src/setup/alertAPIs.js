const express = require('express');
const XLSX = require('xlsx');
const router = express.Router();

router.post('/dummyServer/json/setup/templateManagement/alert/private/', (req, res) => {
  res.send({});
});

module.exports = router;
