var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var FakeServer = require('./fakeServer').FakeServer;

const fs = require('fs');

var router = express.Router();

router.post('/dummyServer/json/corporatedetailsService/private/getAllCount', (req, res) => {
  var jsonFile = '.' + req.url + '.json';
  getData(jsonFile, res);
});

router.post('/dummyServer/json/corporatedetailsService/private/getAuthorizedList', (req, res) => {
  var jsonFile = '.' + req.url + '.json';
  getData(jsonFile, res);
});
router.post('/dummyServer/json/corporatedetailsService/private/view', (req, res) => {
  var jsonFile = '.' + req.url + '.json';
  getData(jsonFile, res);
});

function getData(jsonFile, res) {
  fs.readFile(jsonFile, function (err, data) {
    if (!err) {
      res.json(JSON.parse(data));
    } else {
      console.log(err);
      res.json({ responseStatus: { message: 'CAN`T READ FILE', status: '1' } });
    }
  });
}
module.exports = router;
