const express = require('express');
const moment = require('moment');
const getAuthorizedListRecords = require('./../listingAPIs').getAuthorizedListRecords;
const XLSX = require('xlsx');

const router = express.Router();

router.post(
  '/dummyServer/json/payments/transactions/siManagement/private/getListingDashboardData',
  (req, res) => {
    let ongoingSI = 0;
    let expiredSI = 0;
    let attentionRequiredSI = 0;
    let processingSI = 0;
    let paidSI = 0;
    let failedSI = 0;

    if (
      req.session?.userDetails?.loginPreferenceDetails &&
      req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group'
    ) {
      const groupId = req.session?.userDetails?.loginPreferenceDetails?.groupId;
      const groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
      const groupWorkbook = XLSX.readFile(groupXlFile);
      const groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

      groupData
        .filter((record) => record.mstId == groupId)
        .forEach((record) => {
          const corporateSiStatus = getCorporateSiStatus(record.corporateId);
          const corporateAttentionRequiredSiTransactions =
            getCorporateAttentionRequiredSiTransactions(
              record.corporateId,
              req.body.dataMap.timeDuration,
            );
          const corporateSiTransactionsStatus = getCorporateSiTransactionsStatus(
            record.corporateId,
            req.body.dataMap.timeDuration,
          );

          ongoingSI += corporateSiStatus.ongoingStatus;
          expiredSI += corporateSiStatus.expiredStatus;
          attentionRequiredSI += corporateAttentionRequiredSiTransactions;

          processingSI += corporateSiTransactionsStatus.processing;
          paidSI += corporateSiTransactionsStatus.paid;
          failedSI += corporateSiTransactionsStatus.failed;
        });
    } else {
      const corporateId = req.session?.userDetails?.corporateId;

      const corporateSiStatus = getCorporateSiStatus(corporateId);
      const corporateAttentionRequiredSiTransactions = getCorporateAttentionRequiredSiTransactions(
        corporateId,
        req.body.dataMap.timeDuration,
      );
      const corporateSiTransactionsStatus = getCorporateSiTransactionsStatus(
        corporateId,
        req.body.dataMap.timeDuration,
      );

      ongoingSI += corporateSiStatus.ongoingStatus;
      expiredSI += corporateSiStatus.expiredStatus;
      attentionRequiredSI += corporateAttentionRequiredSiTransactions;

      processingSI += corporateSiTransactionsStatus.processing;
      paidSI += corporateSiTransactionsStatus.paid;
      failedSI += corporateSiTransactionsStatus.failed;
    }

    res.json({
      data: {
        ongoingSI,
        expiredSI,
        attentionRequiredSI,
        processingSI,
        paidSI,
        failedSI,
      },
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/siManagement/private/getCorporateSiStatus',
  (req, res) => {
    const corporateId = req.body.dataMap.corporateId;
    console.log(89, corporateId);

    let ongoingSI = 0;
    let expiredSI = 0;
    let attentionRequiredSI = 0;

    if (corporateId == 'all') {
      const groupId = req.session?.userDetails?.loginPreferenceDetails?.groupId;
      const groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
      const groupWorkbook = XLSX.readFile(groupXlFile);
      const groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

      groupData
        .filter((record) => record.mstId == groupId)
        .forEach((record) => {
          const corporateSiStatus = getCorporateSiStatus(record.corporateId);
          const corporateAttentionRequiredSiTransactions =
            getCorporateAttentionRequiredSiTransactions(
              record.corporateId,
              req.body.dataMap.timeDuration,
            );

          ongoingSI += corporateSiStatus.ongoingStatus;
          expiredSI += corporateSiStatus.expiredStatus;
          attentionRequiredSI += corporateAttentionRequiredSiTransactions;
        });
    } else {
      const corporateSiStatus = getCorporateSiStatus(corporateId);
      const corporateAttentionRequiredSiTransactions = getCorporateAttentionRequiredSiTransactions(
        corporateId,
        req.body.dataMap.timeDuration,
      );

      ongoingSI += corporateSiStatus.ongoingStatus;
      expiredSI += corporateSiStatus.expiredStatus;
      attentionRequiredSI += corporateAttentionRequiredSiTransactions;
    }

    res.json({
      data: {
        ongoingSI,
        expiredSI,
        attentionRequiredSI,
      },
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/siManagement/private/getCorporateAttentionRequiredSiTransactions',
  (req, res) => {
    const corporateId = req.body.dataMap.corporateId;
    console.log(142, corporateId);

    let attentionRequiredSI = 0;

    if (corporateId == 'all') {
      const groupId = req.session?.userDetails?.loginPreferenceDetails?.groupId;
      const groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
      const groupWorkbook = XLSX.readFile(groupXlFile);
      const groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

      groupData
        .filter((record) => record.mstId == groupId)
        .forEach((record) => {
          const corporateAttentionRequiredSiTransactions =
            getCorporateAttentionRequiredSiTransactions(
              record.corporateId,
              req.body.dataMap.timeDuration,
            );

          attentionRequiredSI += corporateAttentionRequiredSiTransactions;
        });
    } else {
      const corporateAttentionRequiredSiTransactions = getCorporateAttentionRequiredSiTransactions(
        corporateId,
        req.body.dataMap.timeDuration,
      );

      attentionRequiredSI += corporateAttentionRequiredSiTransactions;
    }

    res.json({
      data: {
        attentionRequiredSI,
      },
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payments/transactions/siManagement/private/getCorporateSiTransactionsStatus',
  (req, res) => {
    const corporateId = req.body.dataMap.corporateId;
    console.log(185, corporateId);

    let processingSI = 0;
    let paidSI = 0;
    let failedSI = 0;

    if (corporateId == 'all') {
      const groupId = req.session?.userDetails?.loginPreferenceDetails?.groupId;
      const groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
      const groupWorkbook = XLSX.readFile(groupXlFile);
      const groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

      groupData
        .filter((record) => record.mstId == groupId)
        .forEach((record) => {
          const corporateSiTransactionsStatus = getCorporateSiTransactionsStatus(
            record.corporateId,
            req.body.dataMap.timeDuration,
          );

          processingSI += corporateSiTransactionsStatus.processing;
          paidSI += corporateSiTransactionsStatus.paid;
          failedSI += corporateSiTransactionsStatus.failed;
        });
    } else {
      const corporateSiTransactionsStatus = getCorporateSiTransactionsStatus(
        corporateId,
        req.body.dataMap.timeDuration,
      );

      processingSI += corporateSiTransactionsStatus.processing;
      paidSI += corporateSiTransactionsStatus.paid;
      failedSI += corporateSiTransactionsStatus.failed;
    }

    res.json({
      data: {
        processingSI,
        paidSI,
        failedSI,
      },
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

const getCorporateSiStatus = (corporateId) => {
  console.log(232, corporateId);

  const siXlFile = './dummyServer/json/payments/transactions/siManagement/data.xlsx';
  const siWorkbook = XLSX.readFile(siXlFile);
  const siXlData = XLSX.utils.sheet_to_json(siWorkbook.Sheets['Sheet1']);

  const siData = siXlData.filter((data) => data.corporateId == corporateId);

  let ongoingStatus = 0;
  let expiredStatus = 0;

  const toDay = new Date();

  siData
    .filter((data) => data.corporateId == corporateId)
    .forEach((data) => {
      const siDate = moment(new Date(data.siEndDate));
      if (moment(toDay).diff(siDate, 'days') <= 0) {
        ongoingStatus++;
      } else {
        expiredStatus++;
      }
    });

  return {
    ongoingStatus,
    expiredStatus,
  };
};

const getCorporateAttentionRequiredSiTransactions = (corporateId, timeDuration) => {
  console.log(263, corporateId, timeDuration);

  const corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
  const corporateWorkbook = XLSX.readFile(corporateXlFile);
  const accountXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['accounts']);

  const corporateAccounts = accountXlData.filter((acc) => acc.mstId == corporateId);

  const siXlFile = './dummyServer/json/payments/transactions/siManagement/data.xlsx';
  const siWorkbook = XLSX.readFile(siXlFile);
  const siXlData = XLSX.utils.sheet_to_json(siWorkbook.Sheets['Sheet1']);

  const toDay = new Date();
  const siData = siXlData
    .filter((data) => data.corporateId == corporateId)
    .filter((data) => {
      const siDate = moment(new Date(data.siEndDate));
      if (timeDuration == 'today') {
        return moment(toDay).isSame(siDate);
      } else if (timeDuration == 'week') {
        return siDate.isBetween(moment(toDay).subtract(7, 'days'), moment(toDay));
      } else if (timeDuration == 'month') {
        return siDate.isBetween(moment(toDay).subtract(30, 'days'), moment(toDay));
      }
    });

  let attentionRequired = 0;

  siData.forEach((data) => {
    const account = corporateAccounts.find((acc) => acc.id == data.accountNo);

    if (account && +account.balance < +data.amount) {
      attentionRequired++;
    }
  });

  return attentionRequired;
};

const getCorporateSiTransactionsStatus = (corporateId, timeDuration) => {
  console.log(303, corporateId, timeDuration);

  const siXlFile = './dummyServer/json/payments/transactions/siManagement/data.xlsx';
  const siWorkbook = XLSX.readFile(siXlFile);
  const siXlData = XLSX.utils.sheet_to_json(siWorkbook.Sheets['Sheet1']);

  const toDay = new Date();

  const siData = siXlData
    .filter((data) => data.corporateId == corporateId)
    .filter((data) => {
      const siDate = moment(new Date(data.siEndDate));
      if (timeDuration == 'today') {
        return moment(toDay).isSame(siDate);
      } else if (timeDuration == 'week') {
        return siDate.isBetween(moment(toDay).subtract(7, 'days'), moment(toDay));
      } else if (timeDuration == 'month') {
        return siDate.isBetween(moment(toDay).subtract(30, 'days'), moment(toDay));
      }
    });

  let processing = 0;
  let paid = 0;
  let failed = 0;

  siData.forEach((data) => {
    if (data.lastAction == 'create') {
      processing++;
    } else if (data.lastAction.includes('Authorized')) {
      paid++;
    } else if (data.lastAction.includes('Rejected')) {
      failed++;
    }
  });

  return {
    processing,
    paid,
    failed,
  };
};

router.post(
  '/dummyServer/json/payments/transactions/siManagement/private/getCorporateAttentionRequiredSiTransactionsList',
  (req, res) => {
    const corporateId = req.body.dataMap.corporateId;
    console.log(349, corporateId);

    const data = [];

    if (corporateId == 'all') {
      const groupId = req.session?.userDetails?.loginPreferenceDetails?.groupId;
      const groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
      const groupWorkbook = XLSX.readFile(groupXlFile);
      const groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

      groupData
        .filter((record) => record.mstId == groupId)
        .forEach((record) => {
          const corporateAttentionRequiredSiTransactions =
            getCorporateAttentionRequiredSiTransactionsList(
              record.corporateId,
              req.body.dataMap.timeDuration,
            );

          data.push(...corporateAttentionRequiredSiTransactions);
        });
    } else {
      data.push(
        ...getCorporateAttentionRequiredSiTransactionsList(
          corporateId,
          req.body.dataMap.timeDuration,
        ),
      );
    }

    res.json({
      data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

const getCorporateAttentionRequiredSiTransactionsList = (corporateId, timeDuration) => {
  console.log(388, corporateId, timeDuration);

  const corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
  const corporateWorkbook = XLSX.readFile(corporateXlFile);
  const accountXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['accounts']);

  const corporateAccounts = accountXlData.filter((acc) => acc.mstId == corporateId);

  const siXlFile = './dummyServer/json/payments/transactions/siManagement/data.xlsx';
  const siWorkbook = XLSX.readFile(siXlFile);
  const siXlData = XLSX.utils.sheet_to_json(siWorkbook.Sheets['Sheet1']);

  const toDay = new Date();
  const siData = siXlData
    .filter((data) => data.corporateId == corporateId)
    .filter((data) => {
      const siDate = moment(new Date(data.siEndDate));
      if (timeDuration == 'today') {
        return moment(toDay).isSame(siDate);
      } else if (timeDuration == 'week') {
        return siDate.isBetween(moment(toDay).subtract(7, 'days'), moment(toDay));
      } else if (timeDuration == 'month') {
        return siDate.isBetween(moment(toDay).subtract(30, 'days'), moment(toDay));
      }
    });

  const data = [];

  siData.forEach((record) => {
    const account = corporateAccounts.find((acc) => acc.id == record.accountNo);

    if (account && +account.balance < +record.amount) {
      data.push({
        corporateName: record.corporateName,
        accountNumber: record.debitAccountNo,
        noOfTransactions: record.totalRequest,
        totalDebitAmount: record.debitAmount,
        availableBalance: acc.balance,
      });
    }
  });

  return data;
};

router.post(
  '/dummyServer/json/payments/transactions/siManagement/private/getCorporateOngoingSiTransactionsList',
  (req, res) => {
    const corporateId = req.body.dataMap.corporateId;
    console.log(437, corporateId);

    const data = [];

    if (corporateId == 'all') {
      const groupId = req.session?.userDetails?.loginPreferenceDetails?.groupId;
      const groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
      const groupWorkbook = XLSX.readFile(groupXlFile);
      const groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

      groupData
        .filter((record) => record.mstId == groupId)
        .forEach((record) => {
          const corporateOngoingSiTransactions = getCorporateOngoingSiTransactionsList(
            record.corporateId,
          );

          data.push(...corporateOngoingSiTransactions);
        });
    } else {
      data.push(...getCorporateOngoingSiTransactionsList(corporateId));
    }

    res.json({
      data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

const getCorporateOngoingSiTransactionsList = (corporateId) => {
  console.log(469, corporateId);
  const siXlFile = './dummyServer/json/payments/transactions/siManagement/data.xlsx';
  const siWorkbook = XLSX.readFile(siXlFile);
  const siXlData = XLSX.utils.sheet_to_json(siWorkbook.Sheets['Sheet1']);

  const siData = siXlData.filter((data) => data.corporateId == corporateId);

  const data = [];

  const toDay = new Date();

  siData
    .filter((record) => record.corporateId == corporateId)
    .forEach((record) => {
      const siDate = moment(new Date(record.siEndDate));
      if (moment(toDay).diff(siDate, 'days') <= 0) {
        data.push({
          siName: record.siName,
          corporateName: record.corporateName,
          debitAccount: record.debitAccountNo,
          payableAmount: record.payableAmount,
          beneficiaryName: record.beneficiaryName,
          startDate: record.siStartDate,
          endDate: record.siEndDate,
          actions: [
            {
              index: 1,
              displayName: 'View',
              type: 'ICON',
              icon: 'pi pi-eye',
              url: 'route~view',
              methodName: 'view',
              paramList: 'id',
              color: null,
            },
          ],
        });
      }
    });

  return data;
};

router.post(
  '/dummyServer/json/payments/transactions/siManagement/private/getCorporateFailedSiTransactionsList',
  (req, res) => {
    const corporateId = req.body.dataMap.corporateId;
    console.log(516, corporateId);

    const data = [];

    if (corporateId == 'all') {
      const groupId = req.session?.userDetails?.loginPreferenceDetails?.groupId;
      const groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
      const groupWorkbook = XLSX.readFile(groupXlFile);
      const groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

      groupData
        .filter((record) => record.mstId == groupId)
        .forEach((record) => {
          const corporateOngoingSiTransactions = getCorporateFailedSiTransactionsList(
            record.corporateId,
            req.body.dataMap.timeDuration,
          );

          data.push(...corporateOngoingSiTransactions);
        });
    } else {
      data.push(
        ...getCorporateFailedSiTransactionsList(corporateId, req.body.dataMap.timeDuration),
      );
    }

    res.json({
      data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_CREATE_SUCCESSFUL', status: '0' },
    });
  },
);

const getCorporateFailedSiTransactionsList = (corporateId, timeDuration) => {
  console.log(551, corporateId, timeDuration);

  const siXlFile = './dummyServer/json/payments/transactions/siManagement/data.xlsx';
  const siWorkbook = XLSX.readFile(siXlFile);
  const siXlData = XLSX.utils.sheet_to_json(siWorkbook.Sheets['Sheet1']);

  const toDay = new Date();

  const siData = siXlData
    .filter((data) => data.corporateId == corporateId)
    .filter((data) => {
      const siDate = moment(new Date(data.siEndDate));
      if (timeDuration == 'today') {
        return moment(toDay).isSame(siDate);
      } else if (timeDuration == 'week') {
        return siDate.isBetween(moment(toDay).subtract(7, 'days'), moment(toDay));
      } else if (timeDuration == 'month') {
        return siDate.isBetween(moment(toDay).subtract(30, 'days'), moment(toDay));
      }
    });

  const data = [];

  siData.forEach((record) => {
    if (record.lastAction.includes('Rejected')) {
      data.push({
        transactionReferenceNo: record.id,
        transactionDate: record.valueDate,
        corporateName: record.corporateName,
        debitAccount: record.debitAccountNo,
        debitCurrency: record.debitCurrencyCode,
        debitAmount: record.debitAmount,
        payableCurrency: record.payableCurrencyCode,
        payableAmount: record.payableAmount,
        beneficiary: record.beneficiaryName,
        beneficiaryAccountNo: record.beneficiaryAccountNo,
        failedReason: record.rejectReason,
      });
    }
  });

  return data;
};

router.post(
  '/dummyServer/json/payments/transactions/siManagement/private/getAuthorizedList',
  (req, res) => {
    const response = getAuthorizedListRecords(
      '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx',
      req.body,
      req.session.userDetails,
    );
    response.data = response.data.map((record) => {
      const index = record.actions.findIndex((action) => action.methodName == 'edit');

      if (index !== -1) {
        record.actions.splice(index, 1);
      }
      return record;
    });
    res.json(response);
  },
);

module.exports = router;
