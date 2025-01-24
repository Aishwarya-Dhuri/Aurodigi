const express = require('express');

const getAuthorizedListRecords = require('./../../../listingAPIs').getAuthorizedListRecords;

const router = express.Router();

router.post(
    '/dummyServer/json/setup/security/corporateDetails/private/getAuthorizedList',
    (req, res) => {
        console.log('Getting Search Result list for Invoice Payment and Apply Finance');

        const response = getAuthorizedListRecords(
            '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
            req.body,
            req.session.userDetails,
        );
        // response.data = response.data.map((record) => {
        //     const index = record.actions.findIndex((action) => action.methodName == 'edit');

        //     if (index !== -1) {
        //         record.actions.splice(index, 1);
        //     }
        //     return record;
        // });
        response.data = response.data.map((data) => {
            data.actions = [
                ...data.actions.filter((action) => action.displayName == 'View'),
                {
                    index: 8,
                    displayName: 'Download',
                    type: 'ICON',
                    icon: 'far fa-arrow-to-bottom',
                    url: '',
                    methodName: 'billPaymentDownload',
                    paramList: 'id',
                    color: 'primary',
                },
            ];

            return data;
        });
        res.json(response);
    },
);

module.exports = router;
