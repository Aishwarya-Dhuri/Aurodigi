const express = require('express');
let XLSX = require('xlsx');
var _ = require('lodash');

const getAllListRecords = require('../../listingAPIs').getAllListRecords;
const getAuthorizedListRecords = require('../../listingAPIs').getAuthorizedListRecords;
const getDraftListRecords = require('../../listingAPIs').getDraftListRecords;
const getTemplatetListRecords = require('../../listingAPIs').getTemplatetListRecords;
const router = express.Router();

let reqBody = {
  startRow: 0,
  endRow: 10,
  rowGroupCols: [],
  valueCols: [],
  pivotCols: [],
  pivotMode: false,
  groupKeys: [],
  filterModel: {},
  sortModel: [],
  entityName: '',
};

router.post(
  '/dummyServer/json/payments/transactions/singlePaymentRequest/private/getDraftList',
  (req, res) => {
    const reqBody = {
      startRow: 0,
      endRow: 10,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: {},
      sortModel: [],
      entityName: '',
    };
    const response = getDraftListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'draftData.xlsx',
      reqBody,
      req.session.userDetails,
    );
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/singlePaymentRequest/private/getTemplateList',
  (req, res) => {
    const reqBody = {
      startRow: 0,
      endRow: 10,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: {},
      sortModel: [],
      entityName: '',
    };
    const response = getTemplatetListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'templateData.xlsx',
      reqBody,
      req.session.userDetails,
    );
    res.json(response);
  },
);
router.post(
  '/dummyServer/json/payments/transactions/singlePaymentRequest/private/frequentPaymentData',
  (req, res) => {
    const response = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      reqBody,
      req.session.userDetails,
    );

    response.data.forEach((record) => {
      record.actions = [
        {
          index: 1,
          displayName: 'INITIATE',
          type: 'BUTTON',
          icon: '',
          methodName: 'intiateFrequentPayment',
          paramList: 'id,initiateMode',
          color: null,
        },
      ];
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/singlePaymentRequest/private/recentPaymentData',
  (req, res) => {
    const response = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      reqBody,
      req.session.userDetails,
    );

    response.data.forEach((record) => {
      record.actions = [
        {
          index: 1,
          displayName: 'INITIATE',
          type: 'BUTTON',
          icon: '',
          methodName: 'intiateRecentPayment',
          paramList: 'id,initiateMode',
          color: null,
        },
      ];
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/singlePaymentRequest/private/upcomingPaymentData',
  (req, res) => {
    const response = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      reqBody,
      req.session.userDetails,
    );

    response.data.forEach((record) => {
      record.actions = [
        {
          index: 2,
          displayName: 'INITIATE',
          type: 'BUTTON',
          icon: '',
          methodName: 'initiateUpcomingPayment',
          paramList: 'id,initiateMode',
          color: null,
        },
        {
          index: 3,
          displayName: 'CANCEL',
          type: 'BUTTON',
          icon: '',
          methodName: 'cancelUpcomingPayment',
          paramList: 'id',
          color: null,
        },
      ];
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/json/collections/process/transactionEnquiry/private/getAuthorizedList',
  (req, res) => {
    const response = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );
    response.data.forEach((record) => {
      const indexEdit = record.actions.findIndex((action) => action.methodName == 'edit');

      if (indexEdit !== -1) {
        record.actions.splice(indexEdit, 1);
      }
      const indexDisable = record.actions.findIndex((action) => action.methodName == 'disable');

      if (indexDisable !== -1) {
        record.actions.splice(indexDisable, 1);
      }

      const dataflow = [
        {
          index: 2,
          displayName: 'Dataflow',
          type: 'ICON',
          icon: 'fa-chart-network',
          methodName: 'swiftGpiDataFlow',
          paramList: 'id',
          color: null,
        },
      ];
      record.actions.push(...dataflow);
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/collections/process/transactionEnquiry/cashTransactionEquiry/private/getAllTransactionEnquiryList',
  (req, res) => {
    const response = getAllListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    // response.data.forEach((record) => {
    //   const dataflow = [
    //     {
    //       index: 2,
    //       displayName: 'View Image',
    //       type: 'ICON',
    //       icon: 'fa-light fa-money-check',
    //       methodName: 'routeToCashTransactionDetails',
    //       paramList: 'id',
    //       color: null,
    //     },
    //   ];
    //   record.actions.push(...dataflow);
    // });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/singlePaymentRequest/private/getTransactionListTypes',
  (req, res) => {
    const transactionsListTypes = [
      {
        label: 'Draft',
        count: getListCount(req, 'payments/transactions/singlePaymentRequest/draftData.xlsx'),
        colDefUrl: 'payments/transactions/singlePaymentRequest/private/draftColDef',
        rowDataUrl: 'payments/transactions/singlePaymentRequest/private/getDraftList',
        cardDataUrl: 'payments/transactions/singlePaymentRequest/private/getDraftList',
      },
      {
        label: 'Frequent Payment',
        count: getListCount(req, '', 'payments/transactions/singlePaymentRequest/data.xlsx'),
        colDefUrl: 'payments/transactions/singlePaymentRequest/private/frequentPaymentColDef',
        rowDataUrl: 'payments/transactions/singlePaymentRequest/private/frequentPaymentData',
        cardDataUrl: 'payments/transactions/singlePaymentRequest/private/frequentPaymentData',
      },
      {
        label: 'Recent Payment',
        count: getListCount(req, '', 'payments/transactions/singlePaymentRequest/data.xlsx'),
        colDefUrl: 'payments/transactions/singlePaymentRequest/private/recentPaymentColDef',
        rowDataUrl: 'payments/transactions/singlePaymentRequest/private/recentPaymentData',
        cardDataUrl: 'payments/transactions/singlePaymentRequest/private/recentPaymentData',
      },
      {
        label: 'Upcoming Payment',
        count: getListCount(req, '', 'payments/transactions/singlePaymentRequest/data.xlsx'),
        colDefUrl: 'payments/transactions/singlePaymentRequest/private/upcomingPaymentColDef',
        rowDataUrl: 'payments/transactions/singlePaymentRequest/private/upcomingPaymentData',
        cardDataUrl: 'payments/transactions/singlePaymentRequest/private/upcomingPaymentData',
      },
      {
        label: 'Template',
        count: getListCount(req, 'payments/transactions/singlePaymentRequest/templateData.xlsx'),
        colDefUrl: 'payments/transactions/singlePaymentRequest/private/templateColDef',
        rowDataUrl: 'payments/transactions/singlePaymentRequest/private/getTemplateList',
        cardDataUrl: 'payments/transactions/singlePaymentRequest/private/getTemplateList',
      },
    ];

    res.json({
      data: transactionsListTypes,
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

const getListCount = (req, xlFileUrl, dataXlFileUrl) => {
  var count = 0;
  if (xlFileUrl) {
    const workbook = XLSX.readFile('./dummyServer/json/' + xlFileUrl);
    const data = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
    count = _.filter(data, function (d) {
      if (
        req.session?.userDetails?.loginPreferenceDetails &&
        req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group'
      ) {
        return d?.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId;
      } else if (
        req.session?.userDetails?.loginPreferenceDetails &&
        req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group'
      ) {
        return d?.corporateId == req.session?.userDetails?.corporateId;
      }
      return true;
    }).length;
  } else {
    const response = getAuthorizedListRecords(
      './dummyServer/json/' + dataXlFileUrl,
      reqBody,
      req.session.userDetails,
    );
    count = response.data.length;
  }
  return count;
};

module.exports = router;
