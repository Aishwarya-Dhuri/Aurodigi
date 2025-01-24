const express = require('express');
const _ = require('lodash');
let XLSX = require('xlsx');

const addRecordInExcel = require('./../crudAPIs').addRecordInExcel;
const getAllListRecords = require('./../listingAPIs').getAllListRecords;
const getPendingListRecords = require('./../listingAPIs').getPendingListRecords;
const getAuthorizedListRecords = require('./../listingAPIs').getAuthorizedListRecords;
const getRejectedListRecords = require('./../listingAPIs').getRejectedListRecords;
const getDisabledListRecords = require('./../listingAPIs').getDisabledListRecords;
const getViewData = require('./../crudAPIs').getViewData;
const deleteRecordInExcel = require('./../crudAPIs').deleteRecordInExcel;
const updateRecordInExcel = require('./../crudAPIs').updateRecordInExcel;
const authorize = require('./../crudAPIs').authorize;
const updateWorkbook = require('./../crudAPIs').updateWorkbook;
const generateDisableSheetData = require('./../crudAPIs').generateDisableSheetData;
const generateRejectSheetData = require('./../crudAPIs').generateRejectSheetData;

const defaultReqModel = {
  startRow: 0,
  endRow: 100,
  rowGroupCols: [],
  valueCols: [],
  pivotCols: [],
  pivotMode: false,
  groupKeys: [],
  filterModel: {},
  sortModel: [],
  entityName: '',
};

const router = express.Router();

router.post(
  '/dummyServer/json/payments/transactions/ownAccountTransfer/private/getTransactionStatus',
  (req, res) => {
    const allListRecords = getAllListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      defaultReqModel,
      req.session.userDetails,
    );

    const authorizedListRecords = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      defaultReqModel,
      req.session.userDetails,
    );

    const pendingListRecords = getPendingListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      defaultReqModel,
      req.session.userDetails,
    );

    const rejectedListRecords = getRejectedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      defaultReqModel,
      req.session.userDetails,
    );

    let totalValue = 0;

    allListRecords.data.forEach((data) => {
      totalValue += data.debitAmount ? +data.debitAmount : 0;
    });

    res.send({
      data: {
        totalTransactionValue: totalValue,
        totalTransactions: allListRecords.data.length,
        completed: authorizedListRecords.data.length,
        pending: pendingListRecords.data.length,
        rejected: rejectedListRecords.data.length,
      },
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/ownAccountTransfer/private/getTopFiveHighestOATDebitCorporates',
  (req, res) => {
    const groupId = req.session?.userDetails?.loginPreferenceDetails?.groupId;

    const groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
    const groupWorkbook = XLSX.readFile(groupXlFile);
    const groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

    const corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    const corporateWorkbook = XLSX.readFile(corporateXlFile);
    const corporateXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['Sheet1']);

    const authorizedListRecords = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      defaultReqModel,
      req.session.userDetails,
    );

    const data = [];

    groupData
      .filter((record) => record.mstId == groupId)
      .forEach((record) => {
        const corporateData = corporateXlData.find((corp) => corp.id == record.corporateId);

        if (corporateData) {
          let totalTransactionValue = 0;

          authorizedListRecords.data
            .filter((data) => data.debitAccountCorporate == corporateData.id)
            .forEach((data) => {
              totalTransactionValue += data.debitAmount ? +data.debitAmount : 0;
            });

          data.push({
            xLabel: corporateData.corporateName,
            yLabel0: totalTransactionValue,
          });
        }
      });

    res.send({
      data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/ownAccountTransfer/private/getCorporateToCorporateTotalOat',
  (req, res) => {
    const fromCorporate = req.body.dataMap.fromCorporate;
    const toCorporate = req.body.dataMap.toCorporate;

    const authorizedListRecords = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      defaultReqModel,
      req.session.userDetails,
    );

    let totalValue = 0;

    authorizedListRecords.data
      .filter(
        (data) =>
          data.debitAccountCorporate == fromCorporate && data.creditAccountCorporate == toCorporate,
      )
      .forEach((data) => {
        totalValue += data.debitAmount ? +data.debitAmount : 0;
      });

    res.send({
      data: {
        totalTransactionValue: totalValue,
      },
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/ownAccountTransfer/private/getGroupDashboardData',
  (req, res) => {
    const groupId = req.session.userDetails.groupId;

    const groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
    const groupWorkbook = XLSX.readFile(groupXlFile);

    const groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['Sheet1']);
    const groupCorporates = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

    const group = groupData.find((g) => g.id == groupId);

    let totalAccounts = 0;
    let overallBalance = 0;
    let overallLimit = 0;
    let corporates = 0;

    var corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    var corporateWorkbook = XLSX.readFile(corporateXlFile);

    var corporateXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['Sheet1']);
    var accountsXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['accounts']);

    groupCorporates
      .filter((record) => record.mstId == groupId)
      .forEach((record) => {
        const corporateData = corporateXlData.find((corp) => corp.id == record.corporateId);

        if (corporateData) {
          accountsXlData
            .filter((acc) => acc.mstId === corporateData.id)
            .forEach((acc) => {
              if (
                acc.lastAction.indexOf('Authorized') !== -1 &&
                ['CURRENT', 'SAVING'].includes(acc.accountType.toUpperCase())
              ) {
                overallBalance += acc.availableBalance;
                overallLimit += acc.odLimit;
              }
              totalAccounts++;
            });

          corporates++;
        }
      });

    res.json({
      data: {
        groupName: group.groupName,
        groupImage: group.groupImage,
        totalAccounts,
        overallBalance,
        overallLimit,
        corporates,
      },
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/ownAccountTransfer/private/getGroupCorporateAccounts',
  (req, res) => {
    const groupId = req.session.userDetails.groupId;

    const groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
    const groupWorkbook = XLSX.readFile(groupXlFile);

    // const groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['Sheet1']);
    const groupCorporates = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

    // const group = groupData.find((g) => g.id == groupId);

    const corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    const corporateWorkbook = XLSX.readFile(corporateXlFile);

    const corporateXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['Sheet1']);
    const accountsXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['accounts']);

    const data = [];

    groupCorporates
      .filter((record) => record.mstId == groupId)
      .forEach((record) => {
        const corporateData = corporateXlData.find((corp) => corp.id == record.corporateId);

        const corporateAccounts = [];

        let blankSpaces = ' ';

        let overallBalance = 0;

        if (corporateData) {
          accountsXlData
            .filter((acc) => acc.mstId === corporateData.id)
            .forEach((acc) => {
              if (
                acc.lastAction.indexOf('Authorized') !== -1 &&
                ['CURRENT', 'SAVING'].includes(acc.accountType.toUpperCase())
              ) {
                corporateAccounts.push({
                  corporateName: [corporateData.corporateName, blankSpaces],
                  accountNumber: acc.accountNo + '-' + acc.currencyCode,
                  currency: acc.currencyCode,
                  balance: acc.availableBalance,
                });

                blankSpaces += ' ';
                overallBalance += acc.availableBalance;
              }
            });
        }

        data.push(
          {
            corporateName: [corporateData.corporateName],
            accountNumber: corporateAccounts.length + ' Accounts',
            currency: '',
            balance: overallBalance,
          },
          ...corporateAccounts,
        );
      });

    res.json({
      data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/ownAccountTransfer/private/getTransactionListTypes',
  (req, res) => {
    const transactionsListTypes = [
      {
        label: 'Draft',
        count: getListCount(req, 'payments/transactions/ownAccountTransfer/draftData.xlsx'),
        colDefUrl: 'payments/transactions/ownAccountTransfer/private/draftColDef',
        rowDataUrl: 'payments/transactions/ownAccountTransfer/private/getDraftList',
        cardDataUrl: 'payments/transactions/ownAccountTransfer/private/draftCardData',
      },
      {
        label: 'Frequent Payment',
        count: 8,
        colDefUrl: 'payments/transactions/ownAccountTransfer/private/frequentPaymentColDef',
        rowDataUrl: 'payments/transactions/ownAccountTransfer/private/frequentPaymentData',
        cardDataUrl: 'payments/transactions/ownAccountTransfer/private/frequentPaymentCardData',
      },
      {
        label: 'Recent Payment',
        count: 5,
        colDefUrl: 'payments/transactions/ownAccountTransfer/private/recentPaymentColDef',
        rowDataUrl: 'payments/transactions/ownAccountTransfer/private/recentPaymentData',
        cardDataUrl: 'payments/transactions/ownAccountTransfer/private/recentPaymentCardData',
      },
      {
        label: 'Upcoming Payment',
        count: 10,
        colDefUrl: 'payments/transactions/ownAccountTransfer/private/upcomingPaymentColDef',
        rowDataUrl: 'payments/transactions/ownAccountTransfer/private/upcomingPaymentData',
        cardDataUrl: 'payments/transactions/ownAccountTransfer/private/upcomingPaymentCardData',
      },
      {
        label: 'Template',
        count: getListCount(req, 'payments/transactions/ownAccountTransfer/templateData.xlsx'),
        colDefUrl: 'payments/transactions/ownAccountTransfer/private/templateColDef',
        rowDataUrl: 'payments/transactions/ownAccountTransfer/private/getTemplateList',
        cardDataUrl: 'payments/transactions/ownAccountTransfer/private/templateCardData',
      },
    ];

    res.json({
      data: transactionsListTypes,
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

const getListCount = (req, xlFileUrl) => {
  const workbook = XLSX.readFile('./dummyServer/json/' + xlFileUrl);
  const data = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

  return data.filter((d) => {
    if (
      req.session?.userDetails?.loginPreferenceDetails &&
      req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group'
    ) {
      return d?.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId;
    } else if (
      req.session?.userDetails?.loginPreferenceDetails &&
      req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group'
    ) {
      return d?.corporateId == req.session?.userDetails?.corporateId;
    }
    return true;
  }).length;
};

module.exports = router;
