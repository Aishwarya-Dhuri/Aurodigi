var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var moment = require('moment');

var router = express.Router();

router.post(
  '/dummyServer/json/accountServices/services/cashflowForecast/private/getGroupCashflowData',
  (req, res) => {
    let groupId = '1';

    if (req.body?.dataMap?.groupId) {
      groupId = req.body.dataMap.groupId;
    } else if (req.session?.userDetails?.groupId) {
      groupId = req.session.userDetails.groupId;
    }

    const forecastPeriod = req.body.dataMap.forecastPeriod;

    const groupSummery = getGroupCorporates(groupId, forecastPeriod);

    res.send(groupSummery);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/cashflowForecast/private/getCorporateCashflowData',
  (req, res) => {
    const corporateId = req.body.dataMap.corporateId;
    const forecastPeriod = req.body.dataMap.forecastPeriod;

    const corporateAccounts = getCorporateAccounts(corporateId, forecastPeriod);

    res.send(corporateAccounts);
  },
);

const getGroupCorporates = (groupId, forecastPeriod) => {
  var groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
  var groupWorkbook = XLSX.readFile(groupXlFile);

  var groupData = XLSX.utils
    .sheet_to_json(groupWorkbook.Sheets['Sheet1'])
    .find((record) => record.id == groupId);

  var groupDataCorporates = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

  var data = {
    corporateId: groupData.id,
    logo: 'assets/images/' + groupData.groupImage,
    name: groupData.groupName,
    cashInFlowDistributionChartData: [
      {
        label: 'Cheque Collection',
        value: 0,
      },
      {
        label: 'Cash Collection',
        value: 0,
      },
      {
        label: 'PDC Collection',
        value: 0,
      },
      {
        label: 'E-Mandate',
        value: 0,
      },
      {
        label: 'Invoice Financing',
        value: 0,
      },
    ],
    cashOutFlowDistributionChartData: [
      {
        label: 'Future Payment',
        value: 0,
      },
      {
        label: 'Payment By SI',
        value: 0,
      },
      {
        label: 'Bill Payment Scheduled',
        value: 0,
      },
      {
        label: 'Tax Payment Scheduled',
        value: 0,
      },
      {
        label: 'Loan EMI',
        value: 0,
      },
    ],
    totalCashInFlow: 0,
    totalCashOutFlow: 0,
    totalNetInFlow: 0,
    noOfAccounts: 0,
    corporates: [],
  };

  groupDataCorporates
    .filter((record) => record.mstId == groupId)
    .forEach((record) => {
      const cashflowCorporateData = getCorporateAccounts(record.corporateId, forecastPeriod);

      data.cashInFlowDistributionChartData[0].value +=
        cashflowCorporateData.cashInFlowDistributionChartData[0].value;
      data.cashInFlowDistributionChartData[1].value +=
        cashflowCorporateData.cashInFlowDistributionChartData[1].value;
      data.cashInFlowDistributionChartData[2].value +=
        cashflowCorporateData.cashInFlowDistributionChartData[2].value;
      data.cashInFlowDistributionChartData[3].value +=
        cashflowCorporateData.cashInFlowDistributionChartData[3].value;
      data.cashInFlowDistributionChartData[4].value +=
        cashflowCorporateData.cashInFlowDistributionChartData[4].value;

      data.cashOutFlowDistributionChartData[0].value +=
        cashflowCorporateData.cashOutFlowDistributionChartData[0].value;
      data.cashOutFlowDistributionChartData[1].value +=
        cashflowCorporateData.cashOutFlowDistributionChartData[1].value;
      data.cashOutFlowDistributionChartData[2].value +=
        cashflowCorporateData.cashOutFlowDistributionChartData[2].value;
      data.cashOutFlowDistributionChartData[3].value +=
        cashflowCorporateData.cashOutFlowDistributionChartData[3].value;
      data.cashOutFlowDistributionChartData[4].value +=
        cashflowCorporateData.cashOutFlowDistributionChartData[4].value;

      data.totalCashInFlow += cashflowCorporateData.totalCashInFlow;
      data.totalCashOutFlow += cashflowCorporateData.totalCashOutFlow;
      data.totalNetInFlow += cashflowCorporateData.totalNetInFlow;
      data.noOfAccounts += cashflowCorporateData.accounts.length;

      data.corporates.push(cashflowCorporateData);
    });

  return data;
};

const getCorporateAccounts = (corporateId, forecastPeriod) => {
  var data = {};

  var corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
  var corporateWorkbook = XLSX.readFile(corporateXlFile);

  var corporateXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['Sheet1']);
  var accountsXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['accounts']);

  const corporateData = corporateXlData.find((corp) => corp.id == corporateId);

  if (corporateData) {
    const corporateCashInFlowDistributionChartData = [
      {
        label: 'Cheque Collection',
        value: 0,
      },
      {
        label: 'Cash Collection',
        value: 0,
      },
      {
        label: 'PDC Collection',
        value: 0,
      },
      {
        label: 'E-Mandate',
        value: 0,
      },
      {
        label: 'Invoice Financing',
        value: 0,
      },
    ];
    const corporateCashOutFlowDistributionChartData = [
      {
        label: 'Future Payment',
        value: 0,
      },
      {
        label: 'Payment By SI',
        value: 0,
      },
      {
        label: 'Bill Payment Scheduled',
        value: 0,
      },
      {
        label: 'Tax Payment Scheduled',
        value: 0,
      },
      {
        label: 'Loan EMI',
        value: 0,
      },
    ];

    let corporateTotalCashInFlow = 0;
    let corporateTotalCashOutFlow = 0;
    let corporateTotalNetInFlow = 0;

    forecastPeriod = forecastPeriod.split(' - ');

    data = {
      corporateId: corporateData.id,
      logo: 'assets/images/' + corporateData.corporateImage,
      name: corporateData.corporateName,
      accounts: accountsXlData
        .filter((acc) => acc.mstId === corporateData.id && acc.cashflowAccount == 'Y')
        .map((acc) => {
          const cashInFlowDistributionChartData = [
            {
              label: 'Cheque Collection',
              value: 0,
            },
            {
              label: 'Cash Collection',
              value: 0,
            },
            {
              label: 'PDC Collection',
              value: 0,
            },
            {
              label: 'E-Mandate',
              value: 0,
            },
            {
              label: 'Invoice Financing',
              value: 0,
            },
          ];
          const cashOutFlowDistributionChartData = [
            {
              label: 'Future Payment',
              value: 0,
            },
            {
              label: 'Payment By SI',
              value: 0,
            },
            {
              label: 'Bill Payment Scheduled',
              value: 0,
            },
            {
              label: 'Tax Payment Scheduled',
              value: 0,
            },
            {
              label: 'Loan EMI',
              value: 0,
            },
          ];
          let cashflowGridData = [];
          let cashflowChartData = [];

          let totalCashInFlow = 0;
          let totalCashOutFlow = 0;
          let totalNetInFlow = 0;

          let openingBalance = 0;
          let closingBalance = 0;

          const cashflowDetails = getAccountCashflow(acc.accountNo);

          cashflowDetails.forEach((cashflowRecord) => {
            cashInFlowDistributionChartData[0].value += +cashflowRecord.chequeCollection;
            cashInFlowDistributionChartData[1].value += +cashflowRecord.cashCollection;
            cashInFlowDistributionChartData[2].value += +cashflowRecord.pdcCollection;
            cashInFlowDistributionChartData[3].value += +cashflowRecord.eMandate;
            cashInFlowDistributionChartData[4].value += +cashflowRecord.invoiceFinancing;

            cashOutFlowDistributionChartData[0].value += +cashflowRecord.futurePayment;
            cashOutFlowDistributionChartData[1].value += +cashflowRecord.paymentBySi;
            cashOutFlowDistributionChartData[2].value += +cashflowRecord.billPaymentScheduled;
            cashOutFlowDistributionChartData[3].value += +cashflowRecord.taxPaymentScheduled;
            cashOutFlowDistributionChartData[4].value += +cashflowRecord.loanEmi;

            // cashflowGridData.push({
            //   month: cashflowRecord.date.trim().substring(3, 11),
            //   openingBalance: cashflowRecord.openingBalance,
            //   closingBalance: cashflowRecord.closingBalance,
            // });

            const month = cashflowRecord.date.trim().substring(3, 11);

            const compareDate = moment(new Date(cashflowRecord.date.trim()), 'DD/MM/YYYY');
            const startDate = moment(new Date(forecastPeriod[0]), 'DD/MM/YYYY');
            const endDate = moment(
              forecastPeriod[1]
                ? new Date(forecastPeriod[1])
                : moment(new Date(forecastPeriod[0]), 'DD/MM/YYYY').add(180, 'days'),
              'DD/MM/YYYY',
            );

            if (compareDate.isBetween(startDate, endDate)) {
              const cashflowGridDataIndex = cashflowGridData.findIndex(
                (cashflowChart) => cashflowChart.month == month,
              );

              if (cashflowGridDataIndex > -1) {
                cashflowGridData[cashflowGridDataIndex].openingBalance +=
                  +cashflowRecord.openingBalance;
                cashflowGridData[cashflowGridDataIndex].closingBalance +=
                  +cashflowRecord.closingBalance;
                cashflowGridData[cashflowGridDataIndex].data.push({
                  date: cashflowRecord.date,
                  openingBalance: +cashflowRecord.openingBalance,
                  closingBalance: +cashflowRecord.closingBalance,
                });
              } else {
                cashflowGridData.push({
                  month,
                  date: '15-' + month,
                  openingBalance: +cashflowRecord.openingBalance,
                  closingBalance: +cashflowRecord.closingBalance,
                  data: [
                    {
                      date: cashflowRecord.date,
                      openingBalance: +cashflowRecord.openingBalance,
                      closingBalance: +cashflowRecord.closingBalance,
                    },
                  ],
                });
              }

              cashflowGridData = cashflowGridData.sort((a, b) => {
                const d1 = new Date(a.date).getTime();
                const d2 = new Date(b.date).getTime();
                return d1 > d2 ? 1 : d2 > d1 ? -1 : 0;
              });

              const cashflowChartDataIndex = cashflowChartData.findIndex(
                (cashflowChart) => cashflowChart.month == month,
              );

              if (cashflowChartDataIndex > -1) {
                cashflowChartData[cashflowChartDataIndex].cashInFlow += +cashflowRecord.cashInflow;
                cashflowChartData[cashflowChartDataIndex].cashOutFlow +=
                  +cashflowRecord.cashOutFlow;
                cashflowChartData[cashflowChartDataIndex].netCashFlow += +cashflowRecord.netInFlow;
                // cashflowChartData[cashflowChartDataIndex].delta += +cashflowRecord.delta;
                cashflowChartData[cashflowChartDataIndex].lastYearNetCashFlow +=
                  +cashflowRecord.lastYearNetCashflow;
              } else {
                cashflowChartData.push({
                  month,
                  date: '15-' + month,
                  cashInFlow: +cashflowRecord.cashInflow,
                  cashOutFlow: +cashflowRecord.cashOutFlow,
                  netCashFlow: +cashflowRecord.netInFlow,
                  // delta: +cashflowRecord.delta,
                  lastYearNetCashFlow: +cashflowRecord.lastYearNetCashflow,
                });
              }

              cashflowChartData = cashflowChartData.sort((a, b) => {
                const d1 = new Date(a.date).getTime();
                const d2 = new Date(b.date).getTime();
                return d1 > d2 ? 1 : d2 > d1 ? -1 : 0;
              });
            }

            openingBalance += +cashflowRecord.openingBalance;

            closingBalance += +cashflowRecord.closingBalance;

            totalNetInFlow += +cashflowRecord.netInFlow;
            corporateTotalNetInFlow += +cashflowRecord.netInFlow;
          });

          corporateCashInFlowDistributionChartData[0].value +=
            cashInFlowDistributionChartData[0].value;
          corporateCashInFlowDistributionChartData[1].value +=
            cashInFlowDistributionChartData[1].value;
          corporateCashInFlowDistributionChartData[2].value +=
            cashInFlowDistributionChartData[2].value;
          corporateCashInFlowDistributionChartData[3].value +=
            cashInFlowDistributionChartData[3].value;
          corporateCashInFlowDistributionChartData[4].value +=
            cashInFlowDistributionChartData[4].value;

          cashInFlowDistributionChartData.forEach((record) => {
            totalCashInFlow += record.value;
            corporateTotalCashInFlow += record.value;
          });

          corporateCashOutFlowDistributionChartData[0].value +=
            cashOutFlowDistributionChartData[0].value;
          corporateCashOutFlowDistributionChartData[1].value +=
            cashOutFlowDistributionChartData[0].value;
          corporateCashOutFlowDistributionChartData[2].value +=
            cashOutFlowDistributionChartData[0].value;
          corporateCashOutFlowDistributionChartData[3].value +=
            cashOutFlowDistributionChartData[0].value;
          corporateCashOutFlowDistributionChartData[4].value +=
            cashOutFlowDistributionChartData[0].value;

          cashOutFlowDistributionChartData.forEach((record) => {
            totalCashOutFlow += record.value;
            corporateTotalCashOutFlow += record.value;
          });

          return {
            ...acc,
            show: false,
            cashFlowForecastOverview: 'Cash Flow',
            accountNumber: acc.accountNo + '-' + acc.currencyCode,
            cashInFlowDistributionChartData,
            cashOutFlowDistributionChartData,
            cashflowGridData,
            cashflowChartData,
            totalCashInFlow,
            totalCashOutFlow,
            totalNetInFlow,
            openingBalance,
            closingBalance,
            cashflowData: cashflowDetails,
          };
        }),
      cashInFlowDistributionChartData: corporateCashInFlowDistributionChartData,
      cashOutFlowDistributionChartData: corporateCashOutFlowDistributionChartData,
      totalCashInFlow: corporateTotalCashInFlow,
      totalCashOutFlow: corporateTotalCashOutFlow,
      totalNetInFlow: corporateTotalNetInFlow,
    };
  }

  return data;
};

const getAccountCashflow = (accountNo) => {
  const cashflowXlFile = './dummyServer/json/accountServices/services/cashFlowForcast/data.xlsx';

  var cashflowWorkbook = XLSX.readFile(cashflowXlFile);

  var cashflowData = XLSX.utils
    .sheet_to_json(cashflowWorkbook.Sheets['Sheet1'])
    .filter((record) => record.accountNo == accountNo);

  return cashflowData;
};

module.exports = router;
