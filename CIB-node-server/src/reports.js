var express = require('express');
const fs = require('fs');
var XLSX = require('xlsx');
var _ = require('lodash');
var router = express.Router();
var getViewData = require('./crudAPIs').getViewData;
let getPendingListRecords = require('./listingAPIs').getPendingListRecords;
var getAllListRecords = require('./listingAPIs').getAllListRecords;

router.get('/dummyServer/json/AllTransactionsReportTransaction', function (req, res) {
  res.download('./dummyServer/uploadedFiles/AllTransactionsReportTransaction.xls');
});

//Get Category
router.post('/dummyServer/json/reports/private/getCategoryList', (req, res) => {
  console.log('reading category');
  var dataXlFile = './dummyServer/json/reports/genericFields/reportConfig.xlsx';
  var workbook = XLSX.readFile(dataXlFile);
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['reports']);
  var dataList = [];
  var uniqueCategories = _.uniqBy(xlData, 'reportCategory');
  _.forEach(uniqueCategories, function (record) {
    dataList.push({
      id: record.reportCategory,
      displayName: record.reportCategory,
      enrichments: {},
    });
  });
  res.json({
    dataList: dataList,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

//Get SubCategory By Product & Category
router.post('/dummyServer/json/reports/private/getSubCategoryList', (req, res) => {
  let { productId, category } = req.body.dataMap;
  category = category || req.body.dataMap.categoryId;
  var dataXlFile = './dummyServer/json/reports/genericFields/reportConfig.xlsx';
  var workbook = XLSX.readFile(dataXlFile);
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['reports']);
  var dataList = [];
  var uniqueSubcategories = _.uniqBy(xlData, 'reportSubCategory');
  console.log('productId', productId);
  console.log('subCategoryId', category);
  _.forEach(uniqueSubcategories, function (record) {
    // OR Condititon Because On load subCategories has No Value
    if (
      record.reportSubCategory ||
      (record.cashProProductId == productId && record.reportCategory == category)
    ) {
      dataList.push({
        id: record.reportSubCategory,
        displayName: record.reportSubCategory,
        enrichments: {},
      });
    }
  });
  res.json({
    dataList: dataList,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

//Get Filtered Reports List
router.post('/dummyServer/json/reports/private/getReportsList', (req, res) => {
  let { productId, categoryId, subCategoryId } = req.body.dataMap;
  console.log('Reading Report List');
  var dataXlFile = './dummyServer/json/reports/genericFields/reportConfig.xlsx';
  var workbook = XLSX.readFile(dataXlFile);
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['reports']);
  var dataList = [];
  _.forEach(xlData, function (record) {
    if (record.cashProProductId === productId && record.reportCategory === categoryId) {
      if (subCategoryId && subCategoryId != '') {
        if (record.reportSubCategory === subCategoryId) {
          dataList.push({
            id: record.id,
            displayName: record.reportName,
            enrichments: { reportEntityKey: record.reportEntityKey },
          });
        }
      } else {
        dataList.push({
          id: record.id,
          displayName: record.reportName,
          enrichments: { reportEntityKey: record.reportEntityKey },
        });
      }
    }
  });
  res.json({
    dataList: dataList,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

//Get Generic Fields Data For Report
router.post('/dummyServer/json/reports/private/getAsGenericFieldData', (req, res) => {
  var reportId = req.body.dataMap.reportId;
  console.log('reading generic field data', req.reportId);
  var dataXlFile = './dummyServer/json/reports/genericFields/reportConfig.xlsx';
  var workbook = XLSX.readFile(dataXlFile);
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['reportFields']);

  var dataList = [];
  var filteredData = xlData.filter((res) => res.mstId === reportId && res.columnName != 'HIDDEN');
  dataList = _.sortBy(filteredData);
  res.json({
    dataList: dataList,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

//Get Select Data For Filters
router.post('/dummyServer/json/reports/private/getFilterDataList', (req, res) => {
  var reportId = req.body.dataMap.reportId;
  console.log('reading filter data', reportId);
  var dataXlFile = './dummyServer/json/reports/genericFields/reportConfig.xlsx';
  var workbook = XLSX.readFile(dataXlFile);
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['filterSortingData']);

  var dataList = [];
  var filteredData = xlData.filter((x) => x.mstId === reportId && x.filterKey === 'Y');
  _.forEach(filteredData, function (record) {
    dataList.push({
      id: record.id,
      displayName: record.filterDisplayName,
      enrichments: {},
    });
  });
  res.json({
    dataList: dataList,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

//Get Select Data For Operators
router.post('/dummyServer/json/reports/private/getOperatorDataList', (req, res) => {
  var reportId = req.body.dataMap.reportId;
  console.log('reading operator data', reportId);
  var dataXlFile = './dummyServer/json/reports/genericFields/reportConfig.xlsx';
  var workbook = XLSX.readFile(dataXlFile);
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['filterSortingData']);

  var dataList = [];
  var filteredData = xlData.filter((x) => x.mstId === reportId && x.orderByKey === 'Y');
  _.forEach(filteredData, function (record) {
    dataList.push({
      id: record.id,
      displayName: record.filterDisplayName,
      enrichments: {},
    });
  });
  res.json({
    dataList: dataList,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

//GetFiltered Grid Data By Product And Category For Reports
//( --Commmented as of now for filter data and currently using "getReportList")

// router.post('/dummyServer/json/reports/private/getGridFilteredData', (req, res) => {
//     let { productName, category } = req.body.dataMap
//     console.log('reading report grid data');
//     var dataXlFile = './dummyServer/json/reports/data.xlsx';
//     var workbook = XLSX.readFile(dataXlFile);
//     var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

//     var dataList = [];
//     dataList = xlData.filter(res => res.productName === productName && res.reportCategory === category)
//     res.json({
//         dataList: dataList,
//         responseStatus: { message: '', status: '0' },
//         entityIdentifier: '',
//         loggable: false,
//     });
// });

//Get Report Listing Data
router.post('/dummyServer/json/reports/private/getReportList', (req, res) => {
  console.log('Getting Report List');
  if (req.body.dataMap) {
    req.body = { ...req.body, filterModel: { ...req.body.dataMap.filterModel } };
    delete req.body.dataMap;
  }
  let response = getPendingListRecords(
    './dummyServer/json/reports/data.xlsx',
    req.body,
    req.session.userDetails,
  );
  _.forEach(response.data, function (row) {
    row.actions = [
      {
        index: 1,
        displayName: 'Download',
        type: 'ICON',
        icon: 'fa-download',
        methodName: 'downloadReport',
        paramList: 'id,reportId,reportFileType',
      },
      {
        index: 2,
        displayName: 'View',
        type: 'ICON',
        icon: 'pi pi-eye',
        url: '',
        methodName: 'showOnlineReport',
        paramList: 'id,reportId,reportFileType',
        color: null,
      },
      {
        index: 3,
        displayName: 'Delete',
        type: 'ICON',
        icon: 'pi pi-trash',
        url: 'private/delete',
        methodName: 'delete',
        paramList: 'id',
        color: 'warn',
      },
    ];
  });

  res.json(response);
});

// download reports
router.post('/dummyServer/json/reports/private/downloadReport', (req, res) => {
  console.log('downloading report');
  const filters = [{ name: 'id', value: req.body.dataMap.reportId }];
  const reportConfigData = getViewData(
    './dummyServer/json/reports/genericFields/reportConfig.xlsx',
    filters,
  );
  console.log('reportConfigData :',reportConfigData);
  const fileName = reportConfigData.generateData[0].fileName;
  console.log('File Name: ',fileName);
  //note: below filetype is for making it run
  let fileTypeFinal = req.body.dataMap.fileType;
  console.log("File Type : ", fileTypeFinal);
  if(fileTypeFinal =='' || fileTypeFinal == undefined){
    fileTypeFinal = 'xls';
  }
  // const filePath = 'downloadReport/generatedReports/' + fileName + '.' + req.body.dataMap.fileType;
  const filePath = 'downloadReport/generatedReports/' + fileName + '.' + fileTypeFinal;
  console.log('filePath', filePath);
  console.log('exFile', filePath);
  res.json({
    dataMap: { filePath: filePath },
    responseStatus: { message: 'SUCCESS', status: '0' },
  });
  // res.download(filePath);
});

function readReportFilePath(req) {
  const filters = [{ name: 'id', value: req.body.dataMap.reportId }];
  const reportConfigData = getViewData(
    './dummyServer/json/reports/genericFields/reportConfig.xlsx',
    filters,
  );
  console.log('readReportFilePath reqbody', req.body);
  const fileName = reportConfigData.generateData[0].fileName;
  const filePath =
    './dummyServer/directDownload/reports/generatedReports/' +
    'ONLINE_' +
    fileName +
    '.' +
    req.body.dataMap.fileType; //'.xlsx';
  console.log('filePath', filePath);
  return filePath;
}

//Get Online grid data
router.post('/dummyServer/json/reports/private/getOnlineGridColDef', (req, res) => {
  let filePath = readReportFilePath(req);
  let workbook = XLSX.readFile(filePath);
  let sheet_name_list = workbook.SheetNames;
  const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  let colDef = [];
  if (xlData && xlData.length > 0) {
    const headers = Object.keys(xlData[0]);
    for (const header of headers) {
      colDef.push({
        headerName: header,
        field: header.toString().replace(/ /g, '').toLowerCase(),
        checkboxSelection: false,
        filter: 'true',
        headerCheckboxSelection: false,
        hide: 'false',
        lockVisible: 'false',
        sortable: 'true',
      });
    }
  }
  res.json([...colDef]);
});

router.post('/dummyServer/json/reports/private/getOnlineGridData', (req, res) => {
  let reportData = [];
  console.log('reading online grid data');
  const defaultReqModel = {
    endRow: 10,
    entityName: '',
    filterModel: {},
    groupKeys: [],
    pivotCols: [],
    pivotMode: false,
    rowGroupCols: [],
    sortModel: [],
    startRow: 0,
    valueCols: [],
  };
  const filters = [{ name: 'id', value: req.body.dataMap.reportId }];
  let filePath = readReportFilePath(req);
  let workbook = XLSX.readFile(filePath);
  let sheet_name_list = workbook.SheetNames;
  const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  for (let data of xlData) {
    let tempData = {};
    Object.keys(data).forEach((key) => {
      let convertedKey = key.toString().replace(/ /g, '').toLowerCase();
      tempData[convertedKey] = data[key];
    });
    console.log('tempData', tempData);
    reportData.push(tempData);
  }
  res.json({
    data: reportData,
    lastRow: xlData.length,
    responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
  });
});

module.exports = router;
