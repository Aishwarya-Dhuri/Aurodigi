var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
const { getViewData } = require('../../crudAPIs');

const addDataToExcel = require('../../crudAPIs').addRecordInExcel;
const deleteRecordInExcel = require('../../crudAPIs').deleteRecordInExcel;
const generateAuthorizeSheetData = require('../../crudAPIs').generateAuthorizeSheetData;
const updateWorkbook = require('../../crudAPIs').updateWorkbook;

var router = express.Router();

const getInvoiceEntryData = (sheetName) => {
  var dataXlFile = './dummyServer/json/fscm/transactions/invoiceEntry/invoiceEntryData.xlsx';
  var dataWorkbook = XLSX.readFile(dataXlFile);

  return XLSX.utils.sheet_to_json(dataWorkbook.Sheets[sheetName]);
};

const getData = (dataXlFile) => {
  var dataXlFile1 = './dummyServer/json/fscm/transactions/invoiceEntry/invoiceEntryData.xlsx';
  var dataWorkbook = XLSX.readFile(dataXlFile ? dataXlFile : dataXlFile1);

  return XLSX.utils.sheet_to_json(dataWorkbook.Sheets['Sheet1']);
};

router.post(
  '/dummyServer/json/fscm/transactions/invoiceEntry/private/getSponsorData',
  (req, res) => {
    const data = getInvoiceEntryData('sponsorData').map((d) => {
      return {
        ...d,
      };
    });

    res.send({
      data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/invoiceEntry/private/getSellerBuyerData',
  (req, res) => {
    const data = getInvoiceEntryData('sellerBuyerData')
      .filter((d) => {
        if (req.body.dataMap && req.body.dataMap.sponsorCode) {
          return d.sponsorCode == req.body.dataMap.sponsorCode;
        }
        return true;
      })
      .map((d) => {
        return {
          ...d,
        };
      });

    res.send({
      data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/invoiceEntry/private/getEntitySubCodeData',
  (req, res) => {
    const data = getInvoiceEntryData('entitySubData')
      .filter((d) => {
        if (req.body.dataMap && req.body.dataMap.sellerBuyerCode) {
          return d.sellerBuyerCode == req.body.dataMap.sellerBuyerCode;
        }
        return true;
      })
      .map((d) => {
        return {
          ...d,
        };
      });

    res.send({
      data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/invoiceEntry/private/getProductCategory',
  (req, res) => {
    const dataList = getInvoiceEntryData('productCategory')
      .filter((d) => d.sellerBuyerCode == req.body.dataMap.sellerBuyerCode)
      .map((d) => {
        return {
          id: d.productCategory,
          displayName: d.productCategory,
          enrichments: { ...d },
        };
      });

    res.send({
      dataList,
      lastRow: dataList.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/invoiceEntry/private/getProgramReferenceNumber',
  (req, res) => {
    const dataList = getInvoiceEntryData('programReferenceNumber')
      .filter((d) => {
        return (
          d.sellerBuyerCode == req.body.dataMap.sellerBuyerCode &&
          d.productCategory == req.body.dataMap.productCategory
        );
      })
      .map((d) => {
        return {
          id: d.programRefNo,
          displayName: d.programRefNo,
          enrichments: { ...d },
        };
      });

    res.send({
      dataList,
      lastRow: dataList.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/invoiceEntry/private/getPurchaseOrderList',
  (req, res) => {
    var dataXlFile = './dummyServer/json/fscm/transactions/poEntry/data.xlsx';

    const dataList = getData(dataXlFile).map((d) => {
      return {
        id: d.poNumber,
        displayName: d.poNumber,
        enrichments: { ...d },
      };
    });

    res.send({
      dataList,
      lastRow: dataList.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post('/dummyServer/json/fscm/transactions/invoiceEntry/private/authorize', (req, res) => {
  var dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  var existingWb = XLSX.readFile(dataXlFile);

  var sheets = generateAuthorizeSheetData(req.session.userDetails, req.body.dataMap, existingWb);
  updateWorkbook(existingWb, sheets, dataXlFile);

  let filters = [];

  filters.push({ name: 'id', value: req.body.dataMap.ids[0] });

  const data = getViewData('./dummyServer/json/fscm/transactions/invoiceEntry/data.xlsx', filters);

  delete data.id;

  addDataToExcel(
    './dummyServer/json/fscm/transactions/invoiceAcceptance/authorizedInvoiceData.xlsx',
    data,
    req.session.userDetails,
  );

  res.json({ responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
});

module.exports = router;
