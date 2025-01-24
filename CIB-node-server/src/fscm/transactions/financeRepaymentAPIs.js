let express = require('express');
let moment = require('moment');
let XLSX = require('xlsx');
let _ = require('lodash');
let getAuthorizedListRecords = require('../../listingAPIs').getAuthorizedListRecords;
let router = express.Router();

router.post(
  '/dummyServer/json/fscm/transactions/financeRepayment/private/getDueInvoices',
  (req, res) => {
    console.log('Getting Overdue Invoices for Finance Repayments');

    let workbook = XLSX.readFile('./dummyServer/json/fscm/transactions/invoiceEntry/data.xlsx');
    let allInvoices = XLSX.utils.sheet_to_json(workbook.Sheets['invoiceDetails']);
    let dueDateCriteria = moment().add(1, req.body.dataMap.duration);
    let response = { success: true, data: [], lastRow: 0 };
    _.forEach(allInvoices, function (invoice) {
      if (
        parseFloat(invoice.financeProcessedAmt.toString()) > 0 &&
        moment(invoice.maturityDate, 'DD-MMM-YYYY').isBefore(dueDateCriteria)
      ) {
        invoice.status = moment(invoice.maturityDate, 'DD-MMM-YYYY').isBefore(moment())
          ? 'Overdue'
          : 'Normal';
        invoice.dueInDays = Math.abs(
          moment(invoice.maturityDate, 'DD-MMM-YYYY').diff(moment(), 'days'),
        );
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
            displayName: 'Repay',
            type: 'ICON',
            icon: 'fa-reply',
            methodName: 'singleRePay',
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
  '/dummyServer/json/fscm/transactions/financeRepayment/private/getSearchResultList',
  (req, res) => {
    console.log('Getting Search Result list for Invoice Payment and Apply Finance');

    let response = getAuthorizedListRecords(
      './dummyServer/json/fscm/transactions/invoiceEntry/data.xlsx',
      req.body,
      req.session.userDetails,
    );
    _.forEach(response.data, function (invoice) {
      invoice.amountPaidTillDate = '0.00';
      invoice.status = moment(invoice.maturityDate, 'DD-MMM-YYYY').isBefore(moment())
        ? 'Overdue'
        : 'Normal';
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
          displayName: 'Repay',
          type: 'ICON',
          icon: 'fa-reply',
          methodName: 'singleRePay',
          paramList: 'mstId',
        },
      ];
    });

    res.json(response);
  },
);

module.exports = router;
