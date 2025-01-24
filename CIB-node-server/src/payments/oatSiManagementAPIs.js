const express = require('express');

const getAuthorizedListRecords = require('./../listingAPIs').getAuthorizedListRecords;

const router = express.Router();

router.post(
  '/dummyServer/json/payments/transactions/oatSiManagement/private/getAuthorizedList',
  (req, res) => {
    const response = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );
    response.data = response.data.map((record) => {
      const index = record.actions.findIndex((action) => action.methodName == 'edit');

      if (index !== -1) {
        record.actions.splice(index, 1);
      }
      return record;
    });
    res.json(response);
  },
);

module.exports = router;
