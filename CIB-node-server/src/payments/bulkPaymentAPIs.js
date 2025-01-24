const express = require('express');
const XLSX = require('xlsx');
const _ = require('lodash');
const multer = require('multer');

const addRecordInExcel = require('../crudAPIs').addRecordInExcel;
const getViewData = require('../crudAPIs').getViewData;
const deleteRecordInExcel = require('../crudAPIs').deleteRecordInExcel;
const generateUpdateSheetData = require('../crudAPIs').generateUpdateSheetData;
const updateWorkbook = require('../crudAPIs').updateWorkbook;

const getActiveListRecords = require('./../listingAPIs').getActiveListRecords;
const getPendingListRecords = require('./../listingAPIs').getPendingListRecords;
const getAuthorizedListRecords = require('./../listingAPIs').getAuthorizedListRecords;
const getRejectedListRecords = require('./../listingAPIs').getRejectedListRecords;
const getDraftListRecords = require('./../listingAPIs').getDraftListRecords;

const reqModel = {
  endRow: 10000,
  entityName: 'BBULKPAYMENTREQUEST',
  filterModel: {},
  groupKeys: [],
  pivotCols: [],
  pivotMode: false,
  rowGroupCols: [],
  sortModel: [],
  startRow: 0,
  valueCols: [],
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Saving Files : ' + file.originalname);
    cb(null, 'dummyServer/uploadedFiles/bulkUpload');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    cb(null, 'sys_' + Date.now() + '_' + name);
  },
});

const router = express.Router();

router.post(
  '/dummyServer/json/payments/transactions/bulkPaymentRequest/private/create',
  multer({ storage: storage }).single('bulkFile'),
  (req, res) => {
    console.log(req.body.initiateType);

    let status = 'S';
    let error = '';

    if (req.body.initiateType == 'upload') {
      const file = req.file;

      req.body.supportingDocument = JSON.parse(req.body.supportingDocument);

      req.body.filePath = './' + file.path;
      req.body.fileFormat = file.type;
      req.body.fileName = file.filename;
      req.body.status = 'S';

      // if (!file.filename.includes('bulk')) {
      //   req.body.status = 'E';
      //   req.body.error = 'Duplicate File';
      //   res.json({
      //     responseStatus: { message: 'Duplicate File', status: '1' },
      //   });

      //   return;
      // }

      const workbook = XLSX.readFile(req.body.filePath);
      const xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

      let totalAmount = 0;

      const transactionRefNos = [];

      req.body.status = 'S';

      xlData.forEach((record) => {
        totalAmount += +record.totalAmount;

        if (record.transactionRefNumber == '123456789') {
          status = 'E';
          error = 'Duplicate Reference Number';
        }

        if (!transactionRefNos.includes(record.transactionRefNumber)) {
          transactionRefNos.push(record.transactionRefNumber);
        } else {
          status = 'E';
          error = 'Duplicate Reference Number';
        }
      });

      req.body.amount = totalAmount;
      req.body.currency = xlData[0].currency;
      req.body.noOfTransactions = xlData.length;

      req.body.uploadDate = new Date().toDateString();
    }

    req.body.corporateReference = req.session.userDetails.corporateCode;
    req.body.corporateCode = req.session.userDetails.corporateCode;
    req.body.corporateName = req.session.userDetails.corporateName;

    if (req.body.draftId) {
      deleteRecordInExcel(
        './dummyServer/json/payments/transactions/bulkPaymentRequest/draftData.xlsx',
        req.body.draftId,
      );

      delete req.body.draftId;
    }

    req.body.requestBy =
      req.session && req.session.userDetails?.requestBy ? req.session.userDetails?.requestBy : '';
    if (
      req.session &&
      req.session.userDetails &&
      req.session.userDetails?.requestBy == 'CORPORATE'
    ) {
      req.body.corporateId = req.session.userDetails.corporateId;
    }

    const dataXlFile = './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx';

    const data = addRecordInExcel(dataXlFile, req.body, req.session.userDetails);
    const sessionData = req.session.userDetails;
    const modReqBody = {
      ...req.body,
      status,
      error,
    };

    res.json({
      dataMap: { data },
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });

    if (modReqBody.initiateType == 'upload') {
      updateBulkFileRecord(sessionData, modReqBody);
    }
  },
);

const updateBulkFileRecord = (userDetails, data) => {
  setTimeout(() => {
    const dataXlFile = './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx';
    let existingWb = XLSX.readFile(dataXlFile);
    let sheets = generateUpdateSheetData(userDetails, data, existingWb);
    updateWorkbook(existingWb, sheets, dataXlFile);
  }, 5000);
};

router.post(
  '/dummyServer/json/payments/transactions/bulkPaymentRequest/private/view',
  (req, res) => {
    const dataXlFile = './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx';

    let filters = [];
    if (req.body.dataMap && req.body.dataMap.filters) {
      filters = req.body.dataMap.filters;
    } else if (req.body.filters) {
      filters = req.body.filters;
    }
    if (req.body.dataMap && req.body.dataMap.id) {
      filters.push({ name: 'id', value: req.body.dataMap.id });
    }

    let transactionsData = [];

    let viewData = getViewData(dataXlFile, filters);

    if (viewData.initiateType == 'upload') {
      const workbook = XLSX.readFile(viewData.filePath);

      transactionsData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
    } else {
      transactionsData = viewData.transactions.map((record) => {
        record.supportingDocument = record?.supportingDocument ? record.supportingDocument : [];
        return record;
      });
    }

    viewData['transactions'] = transactionsData.map((record) => {
      const actions = [
        {
          index: 0,
          paramList: 'id',
          methodName: 'onViewTransaction',
          type: 'ICON',
          displayName: 'View',
          icon: 'fa-eye',
        },
      ];

      if (
        viewData.modifiedBy != req.session?.userDetails?.userName &&
        viewData.authorized == 'N' &&
        !viewData.lastAction.includes('Rejected')
      ) {
        actions.unshift({
          index: 4,
          displayName: 'Reject',
          type: 'ICON',
          icon: 'pi pi-times',
          url: 'private/reject',
          methodName: 'reject',
          paramList: 'id',
          color: 'warn',
        });
        actions.unshift({
          index: 3,
          displayName: 'Authorize',
          type: 'ICON',
          icon: 'pi pi-check',
          url: 'private/authorize',
          methodName: 'authorize',
          paramList: 'id',
          color: 'green',
        });
      } else if (
        viewData.modifiedBy == req.session?.userDetails?.userName &&
        viewData.authorized == 'N' &&
        viewData.lastAction.includes('Rejected')
      ) {
        actions.unshift({
          displayName: 'Accept Reject',
          type: 'ICON',
          icon: 'pi pi-check-circle',
          url: 'private/acceptReject',
          methodName: 'acceptReject',
          paramList: 'id',
          color: 'warn',
        });
      }

      return {
        ...record,
        actions,
      };
    });

    res.json({ ...viewData, responseStatus: { message: '', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/bulkPaymentRequest/private/viewTransaction',
  (req, res) => {
    const dataXlFile = './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx';

    let filters = [];
    if (req.body.dataMap && req.body.dataMap.filters) {
      filters = req.body.dataMap.filters;
    } else if (req.body.filters) {
      filters = req.body.filters;
    }
    if (req.body.dataMap && req.body.dataMap.id) {
      filters.push({ name: 'id', value: req.body.dataMap.id });
    }

    let viewData = getViewData(dataXlFile, filters);

    const transactionFilters = [
      {
        name: 'id',
        value: req.body.dataMap.transactionId,
      },
    ];

    const transactionData = getViewData(viewData.filePath, transactionFilters);

    res.json({ ...transactionData, responseStatus: { message: '', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/bulkPaymentRequest/private/getActiveList',
  (req, res) => {
    const response = getActiveListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    response.data = response.data.map((record) => {
      if (record.initiateType == 'upload') {
        const index = record.actions.findIndex((action) => action.methodName == 'edit');
        if (index !== -1) {
          record.actions.splice(index, 1);
        }

        if (record.status == 'E') {
          const index = record.actions.findIndex((action) => action.methodName == 'view');

          if (index !== -1) {
            record.actions.splice(index, 1);
          }

          record.actions.push({
            index: 10,
            displayName: 'Error',
            type: 'ICON',
            icon: 'pi pi-times',
            url: '',
            methodName: 'error',
            paramList: 'id,error',
            color: null,
          });
        }
      }

      return record;
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/bulkPaymentRequest/private/getPendingList',
  (req, res) => {
    const response = getPendingListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    response.data = response.data.map((record) => {
      if (record.initiateType == 'upload') {
        const index = record.actions.findIndex((action) => action.methodName == 'edit');

        if (index !== -1) {
          record.actions.splice(index, 1);
        }

        if (record.status == 'E') {
          const index = record.actions.findIndex((action) => action.methodName == 'view');

          if (index !== -1) {
            record.actions.splice(index, 1);
          }

          record.actions.push({
            index: 10,
            displayName: 'Error',
            type: 'ICON',
            icon: 'pi pi-times',
            url: '',
            methodName: 'error',
            paramList: 'id,error',
            color: null,
          });
        }
      }

      return record;
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/bulkPaymentRequest/private/getAuthorizedList',
  (req, res) => {
    const response = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    response.data = response.data.map((record) => {
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
      if (record.initiateType == 'upload') {
        const index = record.actions.findIndex((action) => action.methodName == 'edit');

        if (index !== -1) {
          record.actions.splice(index, 1);
        }

        if (record.status == 'E') {
          const index = record.actions.findIndex((action) => action.methodName == 'view');

          if (index !== -1) {
            record.actions.splice(index, 1);
          }

          record.actions.push({
            index: 10,
            displayName: 'Error',
            type: 'ICON',
            icon: 'pi pi-times',
            url: '',
            methodName: 'error',
            paramList: 'id,error',
            color: null,
          });
        }
      }

      return record;
    });
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/bulkPaymentRequest/private/getRejectedList',
  (req, res) => {
    const response = getRejectedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    response.data = response.data.map((record) => {
      if (record.initiateType == 'upload') {
        const index = record.actions.findIndex((action) => action.methodName == 'edit');

        if (index !== -1) {
          record.actions.splice(index, 1);
        }

        if (record.status == 'P') {
          const index = record.actions.findIndex((action) => action.methodName == 'view');

          if (index !== -1) {
            record.actions.splice(index, 1);
          }
        }

        if (record.status == 'E') {
          const index = record.actions.findIndex((action) => action.methodName == 'view');

          if (index !== -1) {
            record.actions.splice(index, 1);
          }

          record.actions.push({
            index: 10,
            displayName: 'Error',
            type: 'ICON',
            icon: 'pi pi-times',
            url: '',
            methodName: 'error',
            paramList: 'id,error,noOfTransactions',
            color: null,
          });
        }
      }

      return record;
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/bulkPaymentRequest/private/getRecentPaymentsList',
  (req, res) => {
    const authorizedList = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      {
        ...reqModel,
        ...req.body,
        filterModel: {
          initiateType: { filterType: 'text', type: 'equals', filter: 'manual' },
        },
      },
      req.session.userDetails,
    );

    res.json(authorizedList);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/bulkPaymentRequest/private/getRecentUploadsList',
  (req, res) => {
    const authorizedList = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      {
        ...reqModel,
        ...req.body,
        filterModel: {
          initiateType: { filterType: 'text', type: 'equals', filter: 'upload' },
        },
      },
      req.session.userDetails,
    );

    res.json(authorizedList);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/bulkPaymentRequest/private/getDashboardData',
  (req, res) => {
    const rejectedList = getRejectedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      { ...reqModel, ...req.body },
      req.session.userDetails,
    );

    const pendingList = getPendingListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      { ...reqModel, ...req.body },
      req.session.userDetails,
    );

    const authorizedList = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      { ...reqModel, ...req.body },
      req.session.userDetails,
    );

    const draftList = getDraftListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'draftData.xlsx',
      { ...reqModel, ...req.body },
      req.session.userDetails,
    );

    const fileUploadStatus = {
      pending: pendingList.data.filter((record) => record.initiateType == 'upload').length,
      rejected: rejectedList.data.filter((record) => record.initiateType == 'upload').length,
      authorized: authorizedList.data.filter((record) => record.initiateType == 'upload').length,
    };

    const listingTabs = [
      {
        header: 'Recent Payment',
        count: authorizedList.data.filter((record) => record.initiateType == 'manual').length,
        colDefsUrl: 'payments/transactions/bulkPaymentRequest/private/recentPaymentsColDefs',
        rowDefUrl: 'payments/transactions/bulkPaymentRequest/private/getRecentPaymentsList',
      },
      {
        header: 'Recent Uploads',
        count: authorizedList.data.filter((record) => record.initiateType == 'upload').length,
        colDefsUrl: 'payments/transactions/bulkPaymentRequest/private/recentUploadColDefs',
        rowDefUrl: 'payments/transactions/bulkPaymentRequest/private/getRecentUploadsList',
      },
      {
        header: 'Drafts',
        count: draftList.data.length,
        colDefsUrl: 'payments/transactions/bulkPaymentRequest/private/draftColDefs',
        rowDefUrl: 'payments/transactions/bulkPaymentRequest/private/getDraftList',
      },
    ];

    res.send({
      fileUploadStatus,
      listingTabs,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

module.exports = router;
