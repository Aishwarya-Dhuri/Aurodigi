let express = require('express');
let moment = require('moment');
let XLSX = require('xlsx');
let _ = require('lodash');
let getAuthorizedListRecords = require('../../listingAPIs').getAuthorizedListRecords;
let router = express.Router();

router.post(
  '/dummyServer/json/fscm/transactions/invoicePaymentApplyFinance/private/getDueInvoices',
  (req, res) => {
    console.log('Getting Overdue Invoices for Invoice Payment and Apply Finance');

    let workbook = XLSX.readFile('./dummyServer/json/fscm/transactions/invoiceEntry/data.xlsx');
    let allInvoices = XLSX.utils.sheet_to_json(workbook.Sheets['invoiceDetails']);
    let dueDateCriteria = moment().add(1, req.body.dataMap.duration);
    let response = { success: true, data: [], lastRow: 0 };
    _.forEach(allInvoices, function (invoice) {
      if (moment(invoice.dueDate, 'DD-MMM-YYYY').isBefore(dueDateCriteria)) {
        invoice.status = moment(invoice.dueDate, 'DD-MMM-YYYY').isBefore(moment())
          ? 'Overdue'
          : 'Normal';
        invoice.dueInDays = Math.abs(moment(invoice.dueDate, 'DD-MMM-YYYY').diff(moment(), 'days'));
        invoice.actions = [
          {
            index: 1,
            displayName: 'View',
            type: 'ICON',
            icon: 'fa-eye',
            methodName: 'viewInvoice',
            paramList: 'mstId',
          },
          {
            index: 2,
            displayName: 'PAY NOW',
            type: 'BUTTON',
            class: 'aps-button-primary',
            methodName: 'singlePayNow',
            paramList: 'mstId',
          },
          {
            index: 3,
            displayName: 'FINANCE',
            type: 'BUTTON',
            class: 'aps-button-tertiary',
            methodName: 'singleApplyFinance',
            paramList: 'mstId',
          },
        ];
        response.data.push(invoice);
      }
    });
    response.lastRow = response.data.length;
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/fscm/transactions/invoicePaymentApplyFinance/private/getSearchResultList',
  (req, res) => {
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
    console.log('Getting Search Result list for Invoice Payment and Apply Finance');

    let response = getAuthorizedListRecords(
      './dummyServer/json/fscm/transactions/invoiceEntry/data.xlsx',
      defaultReqModel,
      req.body,
      req.session.userDetails,
    );
    _.forEach(response.data, function (row) {
      row.amountPaidTillDate = '0.00';
      row.status = moment(row.dueDate, 'DD-MMM-YYYY').isBefore(moment()) ? 'Overdue' : 'Normal';
      row.actions = [
        {
          index: 1,
          displayName: 'View',
          type: 'ICON',
          icon: 'fa-eye',
          methodName: 'viewInvoice',
          paramList: 'mstId',
        },
        {
          index: 2,
          displayName: 'PAY NOW',
          type: 'BUTTON',
          class: 'p-button-text p-button-sm',
          methodName: 'singlePayNow',
          paramList: 'mstId',
        },
        {
          index: 3,
          displayName: 'FINANCE',
          type: 'BUTTON',
          class: 'p-button-text p-button-sm',
          methodName: 'singleApplyFinance',
          paramList: 'mstId',
        },
      ];
    });

    res.json(response);
  },
);

module.exports = router;