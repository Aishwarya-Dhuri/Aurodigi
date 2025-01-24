var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
const moment = require('moment');

const getAuthorizedListRecords = require('./listingAPIs').getAuthorizedListRecords;

var router = express.Router();

router.post(
  '/dummyServer/json/setup/security/mobilityRegistration/private/getMultipleConsumerBills',
  (req, res) => {
    const selectedConsumers = req.body.dataMap.selectedConsumers;

    const bill = {
      consumer: '',
      billNo: 'Bill No ' + new Date().getTime(),
      dueDate: '20 Aug 2021',
      billAmount: '10000',
      amountBeingPaid: '10000',
      paymentDate: '31 Aug 2021',
      selected: false,
      actions: [],
    };

    const selectedConsumersBills = [];

    for (let selectedConsumer of selectedConsumers) {
      const consumerBills = [];

      const n = selectedConsumer.noOfBills;

      for (let i = 0; i < n; i++) {
        consumerBills.push(bill);
      }

      selectedConsumersBills.push({ ...selectedConsumer, bills: consumerBills });
    }

    const response = {};

    response.data = selectedConsumersBills;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/setup/security/mobilityRegistration/getBillerConsumerBills',
  (req, res) => {
    const n = req.body.dataMap.noOfBills;

    const consumerBills = [];

    const bill = {
      consumer: '',
      billNo: 'Bill No ' + new Date().getTime(),
      dueDate: '20 Aug 2021',
      billAmount: '1000',
      amountBeingPaid: '1000',
      paymentDate: '31 Aug 2021',
      selected: false,
      actions: [],
    };

    for (let i = 0; i < n; i++) {
      if (i == n - 1) {
        bill.billAmount = '500';
        bill.amountBeingPaid = '500';
      }

      consumerBills.push(_.cloneDeep({ ...bill }));
    }

    const response = {};

    response.data = consumerBills;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post('payments/transactions/billPayment/private/viewBillPaymentEnquiry', (req, res) => {
  // const dataFilePath = '.payments/transactions/billPayment/payBill/data.xlsx';

  // const workbook = XLSX.readFile(dataFilePath);

  // const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  const response = {};

  response.data = { batchNo: '12345' };

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

router.post(
  '/dummyServer/json/setup/security/mobilityRegistration/getExistingConsumers',
  (req, res) => {
    const dataFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';

    var workbook = XLSX.readFile(dataFilePath);

    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    var response = {};

    const data = excelData.filter(
      (row) =>
        row.category === req.body.dataMap.category &&
        row.billerName === req.body.dataMap.billerName &&
        row.product === req.body.dataMap.product,
    );

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/setup/security/mobilityRegistration/getBillerConsumers',
  (req, res) => {
    const dataFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';

    var workbook = XLSX.readFile(dataFilePath);

    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    var response = {};

    const data = excelData
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.enabled == 'Y' &&
          record.authorized == 'Y',
      )
      .filter(
        (row) =>
          row.category === req.body.dataMap.category &&
          row.billerName === req.body.dataMap.billerName &&
          row.product === req.body.dataMap.product &&
          row.type === req.body.dataMap.type,
      )
      .map((row) => {
        return {
          id: row.id,
          checkbox: '',
          consumer: row.consumer,
          noOfBills: row.noOfBills,
          billNo: `${row.noOfBills} Bills`,
          dueDate: '',
          billAmount: '',
          amountBeingPaid: '',
          paymentDate: '',
          partialSelected: false,
          selected: false,
          actions: [
            {
              index: 0,
              paramList: '',
              methodName: 'fetchBills',
              type: 'BUTTON',
              displayName: 'FETCH',
            },
            {
              index: 1,
              paramList: '',
              methodName: 'raiseDispute',
              type: 'ICON',
              displayName: 'Raise Dispute',
              icon: 'fal  fa-hand-point-up',
            },
            {
              index: 2,
              paramList: '',
              methodName: 'schedulePayment',
              type: 'ICON',
              displayName: 'Schedule Payment',
              icon: 'fal fa-calendar-plus',
            },
          ],
        };
      });

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/billPayments/registeredBillPayment/private/getAllBillers',
  (req, res) => {
    var workbook = XLSX.readFile(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
    );
    var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    let response = { data: [] };

    const categories = [];
    const data = [];

    _.forEach(excelData, function (row) {
      if (!categories.includes(row.category)) {
        categories.push(row.category);
        data.push({ category: row.category, count: 0, billers: [] });
      }

      const index = data.findIndex((d) => d.category === row.category);
      if (index >= 0) {
        if (row.type === 'offline') {
          delete row.totalBills;
          delete row.totalPayableAmount;
          delete row.consumers;
          delete row.overdueBills;

          row.actions = [
            {
              index: 0,
              paramList: '',
              methodName: 'fetchBills',
              type: 'BUTTON',
              displayName: 'FETCH BILLS',
            },
          ];
        }

        data[index].billers.push(row);
        data[index].count = data[index].billers.length;
      }
    });

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/billPayments/registeredBillPayment/private/getCriticalBillers',
  (req, res) => {
    var workbook = XLSX.readFile(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
    );
    var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    let response = { data: [] };

    const categories = [];

    const data = [];

    const date = new Date();

    _.forEach(excelData, function (row) {
      const dueDate = new Date(row.dueDate);

      if (date.getTime() > dueDate.getTime()) {
        if (!categories.includes(row.category)) {
          categories.push(row.category);
          data.push({ category: row.category, count: 0, billers: [] });
        }

        const index = data.findIndex((d) => d.category === row.category);

        if (index >= 0) {
          if (row.type === 'offline') {
            delete row.totalBills;
            delete row.totalPayableAmount;
            delete row.consumers;
            delete row.overdueBills;

            row.actions = [
              {
                index: 0,
                paramList: '',
                methodName: 'fetchBills',
                type: 'BUTTON',
                displayName: 'FETCH BILLS',
              },
            ];
          }

          data[index].billers.push(row);
          data[index].count = data[index].billers.length;
        }
      }
    });

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/billPayments/registeredBillPayment/private/getOverdueDueBillers',
  (req, res) => {
    var workbook = XLSX.readFile(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
    );
    var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    let response = { data: [] };

    const categories = [];

    const data = [];

    var toDay = moment(new Date());

    _.forEach(excelData, function (row) {
      const dueDate = moment(new Date(row.dueDate));

      const dueDays = toDay.diff(dueDate, 'days');

      if (dueDays > 0) {
        if (!categories.includes(row.category)) {
          categories.push(row.category);
          data.push({ category: row.category, count: 0, billers: [] });
        }

        const index = data.findIndex((d) => d.category === row.category);

        if (index >= 0) {
          if (row.type === 'offline') {
            delete row.totalBills;
            delete row.totalPayableAmount;
            delete row.consumers;
            delete row.overdueBills;

            row.actions = [
              {
                index: 0,
                paramList: '',
                methodName: 'fetchBills',
                type: 'BUTTON',
                displayName: 'FETCH BILLS',
              },
            ];
          }

          data[index].billers.push(row);
          data[index].count = data[index].billers.length;
        }
      }
    });

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/billPayments/registeredBillPayment/private/getRecentPayments',
  (req, res) => {
    var workbook = XLSX.readFile('./dummyServer/json/payments/billPayments/payBill/data.xlsx');
    var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    let response = { data: [] };

    const categories = [];

    const data = [];

    excelData
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.enabled == 'Y' &&
          record.authorized == 'Y',
      )
      .filter((row) => row.billerType === 'registered')
      .forEach((row) => {
        if (!categories.includes(row.category)) {
          categories.push(row.category);
          data.push({ category: row.category, count: 0, billers: [] });
        }

        const index = data.findIndex((d) => d.category === row.category);

        if (index >= 0) {
          row.consumers = row.consumers.length;

          data[index].billers.push(row);
          data[index].count = data[index].billers.length;
        }
      });

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/billPayments/unregisteredBillPayment/private/getRecentPayments',
  (req, res) => {
    var workbook = XLSX.readFile('./dummyServer/json/payments/billPayments/payBill/data.xlsx');
    var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    let response = { data: [] };

    const data = [];

    excelData
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.enabled == 'Y' &&
          record.authorized == 'Y',
      )
      .filter((row) => row.billerType === 'unregistered')
      .forEach((row) => {
        data.push(row);
      });

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/setup/security/mobilityRegistration/getBillerUnregisteredConsumer',
  (req, res) => {
    let response = { data: [] };

    const consumerNo = req.body.dataMap.consumer;

    const consumerBills = [];

    const bill = {
      consumer: '',
      billNo: 'Bill No ' + new Date().getTime(),
      dueDate: '20 Aug 2021',
      billAmount: '10000',
      amountBeingPaid: '10000',
      paymentDate: '31 Aug 2021',

      selected: false,
    };

    for (let i = 0; i < 3; i++) {
      const newBill = {
        ...bill,
        parentId: consumerNo,
        id: '' + consumerNo + i,
        billNo: 'Bill No ' + consumerNo + i,
      };
      consumerBills.push(newBill);
    }

    const data = [
      {
        id: consumerNo,
        checkbox: '',
        consumer: `Consumer ${consumerNo}`,
        noOfBills: 3,
        billNo: `3 Bills`,
        dueDate: '',
        billAmount: '',
        amountBeingPaid: '',
        paymentDate: '',
        partialSelected: false,
        selected: false,
        children: consumerBills,
      },
    ];

    response.data = data;

    response.billerData = {
      refNo: new Date().getTime(),
      ...req.body.dataMap,
      totalBills: 3,
      totalPayableAmount: 30000,
      dueDate: '31 Dec 2021',
      overdueBills: 1,
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/setup/security/mobilityRegistration/getSMEBillerUnregisteredConsumer',
  (req, res) => {
    let response = { data: [] };

    const consumerNo = req.body.dataMap.consumer;

    const data = [
      {
        id: consumerNo,
        checkbox: '',
        consumer: `Consumer ${consumerNo}`,
        billNo: 'Bill No ' + new Date().getTime(),
        dueDate: '20 Aug 2021',
        billAmount: '10000',
        amountBeingPaid: '10000',
        paymentDate: '31 Aug 2021',
      },
    ];

    response.data = data;

    response.billerData = {
      refNo: new Date().getTime(),
      ...req.body.dataMap,
      totalBills: 3,
      totalPayableAmount: 30000,
      dueDate: '31 Dec 2021',
      overdueBills: 1,
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/billPayments/billPaymentHistory/getBillPaymentHistoryData',
  (req, res) => {
    var workbook = XLSX.readFile('./dummyServer/json/payments/billPayments/payBill/data.xlsx');
    var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    let response = {};

    const data = [];

    excelData
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.enabled == 'Y' &&
          record.authorized == 'Y',
      )
      .forEach((row) => {
        row.actions = [
          {
            index: 0,
            paramList:
              'id,cardNumber,billerName,product,consumerName,totalPayableAmount,modifiedSysOn,channel',
            methodName: 'onPrint',
            type: 'ICON',
            displayName: 'Print',
            icon: 'fa-print',
          },
        ];

        data.push(row);
      });

    response = data;

    // response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/billPayments/payBill/private/getAuthorizedList',
  (req, res) => {
    const response = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );

    response.data = response.data.map((data) => {
      data.actions = [
        ...data.actions.filter((action) => action.displayName == 'View'),
        {
          index: 8,
          displayName: 'Download',
          type: 'ICON',
          icon: 'far fa-arrow-to-bottom',
          url: '',
          methodName: 'billPaymentDownload',
          paramList: 'id',
          color: 'primary',
        },
      ];

      return data;
    });

    res.json(response);
  },
);

module.exports = router;
