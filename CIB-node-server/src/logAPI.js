var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var moment = require('moment');
var viewDetails = require('./crudAPIs').getViewData;
var addDataToExcel = require('./crudAPIs').addRecordInExcel;

const userDetails = {
  loginId: 'tovmaker',
  corporateId: '100083',
  corporateCode: '999200',
  corporateName: 'Toyota Motors Malaysia',
  corporateType: 'L',
  applicationDate: '24-Dec-2021',
  smsVerification: true,
  mobileVerification: true,
  deviceVerification: true,
  webVerification: true,
  isSelfAuth: false,
  fullName: 'James Tan',
  firstName: 'James',
  lastName: 'Tan',
  mobileNumber: 9087654321,
  profileName: 'Chief Executive Officer',
  isGroupUser: 'Y',
  authType: ['SOFTTOKEN'],
  landingPage: 'Payments',
  consolidatedwidget: 'Y',
  currentServerTimeSec: '15:20:07',
  currentServerTimeA: '03:20 PM',
  lastLoginDateTime: '24-Dec-2021 01:20 pm',
  lastFailedLogin: '22-Dec-2021 03:20:07',
  lastLoginTime: '01:20 pm',
  lastCorporateLoginDateTime: '02:20 PM, 24 Dec 2021',
  tokenUsed: 'TI12456',
  token: 'xxx12456',
  userImage: './../../../assets/images/avatar.jpg',
  corporateImage: './../../../assets/images/corporate.png',
  quickActions: [
    { displayName: 'Single Payment', link: '' },
    { displayName: 'Add Beneficiary', link: '' },
    { displayName: 'Bulk Payment', link: '' },
    { displayName: 'Apply For Loan', link: '' },
    { displayName: 'Start Investing', link: '' },
    { displayName: 'Create VA', link: '' },
  ],
  accountDetails: {
    accountNumber: 999200000011,
    accountType: 'Business Savings',
    accountBalance: 788800,
  },
};

var router = express.Router();

router.post('/dummyServer/json/bbe/logApi', (req, res) => {
  const dataFilePath = './apiList.xlsx';

  const log = viewDetails(dataFilePath, [
    { name: 'URL', value: req.body.api },
    { name: 'cfeBBe', value: 'BBE' },
  ]);

  let response = {};

  if (!log) {
    const data = {
      cfeBBe: 'BBE',
      product: req.body.product,
      master: req.body.master,
      module: req.body.module,
      URL: req.body.api,
      ServiceName: req.body.serviceName,
      CompleteURL: 'http://172.16.0.163:4201/dummyServer/json/' + req.body.api,
      Request: JSON.stringify(req.body.request),
      Response: JSON.stringify(req.body.response),
    };

    try {
      const d = addDataToExcel(dataFilePath, data, userDetails);
      response = { data: d };
    } catch (e) {}
  }

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

router.post('/dummyServer/json/cfe/logApi', (req, res) => {
  const dataFilePath = './apiList.xlsx';

  const log = viewDetails(dataFilePath, [
    { name: 'URL', value: req.body.api },
    { name: 'cfeBBe', value: 'CFE' },
  ]);

  let response = {};

  if (!log) {
    const data = {
      cfeBBe: 'CFE',
      product: req.body.product,
      master: req.body.master,
      module: req.body.module,
      URL: req.body.api,
      ServiceName: req.body.serviceName,
      CompleteURL: 'http://172.16.0.163:4201/dummyServer/json/' + req.body.api,
      Request: JSON.stringify(req.body.request),
      Response: JSON.stringify(req.body.response),
    };

    try {
      const d = addDataToExcel(dataFilePath, data, userDetails);
      response = { data: d };
    } catch (e) {}
  }
  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

module.exports = router;
