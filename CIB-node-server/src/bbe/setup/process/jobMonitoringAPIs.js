var express = require('express');
var router = express.Router();
var _ = require('lodash');

const getAllListRecords = require('./../../../listingAPIs').getAllListRecords;




router.post(
    '/dummyServer/json/setup/process/jobMonitoring/private/getSearchResultList',
    (req, res) => {

        var response = getAllListRecords(
            './dummyServer/json/setup/process/jobMonitoring/data.xlsx',
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
        });
        res.json(response);
    },
);

module.exports = router;