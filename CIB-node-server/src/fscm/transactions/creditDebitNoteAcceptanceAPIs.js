var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
const { getViewData } = require('../../crudAPIs');

const addDataToExcel = require('../../crudAPIs').addRecordInExcel;
const deleteRecordInExcel = require('../../crudAPIs').deleteRecordInExcel;
const generateAuthorizeSheetData = require('../../crudAPIs').generateAuthorizeSheetData;
let getAuthorizedListRecords = require('../../listingAPIs').getAuthorizedListRecords;
const updateWorkbook = require('../../crudAPIs').updateWorkbook;

var router = express.Router();

const getData = () => {
  var dataXlFile =
    './dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/authorizedCreditDebitNoteData.xlsx';
  var dataWorkbook = XLSX.readFile(dataXlFile);

  return XLSX.utils.sheet_to_json(dataWorkbook.Sheets['Sheet1']);
};

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
  '/dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/private/getCreditDebitNoteData',
  (req, res) => {
    const dataXlFile =
      './dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/authorizedCreditDebitNoteData.xlsx';

    let filters = [];
    if (req.body.dataMap && req.body.dataMap.filters) {
      filters = req.body.dataMap.filters;
    } else if (req.body.filters) {
      filters = req.body.filters;
    }
    if (req.body.dataMap && req.body.dataMap.id) {
      filters.push({ name: 'id', value: req.body.dataMap.id });
    }

    res.json({ ...getViewData(dataXlFile, filters), responseStatus: { message: '', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/private/getCreditNotes',
  (req, res) => {
    const dataXlFile = './dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/data.xlsx';

    const dataList = [];
    getAuthorizedListRecords(dataXlFile, defaultReqModel, req.session.userDetails)
      .data.filter((record) => record.creditNoteOrDebitNote == 'Credit Note')
      .filter((record) => {
        if (req.body && req.body.dataMap && req.body.dataMap.invoiceNumber) {
          return record.invoiceNumber == req.body.dataMap.invoiceNumber;
        }
        return true;
      })
      .forEach((record) => {
        dataList.push({
          id: record.id,
          refNo: record.creditDebitNoteReferenceNumber,
          amount: +record.creditDebitNoteAmount,
          vatAmount: 0.0,
          outstandingAmount: +record.creditDebitNoteAmount,
          whtAmount: 0.0,
          netApplicableAmount: +record.creditDebitNoteAmount,
        });
      });

    res.json({
      data: dataList,
      lastRow: dataList.length,
      responseStatus: { message: '', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/private/getDebitNotes',
  (req, res) => {
    const dataXlFile = './dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/data.xlsx';

    const dataList = [];
    getAuthorizedListRecords(dataXlFile, defaultReqModel, req.session.userDetails)
      .data.filter((record) => record.creditNoteOrDebitNote == 'Debit Note')
      .filter((record) => {
        if (req.body && req.body.dataMap && req.body.dataMap.invoiceNumber) {
          return record.invoiceNumber == req.body.dataMap.invoiceNumber;
        }
        return true;
      })
      .forEach((record) => {
        dataList.push({
          id: record.id,

          refNo: record.creditDebitNoteReferenceNumber,
          amount: +record.creditDebitNoteAmount,
          vatAmount: 0.0,
          outstandingAmount: +record.creditDebitNoteAmount,
          whtAmount: 0.0,
          netApplicableAmount: +record.creditDebitNoteAmount,
        });
      });

    res.json({
      data: dataList,
      lastRow: dataList.length,
      responseStatus: { message: '', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/private/getRecentCreditDebitNotes',
  (req, res) => {
    const data = getData()
      .filter((d) => {
        return true;
      })
      .map((d) => {
        return {
          ...d,
          actions: [
            {
              index: 1,
              displayName: 'View',
              type: 'ICON',
              icon: 'fas fa-eye',
              url: '',
              methodName: 'onView',
              paramList: 'id',
              color: null,
            },
            {
              index: 2,
              displayName: 'Accept',
              type: 'ICON',
              icon: 'fas fa-check',
              url: '',
              methodName: 'onAcceptCreditDebitNote',
              paramList: 'id',
              color: 'primary',
            },
            {
              index: 6,
              displayName: 'Reject',
              type: 'ICON',
              icon: 'fas fa-times',
              url: '',
              methodName: 'onRejectCreditDebitNote',
              paramList: 'id',
              color: 'warn',
            },
          ],
        };
      });

    res.send({ data, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/private/getNearDueCreditDebitNotes',
  (req, res) => {
    const data = getData()
      .filter((d) => {
        return true;
      })
      .map((d) => {
        return {
          ...d,
          actions: [
            {
              index: 1,
              displayName: 'View',
              type: 'ICON',
              icon: 'fas fa-eye',
              url: '',
              methodName: 'onView',
              paramList: 'id',
              color: null,
            },
            {
              index: 2,
              displayName: 'Accept',
              type: 'ICON',
              icon: 'fas fa-check',
              url: '',
              methodName: 'onAcceptCreditDebitNote',
              paramList: 'id',
              color: 'primary',
            },
            {
              index: 6,
              displayName: 'Reject',
              type: 'ICON',
              icon: 'fas fa-times',
              url: '',
              methodName: 'onRejectCreditDebitNote',
              paramList: 'id',
              color: 'warn',
            },
          ],
        };
      });

    res.send({ data, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/private/getSearchedCreditDebitNotes',
  (req, res) => {
    const data = getData()
      .filter((d) => {
        return true;
      })
      .map((d) => {
        return {
          ...d,
          actions: [
            {
              index: 1,
              displayName: 'View',
              type: 'ICON',
              icon: 'fas fa-eye',
              url: '',
              methodName: 'onView',
              paramList: 'id',
              color: null,
            },
            {
              index: 2,
              displayName: 'Accept',
              type: 'ICON',
              icon: 'fas fa-check',
              url: '',
              methodName: 'onAcceptCreditDebitNote',
              paramList: 'id',
              color: 'primary',
            },
            {
              index: 6,
              displayName: 'Reject',
              type: 'ICON',
              icon: 'fas fa-times',
              url: '',
              methodName: 'onRejectCreditDebitNote',
              paramList: 'id',
              color: 'warn',
            },
          ],
        };
      });

    res.send({ data, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/private/acceptCreditDebitNotes',
  (req, res) => {
    const dataXlFile = './dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/data.xlsx';
    const creditDebitNoteXlFile =
      './dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/authorizedCreditDebitNoteData.xlsx';

    req.body.dataMap.data.forEach((data) => {
      const filters = [];
      filters.push({ name: 'id', value: data.id });

      const creditDebitNote = getViewData(creditDebitNoteXlFile, filters);

      const newData = {
        ...creditDebitNote,
        creditDebitNoteStatus: 'Accepted',
        remark: req.body.dataMap.remark,
      };

      addDataToExcel(dataXlFile, newData, req.session.userDetails);

      deleteRecordInExcel(creditDebitNoteXlFile, data.id);
    });

    res.send({ responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/private/rejectCreditDebitNotes',
  (req, res) => {
    const dataXlFile = './dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/data.xlsx';
    const creditDebitNoteXlFile =
      './dummyServer/json/fscm/transactions/creditDebitNoteAcceptance/authorizedCreditDebitNoteData.xlsx';

    req.body.dataMap.data.forEach((data) => {
      const filters = [];
      filters.push({ name: 'id', value: data.id });

      const creditDebitNote = getViewData(creditDebitNoteXlFile, filters);

      const newData = {
        ...creditDebitNote,
        creditDebitNoteStatus: 'Rejected',
        remark: req.body.dataMap.remark,
      };

      addDataToExcel(dataXlFile, newData, req.session.userDetails);

      deleteRecordInExcel(creditDebitNoteXlFile, data.id);
    });

    res.send({ responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

module.exports = router;
