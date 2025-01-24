var express = require('express');
var router = express.Router();
var _ = require('lodash');

// const authorize = require('./../../crudAPIs').authorize;
// const updateWorkbook = require('./../../crudAPIs').updateWorkbook;
// const getViewData = require('./../../crudAPIs').getViewData;

// router.post(
//     '/dummyServer/json/setup/generalMasters/corporateAccount/private/authorize',
//     (req, res) => {
//         let dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
//         authorize(dataXlFile, req.session.userDetails, req.body, XLSX.readFile(dataXlFile));

//         let addDataXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx'
//         _.forEach(req.body, function (row) {
//             let filters = [];
//             filters.push({ name: 'id', value: row.id });
//             const viewData = getViewData(dataXlFile, filters);
//             updateWorkbook(existingWb, sheets, dataXlFile)
//         })

//         res.json({ responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
//     },
// );

module.exports = router;