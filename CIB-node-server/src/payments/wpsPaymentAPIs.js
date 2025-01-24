const express = require('express');
const XLSX = require('xlsx');
const _ = require('lodash');
const multer = require('multer');
const moment = require('moment');

const addRecordInExcel = require('./../crudAPIs').addRecordInExcel;
const getViewData = require('./../crudAPIs').getViewData;
const getActiveListRecords = require('./../listingAPIs').getActiveListRecords;
const getPendingListRecords = require('./../listingAPIs').getPendingListRecords;
const getAuthorizedListRecords = require('./../listingAPIs').getAuthorizedListRecords;
const getRejectedListRecords = require('./../listingAPIs').getRejectedListRecords;
const getAllListRecords = require('./../listingAPIs').getAllListRecords;
const getDraftListRecords = require('./../listingAPIs').getDraftListRecords;

const getGroupRegisteredMolList = require('./wpsRegisteredMolAPIs').getGroupRegisteredMolList;
const getCorporateRegisteredMolList =
  require('./wpsRegisteredMolAPIs').getCorporateRegisteredMolList;

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'dummyServer/uploadedFiles/wpsUpload');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    cb(null, 'sys_' + Date.now() + '_' + name);
  },
});

const router = express.Router();

router.post(
  '/dummyServer/json/payments/transactions/wpsPayment/private/get*ColDefs',
  (req, res) => {
    const userLoginType = req.body.dataMap.loginType;

    var workbook = XLSX.readFile(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'listingTypes.xlsx',
    );

    var response = {};

    var listTypes = XLSX.utils.sheet_to_json(workbook.Sheets['listingTypes']);

    var listType = _.find(listTypes, function (o) {
      return o.code == req.body.dataMap.listType;
    });

    var allColumns = XLSX.utils.sheet_to_json(workbook.Sheets['columns']);

    response.columnDefs = _.filter(allColumns, function (o) {
      return o.applicableListings && o.applicableListings.indexOf(req.body.dataMap.listType) != -1;
    });

    response.columnDefs = response.columnDefs.filter((col) => {
      return !(
        userLoginType != 'group' &&
        (col.field == 'corporateCode' || col.field == 'corporateName')
      );
    });

    var checkBoxSelectionAdded = false;

    response.columnDefs.forEach((coldef) => {
      delete coldef.applicableListings;
      if (
        listType.checkboxSelection == 'true' &&
        coldef.hide == 'false' &&
        coldef.lockVisible == 'false' &&
        !checkBoxSelectionAdded
      ) {
        coldef.checkboxSelection = true;
        coldef.headerCheckboxSelection = true;
        checkBoxSelectionAdded = true;
      }
      /* if(coldef.filter == true) {
      coldef.filter = ''
    } */
    });
    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/wpsPayment/private/create',
  multer({ storage: storage }).single('wpsFile'),
  (req, res) => {
    if (req.body.initiateType == 'upload') {
      const file = req.file;

      req.body.filePath = './' + file.path;
      req.body.fileFormat = file.type;
      req.body.fileName = file.filename;
      req.body.manualUploadType = 'Upload';

      const workbook = XLSX.readFile(req.body.filePath);
      const id = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1'])[0].id;

      const filters = [{ name: 'id', value: id }];

      const fileData = getViewData(req.body.filePath, filters);

      req.body.routingCodeAgentId = fileData.routingCodeAgentId;
      req.body.payableCurrencyAndSalaryAmount = fileData.payableCurrencyAndSalaryAmount;
      req.body.salaryMonth = fileData.salaryMonth;
      req.body.edrCount = fileData.edrCount;
      req.body.employerReference = fileData.employerReference;
      req.body.totalAmount = fileData.totalAmount;
      req.body.uploadDate = new Date().toDateString();
    } else {
      req.body.manualUploadType = 'Manual';
    }

    req.body.corporateCode = req.session.userDetails.corporateCode;
    req.body.corporateName = req.session.userDetails.corporateName;

    const dataXlFile = './dummyServer/json/payments/transactions/wpsPayment/data.xlsx';

    if (req.body.draftId) {
      deleteRecordInExcel(
        './dummyServer/json/payments/transactions/wpsPayment/draftData.xlsx',
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

    const data = addRecordInExcel(dataXlFile, req.body, req.session.userDetails);

    res.json({
      dataMap: { data },
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/wpsPayment/private/createDraft',
  (req, res) => {
    req.body.corporateCode = req.session.userDetails.corporateCode;
    req.body.corporateName = req.session.userDetails.corporateName;

    const dataXlFile = './dummyServer/json/payments/transactions/wpsPayment/draftData.xlsx';

    req.body.requestBy =
      req.session && req.session.userDetails?.requestBy ? req.session.userDetails?.requestBy : '';
    if (
      req.session &&
      req.session.userDetails &&
      req.session.userDetails?.requestBy == 'CORPORATE'
    ) {
      req.body.corporateId = req.session.userDetails.corporateId;
    }

    const data = addRecordInExcel(dataXlFile, req.body, req.session.userDetails);

    res.json({
      dataMap: { id: data.id },
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post('/dummyServer/json/payments/transactions/wpsPayment/private/view', (req, res) => {
  const dataXlFile = './dummyServer/json/payments/transactions/wpsPayment/data.xlsx';

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

  if (viewData.initiateType == 'upload') {
    const workbook = XLSX.readFile(viewData.filePath);
    const id = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1'])[0].id;

    const fileDataFilters = [{ name: 'id', value: id }];

    viewData = {
      ...viewData,
      ...getViewData(viewData.filePath, fileDataFilters),
    };
  }

  if (viewData.edrList) {
    // if (viewData.edrList) {
    viewData.edrList = viewData.edrList.map((record) => {
      return {
        ...record,
        requestStatus: viewData.authorized == 'Y' ? 'Processing' : '',
        rejectFailReason: '',
      };
    });
  }

  res.json({ ...viewData, responseStatus: { message: '', status: '0' } });
});

router.post(
  '/dummyServer/json/payments/transactions/wpsPayment/private/getActiveList',
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
      }

      return record;
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/wpsPayment/private/getPendingList',
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
      }

      record.actions.push(
        {
          index: 21,
          displayName: 'Workflow',
          type: 'ICON',
          icon: 'fa-project-diagram',
          url: '',
          methodName: 'onWorkflow',
          paramList: 'id',
          color: null,
        },
        {
          index: 22,
          displayName: 'Resend Alert',
          type: 'ICON',
          icon: 'fa-paper-plane',
          url: '',
          methodName: 'onResendAlert',
          paramList: 'id',
          color: null,
        },
      );

      return record;
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/wpsPayment/private/getDashboardAuthorizedList',
  (req, res) => {
    const response = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    response.data = response.data.map((record) => {
      const actions = [
        {
          index: 1,
          displayName: 'View',
          type: 'ICON',
          icon: 'pi pi-eye',
          methodName: 'view',
          paramList: 'id',
          color: null,
        },
      ];

      if (record.initiateType == 'manual') {
        actions.push({
          index: 1,
          displayName: 'Initiate',
          type: 'BUTTON',
          icon: 'pi pi-plus',
          methodName: 'initiate',
          paramList: 'id',
          color: null,
        });
      }

      return {
        ...record,
        actions,
      };
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/wpsPayment/private/getAuthorizedList',
  (req, res) => {
    const response = getAuthorizedListRecords(
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
      }

      const index = record.actions.findIndex((action) => action.methodName == 'disable');

      if (index !== -1) {
        record.actions.splice(index, 1);
      }

      return record;
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/wpsPayment/private/getRejectedList',
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
      }

      return record;
    });

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/wpsPayment/private/getLandingPageData',
  (req, res) => {
    const userLoginType = req.body.dataMap.loginType;

    const draftCount = XLSX.utils
      .sheet_to_json(
        XLSX.readFile('./dummyServer/json/payments/transactions/wpsPayment/draftData.xlsx').Sheets[
          'Sheet1'
        ],
      )
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)),
      ).length;

    // const draftCount = getDraftListRecords('', defaultReqModel, req.session.userDetails).data
    //   .length;

    // const authorizedCount = getAuthorizedListRecords(
    //   './dummyServer/json/payments/transactions/wpsPayment/data.xlsx',
    //   defaultReqModel,
    //   req.session.userDetails,
    // ).data.length;

    const authorizedCount = XLSX.utils
      .sheet_to_json(
        XLSX.readFile('./dummyServer/json/payments/transactions/wpsPayment/data.xlsx').Sheets[
          'Sheet1'
        ],
      )
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.enabled == 'Y' &&
          record.authorized == 'Y',
      ).length;

    const futureDatedCount = getFutureDatedData(req).length;

    const registeredMOLCount =
      userLoginType == 'group'
        ? getGroupRegisteredMolList(req).length
        : getCorporateRegisteredMolList(req.session.userDetails.corporateId).length;

    const data = {
      fileUploadStatus: {
        corporatePending: 20,
        corporateRejected: 10,
        corporateAuthorized: 101,
        sendToBankCompleted: 10,
      },
      authorizedTransactionStatus: {
        processing: 10,
        paid: 101,
        rejected: 20,
      },
      insights: [
        {
          icon: 'fa-info-circle',
          label: 'The Debit a/c linked to MOL ID MOL1234567 is Frozen as on 10th Aug 2022',
        },
        {
          icon: 'fa-info-circle',
          label: 'The Credit for Employee ID EMP3221 has got rejected last 2 monthly payments',
        },
        {
          icon: 'fa-info-circle',
          label: 'The Credit for Employee IF EMP457 has got rejected last 3 monthly payments',
        },
      ],
      listingTabs: [
        {
          header: 'Recent Payment',
          count: authorizedCount,
          colDefsUrl:
            userLoginType == 'group'
              ? 'payments/transactions/wpsPayment/private/authorizedListColDefs'
              : 'payments/transactions/wpsPayment/private/authorizedListCorporateColDefs',

          rowDefUrl: 'payments/transactions/wpsPayment/private/getDashboardAuthorizedList',
        },
        {
          header: 'Future Dated',
          count: futureDatedCount,
          colDefsUrl:
            userLoginType == 'group'
              ? 'payments/transactions/wpsPayment/private/futureDatedColDefs'
              : 'payments/transactions/wpsPayment/private/futureDatedCorporateColDefs',
          colDefReq: {},
          rowDefUrl: 'payments/transactions/wpsPayment/private/getFutureDatedList',
        },
        {
          header: 'Registered MOL',
          count: registeredMOLCount,
          colDefsUrl:
            userLoginType == 'group'
              ? 'payments/transactions/wpsRegisteredMol/private/groupWpsRegisteredMolIdsColDefs'
              : 'payments/transactions/wpsRegisteredMol/private/corporateWpsRegisteredMolIdsColDefs',
          colDefReq: {},
          rowDefUrl:
            userLoginType == 'group'
              ? 'payment/transactions/wpsRegisteredMol/private/getGroupRegisteredMolList'
              : 'payment/transactions/wpsRegisteredMol/private/getCorporateRegisteredMolList',
        },
        {
          header: 'Drafts',
          count: draftCount,
          colDefsUrl:
            userLoginType == 'group'
              ? 'payments/transactions/wpsPayment/private/draftColDefs'
              : 'payments/transactions/wpsPayment/private/draftCorporateColDefs',

          colDefReq: {},
          rowDefUrl: 'payments/transactions/wpsPayment/private/getDraftList',
        },
      ],
    };

    res.json({
      data,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/wpsPayment/private/getFileUploadStatus',
  (req, res) => {
    const duration = req.body.dataMap.duration;

    let data = {
      corporatePending: 20,
      corporateRejected: 10,
      corporateAuthorized: 101,
      sendToBankCompleted: 10,
    };

    if (duration == 'today') {
      data = {
        corporatePending: 10,
        corporateRejected: 5,
        corporateAuthorized: 54,
        sendToBankCompleted: 6,
      };
    } else if (duration == 'thisMonth') {
      data = {
        corporatePending: 80,
        corporateRejected: 40,
        corporateAuthorized: 350,
        sendToBankCompleted: 53,
      };
    }

    res.json({
      data,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/wpsPayment/private/getAuthorizedTransactionStatus',
  (req, res) => {
    const duration = req.body.dataMap.duration;

    let data = {
      processing: 10,
      paid: 101,
      rejected: 20,
    };

    if (duration == 'today') {
      data = {
        processing: 5,
        paid: 53,
        rejected: 10,
      };
    } else if (duration == 'thisMonth') {
      data = {
        processing: 89,
        paid: 543,
        rejected: 102,
      };
    }

    res.json({
      data,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post('/dummyServer/json/payments/transactions/wpsPayment/private/getAllList', (req, res) => {
  const response = getAllListRecords(
    './dummyServer/json/payments/transactions/wpsPayment/data.xlsx',
    defaultReqModel,
    req.session.userDetails,
  );

  response.data = response.data.map((record) => {
    record.actions = [
      {
        index: 1,
        displayName: 'View',
        type: 'ICON',
        icon: 'pi pi-eye',
        methodName: 'view',
        paramList: 'id',
        color: null,
      },
    ];
    return record;
  });

  res.json(response);
});

router.post(
  '/dummyServer/json/payments/transactions/wpsPayment/private/getTransactionEnquirySearchList',
  (req, res) => {
    const allListRecords = getAllListRecords(
      './dummyServer/json/payments/transactions/wpsPayment/data.xlsx',
      defaultReqModel,
      req.session.userDetails,
    );

    const data = [];

    allListRecords.data
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.enabled == 'Y' &&
          record.authorized == 'Y',
      )
      .forEach((record) => {
        const filters = [{ name: 'id', value: record.id }];
        const dataXlFile = './dummyServer/json/payments/transactions/wpsPayment/data.xlsx';

        let viewData = getViewData(dataXlFile, filters);

        if (viewData.initiateType == 'upload') {
          const workbook = XLSX.readFile(viewData.filePath);
          const id = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1'])[0].id;

          const fileDataFilters = [{ name: 'id', value: id }];

          viewData = { ...viewData, ...getViewData(viewData.filePath, fileDataFilters) };
        }

        viewData.edrList.forEach((edrRecord) => {
          data.push({
            edrId: edrRecord.id,
            ...edrRecord,
            scrId: record.id,
            ...record,
            id: edrRecord.id + '-' + record.id,
            actions: [
              {
                index: 1,
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
                methodName: 'view',
                paramList: 'id',
                color: null,
              },
            ],
          });
        });
      });

    const response = {
      data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/wpsPayment/private/viewWpsEnquiry',
  (req, res) => {
    const scrId = req.body.dataMap.scrId;
    const edrId = req.body.dataMap.edrId;

    const filters = [{ name: 'id', value: scrId }];
    const dataXlFile = './dummyServer/json/payments/transactions/wpsPayment/data.xlsx';

    let scrData = getViewData(dataXlFile, filters);

    if (scrData.initiateType == 'upload') {
      const workbook = XLSX.readFile(scrData.filePath);
      const id = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1'])[0].id;

      const fileDataFilters = [{ name: 'id', value: id }];

      scrData = { ...scrData, ...getViewData(scrData.filePath, fileDataFilters) };
    }

    let edrData = scrData.edrList.find((edr) => edr.id == edrId);

    const response = {
      ...scrData,
      ...edrData,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/wpsPayment/private/getFutureDatedList',
  (req, res) => {
    const data = getFutureDatedData(req).map((record) => {
      return {
        ...record,
        actions: [
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
        ],
      };
    });

    res.json({
      data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

const getFutureDatedData = (req) => {
  var dataFilePath = './dummyServer/json/payments/transactions/wpsPayment/data.xlsx';
  var workbook = XLSX.readFile(dataFilePath);
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

  const data = xlData
    .filter(
      (record) =>
        req.session?.userDetails?.loginPreferenceDetails &&
        ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
          record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
          (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
            record.corporateId == req.session?.userDetails?.corporateId)),
    )
    .filter((record) => {
      const toDay = moment(new Date());

      const dueDate = moment(new Date(record.valueDate));

      const dueDays = toDay.diff(dueDate, 'days');

      return dueDays < 0;
    });

  return data;
};

module.exports = router;
