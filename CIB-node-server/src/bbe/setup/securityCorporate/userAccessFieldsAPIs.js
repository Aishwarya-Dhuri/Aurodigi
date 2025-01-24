var express = require('express');
var XLSX = require('xlsx');

var getViewData = require('../../../crudAPIs').getViewData;

var router = express.Router();

router.post(
  '/dummyServer/json/setup/security/userFieldAccess/private/getAllUserFields',
  (req, res) => {
    const dataXlFile = './dummyServer/json/setup/security/userFieldAccess/userAccessFields.xlsx';
    const existingWb = XLSX.readFile(dataXlFile);

    const excelData = XLSX.utils.sheet_to_json(existingWb.Sheets['Sheet1']);

    res.json({
      data: excelData,
      lastRow: excelData.length,
      responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/setup/security/userFieldAccess/private/getUserFieldAccess',
  (req, res) => {
    const dataXlFile = './dummyServer/json/setup/security/userFieldAccess/data.xlsx';

    let filters = [{ name: 'corporateId', value: req.body.dataMap.corporateId }];

    console.log(filters);

    const userAccessFields = getViewData(dataXlFile, filters);

    const data = {};

    userAccessFields.corporateUserAccessFields.map((record) => {
      const fieldName = record.field
        .replace('-', ' ')
        .split(' ')
        .map((d, i) => {
          d = d.toLowerCase();
          if (i != 0) {
            return [...d]
              .map((dd, j) => {
                if (j == 0) {
                  return dd.toUpperCase();
                }
                return dd;
              })
              .join('');
          }
          return d;
        })
        .join('');

      data[fieldName] = {
        id: record.id,
        category: record.category,
        fieldName: record.field,
        field: fieldName,
        criticality: record.criticality,
        cibAdmin: record.cibAdmin,
        cibUserProfile: record.cibUserProfile,
        authRule: record.authRule,
        lock: record.lock,
      };
    });

    res.json({
      data: [data],
      lastRow: 1,
      responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' },
    });
  },
);

module.exports = router;
