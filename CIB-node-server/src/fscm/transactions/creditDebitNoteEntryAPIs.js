var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
const { getViewData } = require('../../crudAPIs');

const addDataToExcel = require('../../crudAPIs').addRecordInExcel;
const deleteRecordInExcel = require('../../crudAPIs').deleteRecordInExcel;
const generateAuthorizeSheetData = require('../../crudAPIs').generateAuthorizeSheetData;
const updateWorkbook = require('../../crudAPIs').updateWorkbook;

var router = express.Router();

router.post(
  '/dummyServer/json/fscm/transactions/creditDebitNoteEntry/private/getAcceptedInvoices',
  (req, res) => {
    var dataXlFile = './dummyServer/json/fscm/transactions/invoiceAcceptance/data.xlsx';
    var dataWorkbook = XLSX.readFile(dataXlFile);

    const creditDebitNotes = XLSX.utils.sheet_to_json(dataWorkbook.Sheets['Sheet1']);
    const data = creditDebitNotes.filter((d) => {
      return (
        d.sponsorCode == req.body.dataMap.sponsorCode &&
        d.sellerBuyerCode == req.body.dataMap.sellerBuyerCode
      );
    });

    res.send({
      data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/creditDebitNoteEntry/private/authorize',
  (req, res) => {
    var dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
    var existingWb = XLSX.readFile(dataXlFile);

    var sheets = generateAuthorizeSheetData(req.session.userDetails, req.body.dataMap, existingWb);
    updateWorkbook(existingWb, sheets, dataXlFile);

    let filters = [];

    filters.push({ name: 'id', value: req.body.dataMap.ids[0] });

    const data = getViewData(
      './dummyServer/json/fscm/transactions/creditDebitNoteEntry/data.xlsx',
      filters,
    );

    delete data.id;

    addDataToExcel(
      './dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/authorizedCreditDebitNoteData.xlsx',
      data,
      req.session.userDetails,
    );

    res.json({ responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
  },
);

module.exports = router;
