var express = require('express');
var getAuthorizedListRecords = require('./listingAPIs').getAuthorizedListRecords;
var router = express.Router();

//Get
router.post(
  '/dummyServer/json/rms/transactions/invoiceEntry/private/getInvoiceData',
  (req, res) => {
    const response = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    res.json(response);
  },
);

module.exports = router;
