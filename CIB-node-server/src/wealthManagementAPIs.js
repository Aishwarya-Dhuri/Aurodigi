const express = require('express');
const viewDetails = require('./crudAPIs').getViewData;

const router = express.Router();

router.post(
  '/dummyServer/json/accountServices/services/wealthManagement/private/getCorporateWealthManagementData',
  (req, res) => {
    const corporateId = req.body.dataMap.corporateId;

    const wealthManagementXlFile =
      './dummyServer/json/accountServices/services/wealthManagement/data.xlsx';

    let filters = [];

    if (corporateId) {
      filters.push({ name: 'corporateId', value: corporateId });
    }

    res.json({
      ...viewDetails(wealthManagementXlFile, filters),
      responseStatus: { message: '', status: '0' },
    });
  },
);

module.exports = router;
