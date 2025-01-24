var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');

var router = express.Router();

router.post(
    '/dummyServer/json/positivePay/transactions/chequeEntry/private/getRecentCheques',
    (req, res) => {
        res.send({ data: [], responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
    },
);

module.exports = router;
