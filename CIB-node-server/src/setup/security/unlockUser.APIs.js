var express = require('express');
var router = express.Router();
var _ = require('lodash');

const getAuthorizedListRecords = require('../../listingAPIs').getAuthorizedListRecords;
const getViewData = require('../../crudAPIs').getViewData;
const updateRecordInExcel = require('../../crudAPIs').updateRecordInExcel;

router.post(
    '/dummyServer/json/setup/security/unlockUser/private/getUserList',
    (req, res) => {
        const defaultReqModel = {
            startRow: 0,
            endRow: 100000,
            rowGroupCols: [],
            valueCols: [],
            pivotCols: [],
            pivotMode: false,
            groupKeys: [],
            filterModel: {},
            sortModel: [],
            entityName: 'CORPORATEUSER',
        };
        var response = getAuthorizedListRecords(
            './dummyServer/json/setup/security/corporateUser/data.xlsx',
            defaultReqModel,
            req.session.userDetails,
        )
        let dataList = [];
        _.forEach(response.data, function (row) {
            if (row.isLockUser) {
                const dropdownObj = {};
                dropdownObj.id = row.userId;
                dropdownObj.displayName = row.userId;
                dropdownObj.userName = row.firstName + ' ' + row.lastName;
                dropdownObj.enrichments = {
                    userId: row.id
                };
                dataList.push(dropdownObj);
            }
        });
        res.json({ dataList: dataList });
    },
);

router.post(
    '/dummyServer/json/setup/security/unlockUser/private/unlock',
    (req, res) => {
        const dataXlFile = './dummyServer/json/setup/security/corporateUser/data.xlsx'

        let filters = [{ name: 'id', value: req.body.dataMap.id }];
        const viewData = getViewData(dataXlFile, filters);
        viewData.isLockUser = false;
        const data = updateRecordInExcel(dataXlFile, viewData, req.session.userDetails);
        res.json({
            dataMap: { id: data.id, data },
            responseStatus: { message: 'MSG_KEY_UPDATE_SUCCESSFUL', status: '0' },
        });
    },
);

module.exports = router;