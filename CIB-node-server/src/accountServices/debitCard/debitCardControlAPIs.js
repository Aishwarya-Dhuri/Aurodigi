var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');
var _ = require('lodash');
var cloneDeep = require('lodash').cloneDeep;

const addRecordInExcel = require('./../../crudAPIs').addRecordInExcel;
const updateRecordInExcel = require('./../../crudAPIs').updateRecordInExcel;
const getViewData = require('./../../crudAPIs').getViewData;
const authorize = require('./../../crudAPIs').authorize;
const getCorporateData = require('./../../crudAPIs').getCorporateData;
const getAllListRecords = require('./../../listingAPIs').getAllListRecords;
const getPendingListRecords = require('./../../listingAPIs').getPendingListRecords;
const getAuthorizedListRecords = require('./../../listingAPIs').getAuthorizedListRecords;
const getRejectedListRecords = require('./../../listingAPIs').getRejectedListRecords;



router.post(
    '/dummyServer/json/accountServices/debitCard/debitCardControl/private/update',
    (req, res) => {

        req.body.requestBy =
            req.session && req.session.userDetails?.requestBy ? req.session.userDetails?.requestBy : '';
        if (req.session && req.session.userDetails && req.session.userDetails?.requestBy == 'CORPORATE') {
            if (req.session.userDetails?.loginPreferenceDetails?.loginType == 'group') {
                req.body.groupId = req.body.groupId
                    ? req.body.groupId
                    : req.session?.userDetails?.loginPreferenceDetails?.groupId;
                req.body.groupId = parseInt(req.body.groupId.toString());
            }
            const corporateId = req.body.corporateId
                ? req.body.corporateId
                : req.session?.userDetails?.corporateId;

            const corporateData = getCorporateData(corporateId);
            req.body.corporateId = corporateId;
            req.body.corporateCode = corporateData ? corporateData.corporateCode : '';
            req.body.corporateName = corporateData ? corporateData.corporateName : '';

            req.body.corporateId = parseInt(corporateId.toString());
        }

        if (req.body.listingType != 'Card List') {
            const data = updateRecordInExcel(
                './dummyServer/json/accountServices/debitCard/debitCardControl/data.xlsx',
                req.body,
                req.session.userDetails);

            res.json({
                dataMap: { data },
                responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
            });
        }
        else {
            const keys = [
                'changePin',
                'switchPrimaryAccount',
                'blockCard',
                'cardActiveInactive',
                'limitControl',
                'merchantCardControlGroupSetting',
            ];
            const data = [];
            req.body.changedTabs.forEach((key) => {
                const newFormData = cloneDeep(req.body);
                newFormData.requestFor = newFormData[key][0].displayName;
                newFormData.key = newFormData[key][0].key

                delete newFormData.changedTabs;

                keys.forEach((k) => {
                    if (k != key) {
                        delete newFormData[k];
                    }
                });

                const reqBody = { "startRow": 0, "endRow": 10, "rowGroupCols": [], "valueCols": [], "pivotCols": [], "pivotMode": false, "groupKeys": [], "filterModel": {}, "sortModel": [], "entityName": "DEBITCARDCONTROL" }
                const debitCardControlPendingData = getPendingListRecords(
                    './dummyServer/json/accountServices/debitCard/debitCardControl/data.xlsx',
                    reqBody,
                    req.session.userDetails,
                )
                let isAvailable = false;
                _.filter(debitCardControlPendingData.data, function (res) {
                    if (res.key == newFormData.key) {
                        isAvailable = true
                    }
                    return true
                });
                if (!isAvailable) {
                    data.push(addRecordInExcel(
                        './dummyServer/json/accountServices/debitCard/debitCardControl/data.xlsx',
                        newFormData,
                        req.session.userDetails,
                    ))

                    const changePinIds = data.filter((res) => res.key === 'changePin').map(((res) => {
                        return res.id
                    }))

                    const reqData = { "dataMap": { "ids": changePinIds } }

                    authorize('./dummyServer/json/accountServices/debitCard/debitCardControl/data.xlsx',
                        req.session.userDetails,
                        reqData,
                        XLSX.readFile('./dummyServer/json/accountServices/debitCard/debitCardControl/data.xlsx'));
                }
            });
            if (data.length > 0) {
                res.json({
                    dataMap: { data },
                    responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
                });
            } else {
                res.json({
                    dataMap: { data },
                    responseStatus: { message: 'MSG_KEY_EXISTING_RECORD', status: '1' },
                });
            }
        }
    }
);

router.post(
    '/dummyServer/json/accountServices/debitCard/debitCardControl/private/getCardList',
    (req, res) => {

        var response = getAllListRecords(
            './dummyServer/json/accountServices/debitCard/data.xlsx',
            req.body,
            req.session.userDetails,
        )
        _.forEach(response.data, function (row) {
            row.actions = [
                {
                    index: 1,
                    displayName: 'View',
                    type: 'ICON',
                    icon: 'pi pi-eye',
                    url: 'route~view',
                    methodName: 'view',
                    paramList: 'id',
                    color: null,
                },
                {
                    index: 2,
                    displayName: 'Edit',
                    type: 'ICON',
                    icon: 'pi pi-pencil',
                    url: 'route~edit',
                    methodName: 'edit',
                    paramList: 'id',
                    color: 'primary',
                }
            ];
            if (row.isBlockCard) {
                row.actions.splice(1, 1)
                row.actions.push({
                    index: 2,
                    displayName: 'Unblock',
                    type: 'ICON',
                    icon: 'pi pi-unlock',
                    url: 'route~unblock',
                    methodName: 'unblockCard',
                    paramList: 'id',
                    color: 'primary',
                })
            }
        });
        res.json(response);
    },
);

router.post(
    '/dummyServer/json/accountServices/debitCard/debitCardControl/private/getAllCount',
    (req, res) => {
        var workbook = XLSX.readFile(
            '.' + req.url.substring(0, req.url.indexOf('private')) + 'listingTypes.xlsx',
        );

        var response = {};
        response.dataList = XLSX.utils.sheet_to_json(workbook.Sheets['listingTypes']);
        const defaultReqModel = {
            startRow: 0,
            endRow: 1,
            rowGroupCols: [],
            valueCols: [],
            pivotCols: [],
            pivotMode: false,
            groupKeys: [],
            filterModel: {},
            sortModel: [],
            entityName: '',
        };
        response.dataList.forEach((list) => {
            delete list.checkboxSelection;
            let dataFileUrl = list.serviceUrl
                ? './dummyServer/json/' + list.serviceUrl
                : '.' + req.url.substring(0, req.url.indexOf('private'));

            if (list.rowDataUrl == 'getCardList') {
                list.count = getAllListRecords(
                    './dummyServer/json/accountServices/debitCard/data.xlsx',
                    defaultReqModel,
                    req.session.userDetails,
                ).lastRow;
            } else if (list.rowDataUrl == 'getPendingList') {
                list.count = getPendingListRecords(
                    dataFileUrl + '/data.xlsx',
                    defaultReqModel,
                    req.session.userDetails,
                ).lastRow;
            } else if (list.rowDataUrl == 'getAuthorizedList') {
                list.count = getAuthorizedListRecords(
                    dataFileUrl + '/data.xlsx',
                    defaultReqModel,
                    req.session.userDetails,
                ).lastRow;
            } else if (list.rowDataUrl == 'getRejectedList') {
                list.count = getRejectedListRecords(
                    dataFileUrl + '/data.xlsx',
                    defaultReqModel,
                    req.session.userDetails,
                ).lastRow;
            }
        });
        response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
        res.json(response);
    },
);

router.post(
    '/dummyServer/json/accountServices/debitCard/private/view',
    (req, res) => {
        const dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
        const pendingXlFile = './dummyServer/json/accountServices/debitCard/debitCardControl/data.xlsx'

        let filters = []

        const reqBody = { "startRow": 0, "endRow": 10, "rowGroupCols": [], "valueCols": [], "pivotCols": [], "pivotMode": false, "groupKeys": [], "filterModel": {}, "sortModel": [], "entityName": "DEBITCARDCONTROL" }
        const debitCardControlPendingData = getPendingListRecords(
            pendingXlFile,
            reqBody,
            req.session.userDetails,
        )

        filters.push({ name: 'id', value: req.body.dataMap.id });
        const viewData = getViewData(dataXlFile, filters);

        debitCardControlPendingData.data = _.filter(debitCardControlPendingData.data, function (res) {
            return res.cardNumber === viewData.cardNumber
        });

        _.forEach(debitCardControlPendingData.data, function (row) {
            const reqData = { name: 'id', value: row.id };
            const pendingViewData = getViewData(pendingXlFile, reqData);

            viewData[pendingViewData.key] = pendingViewData[pendingViewData.key];
        });
        console.log('viewData', viewData)
        res.json({ ...viewData, responseStatus: { message: '', status: '0' } });
    },
);

router.post(
    '/dummyServer/json/accountServices/debitCard/debitCardControl/private/authorize',
    (req, res) => {
        const dataXlFile = './dummyServer/json/accountServices/debitCard/debitCardControl/data.xlsx';

        var response = authorize(dataXlFile,
            req.session.userDetails,
            req.body,
            XLSX.readFile(dataXlFile));
        if (response) {
            req.body.dataMap.ids.forEach((id) => {
                filters.push({ name: 'id', value: id });
                const viewData = getViewData(dataXlFile, filters);
                updateRecordInExcel(
                    './dummyServer/json/accountServices/debitCard/data.xlsx',
                    viewData,
                    req.session.userDetails);
            })
        }
        res.json({ responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
    },
);

router.post(
    '/dummyServer/json/accountServices/debitCard/debitCardControl/private/getAuthorizedList',
    (req, res) => {
        var response = getAuthorizedListRecords(
            './dummyServer/json/accountServices/debitCard/debitCardControl/data.xlsx',
            req.body,
            req.session.userDetails,
        )
        _.forEach(response.data, function (row) {
            row.actions = [
                {
                    index: 1,
                    displayName: 'View',
                    type: 'ICON',
                    icon: 'pi pi-eye',
                    url: 'route~view',
                    methodName: 'view',
                    paramList: 'id',
                    color: null,
                }
            ];
        });
        res.json(response);
    },
);


module.exports = router;