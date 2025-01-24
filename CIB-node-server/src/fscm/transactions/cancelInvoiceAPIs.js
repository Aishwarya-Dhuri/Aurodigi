var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
const { getViewData } = require('../../crudAPIs');

const addDataToExcel = require('../../crudAPIs').addRecordInExcel;
const deleteRecordInExcel = require('../../crudAPIs').deleteRecordInExcel;

var router = express.Router();

const getData = () => {
  var dataXlFile =
    './dummyServer/json/fscm/transactions/cancelInvoice/authorizedAcceptedInvoiceData.xlsx';
  var dataWorkbook = XLSX.readFile(dataXlFile);

  return XLSX.utils.sheet_to_json(dataWorkbook.Sheets['Sheet1']);
};

router.post(
  '/dummyServer/json/fscm/transactions/cancelInvoice/private/getAuthorizedAcceptedInvoice',
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

    const data = getViewData(dataXlFile, filters);

    res.json({ ...data, responseStatus: { message: '', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/cancelInvoice/private/getThisWeekInvoices',
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
              index: 6,
              displayName: 'Cancel Invoice',
              type: 'ICON',
              icon: 'fas fa-times',
              url: '',
              methodName: 'onCancelInvoice',
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
  '/dummyServer/json/fscm/transactions/cancelInvoice/private/getThisMonthInvoices',
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
              index: 6,
              displayName: 'Cancel Invoice',
              type: 'ICON',
              icon: 'fas fa-times',
              url: '',
              methodName: 'onCancelInvoice',
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
  '/dummyServer/json/fscm/transactions/cancelInvoice/private/getThisYearInvoices',
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
              index: 6,
              displayName: 'Cancel Invoice',
              type: 'ICON',
              icon: 'fas fa-times',
              url: '',
              methodName: 'onCancelInvoice',
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
  '/dummyServer/json/fscm/transactions/cancelInvoice/private/getSearchedInvoices',
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
              index: 6,
              displayName: 'Cancel Invoice',
              type: 'ICON',
              icon: 'fas fa-times',
              url: '',
              methodName: 'onCancelInvoice',
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
  '/dummyServer/json/fscm/transactions/cancelInvoice/private/cancelInvoices',
  (req, res) => {
    const dataXlFile = './dummyServer/json/fscm/transactions/cancelInvoice/data.xlsx';
    const invoiceXlFile =
      './dummyServer/json/fscm/transactions/cancelInvoice/authorizedAcceptedInvoiceData.xlsx';

    req.body.dataMap.data.forEach((data) => {
      const filters = [];
      filters.push({ name: 'id', value: data.id });

      const invoice = getViewData(invoiceXlFile, filters);

      const newData = {
        ...invoice,
        invoiceStatus: 'Cancelled',
        remark: req.body.dataMap.remark,
      };

      addDataToExcel(dataXlFile, newData, req.session.userDetails);

      deleteRecordInExcel(invoiceXlFile, data.id);
    });

    res.send({ responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

module.exports = router;
