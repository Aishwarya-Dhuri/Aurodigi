var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');

const addDataToExcel = require('../crudAPIs').addRecordInExcel;
const deleteRecordInExcel = require('../crudAPIs').deleteRecordInExcel;

var router = express.Router();

const getChequeData = () => {
  var chequeDataXlFile = './dummyServer/json/positivePay/transactions/positivePay/chequeData.xlsx';
  var chequeDataWorkbook = XLSX.readFile(chequeDataXlFile);

  return XLSX.utils.sheet_to_json(chequeDataWorkbook.Sheets['Sheet1']);
};

const getData = () => {
  var chequeDataXlFile = './dummyServer/json/positivePay/transactions/positivePay/data.xlsx';
  var chequeDataWorkbook = XLSX.readFile(chequeDataXlFile);

  return XLSX.utils.sheet_to_json(chequeDataWorkbook.Sheets['Sheet1']);
};

router.post(
  '/dummyServer/json/positivePay/transactions/positivePay/private/getRecentCheques',
  (req, res) => {
    const chequeData = getChequeData().map((data) => {
      return {
        ...data,
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
            methodName: 'onAccept',
            paramList: 'id',
            color: 'primary',
          },
          {
            index: 6,
            displayName: 'Reject',
            type: 'ICON',
            icon: 'fas fa-times',
            url: '',
            methodName: 'onReject',
            paramList: 'id',
            color: 'warn',
          },
        ],
        links: [
          {
            index: 1,
            displayName: 'Show Cheque',
            type: 'ICON',
            icon: 'fas fa-file',
            url: '',
            methodName: 'onShowCheque',
            paramList: 'id',
            color: null,
          },
          {
            index: 2,
            displayName: 'E',
            type: 'BUTTON',
            icon: '',
            url: '',
            methodName: 'onEnrichments',
            paramList: 'id',
            color: null,
          },
        ],
      };
    });

    res.send({ data: chequeData, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/positivePay/transactions/positivePay/private/getApprovedCheques',
  (req, res) => {
    const data = getData()
      .filter((d) => d.enabled == 'Y' && d.authorized == 'Y' && d.chequeStatus == 'Approved')
      .map((data) => {
        return {
          ...data,
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
          ],
          links: [
            {
              index: 1,
              displayName: 'Show Cheque',
              type: 'ICON',
              icon: 'fas fa-file',
              url: '',
              methodName: 'onShowCheque',
              paramList: 'id',
              color: null,
            },
            {
              index: 2,
              displayName: 'E',
              type: 'BUTTON',
              icon: '',
              url: '',
              methodName: 'onEnrichments',
              paramList: 'id',
              color: null,
            },
          ],
        };
      });

    res.send({ data, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/positivePay/transactions/positivePay/private/getChequeData',
  (req, res) => {
    const id = req.body.dataMap.id;
    const activeTab = req.body.dataMap.activeTab;

    let data = {
      chequeNumber: '',
      chequeAmount: '',
      chequeDate: '',
      draweeName: '',
      modifiedSysOn: '',
      exceptionReason: '',
    };

    if (activeTab == 'recentCheques') {
      data = getChequeData().find((d) => d.id == id);
    } else if (activeTab == 'approvedCheques') {
      data = getData()
        .filter((d) => d.enabled == 'Y' && d.authorized == 'Y' && d.chequeStatus == 'Approved')
        .find((d) => d.id == id);
    } else if (activeTab == 'disapprovedCheques') {
      data = getData()
        .filter((d) => d.enabled == 'Y' && d.authorized == 'Y' && d.chequeStatus == 'Disapproved')
        .find((d) => d.id == id);
    }

    res.send({ data, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/positivePay/transactions/positivePay/private/getPositivePayTabs',
  (req, res) => {
    const recentCheques = getChequeData().length;

    const approveCheques = getData().filter(
      (d) => d.enabled == 'Y' && d.authorized == 'Y' && d.chequeStatus == 'Approved',
    ).length;

    const disapproveCheques = getData().filter(
      (d) => d.enabled == 'Y' && d.authorized == 'Y' && d.chequeStatus == 'Disapproved',
    ).length;

    const data = [
      {
        id: 'recentCheques',
        label: 'Recent Cheques',
        colDefsUrl: 'positivePay/transactions/positivePay/private/positivePayRecentDataColDefs',
        rowDefsUrl: 'positivePay/transactions/positivePay/private/getRecentCheques',
        count: recentCheques,
      },
      {
        id: 'approvedCheques',
        label: 'Approved Cheques',
        colDefsUrl: 'positivePay/transactions/positivePay/private/positivePayColDefs',
        rowDefsUrl: 'positivePay/transactions/positivePay/private/getApprovedCheques',
        count: approveCheques,
      },
      {
        id: 'disapprovedCheques',
        label: 'Disapproved Cheques',
        colDefsUrl: 'positivePay/transactions/positivePay/private/positivePayColDefs',
        rowDefsUrl: 'positivePay/transactions/positivePay/private/getDisapprovedCheques',
        count: disapproveCheques,
      },
    ];

    res.send({ data, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/positivePay/transactions/positivePay/private/getDisapprovedCheques',
  (req, res) => {
    const data = getData()
      .filter((d) => d.enabled == 'Y' && d.authorized == 'Y' && d.chequeStatus == 'Disapproved')
      .map((data) => {
        return {
          ...data,
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
          ],
          links: [
            {
              index: 1,
              displayName: 'Show Cheque',
              type: 'ICON',
              icon: 'fas fa-file',
              url: '',
              methodName: 'onShowCheque',
              paramList: 'id',
              color: null,
            },
            {
              index: 2,
              displayName: 'E',
              type: 'BUTTON',
              icon: '',
              url: '',
              methodName: 'onEnrichments',
              paramList: 'id',
              color: null,
            },
          ],
        };
      });

    res.send({ data, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/positivePay/transactions/positivePay/private/approveCheques',
  (req, res) => {
    const dataXlFile = './dummyServer/json/positivePay/transactions/positivePay/data.xlsx';
    const chequeXlFile = './dummyServer/json/positivePay/transactions/positivePay/chequeData.xlsx';

    req.body.dataMap.data.forEach((data) => {
      const newData = {
        ...data,
        chequeStatus: 'Approved',
        systemDate: new Date().toDateString(),
        remark: req.body.dataMap.remark,
      };

      addDataToExcel(dataXlFile, newData, req.session.userDetails);

      deleteRecordInExcel(chequeXlFile, data.id);
    });

    res.send({ responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/positivePay/transactions/positivePay/private/disapproveCheques',
  (req, res) => {
    const dataXlFile = './dummyServer/json/positivePay/transactions/positivePay/data.xlsx';
    const chequeXlFile = './dummyServer/json/positivePay/transactions/positivePay/chequeData.xlsx';

    req.body.dataMap.data.forEach((data) => {
      const newData = {
        ...data,
        chequeStatus: 'Disapproved',
        systemDate: new Date().toDateString(),
        remark: req.body.dataMap.remark,
      };

      addDataToExcel(dataXlFile, newData, req.session.userDetails);

      deleteRecordInExcel(chequeXlFile, data.id);
    });

    res.send({ responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

router.post(
  '/dummyServer/json/positivePay/transactions/positivePay/private/getSearchedCheques',
  (req, res) => {
    // console.log(req.body.dataMap.filters);

    const chequeData = getChequeData()
      .filter((data) => true)
      .map((data) => {
        return {
          ...data,
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
              methodName: 'onAccept',
              paramList: 'id',
              color: 'primary',
            },
            {
              index: 6,
              displayName: 'Reject',
              type: 'ICON',
              icon: 'fas fa-times',
              url: '',
              methodName: 'onReject',
              paramList: 'id',
              color: 'warn',
            },
          ],
          links: [
            {
              index: 1,
              displayName: 'Show Cheque',
              type: 'ICON',
              icon: 'fas fa-file',
              url: '',
              methodName: 'onShowCheque',
              paramList: 'id',
              color: null,
            },
            {
              index: 2,
              displayName: 'E',
              type: 'BUTTON',
              icon: '',
              url: '',
              methodName: 'onEnrichments',
              paramList: 'id',
              color: null,
            },
          ],
        };
      });

    res.send({ data: chequeData, responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' } });
  },
);

module.exports = router;
