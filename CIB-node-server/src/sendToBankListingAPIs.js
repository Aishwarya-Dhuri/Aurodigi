const express = require('express');
const XLSX = require('xlsx');
const _ = require('lodash');
const updateWorkbook = require('./crudAPIs').updateWorkbook;
const router = express.Router();

router.post(
  '/dummyServer/json/payments/transactions/sendToBank/private/getDashboardData',
  (req, res) => {
    const sum = function (items, prop) {
      return items.reduce(function (a, b) {
        return +a + +b[prop];
      }, 0);
    };

    const paymentMethodWorkbook = XLSX.readFile(
      './dummyServer/json/payments/transactions/singlePaymentRequest/data.xlsx',
    );
    const bulkPaymentMethodWorkbook = XLSX.readFile(
      './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx',
    );
    const paymentMethods = [
      ...XLSX.utils
        .sheet_to_json(paymentMethodWorkbook.Sheets[paymentMethodWorkbook.SheetNames[0]])
        .filter(
          (record) =>
            req.session?.userDetails?.loginPreferenceDetails &&
            ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
              record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
              (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
                record.corporateId == req.session?.userDetails?.corporateId)) &&
            record.authorized == 'Y' &&
            record.sendToBank == 'N' &&
            !record.sysReqStatus.includes('Rejected'),
        ),
      ...XLSX.utils
        .sheet_to_json(bulkPaymentMethodWorkbook.Sheets[bulkPaymentMethodWorkbook.SheetNames[0]])
        .filter(
          (record) =>
            req.session?.userDetails?.loginPreferenceDetails &&
            ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
              record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
              (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
                record.corporateId == req.session?.userDetails?.corporateId)) &&
            record.authorized == 'Y' &&
            record.sendToBank == 'N' &&
            !record.sysReqStatus.includes('Rejected'),
        )
        .map((record) => {
          return { ...record, debitAmount: record.amount };
        }),
    ];

    const billPaymentsWorkbook = XLSX.readFile(
      './dummyServer/json/payments/billPayments/payBill/data.xlsx',
    );
    const billPayments = XLSX.utils
      .sheet_to_json(billPaymentsWorkbook.Sheets[billPaymentsWorkbook.SheetNames[0]])
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.authorized == 'Y' &&
          record.sendToBank == 'N' &&
          !record.sysReqStatus.includes('Rejected'),
      );

    const fdPlacementWorkbook = XLSX.readFile(
      './dummyServer/json/accountServices/fixedDeposit/fdInitiation/data.xlsx',
    );
    const fdPlacements = XLSX.utils
      .sheet_to_json(fdPlacementWorkbook.Sheets[fdPlacementWorkbook.SheetNames[0]])
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.authorized == 'Y' &&
          record.sendToBank == 'N' &&
          !record.sysReqStatus.includes('Rejected'),
      );

    const wpsPaymentWorkbook = XLSX.readFile(
      './dummyServer/json/payments/transactions/wpsPayment/data.xlsx',
    );
    const wpsPayments = XLSX.utils
      .sheet_to_json(wpsPaymentWorkbook.Sheets[wpsPaymentWorkbook.SheetNames[0]])
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.authorized == 'Y' &&
          record.sendToBank == 'N' &&
          !record.sysReqStatus.includes('Rejected'),
      );

    const withRightsAccessOptionData = [
      {
        module: 'Payment Method',
        records: paymentMethods.length,
        amount: sum(paymentMethods, 'debitAmount'),
        criticalRecords: 0,
      },
      {
        module: 'Bill Payment',
        records: billPayments.length,
        amount: sum(billPayments, 'totalPayableAmount'),
        criticalRecords: 0,
      },
      {
        module: 'FD Placement',
        records: fdPlacements.length,
        amount: sum(fdPlacements, 'amount'),
        criticalRecords: 0,
      },
      {
        module: 'WPS Payment',
        records: wpsPayments.length,
        amount: sum(wpsPayments, 'totalAmount'),
        criticalRecords: 0,
      },
    ];

    const withoutRightsAccessOptionData = _.cloneDeep(withRightsAccessOptionData);

    let totalRecords = 0;
    let criticalRecords = 0;

    withRightsAccessOptionData.forEach((data) => {
      totalRecords += data.records;
      criticalRecords += data.criticalRecords;
    });

    const listingTypes = [
      {
        id: 'PAYMENTMETHOD',
        displayName: 'Payment Method',
        serverUrl: 'payments/transactions/singlePaymentRequest/',
        colDefsUrl: 'payments/transactions/sendToBank/paymentMethod/private/colDefs',
        rowDefUrl: 'payments/transactions/singlePaymentRequest/private/getPendingSendToBankList',
        WithRightsAccessCount: paymentMethods.length,
        WithoutRightsAccessCount: paymentMethods.length,
      },
      {
        id: 'BILLPAYMENT',
        displayName: 'BIll Payment',
        serverUrl: 'payments/billPayments/payBill/',
        colDefsUrl: 'payments/transactions/sendToBank/billPayment/private/colDefs',
        rowDefUrl: 'payments/billPayments/payBill/private/getPendingSendToBankList',
        WithRightsAccessCount: billPayments.length,
        WithoutRightsAccessCount: billPayments.length,
      },
      {
        id: 'FDPLACENMENT',
        displayName: 'FD Placement',
        serverUrl: 'accountServices/fixedDeposit/fdInitiation/',
        colDefsUrl: 'payments/transactions/sendToBank/fdPlacement/private/colDefs',
        rowDefUrl: 'accountServices/fixedDeposit/fdInitiation/private/getPendingSendToBankList',
        WithRightsAccessCount: fdPlacements.length,
        WithoutRightsAccessCount: fdPlacements.length,
      },
      {
        id: 'WPSPAYMENT',
        displayName: 'WPS Payment',
        serverUrl: 'payments/transactions/wpsPayment/',
        colDefsUrl: 'payments/transactions/sendToBank/wpsPayment/private/colDefs',
        rowDefUrl: 'payments/transactions/wpsPayment/private/getPendingSendToBankList',
        WithRightsAccessCount: wpsPayments.length,
        WithoutRightsAccessCount: wpsPayments.length,
      },
    ];

    const topFiveDetails = getGroupCorporateAccountDetails(
      req.session?.userDetails?.loginPreferenceDetails?.groupId,
    )
      .sort((a, b) => {
        return +b.debitBalance - +a.debitBalance;
      })
      .slice(0, 4);

    const response = {
      listingTypes,
      withRightsAccessOptionData,
      withoutRightsAccessOptionData,
      topFiveDetails,
      totalRecords,
      criticalRecords,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    };
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/sendToBank/private/getGroupCorporateAccountDetails',
  (req, res) => {
    const data = getGroupCorporateAccountDetails(
      req.session?.userDetails?.loginPreferenceDetails?.groupId,
    ).sort((a, b) => {
      return +b.debitBalance - +a.debitBalance;
    });

    res.json({
      data,
      lastRow: data.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

const getGroupCorporateAccountDetails = (groupId) => {
  let dataList = [];
  if (groupId) {
    let groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
    let groupWorkbook = XLSX.readFile(groupXlFile);

    let groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

    let corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
    let corporateWorkbook = XLSX.readFile(corporateXlFile);

    let corporateXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['Sheet1']);
    let accountsXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['accounts']);

    groupData
      .filter((record) => record.mstId == groupId)
      .forEach((record) => {
        const corporateData = corporateXlData.find((corp) => corp.id == record.corporateId);

        if (corporateData) {
          accountsXlData
            .filter((acc) => acc.mstId === corporateData.id)
            .forEach((acc) => {
              if (
                acc.lastAction.indexOf('Authorized') !== -1 &&
                ['CURRENT', 'SAVING'].includes(acc.accountType)
              ) {
                dataList.push({
                  corporateId: corporateData.id,
                  corporateName: corporateData.corporateName,
                  accountName: acc.accountNo + '-' + acc.currencyCode,
                  currency: acc.currencyCode,
                  balance: acc.balance,
                  debitBalance: acc.totalDebitBalance,
                });
              }
            });
        }
      });
  }

  return dataList;
};

router.post(
  '/dummyServer/json/payments/transactions/sendToBank/private/getCorporateWiseDashboardSummery',
  (req, res) => {
    const corporateId = req.body.dataMap.corporateId;

    const sum = function (items, prop) {
      return items.reduce(function (a, b) {
        return +a + +b[prop];
      }, 0);
    };

    const paymentMethodWorkbook = XLSX.readFile(
      './dummyServer/json/payments/transactions/singlePaymentRequest/data.xlsx',
    );
    const bulkPaymentMethodWorkbook = XLSX.readFile(
      './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx',
    );
    const paymentMethods = [
      ...XLSX.utils
        .sheet_to_json(paymentMethodWorkbook.Sheets[paymentMethodWorkbook.SheetNames[0]])
        .filter(
          (record) =>
            req.session?.userDetails?.loginPreferenceDetails &&
            ((corporateId == 'all' &&
              req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
              record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
              (corporateId != 'all' &&
                req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
                record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId &&
                record.corporateId == corporateId) ||
              (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
                record.corporateId == req.session?.userDetails?.corporateId)) &&
            record.authorized == 'Y' &&
            record.sendToBank == 'N' &&
            !record.sysReqStatus.includes('Rejected'),
        ),
      ...XLSX.utils
        .sheet_to_json(bulkPaymentMethodWorkbook.Sheets[bulkPaymentMethodWorkbook.SheetNames[0]])
        .filter(
          (record) =>
            req.session?.userDetails?.loginPreferenceDetails &&
            ((corporateId == 'all' &&
              req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
              record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
              (corporateId != 'all' &&
                req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
                record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId &&
                record.corporateId == corporateId) ||
              (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
                record.corporateId == req.session?.userDetails?.corporateId)) &&
            record.authorized == 'Y' &&
            record.sendToBank == 'N' &&
            !record.sysReqStatus.includes('Rejected'),
        )
        .map((record) => {
          return { ...record, debitAmount: record.amount };
        }),
    ];

    const billPaymentsWorkbook = XLSX.readFile(
      './dummyServer/json/payments/billPayments/payBill/data.xlsx',
    );
    const billPayments = XLSX.utils
      .sheet_to_json(billPaymentsWorkbook.Sheets[billPaymentsWorkbook.SheetNames[0]])
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((corporateId == 'all' &&
            req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (corporateId != 'all' &&
              req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
              record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId &&
              record.corporateId == corporateId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.authorized == 'Y' &&
          record.sendToBank == 'N' &&
          !record.sysReqStatus.includes('Rejected'),
      );

    const fdPlacementWorkbook = XLSX.readFile(
      './dummyServer/json/accountServices/fixedDeposit/fdInitiation/data.xlsx',
    );
    const fdPlacements = XLSX.utils
      .sheet_to_json(fdPlacementWorkbook.Sheets[fdPlacementWorkbook.SheetNames[0]])
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((corporateId == 'all' &&
            req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (corporateId != 'all' &&
              req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
              record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId &&
              record.corporateId == corporateId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.authorized == 'Y' &&
          record.sendToBank == 'N' &&
          !record.sysReqStatus.includes('Rejected'),
      );

    const wpsPaymentWorkbook = XLSX.readFile(
      './dummyServer/json/payments/transactions/wpsPayment/data.xlsx',
    );
    const wpsPayments = XLSX.utils
      .sheet_to_json(wpsPaymentWorkbook.Sheets[wpsPaymentWorkbook.SheetNames[0]])
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((corporateId == 'all' &&
            req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (corporateId != 'all' &&
              req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
              record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId &&
              record.corporateId == corporateId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.authorized == 'Y' &&
          record.sendToBank == 'N' &&
          !record.sysReqStatus.includes('Rejected'),
      );

    const withRightsAccessOptionData = [
      {
        module: 'Payment Method',
        records: paymentMethods.length,
        amount: sum(paymentMethods, 'debitAmount'),
        criticalRecords: 0,
      },
      {
        module: 'Bill Payment',
        records: billPayments.length,
        amount: sum(billPayments, 'totalPayableAmount'),
        criticalRecords: 0,
      },
      {
        module: 'FD Placement',
        records: fdPlacements.length,
        amount: sum(fdPlacements, 'amount'),
        criticalRecords: 0,
      },
      {
        module: 'WPS Payment',
        records: wpsPayments.length,
        amount: sum(wpsPayments, 'totalAmount'),
        criticalRecords: 0,
      },
    ];

    const withoutRightsAccessOptionData = _.cloneDeep(withRightsAccessOptionData);

    const response = {
      withRightsAccessOptionData,
      withoutRightsAccessOptionData,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    };
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/sendToBank/private/getActionDashboardData',
  (req, res) => {
    const sum = function (items, prop) {
      return items.reduce(function (a, b) {
        return +a + +b[prop];
      }, 0);
    };

    const paymentMethodWorkbook = XLSX.readFile(
      './dummyServer/json/payments/transactions/singlePaymentRequest/data.xlsx',
    );
    const bulkPaymentMethodWorkbook = XLSX.readFile(
      './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx',
    );
    const paymentMethods = [
      ...XLSX.utils
        .sheet_to_json(paymentMethodWorkbook.Sheets[paymentMethodWorkbook.SheetNames[0]])
        .filter(
          (record) =>
            req.session?.userDetails?.loginPreferenceDetails &&
            ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
              record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
              (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
                record.corporateId == req.session?.userDetails?.corporateId)) &&
            record.authorized == 'Y',
        ),
      ...XLSX.utils
        .sheet_to_json(bulkPaymentMethodWorkbook.Sheets[bulkPaymentMethodWorkbook.SheetNames[0]])
        .filter(
          (record) =>
            req.session?.userDetails?.loginPreferenceDetails &&
            ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
              record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
              (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
                record.corporateId == req.session?.userDetails?.corporateId)) &&
            record.authorized == 'Y',
        )
        .map((record) => {
          return { ...record, debitAmount: record.amount };
        }),
      ,
    ];

    const billPaymentsWorkbook = XLSX.readFile(
      './dummyServer/json/payments/billPayments/payBill/data.xlsx',
    );
    const billPayments = XLSX.utils
      .sheet_to_json(billPaymentsWorkbook.Sheets[billPaymentsWorkbook.SheetNames[0]])
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.authorized == 'Y',
      );

    const fdPlacementWorkbook = XLSX.readFile(
      './dummyServer/json/accountServices/fixedDeposit/fdInitiation/data.xlsx',
    );
    const fdPlacements = XLSX.utils
      .sheet_to_json(fdPlacementWorkbook.Sheets[fdPlacementWorkbook.SheetNames[0]])
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.authorized == 'Y',
      );

    const wpsPaymentWorkbook = XLSX.readFile(
      './dummyServer/json/payments/transactions/wpsPayment/data.xlsx',
    );
    const wpsPayments = XLSX.utils
      .sheet_to_json(wpsPaymentWorkbook.Sheets[wpsPaymentWorkbook.SheetNames[0]])
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.authorized == 'Y',
      );

    const acceptedOptionData = [
      {
        module: 'Payment Method',
        records: paymentMethods.filter(
          (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
        ).length,
        amount: sum(
          paymentMethods.filter(
            (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
          ),
          'debitAmount',
        ),
      },
      {
        module: 'Bill Payment',
        records: billPayments.filter(
          (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
        ).length,
        amount: sum(
          billPayments.filter(
            (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
          ),
          'totalPayableAmount',
        ),
      },
      {
        module: 'FD Placement',
        records: fdPlacements.filter(
          (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
        ).length,
        amount: sum(
          fdPlacements.filter(
            (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
          ),
          'amount',
        ),
      },
      {
        module: 'WPS Payment',
        records: wpsPayments.filter(
          (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
        ).length,
        amount: sum(
          wpsPayments.filter(
            (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
          ),
          'totalAmount',
        ),
      },
    ];

    const rejectedOptionData = [
      {
        module: 'Payment Method',
        records: paymentMethods.filter(
          (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
        ).length,
        amount: sum(
          paymentMethods.filter(
            (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
          ),
          'debitAmount',
        ),
      },
      {
        module: 'Bill Payment',
        records: billPayments.filter(
          (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
        ).length,
        amount: sum(
          billPayments.filter(
            (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
          ),
          'totalPayableAmount',
        ),
      },
      {
        module: 'FD Placement',
        records: fdPlacements.filter(
          (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
        ).length,
        amount: sum(
          fdPlacements.filter(
            (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
          ),
          'amount',
        ),
      },
      {
        module: 'WPS Payment',
        records: wpsPayments.filter(
          (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
        ).length,
        amount: sum(
          wpsPayments.filter(
            (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
          ),
          'totalAmount',
        ),
      },
    ];

    let acceptedRecords = 0;

    acceptedOptionData.forEach((data) => {
      acceptedRecords += data.records;
    });

    let rejectedRecords = 0;

    rejectedOptionData.forEach((data) => {
      rejectedRecords += data.records;
    });

    const listingTypes = [
      {
        id: 'PAYMENTMETHOD',
        displayName: 'Payment Method',
        serverUrl: 'payments/transactions/singlePaymentRequest/',
        colDefsUrl: 'payments/transactions/sendToBank/paymentMethod/private/actionColDefs',
        rowDefUrl: 'payments/transactions/singlePaymentRequest/private/getPendingSendToBankList',
        allCount: paymentMethods.filter(
          (data) => data.sendToBank == 'Y' || data.sysReqStatus.includes('Rejected'),
        ).length,
        acceptedCount: paymentMethods.filter((data) => data.sendToBank == 'Y').length,
        rejectedCount: paymentMethods.filter((data) => data.sysReqStatus.includes('Rejected'))
          .length,
      },
      {
        id: 'BILLPAYMENT',
        displayName: 'BIll Payment',
        serverUrl: 'payments/billPayments/payBill/',
        colDefsUrl: 'payments/transactions/sendToBank/billPayment/private/actionColDefs',
        rowDefUrl: 'payments/billPayments/payBill/private/getPendingSendToBankList',
        allCount: billPayments.filter(
          (data) => data.sendToBank == 'Y' || data.sysReqStatus.includes('Rejected'),
        ).length,
        acceptedCount: billPayments.filter((data) => data.sendToBank == 'Y').length,
        rejectedCount: billPayments.filter((data) => data.sysReqStatus.includes('Rejected')).length,
      },
      {
        id: 'FDPLACENMENT',
        displayName: 'FD Placement',
        serverUrl: 'accountServices/fixedDeposit/fdInitiation/',
        colDefsUrl: 'payments/transactions/sendToBank/fdPlacement/private/actionColDefs',
        rowDefUrl: 'accountServices/fixedDeposit/fdInitiation/private/getPendingSendToBankList',
        allCount: fdPlacements.filter(
          (data) => data.sendToBank == 'Y' || data.sysReqStatus.includes('Rejected'),
        ).length,
        acceptedCount: fdPlacements.filter((data) => data.sendToBank == 'Y').length,
        rejectedCount: fdPlacements.filter((data) => data.sysReqStatus.includes('Rejected')).length,
      },
      {
        id: 'WPSPAYMENT',
        displayName: 'WPS Payment',
        serverUrl: 'payments/transactions/wpsPayment/',
        colDefsUrl: 'payments/transactions/sendToBank/wpsPayment/private/actionColDefs',
        rowDefUrl: 'payments/transactions/wpsPayment/private/getPendingSendToBankList',
        allCount: wpsPayments.filter(
          (data) => data.sendToBank == 'Y' || data.sysReqStatus.includes('Rejected'),
        ).length,
        acceptedCount: wpsPayments.filter((data) => data.sendToBank == 'Y').length,
        rejectedCount: wpsPayments.filter((data) => data.sysReqStatus.includes('Rejected')).length,
      },
    ];

    const response = {
      listingTypes,
      acceptedOptionData,
      rejectedOptionData,
      acceptedRecords,
      rejectedRecords,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    };
    res.json(response);
  },
);

router.post(
  '/dummyServer/json/payments/transactions/sendToBank/private/getCorporateWiseActionSummery',
  (req, res) => {
    const corporateId = req.body.dataMap.corporateId;

    const sum = function (items, prop) {
      return items.reduce(function (a, b) {
        return +a + +b[prop];
      }, 0);
    };

    const paymentMethodWorkbook = XLSX.readFile(
      './dummyServer/json/payments/transactions/singlePaymentRequest/data.xlsx',
    );
    const bulkPaymentMethodWorkbook = XLSX.readFile(
      './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx',
    );
    const paymentMethods = [
      ...XLSX.utils
        .sheet_to_json(paymentMethodWorkbook.Sheets[paymentMethodWorkbook.SheetNames[0]])
        .filter(
          (record) =>
            req.session?.userDetails?.loginPreferenceDetails &&
            ((corporateId == 'all' &&
              req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
              record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
              (corporateId != 'all' &&
                req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
                record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId &&
                record.corporateId == corporateId) ||
              (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
                record.corporateId == req.session?.userDetails?.corporateId)) &&
            record.authorized == 'Y',
        ),
      ...XLSX.utils
        .sheet_to_json(bulkPaymentMethodWorkbook.Sheets[bulkPaymentMethodWorkbook.SheetNames[0]])
        .filter(
          (record) =>
            req.session?.userDetails?.loginPreferenceDetails &&
            ((corporateId == 'all' &&
              req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
              record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
              (corporateId != 'all' &&
                req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
                record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId &&
                record.corporateId == corporateId) ||
              (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
                record.corporateId == req.session?.userDetails?.corporateId)) &&
            record.authorized == 'Y',
        )
        .map((record) => {
          return { ...record, debitAmount: record.amount };
        }),
    ].sort((a, b) => {
      return a.id - b.id;
    });

    const billPaymentsWorkbook = XLSX.readFile(
      './dummyServer/json/payments/billPayments/payBill/data.xlsx',
    );
    const billPayments = XLSX.utils
      .sheet_to_json(billPaymentsWorkbook.Sheets[billPaymentsWorkbook.SheetNames[0]])
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((corporateId == 'all' &&
            req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (corporateId != 'all' &&
              req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
              record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId &&
              record.corporateId == corporateId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.authorized == 'Y',
      );

    const fdPlacementWorkbook = XLSX.readFile(
      './dummyServer/json/accountServices/fixedDeposit/fdInitiation/data.xlsx',
    );
    const fdPlacements = XLSX.utils
      .sheet_to_json(fdPlacementWorkbook.Sheets[fdPlacementWorkbook.SheetNames[0]])
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((corporateId == 'all' &&
            req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (corporateId != 'all' &&
              req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
              record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId &&
              record.corporateId == corporateId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.authorized == 'Y',
      );

    const wpsPaymentWorkbook = XLSX.readFile(
      './dummyServer/json/payments/transactions/wpsPayment/data.xlsx',
    );
    const wpsPayments = XLSX.utils
      .sheet_to_json(wpsPaymentWorkbook.Sheets[wpsPaymentWorkbook.SheetNames[0]])
      .filter(
        (record) =>
          req.session?.userDetails?.loginPreferenceDetails &&
          ((corporateId == 'all' &&
            req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
            record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
            (corporateId != 'all' &&
              req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
              record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId &&
              record.corporateId == corporateId) ||
            (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
              record.corporateId == req.session?.userDetails?.corporateId)) &&
          record.authorized == 'Y',
      );

    const acceptedOptionData = [
      {
        module: 'Payment Method',
        records: paymentMethods.filter(
          (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
        ).length,
        amount: sum(
          paymentMethods.filter(
            (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
          ),
          'debitAmount',
        ),
      },
      {
        module: 'Bill Payment',
        records: billPayments.filter(
          (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
        ).length,
        amount: sum(
          billPayments.filter(
            (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
          ),
          'totalPayableAmount',
        ),
      },
      {
        module: 'FD Placement',
        records: fdPlacements.filter(
          (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
        ).length,
        amount: sum(
          fdPlacements.filter(
            (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
          ),
          'amount',
        ),
      },
      {
        module: 'WPS Payment',
        records: wpsPayments.filter(
          (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
        ).length,
        amount: sum(
          wpsPayments.filter(
            (data) => data.sendToBank == 'Y' && data.sysReqStatus.includes('Authorized'),
          ),
          'totalAmount',
        ),
      },
    ];

    const rejectedOptionData = [
      {
        module: 'Payment Method',
        records: paymentMethods.filter(
          (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
        ).length,
        amount: sum(
          paymentMethods.filter(
            (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
          ),
          'debitAmount',
        ),
      },
      {
        module: 'Bill Payment',
        records: billPayments.filter(
          (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
        ).length,
        amount: sum(
          billPayments.filter(
            (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
          ),
          'totalPayableAmount',
        ),
      },
      {
        module: 'FD Placement',
        records: fdPlacements.filter(
          (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
        ).length,
        amount: sum(
          fdPlacements.filter(
            (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
          ),
          'amount',
        ),
      },
      {
        module: 'WPS Payment',
        records: wpsPayments.filter(
          (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
        ).length,
        amount: sum(
          wpsPayments.filter(
            (data) => data.sendToBank == 'N' && data.sysReqStatus.includes('Rejected'),
          ),
          'totalAmount',
        ),
      },
    ];

    const response = {
      acceptedOptionData,
      rejectedOptionData,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    };
    res.json(response);
  },
);

router.post('/dummyServer/**/sendToBankReject', (req, res) => {
  // if(req.body.dataMap)

  const selectedRecords = req.body.dataMap.selectedRows;

  for (let i = 0; i < selectedRecords.length; i++) {
    let dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';

    if (selectedRecords[i].recordType == 'singlePayment') {
      dataXlFile = './dummyServer/json/payments/transactions/singlePaymentRequest/data.xlsx';
    } else if (selectedRecords[i].recordType == 'bulkPayment') {
      dataXlFile = './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx';
    } else if (selectedRecords[i].recordType == 'billPayment') {
      dataXlFile = './dummyServer/json/payments/billPayments/payBill/data.xlsx';
    } else if (selectedRecords[i].recordType == 'fdPlacement') {
      dataXlFile = './dummyServer/json/accountServices/fixedDeposit/fdInitiation/data.xlsx';
    } else if (selectedRecords[i].recordType == 'wpsPayment') {
      dataXlFile = './dummyServer/json/payments/transactions/wpsPayment/data.xlsx';
    }

    const data = { ids: [selectedRecords[i].id] };

    const existingWb = XLSX.readFile(dataXlFile);
    let sheets = generateRejectSheetData(req.session.userDetails, data, existingWb);
    updateWorkbook(existingWb, sheets, dataXlFile);
  }

  res.json({ responseStatus: { message: 'MSG_KEY_REJECTION_SUCCESSFUL', status: '0' } });
});

function generateRejectSheetData(userDetails, data, existingWb) {
  let sheets = {};
  let sheetList = existingWb.SheetNames;
  _.forEach(sheetList, function (sheetName) {
    sheets[sheetName] = XLSX.utils.sheet_to_json(existingWb.Sheets[sheetName]);
  });
  let xlData = sheets[sheetList[0]];

  _.forEach(data.ids, function (id) {
    let rejectIndex = _.findIndex(xlData, function (o) {
      return o.id == id;
    });
    let record = _.cloneDeep(xlData[rejectIndex]);
    record = rejectRecordData(userDetails, record);
    record.rejectReason = data.rejectReason;
    _.forEach(_.keys(record), function (key) {
      if (record[key] == '[object Array]') {
        let childXlData = sheets[key];
        if (!childXlData) childXlData = [];
        _.forEach(childXlData, function (child, i) {
          if (child.mstId == record.id) {
            childXlData[i] = _.cloneDeep(rejectRecordData(userDetails, child));
            childXlData[i].rejectReason = data.rejectReason;
          }
        });
        sheets[key] = _.cloneDeep(childXlData);
      }
    });
    xlData[rejectIndex] = _.cloneDeep(record);
  });
  sheets[sheetList[0]] = _.cloneDeep(xlData);
  _.forEach(sheetList, function (sheetName) {
    sheets[sheetName] = XLSX.utils.json_to_sheet(sheets[sheetName]);
  });

  return sheets;
}

function rejectRecordData(userDetails, record) {
  record.version = parseInt(record.version) + 1;
  record.sysReqStatus = record.sysReqStatus + ' Rejected';
  return record;
}

router.post('/dummyServer/**/sendToBankAuthorize', (req, res) => {
  let dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';

  const selectedRecords = req.body.dataMap.selectedRows;

  for (let i = 0; i < selectedRecords.length; i++) {
    let dataXlFile = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';

    if (selectedRecords[i].recordType == 'singlePayment') {
      dataXlFile = './dummyServer/json/payments/transactions/singlePaymentRequest/data.xlsx';
    } else if (selectedRecords[i].recordType == 'bulkPayment') {
      dataXlFile = './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx';
    } else if (selectedRecords[i].recordType == 'billPayment') {
      dataXlFile = './dummyServer/json/payments/billPayments/payBill/data.xlsx';
    } else if (selectedRecords[i].recordType == 'fdPlacement') {
      dataXlFile = './dummyServer/json/accountServices/fixedDeposit/fdInitiation/data.xlsx';
    } else if (selectedRecords[i].recordType == 'wpsPayment') {
      dataXlFile = './dummyServer/json/payments/transactions/wpsPayment/data.xlsx';
    }

    const data = { ids: [selectedRecords[i].id] };

    authorize(dataXlFile, req.session.userDetails, data, XLSX.readFile(dataXlFile));
  }

  res.json({ responseStatus: { message: 'MSG_KEY_AUTH_SUCCESSFUL', status: '0' } });
});

let authorize = function (dataXlFile, userDetails, reqData, Wb) {
  updateWorkbook(Wb, generateAuthorizeSheetData(userDetails, reqData, Wb), dataXlFile);
};

function generateAuthorizeSheetData(userDetails, data, existingWb) {
  let sheets = {};
  let sheetList = existingWb.SheetNames;
  _.forEach(sheetList, function (sheetName) {
    sheets[sheetName] = XLSX.utils.sheet_to_json(existingWb.Sheets[sheetName]);
  });
  let xlData = sheets[sheetList[0]];

  _.forEach(data.ids, function (id) {
    let authorizeIndex = _.findIndex(xlData, function (o) {
      return o.id == id;
    });
    let record = _.cloneDeep(xlData[authorizeIndex]);
    record = authorizeRecordData(userDetails, record);
    _.forEach(_.keys(record), function (key) {
      if (record[key] == '[object Array]') {
        let childXlData = sheets[key];
        if (!childXlData) childXlData = [];
        _.forEach(childXlData, function (child, i) {
          if (child.mstId == record.id) {
            childXlData[i] = _.cloneDeep(authorizeRecordData(userDetails, child));
          }
        });
        sheets[key] = _.cloneDeep(childXlData);
      }
    });
    xlData[authorizeIndex] = _.cloneDeep(record);
  });
  sheets[sheetList[0]] = _.cloneDeep(xlData);
  _.forEach(sheetList, function (sheetName) {
    sheets[sheetName] = XLSX.utils.json_to_sheet(sheets[sheetName]);
  });

  return sheets;
}

function authorizeRecordData(userDetails, record) {
  record.version = parseInt(record.version) + 1;
  record.sendToBank = 'Y';
  record.sysReqStatus = record.sysReqStatus + ' Authorized';

  return record;
}

router.post('/dummyServer/**/get*PendingSendToBankList', (req, res) => {
  const isWithRightsAccess = req.body.dataMap.rightsAccess == 'With Rights Access';

  const dataFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  const workbook = XLSX.readFile(dataFilePath);
  let pendingListRecords = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

  if (req.body.dataMap.listingTypeId == 'PAYMENTMETHOD') {
    pendingListRecords.map((record) => {
      record.totalRequest = '1';
      record.totalAmount = record.totalRequestAmount.toString();
      record.recordType = 'singlePayment';
      return record;
    });

    const bulkDataFilePath =
      './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx';
    const bulkWorkbook = XLSX.readFile(bulkDataFilePath);

    const bulkPaymentPendingRecords = XLSX.utils.sheet_to_json(bulkWorkbook.Sheets['Sheet1']);
    bulkPaymentPendingRecords.map((record) => {
      record.totalRequest = record.noOfTransactions.toString();
      record.totalAmount = record.amount ? record.amount.toString() : '10000';
      record.recordType = 'bulkPayment';
      return record;
    });

    pendingListRecords = [...pendingListRecords, ...bulkPaymentPendingRecords]
      .sort((a, b) => {
        return a.id - b.id;
      })
      .map((record) => {
        record.totalAmount = record.totalAmount ? record.totalAmount : '10000';
        return record;
      });
  } else if (req.body.dataMap.listingTypeId == 'BILLPAYMENT') {
    pendingListRecords.map((record) => {
      record.recordType = 'billPayment';
      return record;
    });
  } else if (req.body.dataMap.listingTypeId == 'FDPLACENMENT') {
    pendingListRecords.map((record) => {
      record.recordType = 'fdPlacement';
      return record;
    });
  } else if (req.body.dataMap.listingTypeId == 'WPSPAYMENT') {
    pendingListRecords.map((record) => {
      record.recordType = 'wpsPayment';
      return record;
    });
  }

  const data = pendingListRecords
    .filter(
      (record) =>
        req.session?.userDetails?.loginPreferenceDetails &&
        ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
          record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
          (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
            record.corporateId == req.session?.userDetails?.corporateId)) &&
        record.authorized == 'Y' &&
        record.sendToBank == 'N' &&
        !record.sysReqStatus.includes('Rejected'),
    )
    .map((record) => {
      if (isWithRightsAccess) {
        record.actions = [
          {
            index: 1,
            displayName: 'Authorize',
            type: 'ICON',
            icon: 'pi pi-check',
            url: 'private/authorize',
            methodName: 'authorize',
            paramList: 'id,recordType',
            color: 'success',
          },
          {
            index: 2,
            displayName: 'Reject',
            type: 'ICON',
            icon: 'pi pi-times',
            url: 'private/reject',
            methodName: 'reject',
            paramList: 'id,recordType',
            color: 'danger',
          },
        ];
      } else {
        record.actions = [
          {
            index: 1,
            displayName: 'View',
            type: 'ICON',
            icon: 'pi pi-eye',
            url: 'private/view',
            methodName: 'view',
            paramList: 'id,recordType',
            color: '',
          },
        ];
      }

      return record;
    });

  res.send({
    data,
    lastRow: data.length,
    responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
  });
});

router.post('/dummyServer/**/getAllAuthorizedRejectedSendToBankList', (req, res) => {
  const dataFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  const workbook = XLSX.readFile(dataFilePath);
  let listRecords = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

  if (req.body.dataMap.listingTypeId == 'PAYMENTMETHOD') {
    listRecords.map((record) => {
      record.totalRequest = '1';
      record.totalAmount = record.totalRequestAmount.toString();
      record.recordType = 'singlePayment';
      return record;
    });

    const bulkDataFilePath =
      './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx';
    const bulkWorkbook = XLSX.readFile(bulkDataFilePath);

    const bulkPaymentPendingRecords = XLSX.utils.sheet_to_json(bulkWorkbook.Sheets['Sheet1']);
    bulkPaymentPendingRecords.map((record) => {
      record.totalRequest = record.noOfTransactions.toString();
      record.totalAmount = record.amount.toString();

      record.recordType = 'bulkPayment';
      return record;
    });

    listRecords = [...listRecords, ...bulkPaymentPendingRecords]
      .sort((a, b) => {
        return a.id - b.id;
      })
      .map((record) => {
        record.totalAmount = record.totalAmount ? record.totalAmount : '10000';
        return record;
      });
  } else if (req.body.dataMap.listingTypeId == 'BILLPAYMENT') {
    listRecords.map((record) => {
      record.recordType = 'billPayment';
      return record;
    });
  } else if (req.body.dataMap.listingTypeId == 'FDPLACENMENT') {
    listRecords.map((record) => {
      record.recordType = 'fdPlacement';
      return record;
    });
  } else if (req.body.dataMap.listingTypeId == 'WPSPAYMENT') {
    listRecords.map((record) => {
      record.recordType = 'wpsPayment';
      return record;
    });
  }

  const data = [
    ...listRecords.filter(
      (record) =>
        req.session?.userDetails?.loginPreferenceDetails &&
        ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
          record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
          (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
            record.corporateId == req.session?.userDetails?.corporateId)) &&
        record.authorized == 'Y' &&
        record.sendToBank == 'Y' &&
        record.sysReqStatus.includes('Authorized'),
    ),
    ...listRecords.filter(
      (record) =>
        req.session?.userDetails?.loginPreferenceDetails &&
        ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
          record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
          (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
            record.corporateId == req.session?.userDetails?.corporateId)) &&
        record.authorized == 'Y' &&
        record.sendToBank == 'N' &&
        record.sysReqStatus.includes('Rejected'),
    ),
  ].map((record) => {
    record.actions = [
      {
        index: 1,
        displayName: 'View',
        type: 'ICON',
        icon: 'pi pi-eye',
        url: 'private/view',
        methodName: 'view',
        paramList: 'id,recordType',
        color: '',
      },
    ];

    return record;
  });

  res.send({
    data,
    lastRow: data.length,
    responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
  });
});

router.post('/dummyServer/**/getAuthorizedSendToBankList', (req, res) => {
  const dataFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  const workbook = XLSX.readFile(dataFilePath);
  let listRecords = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

  if (req.body.dataMap.listingTypeId == 'PAYMENTMETHOD') {
    listRecords.map((record) => {
      record.totalRequest = '1';
      record.totalAmount = record.totalRequestAmount.toString();
      record.recordType = 'singlePayment';
      return record;
    });

    const bulkDataFilePath =
      './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx';
    const bulkWorkbook = XLSX.readFile(bulkDataFilePath);

    const bulkPaymentPendingRecords = XLSX.utils.sheet_to_json(bulkWorkbook.Sheets['Sheet1']);
    bulkPaymentPendingRecords.map((record) => {
      record.totalRequest = record.noOfTransactions.toString();
      record.totalAmount = record.amount.toString();

      record.recordType = 'bulkPayment';
      return record;
    });

    listRecords = [...listRecords, ...bulkPaymentPendingRecords]
      .sort((a, b) => {
        return a.id - b.id;
      })
      .map((record) => {
        record.totalAmount = record.totalAmount ? record.totalAmount : '10000';
        return record;
      });
  } else if (req.body.dataMap.listingTypeId == 'BILLPAYMENT') {
    listRecords.map((record) => {
      record.recordType = 'billPayment';
      return record;
    });
  } else if (req.body.dataMap.listingTypeId == 'FDPLACENMENT') {
    listRecords.map((record) => {
      record.recordType = 'fdPlacement';
      return record;
    });
  } else if (req.body.dataMap.listingTypeId == 'WPSPAYMENT') {
    listRecords.map((record) => {
      record.recordType = 'wpsPayment';
      return record;
    });
  }

  const data = listRecords
    .filter(
      (record) =>
        req.session?.userDetails?.loginPreferenceDetails &&
        ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
          record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
          (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
            record.corporateId == req.session?.userDetails?.corporateId)) &&
        record.authorized == 'Y' &&
        record.sendToBank == 'Y' &&
        record.sysReqStatus.includes('Authorized'),
    )
    .map((record) => {
      record.actions = [
        {
          index: 1,
          displayName: 'View',
          type: 'ICON',
          icon: 'pi pi-eye',
          url: 'private/view',
          methodName: 'view',
          paramList: 'id,recordType',
          color: '',
        },
      ];

      return record;
    });

  res.send({
    data,
    lastRow: data.length,
    responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
  });
});

router.post('/dummyServer/**/getRejectedSendToBankList', (req, res) => {
  const dataFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';
  const workbook = XLSX.readFile(dataFilePath);
  let listRecords = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

  if (req.body.dataMap.listingTypeId == 'PAYMENTMETHOD') {
    listRecords.map((record) => {
      record.totalRequest = '1';
      record.totalAmount = record.totalRequestAmount.toString();
      record.recordType = 'singlePayment';
      return record;
    });

    const bulkDataFilePath =
      './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx';
    const bulkWorkbook = XLSX.readFile(bulkDataFilePath);

    const bulkPaymentPendingRecords = XLSX.utils.sheet_to_json(bulkWorkbook.Sheets['Sheet1']);
    bulkPaymentPendingRecords.map((record) => {
      record.totalRequest = record.noOfTransactions.toString();
      record.totalAmount = record.amount.toString();

      record.recordType = 'bulkPayment';
      return record;
    });

    listRecords = [...listRecords, ...bulkPaymentPendingRecords]
      .sort((a, b) => {
        return a.id - b.id;
      })
      .map((record) => {
        record.totalAmount = record.totalAmount ? record.totalAmount : '10000';
        return record;
      });
  } else if (req.body.dataMap.listingTypeId == 'BILLPAYMENT') {
    listRecords.map((record) => {
      record.recordType = 'billPayment';
      return record;
    });
  } else if (req.body.dataMap.listingTypeId == 'FDPLACENMENT') {
    listRecords.map((record) => {
      record.recordType = 'fdPlacement';
      return record;
    });
  } else if (req.body.dataMap.listingTypeId == 'WPSPAYMENT') {
    listRecords.map((record) => {
      record.recordType = 'wpsPayment';
      return record;
    });
  }

  const data = listRecords
    .filter(
      (record) =>
        req.session?.userDetails?.loginPreferenceDetails &&
        ((req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group' &&
          record.groupId == req.session?.userDetails?.loginPreferenceDetails?.groupId) ||
          (req.session?.userDetails?.loginPreferenceDetails?.loginType != 'group' &&
            record.corporateId == req.session?.userDetails?.corporateId)) &&
        record.authorized == 'Y' &&
        record.sendToBank == 'N' &&
        record.sysReqStatus.includes('Rejected'),
    )
    .map((record) => {
      record.actions = [
        {
          index: 1,
          displayName: 'View',
          type: 'ICON',
          icon: 'pi pi-eye',
          url: 'private/view',
          methodName: 'view',
          paramList: 'id,recordType',
          color: '',
        },
      ];

      return record;
    });

  res.send({
    data,
    lastRow: data.length,
    responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
  });
});

module.exports = router;
