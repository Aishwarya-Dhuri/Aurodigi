var express = require('express');
var router = express.Router();
const getAuthorizedListRecords = require('./../listingAPIs').getAuthorizedListRecords;

router.post(
  '/dummyServer/json/accountServices/services/merchantPayment/private/getAuthorizedList',
  (req, res) => {
    const response = getAuthorizedListRecords(
      './dummyServer/json/accountServices/services/merchantPayment/data.xlsx',
      req.body,
      req.session.userDetails,
    );
    response.data = response.data.map((record) => {
      const indexDisable = record.actions.findIndex((action) => action.methodName == 'disable');
      const indexEdit = record.actions.findIndex((action) => action.methodName == 'edit');

      if (indexDisable !== -1) {
        record.actions.splice(indexDisable, 1);
      }
      if (indexEdit !== -1) {
        record.actions.splice(indexEdit, 1);
      }
      return record;
    });
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/merchantPayment/private/getPendingList',
  (req, res) => {
    const response = getAuthorizedListRecords(
      './dummyServer/json/accountServices/services/merchantPayment/data.xlsx',
      req.body,
      req.session.userDetails,
    );
    response.data = response.data.map((record) => {
      const indexEdit = record.actions.findIndex((action) => action.methodName == 'edit');
      const indexDelete = record.actions.findIndex((action) => action.methodName == 'delete');

      if (indexEdit !== -1) {
        record.actions.splice(indexEdit, 1);
      }
      if (indexDelete !== -1) {
        record.actions.splice(indexDelete, 1);
      }
      return record;
    });
    res.json(response);
  },
);

module.exports = router;
