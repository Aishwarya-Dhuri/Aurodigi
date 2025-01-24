var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');
const getAllListRecords = require('./../../listingAPIs').getAllListRecords;
const getViewData = require('./../../crudAPIs').getViewData;
const addRecordInExcel = require('./../../crudAPIs').addRecordInExcel;
const deleteRecordInExcel = require('./../../crudAPIs').deleteRecordInExcel;
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Saving Files : ' + file.originalname);
    cb(null, 'dummyServer/uploadedFiles/swiftGpiUpload');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    cb(null, 'sys_' + Date.now() + '_' + name);
  },
});

router.post(
  '/dummyServer/json/accountServices/services/swiftGpi/private/getSearchResultsCount',
  (req, res) => {
    const dataXlFile = './dummyServer/json/accountServices/services/swiftGpi/manualSearchData.xlsx';
    const workbook = XLSX.readFile(dataXlFile);
    var dataList = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    res.json({
      listType: {
        code: 'SEARCHBY',
        displayName: 'Search By',
        count: dataList.length,
        colDefUrl: 'accountServices/services/swiftGpi/private/getSearchByColumnDefs',
        colDefReq: {},
        rowDataUrl: 'accountServices/services/swiftGpi/private/getSearchResults',
        rowDataReq: {},
        isRemovable: true,
      },
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/accountServices/services/swiftGpi/private/getSearchResults',
  (req, res) => {
    const dataXlFile = './dummyServer/json/accountServices/services/swiftGpi/manualSearchData.xlsx';
    const workbook = XLSX.readFile(dataXlFile);
    var dataList = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    dataList.forEach((row) => {
      row.actions = [
        {
          index: 1,
          displayName: 'View',
          type: 'ICON',
          icon: 'fa-eye',
          methodName: 'manualSearchView',
          paramList: 'id',
          color: null,
        },
        {
          index: 2,
          displayName: 'Dataflow',
          type: 'ICON',
          icon: 'fa-chart-network',
          methodName: 'swiftGpiDataFlow',
          paramList: 'id',
          color: null,
        },
        {
          index: 3,
          displayName: 'Refresh',
          type: 'ICON',
          icon: 'fa-sync-alt',
          methodName: 'refresh',
          paramList: 'id',
          color: null,
        },
      ];
    });

    res.json({ dataList, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/accountServices/services/swiftGpi/private/getManualSearchList',
  (req, res) => {
    const dataXlFile = './dummyServer/json/accountServices/services/swiftGpi/manualSearchData.xlsx';
    const workbook = XLSX.readFile(dataXlFile);
    var dataList = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    dataList.forEach((row) => {
      row.actions = [
        {
          index: 1,
          displayName: 'View',
          type: 'ICON',
          icon: 'fa-eye',
          methodName: 'manualSearchView',
          paramList: 'id',
          color: null,
        },
        {
          index: 2,
          displayName: 'Dataflow',
          type: 'ICON',
          icon: 'fa-chart-network',
          methodName: 'swiftGpiDataFlow',
          paramList: 'id',
          color: null,
        },
        {
          index: 3,
          displayName: 'Refresh',
          type: 'ICON',
          icon: 'fa-sync-alt',
          methodName: 'refresh',
          paramList: 'id',
          color: null,
        },
      ];
    });

    res.json({ dataList, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/accountServices/services/swiftGpi/private/getUploadedSearchList',
  (req, res) => {
    const dataXlFile =
      './dummyServer/json/accountServices/services/swiftGpi/uploadedSearchData.xlsx';
    const workbook = XLSX.readFile(dataXlFile);
    var dataList = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
    dataList.forEach((row) => {
      if (row.uploadStatus != 'Processing') {
        row.actions = [
          {
            index: 1,
            displayName: 'View',
            type: 'ICON',
            icon: 'fa-eye',
            methodName: 'uploadSearchView',
            paramList: 'id,uploadedFileName,uploadDate,channel,uploadedBy',
            color: null,
          },
        ];
        if (row.uploadStatus == 'Success') {
          row.actions.push(
            {
              index: 2,
              displayName: 'Download',
              type: 'ICON',
              icon: 'fa-download',
              methodName: 'download',
              paramList: 'filePath',
              color: null,
            },
            {
              index: 3,
              displayName: 'Refresh',
              type: 'ICON',
              icon: 'fa-sync-alt',
              methodName: 'refresh',
              paramList: 'id',
              color: null,
            },
          );
        } else {
          row.actions.push(
            {
              index: 3,
              displayName: 'Error',
              type: 'ICON',
              icon: 'fa-exclamation-triangle',
              methodName: 'error',
              paramList: 'id',
              color: null,
            },
            {
              index: 4,
              displayName: 'Delete',
              type: 'ICON',
              icon: 'fa-trash-alt',
              methodName: 'delete',
              paramList: 'id',
              color: null,
            },
          );
        }
      }
    });

    res.json({ dataList, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/accountServices/services/swiftGpi/private/manualSearchView',
  (req, res) => {
    const dataXlFile = './dummyServer/json/accountServices/services/swiftGpi/manualSearchData.xlsx';
    var filters = [];
    filters.push({ name: 'id', value: req.body.dataMap.id });

    const viewData = getViewData(dataXlFile, filters);

    res.json({ ...viewData, responseStatus: { message: '', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/accountServices/services/swiftGpi/private/uploadedSearchView',
  (req, res) => {
    const dataXlFile =
      './dummyServer/json/accountServices/services/swiftGpi/uploadedSearchResultData.xlsx';
    var filters = [];
    filters.push({ name: 'id', value: req.body.dataMap.id });

    const viewData = getViewData(dataXlFile, filters);

    res.json({ ...viewData, responseStatus: { message: '', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/accountServices/services/swiftGpi/private/getUploadedSearchResult',
  (req, res) => {
    const dataXlFile =
      './dummyServer/json/accountServices/services/swiftGpi/uploadedSearchResultData.xlsx';
    const workbook = XLSX.readFile(dataXlFile);
    var dataList = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
    dataList.forEach((row) => {
      row.actions = [
        {
          index: 1,
          displayName: 'View',
          type: 'ICON',
          icon: 'fa-eye',
          methodName: 'uploadedSearchView',
          paramList: 'id',
          color: null,
        },
        {
          index: 2,
          displayName: 'Dataflow',
          type: 'ICON',
          icon: 'fa-chart-network',
          methodName: 'dataflow',
          paramList: 'id',
          color: null,
        },
      ];
    });

    res.json({ dataList, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post('/dummyServer/json/accountServices/services/swiftGpi/private/delete', (req, res) => {
  let dataXlFile =
    '.' + req.url.substring(0, req.url.indexOf('private')) + 'uploadedSearchData.xlsx';
  deleteRecordInExcel(dataXlFile, req.body.dataMap.id);

  res.json({ responseStatus: { message: 'MSG_KEY_DELETION_SUCCESSFUL', status: '0' } });
});

router.post(
  '/dummyServer/json/accountServices/services/swiftGpi/private/create',
  multer({ storage: storage }).single('uploadFile'),
  (req, res) => {
    const file = req.file;

    req.body.filePath = './' + file.path;
    req.body.fileFormat = file.type;
    req.body.uploadedFileName = file.filename;

    const workbook = XLSX.readFile(req.body.filePath);
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    req.body.noOfTransactions = xlData.length;
    req.body.uploadDate = new Date().toDateString();
    req.body.uploadedBy = req.session.userDetails.userName;
    req.body.uploadStatus = 'Processing';
    req.body.channel = 'CHANNEL';

    req.body.corporateReference = req.session.userDetails.corporateCode;
    req.body.corporateCode = req.session.userDetails.corporateCode;
    req.body.corporateName = req.session.userDetails.corporateName;

    const dataXlFile =
      './dummyServer/json/accountServices/services/swiftGpi/uploadedSearchData.xlsx';

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
  '/dummyServer/json/accountServices/services/swiftGpi/private/getAllCount',
  (req, res) => {
    var workbook = XLSX.readFile(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'listingTypes.xlsx',
    );

    var response = {};
    response.dataList = XLSX.utils.sheet_to_json(workbook.Sheets['listingTypes']);
    const defaultReqModel = {
      startRow: 0,
      endRow: 10000,
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
      if (list.rowDataUrl == 'getManualSearchList') {
        list.count = getAllListRecords(
          './dummyServer/json/accountServices/services/swiftGpi/manualSearchData.xlsx',
          defaultReqModel,
          req.session.userDetails,
        ).lastRow;
      } else if (list.rowDataUrl == 'getUploadedSearchList') {
        list.count = getAllListRecords(
          './dummyServer/json/accountServices/services/swiftGpi/uploadedSearchData.xlsx',
          defaultReqModel,
          req.session.userDetails,
        ).lastRow;
      }
    });
    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
    res.json(response);
  },
);

module.exports = router;
