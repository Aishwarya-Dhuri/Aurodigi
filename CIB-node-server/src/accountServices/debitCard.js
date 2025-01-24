var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');
var FakeServer = require('../fakeServer').FakeServer;
const getPendingListRecords = require('./../listingAPIs').getPendingListRecords;
const getAuthorizedListRecords = require('./../listingAPIs').getAuthorizedListRecords;



// router.post(
//     '/dummyServer/json/accountServices/debitCard/debitCardControl/private/getPendingList',
//     (req, res) => {
//         const response = getPendingListRecords(
//             './dummyServer/json/accountServices/debitCard/data.xlsx',
//             req.body,
//             req.session.userDetails,
//         );
//         response.data = response.data.map((record) => {
//             const index = record.actions.findIndex((action) => action.methodName == 'disable');

//             if (index !== -1) {
//                 record.actions.splice(index, 1);
//             }
//             return record;
//         });

//         res.json(response);
//     },
// );

// router.post(
//     '/dummyServer/json/accountServices/debitCard/debitCardControl/private/getAuthorizedList',
//     (req, res) => {

//         const response = getAuthorizedListRecords(
//             './dummyServer/json/accountServices/debitCard/data.xlsx',
//             req.body,
//             req.session.userDetails,
//         );
//         response.data = response.data.map((record) => {
//             const index = record.actions.findIndex((action) => action.methodName == 'disable');

//             if (index !== -1) {
//                 record.actions.splice(index, 1);
//             }
//             return record;
//         });

//         res.json(response);
//     },
// );


// router.post('/dummyServer/json/accountServices/debitCard/debitCardControl/private/getAllCount', (req, res) => {
//     var workbook = XLSX.readFile(
//         './dummyServer/json/accountServices/debitCard/debitCardControl/listingTypes.xlsx',
//     );

//     var response = {};
//     response.dataList = XLSX.utils.sheet_to_json(workbook.Sheets['listingTypes']);
//     const defaultReqModel = {
//         startRow: 0,
//         endRow: 1,
//         rowGroupCols: [],
//         valueCols: [],
//         pivotCols: [],
//         pivotMode: false,
//         groupKeys: [],
//         filterModel: {},
//         sortModel: [],
//         entityName: '',
//     };
//     response.dataList.forEach((list) => {
//         delete list.checkboxSelection;
//         let dataFileUrl =
//             './dummyServer/json/accountServices/debitCard';
//         if (list.rowDataUrl == 'getPendingList') {
//             list.count = getPendingListRecords(
//                 dataFileUrl + '/data.xlsx',
//                 defaultReqModel,
//                 req.session.userDetails,
//             ).lastRow;
//         } else if (list.rowDataUrl == 'getAuthorizedList') {
//             list.count = getAuthorizedListRecords(
//                 dataFileUrl + '/data.xlsx',
//                 defaultReqModel,
//                 req.session.userDetails,
//             ).lastRow;

//         }
//     });
//     response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
//     res.json(response);
// });

router.post('/dummyServer/json/accountServices/debitCard/private/getAllDebitCards', (req, res) => {
    const dataXlFile = './dummyServer/json/accountServices/debitCard/data.xlsx';
    const workbook = XLSX.readFile(dataXlFile);
    const dataList = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']).filter((record) => req.session?.userDetails?.loginPreferenceDetails &&
        ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
                record.corporateId == req.session?.userDetails?.corporateId)));

    const reqModel = req.body;
    var response = [];
    if (Object.keys(reqModel).length > 0) {
        var fakeServer = FakeServer(dataList);
        if (!reqModel.sortModel) reqModel.sortModel = [];
        if (reqModel.sortModel.length == 0)
            reqModel.sortModel.push({ sort: 'desc', colId: 'modifiedSysOn' });
        if (!reqModel.filterModel) reqModel.filterModel = {};
        response = fakeServer.getData(reqModel);
        res.json({ ...response, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
    } else {
        res.json({ dataList, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
    }
})

router.post('/dummyServer/json/accountServices/debitCard/private/getDebitCardsByAccount', (req, res) => {
    const dataXlFile = './dummyServer/json/accountServices/debitCard/data.xlsx';
    const workbook = XLSX.readFile(dataXlFile);
    const data = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
    var dataList = [];
    dataList = data.filter(res => res.accountId === req.body.accountId);
    res.json({ dataList, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
})

router.post('/dummyServer/json/accountServices/debitCard/private/getCardListByAccount', (req, res) => {
    const dataXlFile = './dummyServer/json/accountServices/debitCard/data.xlsx';
    const workbook = XLSX.readFile(dataXlFile);
    const data = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
    var dataList = [];
    data.map(res => {
        if (res.accountId === req.body.dataMap.accountId) {
            const dropdownObj = {};
            dropdownObj.id = res.cardNumber
            dropdownObj.displayName = res.cardNumber
            dropdownObj.enrichments = {}
            dataList.push(dropdownObj);
            return res
        }
    });
    res.json({ dataList, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
})

module.exports = router;