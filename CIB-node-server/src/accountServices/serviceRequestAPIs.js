const express = require('express');
const XLSX = require('xlsx');
const _ = require('lodash');

const getViewData = require('./../crudAPIs').getViewData;
const getActiveListRecords = require('./../listingAPIs').getActiveListRecords;
const getPendingListRecords = require('./../listingAPIs').getPendingListRecords;
const getAuthorizedListRecords = require('./../listingAPIs').getAuthorizedListRecords;
const getRejectedListRecords = require('./../listingAPIs').getRejectedListRecords;
const getAllListRecords = require('./../listingAPIs').getAllListRecords;
const getDraftListRecords = require('./../listingAPIs').getDraftListRecords;

const router = express.Router();

const xlFilePath = './dummyServer/json/accountServices/services/serviceRequest/data.xlsx';
const draftXlFilePath = './dummyServer/json/accountServices/services/serviceRequest/draftData.xlsx';
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

router.post(
  '/dummyServer/json/accountServices/services/serviceRequest/private/getAuthorizedList',
  (req, res) => {
    const response = getAuthorizedListRecords(xlFilePath, defaultReqModel, req.session.userDetails);

    response.data = response.data.map((record) => {
      record.actions = [
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
      ];
      return record;
    });

    res.send(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/serviceRequest/private/getServiceRequestDashboardData',
  (req, res) => {
    const allData = getAllListRecords(xlFilePath, defaultReqModel, req.session.userDetails);
    const pendingData = getPendingListRecords(xlFilePath, defaultReqModel, req.session.userDetails);
    const authorizedData = getAuthorizedListRecords(
      xlFilePath,
      defaultReqModel,
      req.session.userDetails,
    );
    const rejectedData = getRejectedListRecords(
      xlFilePath,
      defaultReqModel,
      req.session.userDetails,
    );
    const inProgressData = getInProgressList(req);
    const closedData = getClosedList(req);
    const draftData = getDraftListRecords(
      draftXlFilePath,
      defaultReqModel,
      req.session.userDetails,
    );

    const data = {
      totalServiceRequest: allData.lastRow + draftData.lastRow,
      listingTypes: [
        {
          id: 'all',
          label: 'All',
          colDefUrl: 'accountServices/services/serviceRequest/private/dashboardListingColDefs',
          rowDataUrl: 'accountServices/services/serviceRequest/private/getAllList',
          count: allData.lastRow,
        },
        {
          id: 'pendingAuthorization',
          label: 'Pending Authorization',
          colDefUrl: 'accountServices/services/serviceRequest/private/dashboardListingColDefs',
          rowDataUrl: 'accountServices/services/serviceRequest/private/getPendingList',
          count: pendingData.lastRow,
        },
        {
          id: 'authorized',
          label: 'Authorized',
          colDefUrl: 'accountServices/services/serviceRequest/private/dashboardListingColDefs',
          rowDataUrl: 'accountServices/services/serviceRequest/private/getAuthorizedList',
          count: authorizedData.lastRow,
        },
        {
          id: 'authorizerRejected',
          label: 'Authorizer Rejected',
          colDefUrl: 'accountServices/services/serviceRequest/private/dashboardListingColDefs',
          rowDataUrl: 'accountServices/services/serviceRequest/private/getRejectedList',
          count: rejectedData.lastRow,
        },
        {
          id: 'bankRejected',
          label: 'Bank Rejected',
          colDefUrl: 'accountServices/services/serviceRequest/private/dashboardListingColDefs',
          rowDataUrl: 'accountServices/services/serviceRequest/private/getRejectedList',
          count: rejectedData.lastRow,
        },
        {
          id: 'inProgress',
          label: 'In Progress',
          colDefUrl: 'accountServices/services/serviceRequest/private/dashboardListingColDefs',
          rowDataUrl: 'accountServices/services/serviceRequest/private/getInProgressList',
          count: inProgressData.lastRow,
        },
        {
          id: 'closed',
          label: 'Closed',
          colDefUrl: 'accountServices/services/serviceRequest/private/dashboardListingColDefs',
          rowDataUrl: 'accountServices/services/serviceRequest/private/getClosedList',
          count: closedData.lastRow,
        },
        {
          id: 'draft',
          label: 'Draft',
          colDefUrl: 'accountServices/services/serviceRequest/private/dashboardListingColDefs',
          rowDataUrl: 'accountServices/services/serviceRequest/private/getDraftList',
          count: draftData.lastRow,
        },
      ],
    };

    res.send({ data, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/accountServices/services/serviceRequest/private/getInProgressList',
  (req, res) => {
    res.send(getInProgressList(req));
  },
);

const getInProgressList = (req) => {
  const srData = getPendingListRecords(xlFilePath, defaultReqModel, req.session.userDetails);

  srData.data = srData.data
    .filter((record) => record.status == 'closed')
    .map((record) => {
      record['actions'] = [
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
      ];
      return record;
    });

  return srData;
};

router.post(
  '/dummyServer/json/accountServices/services/serviceRequest/private/getClosedList',
  (req, res) => {
    res.send(getClosedList(req));
  },
);

const getClosedList = (req) => {
  const srData = getRejectedListRecords(xlFilePath, defaultReqModel, req.session.userDetails);

  srData.data = srData.data
    .filter((record) => record.status == 'closed')
    .map((record) => {
      record['actions'] = [
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
      ];
      return record;
    });

  return srData;
};

router.post(
  '/dummyServer/json/accountServices/services/serviceRequest/private/getSrClasses',
  (req, res) => {
    const filePath = './dummyServer/json/sr/srClassesData.xlsx';
    const workbook = XLSX.readFile(filePath);
    const dataList = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']).map((record) => {
      return {
        id: record.id,
        displayName: record.displayName,
        enrichments: [],
      };
    });

    res.send({
      dataList: dataList,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/accountServices/services/serviceRequest/private/getSrTypes',
  (req, res) => {
    const filePath = './dummyServer/json/sr/srClassesData.xlsx';
    const workbook = XLSX.readFile(filePath);
    const dataList = XLSX.utils
      .sheet_to_json(workbook.Sheets['srType'])
      .filter((record) => {
        return record.parentSrClass == req.body.dataMap.srClass;
      })
      .map((record) => {
        return {
          id: record.id,
          displayName: record.displayName,
          enrichments: [],
        };
      });

    res.send({
      dataList: dataList,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

router.post(
  '/dummyServer/json/accountServices/services/serviceRequest/private/getSrSubTypes',
  (req, res) => {
    const filePath = './dummyServer/json/sr/srClassesData.xlsx';
    const workbook = XLSX.readFile(filePath);
    const dataList = XLSX.utils
      .sheet_to_json(workbook.Sheets['srSubType'])
      .filter((record) => {
        return (
          record.parentSrClass == req.body.dataMap.srClass &&
          record.parentSrType == req.body.dataMap.srType
        );
      })
      .map((record) => {
        return {
          id: record.id,
          displayName: record.displayName,
          enrichments: [],
        };
      });

    res.send({
      dataList: dataList,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

module.exports = router;
