var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
const { getViewData } = require('../../crudAPIs');

const addDataToExcel = require('../../crudAPIs').addRecordInExcel;
const deleteRecordInExcel = require('../../crudAPIs').deleteRecordInExcel;
const generateAuthorizeSheetData = require('../../crudAPIs').generateAuthorizeSheetData;
const updateWorkbook = require('../../crudAPIs').updateWorkbook;

var router = express.Router();

const getData = () => {
  var dataXlFile =
    './dummyServer/json/fscm/transactions/invoiceAcceptance/authorizedInvoiceData.xlsx';
  var dataWorkbook = XLSX.readFile(dataXlFile);

  return XLSX.utils.sheet_to_json(dataWorkbook.Sheets['Sheet1']);
};

router.post(
  '/dummyServer/json/fscm/transactions/invoiceAcceptance/private/getAuthorizedInvoice',
  (req, res) => {
    const dataXlFile =
      './dummyServer/json/fscm/transactions/invoiceAcceptance/authorizedInvoiceData.xlsx';

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
  '/dummyServer/json/fscm/transactions/invoiceAcceptance/private/getAcceptedInvoices',
  (req, res) => {
    var dataXlFile = './dummyServer/json/fscm/transactions/invoiceAcceptance/data.xlsx';
    var dataWorkbook = XLSX.readFile(dataXlFile);

    const invoices = XLSX.utils.sheet_to_json(dataWorkbook.Sheets['Sheet1']);

    const data = invoices.filter((d) => {
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
  '/dummyServer/json/fscm/transactions/invoiceAcceptance/private/getRecentInvoices',
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
              methodName: 'onAcceptInvoice',
              paramList: 'id',
              color: 'primary',
            },
            {
              index: 6,
              displayName: 'Reject',
              type: 'ICON',
              icon: 'fas fa-times',
              url: '',
              methodName: 'onRejectInvoice',
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
  '/dummyServer/json/fscm/transactions/invoiceAcceptance/private/getNearDueInvoices',
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
              methodName: 'onAcceptInvoice',
              paramList: 'id',
              color: 'primary',
            },
            {
              index: 6,
              displayName: 'Reject',
              type: 'ICON',
              icon: 'fas fa-times',
              url: '',
              methodName: 'onRejectInvoice',
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
  '/dummyServer/json/fscm/transactions/invoiceAcceptance/private/getSearchedInvoices',
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
              methodName: 'onAcceptInvoice',
              paramList: 'id',
              color: 'primary',
            },
            {
              index: 6,
              displayName: 'Reject',
              type: 'ICON',
              icon: 'fas fa-times',
              url: '',
              methodName: 'onRejectInvoice',
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
  '/dummyServer/json/fscm/transactions/invoiceAcceptance/private/acceptInvoices',
  (req, res) => {
    const dataXlFile = './dummyServer/json/fscm/transactions/invoiceAcceptance/data.xlsx';
    const invoiceXlFile =
      './dummyServer/json/fscm/transactions/invoiceAcceptance/authorizedInvoiceData.xlsx';

    req.body.dataMap.data.forEach((data) => {
      const filters = [];
      filters.push({ name: 'id', value: data.id });

      const invoice = getViewData(invoiceXlFile, filters);

      const newData = {
        ...invoice,
        invoiceStatus: 'Accepted',
        remark: req.body.dataMap.remark,
      };

      addDataToExcel(dataXlFile, newData, req.session.userDetails);

      deleteRecordInExcel(invoiceXlFile, data.id);
    });

    res.send({ responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/invoiceAcceptance/private/rejectInvoices',
  (req, res) => {
    const dataXlFile = './dummyServer/json/fscm/transactions/invoiceAcceptance/data.xlsx';
    const invoiceXlFile =
      './dummyServer/json/fscm/transactions/invoiceAcceptance/authorizedInvoiceData.xlsx';

    req.body.dataMap.data.forEach((data) => {
      const filters = [];
      filters.push({ name: 'id', value: data.id });

      const invoice = getViewData(invoiceXlFile, filters);
      console.log(filters[0], invoice);

      const newData = {
        ...invoice,
        invoiceStatus: 'Rejected',
        remark: req.body.dataMap.remark,
      };

      addDataToExcel(dataXlFile, newData, req.session.userDetails);

      deleteRecordInExcel(invoiceXlFile, data.id);
    });

    res.send({ responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/invoiceAcceptance/private/authorize',
  (req, res) => {
    var dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
    var existingWb = XLSX.readFile(dataXlFile);

    var sheets = generateAuthorizeSheetData(req.session.userDetails, req.body.dataMap, existingWb);
    updateWorkbook(existingWb, sheets, dataXlFile);

    let filters = [];

    filters.push({ name: 'id', value: req.body.dataMap.ids[0] });

    const data = getViewData(
      './dummyServer/json/fscm/transactions/invoiceAcceptance/data.xlsx',
      filters,
    );

    if (data.invoiceStatus == 'Accepted') {
      delete data.id;

      addDataToExcel(
        './dummyServer/json/fscm/transactions/cancelInvoice/authorizedAcceptedInvoiceData.xlsx',
        data,
        req.session.userDetails,
      );
    }

    res.json({ responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
  },
);

module.exports = router;
