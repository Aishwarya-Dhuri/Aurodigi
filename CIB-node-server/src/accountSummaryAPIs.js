const express = require('express');
const XLSX = require('xlsx');
const _ = require('lodash');
const req = require('express/lib/request');

const router = express.Router();

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getGroupSummaryData',
  (req, res) => {
    let groupId = '1';

    if (req.body?.dataMap?.groupId) {
      groupId = req.body.dataMap.groupId;
    } else if (req.session?.userDetails?.groupId) {
      groupId = req.session.userDetails.groupId;
    }
    const groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
    const groupWorkbook = XLSX.readFile(groupXlFile);

    const groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['Sheet1']);

    const group = groupData.find((g) => g.id == groupId);

    let totalAccounts = 0;
    let overallBalance = 0;
    let overallLimit = 0;

    const corporates = getGroupCorporates(groupId);

    const chartData = [
      {
        summary: 'CASA',
        accounts: 0,
        amount: 0,
      },
      // {
      //   summary: 'CASA Islamic',
      //   accounts: 0,
      //   amount: 0,
      // },
      {
        summary: 'Loan',
        accounts: 0,
        amount: 0,
      },
      // {
      //   summary: 'Loan Islamic',
      //   accounts: 0,
      //   amount: 0,
      // },
      {
        summary: 'Virtual Account',
        accounts: 0,
        amount: 0,
      },
      {
        summary: 'FD Summary',
        accounts: 0,
        amount: 0,
      },
      {
        summary: 'Credit Card',
        accounts: 0,
        amount: 0,
      },
      {
        summary: 'Debit Card',
        accounts: 0,
        amount: 0,
      },
      {
        summary: 'External Account Summary',
        accounts: 0,
        amount: 0,
      },
      {
        summary: 'Equity Summary',
        accounts: 0,
        amount: 0,
      },
      {
        summary: 'MF Summary',
        accounts: 0,
        amount: 0,
      },
    ];

    corporates.forEach((corp) => {
      const corporateData = getCorporateSummary(corp.corporateId);

      if (corporateData) {
        totalAccounts += corporateData.totalAccounts;
        overallBalance += corporateData.overallBalance;
        overallLimit += corporateData.overallLimit;

        corporateData.chartData.forEach((chart, i) => {
          chartData[i].accounts += chart.accounts;
          chartData[i].amount += chart.amount;
        });
      }
    });

    let response = {
      data: {
        name: group.groupName,
        image: group.groupImage,
        totalAccounts,
        overallBalance,
        overallLimit,
        chartData,
        corporates,
      },
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getCorporateSummaryData',
  (req, res) => {
    let corporateId = req.body.dataMap.corporateId;
    const bankType = req.body.dataMap.bankType;

    let data = {};

    if (bankType == 'Islamic') {
      data = getIslamicCorporateSummary(corporateId);
    } else {
      data = getCorporateSummary(corporateId);
    }

    let response = {
      data,
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

const getGroupCorporates = (groupId) => {
  let groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
  let groupWorkbook = XLSX.readFile(groupXlFile);

  let groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

  let dataList = [];

  let corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
  let corporateWorkbook = XLSX.readFile(corporateXlFile);

  let corporateXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['Sheet1']);
  let accountsXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['accounts']);

  groupData
    .filter((record) => record.mstId == groupId)
    .forEach((record) => {
      const corporateData = corporateXlData.find((corp) => corp.id == record.corporateId);

      if (corporateData) {
        let totalBalance = 0;
        let totalLimit = 0;
        let totalAccounts = 0;
        accountsXlData
          .filter((acc) => acc.mstId === corporateData.id)
          .forEach((acc) => {
            if (
              acc.lastAction.indexOf('Authorized') !== -1 &&
              ['CURRENT', 'SAVING'].includes(acc.accountType.toUpperCase())
            ) {
              totalBalance += acc.availableBalance;
              totalLimit += acc.odLimit;
            }
            totalAccounts++;
          });

        dataList.push({
          corporateId: corporateData.id,
          logo: 'assets/images/' + corporateData.corporateImage,
          image: 'assets/images/' + corporateData.corporateImage,
          name: corporateData.corporateName,
          accounts: totalAccounts,
          availableBalance: totalBalance,
          availableLimit: totalLimit,
        });
      }
    });

  return dataList;
};

const getIslamicCorporateSummary = (corporateId) => {
  {
    let overallBalance = 0;
    let overallLimit = 0;
    let totalAccounts = 0;

    let casa = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    let loan = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    let fd = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };

    const accountsDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

    const accountsWorkbook = XLSX.readFile(accountsDataFilePath);

    const accountsData = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['accounts']);

    const corporates = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['Sheet1']);

    const corporate = corporates.find((record) => corporateId == record.id);

    accountsData
      .filter(
        (record) =>
          record.lastAction.indexOf('Authorized') !== -1 &&
          corporateId == record.mstId &&
          record.bankAccountType == 'ISLAMIC',
      )
      .forEach((data) => {
        if (['CURRENT', 'SAVING'].includes(data.accountType.toUpperCase())) {
          casa.totalAmount += +data.balance;
          casa.creditAmount += +data.totalCreditBalance;
          casa.debitAmount += +data.totalDebitBalance;
          casa.accounts.push(data);

          overallBalance += +data.balance;
          totalAccounts++;
        } else if (data.accountType.toUpperCase().includes('LOAN')) {
          loan.totalAmount += +data.balance;
          loan.creditAmount += +data.totalCreditBalance;
          loan.debitAmount += +data.totalDebitBalance;
          loan.accounts.push(data);

          overallLimit += +data.balance;
          totalAccounts++;
        }
      });

    const fdDataFilePath = './dummyServer/json/accountServices/fixedDeposit/fdInitiation/data.xlsx';

    const fdWorkbook = XLSX.readFile(fdDataFilePath);

    const fdData = XLSX.utils.sheet_to_json(fdWorkbook.Sheets['Sheet1']);

    fdData
      .filter(
        (record) =>
          record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.corporateId,
      )
      .forEach((data) => {
        fd.totalAmount += +data.depositAmount;
        fd.creditAmount += +data.creditLimit;
        fd.debitAmount += +data.debitLimit;
        fd.accounts.push(data);

        totalAccounts++;
      });

    const chartData = [
      {
        summary: 'CASA Islamic',
        accounts: casa.accounts.length,
        amount: casa.totalAmount,
      },
      {
        summary: 'Finance',
        accounts: loan.accounts.length,
        amount: loan.totalAmount,
      },
      {
        summary: 'FD Summary',
        accounts: fd.accounts.length,
        amount: fd.totalAmount,
      },
    ];

    const summaries = [
      {
        id: 'casa',
        displayName: 'CASA Islamic',
        colDefUrl: 'accountServices/services/accountSummary/private/casaColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getCasaData',
        totalAccounts: casa.accounts.length,
        totalAmount: casa.totalAmount,
        creditAmount: casa.creditAmount,
        debitAmount: casa.debitAmount,
        accounts: casa.accounts,
        limitOrBalance: 'Balance',
        mainLabel: 'Overall Account Balance',
        label1: 'Total Credit Balance',
        label2: 'Total Debit Balance',
        totalLabel: 'Total Balance',
        moreOptionsList: [
          {
            label: 'Single Payment Initiation',
            method: 'onSinglePaymentInitiation',
          },
          {
            label: 'FD Initiation',
            method: 'onFdInitiation',
          },
          {
            label: 'Statement Download',
            method: 'onStatementDownload',
          },
        ],
      },
      {
        id: 'loan',
        displayName: 'Finance',
        colDefUrl: 'accountServices/services/accountSummary/private/loanColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getLoanData',
        totalAccounts: loan.accounts.length,
        totalAmount: loan.totalAmount,
        creditAmount: loan.creditAmount,
        debitAmount: loan.debitAmount,
        accounts: loan.accounts,
        limitOrBalance: 'Amount',
        mainLabel: 'Total Approved Amount',
        label1: 'Total Disbursed Amount',
        label2: 'Total Outstanding Amount',
        totalLabel: 'Total Finance Amount',
        moreOptionsList: [
          {
            label: 'View Contract Details',
            method: 'onViewContractDetails',
          },
          {
            label: 'Rate Change History',
            method: 'onRateChangeHistory',
          },
          {
            label: 'Arrears Statement',
            method: 'onArrearsStatement',
          },
          {
            label: 'Mini Statement',
            method: 'onMiniStatement',
          },
          {
            label: 'Repayment Schedule',
            method: 'onRepaymentSchedule',
          },
          {
            label: 'Interest Calculation',
            method: 'onInterestCalculation',
          },
        ],
      },
      {
        id: 'fdSummery',
        displayName: 'FD Summary',
        colDefUrl: 'accountServices/services/accountSummary/private/fdIslamicColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getFdData',
        totalAccounts: fd.accounts.length,
        accounts: fd.accounts,
        totalAmount: fd.totalAmount,
        creditAmount: fd.creditAmount,
        debitAmount: fd.debitAmount,
        limitOrBalance: 'Limit',
        mainLabel: 'Total Deposit Amount',
        label1: 'Total Maturity Amount',
        label2: '',
        totalLabel: 'Total FD Amount',
        moreOptionsList: [
          {
            label: 'Additional Details',
            method: 'onAdditionalDetails',
          },
          {
            label: 'FD Advices',
            method: 'onFdAdvices',
          },
          {
            label: 'Change Maturity Instructions',
            method: 'onChangeMaturityInstructions',
          },
        ],
      },
    ];

    return {
      name: corporate.corporateName,
      image: corporate.corporateImage,
      totalAccounts,
      overallBalance,
      overallLimit,
      chartData,
      summaries,
    };
  }
};

const getCorporateSummary = (corporateId) => {
  {
    let overallBalance = 0;
    let overallLimit = 0;
    let totalAccounts = 0;

    let casa = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    // let casaIslamic = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    let loan = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    // let loanIslamic = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    let fd = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    let va = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    let cc = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    let dc = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    let ea = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };

    const accountsDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

    const accountsWorkbook = XLSX.readFile(accountsDataFilePath);

    const accountsData = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['accounts']);

    const corporates = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['Sheet1']);

    const corporate = corporates.find((record) => corporateId == record.id);

    accountsData
      .filter(
        (record) => record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.mstId,
      )
      .forEach((data) => {
        if (['CURRENT', 'SAVING'].includes(data.accountType.toUpperCase())) {
          casa.totalAmount += +data.balance;
          casa.creditAmount += +data.totalCreditBalance;
          casa.debitAmount += +data.totalDebitBalance;
          casa.accounts.push(data);

          overallBalance += +data.balance;
          totalAccounts++;
        } else if (data.accountType.toUpperCase().includes('LOAN')) {
          loan.totalAmount += +data.balance;
          loan.creditAmount += +data.totalCreditBalance;
          loan.debitAmount += +data.totalDebitBalance;
          loan.accounts.push(data);

          overallLimit += +data.balance;
          totalAccounts++;
        }
      });

    // const islamicAccountsDataFilePath =
    //   './dummyServer/json/setup/corporateOnboarding/corporateMain/islamic-data.xlsx';

    // const islamicAccountsWorkbook = XLSX.readFile(islamicAccountsDataFilePath);

    // const islamicAccountsData = XLSX.utils.sheet_to_json(
    //   islamicAccountsWorkbook.Sheets['accounts'],
    // );

    // islamicAccountsData
    //   .filter(
    //     (record) => record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.mstId,
    //   )
    //   .forEach((data) => {
    //     if (['CURRENT', 'SAVING'].includes(data.accountType.toUpperCase())) {
    //       casaIslamic.totalAmount += +data.balance;
    //       casaIslamic.creditAmount += +data.totalCreditBalance;
    //       casaIslamic.debitAmount += +data.totalDebitBalance;
    //       casaIslamic.accounts.push(data);

    //       overallBalance += +data.balance;
    //       totalAccounts++;
    //     } else if (data.accountType.toUpperCase().includes('LOAN')) {
    //       loanIslamic.totalAmount += +data.balance;
    //       loanIslamic.creditAmount += +data.totalCreditBalance;
    //       loanIslamic.debitAmount += +data.totalDebitBalance;
    //       loanIslamic.accounts.push(data);

    //       overallLimit += +data.balance;
    //       totalAccounts++;
    //     }
    //   });

    const fdDataFilePath = './dummyServer/json/accountServices/fixedDeposit/fdInitiation/data.xlsx';

    const fdWorkbook = XLSX.readFile(fdDataFilePath);

    const fdData = XLSX.utils.sheet_to_json(fdWorkbook.Sheets['Sheet1']);

    fdData
      .filter(
        (record) =>
          record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.corporateId,
      )
      .forEach((data) => {
        fd.totalAmount += +data.depositAmount;
        fd.creditAmount += +data.maturityAmount;
        fd.debitAmount += +data.depositAmount;
        fd.accounts.push(data);

        totalAccounts++;
      });

    const vaData = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['virtualAccounts']);

    vaData
      .filter(
        (record) => record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.mstId,
      )
      .forEach((data) => {
        va.totalAmount += +data.availableLimit;
        va.creditAmount += +data.utilizedLimit + 123450;
        va.debitAmount += +data.utilizedLimit;
        va.accounts.push(data);

        totalAccounts++;
      });

    const creditCardDataFilePath = './dummyServer/json/accountServices/creditCard/data.xlsx';

    const creditCardWorkbook = XLSX.readFile(creditCardDataFilePath);

    const creditCardData = XLSX.utils.sheet_to_json(creditCardWorkbook.Sheets['Sheet1']);

    creditCardData
      .filter(
        (record) =>
          record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.corporateId,
      )
      .forEach((data) => {
        cc.totalAmount += +data.cardLimit;
        cc.creditAmount += +data.totalAmountDue;
        cc.debitAmount += +data.outStandingAmount;
        cc.accounts.push(data);

        overallLimit += +data.cardLimit;
      });

    // debit card start

    const debitCardDataFilePath = './dummyServer/json/accountServices/debitCard/data.xlsx';

    const debitCardWorkbook = XLSX.readFile(debitCardDataFilePath);

    const debitCardData = XLSX.utils.sheet_to_json(debitCardWorkbook.Sheets['Sheet1']);

    debitCardData
      // .filter(
      //   (record) =>
      //     record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.corporateId,
      // )
      .forEach((data) => {
        dc.accounts.push(data);
      });

    // debit card end

    const eaDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateAccount/data.xlsx';

    const eaWorkbook = XLSX.readFile(eaDataFilePath);

    const eaData = XLSX.utils.sheet_to_json(eaWorkbook.Sheets['Sheet1']);

    eaData
      .filter(
        (record) =>
          record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.corporateId,
      )
      .forEach((data) => {
        ea.totalAmount += +data.availableBalance;
        ea.creditAmount += +data.creditLimit;
        ea.debitAmount += +data.debitLimit;
        ea.accounts.push(data);

        overallBalance += +data.availableBalance;
      });

    const chartData = [
      {
        summary: 'CASA',
        accounts: casa.accounts.length,
        amount: casa.totalAmount,
      },
      // {
      //   summary: 'CASA Islamic',
      //   accounts: casaIslamic.accounts.length,
      //   amount: casaIslamic.totalAmount,
      // },
      {
        summary: 'Loan',
        accounts: loan.accounts.length,
        amount: loan.totalAmount,
      },
      // {
      //   summary: 'Loan Islamic',
      //   accounts: loanIslamic.accounts.length,
      //   amount: loanIslamic.totalAmount,
      // },
      {
        summary: 'Virtual Account',
        accounts: va.accounts.length,
        amount: va.totalAmount,
      },
      {
        summary: 'FD Summary',
        accounts: fd.accounts.length,
        amount: fd.totalAmount,
      },
      {
        summary: 'Credit Card',
        accounts: cc.accounts.length,
        amount: cc.totalAmount,
      },
      {
        summary: 'Debit Card',
        accounts: cc.accounts.length,
        amount: cc.totalAmount,
      },
      {
        summary: 'External Account Summary',
        accounts: ea.accounts.length,
        amount: ea.totalAmount,
      },
      {
        summary: 'Equity Summary',
        accounts: 3,
        amount: 150000.0,
      },
      {
        summary: 'MF Summary',
        accounts: 4,
        amount: 100000.0,
      },
    ];

    const summaries = [
      {
        id: 'casa',
        displayName: 'CASA',
        colDefUrl: 'accountServices/services/accountSummary/private/casaColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getCasaData',
        totalAccounts: casa.accounts.length,
        totalAmount: casa.totalAmount,
        creditAmount: casa.creditAmount,
        debitAmount: casa.debitAmount,
        accounts: casa.accounts,
        showLimitCard: true,
        limitOrBalance: 'Balance',
        mainLabel: 'Overall Account Balance',
        label1: 'Total Credit Balance',
        label2: 'Total Debit Balance',
        totalLabel: 'Total Balance',
        moreOptionsList: [
          {
            label: 'Single Payment Initiation',
            method: 'onSinglePaymentInitiation',
          },
          {
            label: 'FD Initiation',
            method: 'onFdInitiation',
          },
          {
            label: 'Statement Download',
            method: 'onStatementDownload',
          },
        ],
      },
      // {
      //   id: 'casaIslamic',
      //   displayName: 'CASA Islamic',
      //   colDefUrl: 'accountServices/services/accountSummary/private/casaIslamicColDefs',
      //   rowDefUrl: 'accountServices/services/accountSummary/private/getCasaIslamicData',
      //   totalAccounts: casaIslamic.accounts.length,
      //   totalAmount: casaIslamic.totalAmount,
      //   creditAmount: casaIslamic.creditAmount,
      //   debitAmount: casaIslamic.debitAmount,
      //   accounts: casaIslamic.accounts,
      //   showLimitCard: true,
      //   limitOrBalance: 'Balance',
      //   mainLabel: 'Overall Account Balance',
      //   label1: 'Total Credit Balance',
      //   label2: 'Total Debit Balance',
      //   totalLabel: 'Total Balance',
      //   moreOptionsList: [],
      // },
      {
        id: 'loan',
        displayName: 'Loan',
        colDefUrl: 'accountServices/services/accountSummary/private/loanColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getLoanData',
        totalAccounts: loan.accounts.length,
        totalAmount: loan.totalAmount,
        creditAmount: loan.creditAmount,
        debitAmount: loan.debitAmount,
        accounts: loan.accounts,
        showLimitCard: true,
        limitOrBalance: 'Amount',
        mainLabel: 'Total Approved Amount',
        label1: 'Total Disbursed Amount',
        label2: 'Total Outstanding Amount',
        totalLabel: 'Total Loan Amount',
        moreOptionsList: [
          {
            label: 'View Contract Details',
            method: 'onViewContractDetails',
          },
          {
            label: 'Rate Change History',
            method: 'onRateChangeHistory',
          },
          {
            label: 'Arrears Statement',
            method: 'onArrearsStatement',
          },
          {
            label: 'Mini Statement',
            method: 'onMiniStatement',
          },
          {
            label: 'Repayment Schedule',
            method: 'onRepaymentSchedule',
          },
          {
            label: 'Interest Calculation',
            method: 'onInterestCalculation',
          },
        ],
      },
      // {
      //   id: 'loanIslamic',
      //   displayName: 'Loan Islamic',
      //   colDefUrl: 'accountServices/services/accountSummary/private/loanIslamicColDefs',
      //   rowDefUrl: 'accountServices/services/accountSummary/private/getLoanIslamicData',
      //   totalAccounts: loanIslamic.accounts.length,
      //   totalAmount: loanIslamic.totalAmount,
      //   creditAmount: loanIslamic.creditAmount,
      //   debitAmount: loanIslamic.debitAmount,
      //   accounts: loanIslamic.accounts,
      //   showLimitCard: true,
      //   limitOrBalance: 'Amount',
      //   mainLabel: 'Total Approved Amount',
      //   label1: 'Total Disbursed Amount',
      //   label2: 'Total Outstanding Amount',
      //   totalLabel: 'Total Loan Amount',
      //   moreOptionsList: [
      //     {
      //       label: 'View Contract Details',
      //       method: 'onViewContractDetails',
      //     },
      //     {
      //       label: 'Rate Change History',
      //       method: 'onRateChangeHistory',
      //     },
      //     {
      //       label: 'Arrears Statement',
      //       method: 'onArrearsStatement',
      //     },
      //     {
      //       label: 'Mini Statement',
      //       method: 'onMiniStatement',
      //     },
      //     {
      //       label: 'Repayment Schedule',
      //       method: 'onRepaymentSchedule',
      //     },
      //     {
      //       label: 'Interest Calculation',
      //       method: 'onInterestCalculation',
      //     },
      //   ],
      // },
      {
        id: 'virtualAccount',
        displayName: 'Virtual Account',
        colDefUrl: 'accountServices/services/accountSummary/private/virtualAccountColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getVirtualAccountData',
        totalAccounts: va.accounts.length,
        totalAmount: va.totalAmount,
        creditAmount: va.creditAmount,
        debitAmount: va.debitAmount,
        accounts: va.accounts,
        showLimitCard: true,
        limitOrBalance: 'Limit',
        mainLabel: 'Overall Account Balance',
        label1: 'Total Credit Balance',
        label2: 'Total Debit Balance',
        totalLabel: 'Total Amount',
        moreOptionsList: [
          {
            label: 'Single Payment Initiation',
            method: 'onSinglePaymentInitiation',
          },
          {
            label: 'FD Initiation',
            method: 'onFdInitiation',
          },
          {
            label: 'Statement Download',
            method: 'onStatementDownload',
          },
        ],
      },
      {
        id: 'fdSummery',
        displayName: 'FD Summary',
        colDefUrl: 'accountServices/services/accountSummary/private/fdColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getFdData',
        totalAccounts: fd.accounts.length,
        accounts: fd.accounts,
        totalAmount: fd.totalAmount,
        creditAmount: fd.creditAmount,
        debitAmount: fd.debitAmount,
        showLimitCard: true,
        limitOrBalance: 'Limit',
        mainLabel: 'Total Deposit Amount',
        label1: 'Total Maturity Amount',
        label2: '',
        totalLabel: 'Total FD Amount',
        moreOptionsList: [
          {
            label: 'Additional Details',
            method: 'onAdditionalDetails',
          },
          {
            label: 'FD Advices',
            method: 'onFdAdvices',
          },
          {
            label: 'Change Maturity Instructions',
            method: 'onChangeMaturityInstructions',
          },
        ],
      },
      {
        id: 'creditCard',
        displayName: 'Credit Card',
        colDefUrl: 'accountServices/services/accountSummary/private/creditCardColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getCreditCardData',
        totalAccounts: cc.accounts.length,
        accounts: cc.accounts,
        totalAmount: cc.totalAmount,
        creditAmount: cc.creditAmount,
        debitAmount: cc.debitAmount,
        showLimitCard: true,
        limitOrBalance: 'Limit',
        mainLabel: 'Total Credit Limit',
        label1: 'Total Amount Due',
        label2: 'Total Outstanding Amount',
        totalLabel: 'Total Available Limit',
        moreOptionsList: [
          {
            label: 'Card Payment',
            method: 'onCardPayment',
          },
          {
            label: 'Statement Download',
            method: 'onStatementDownload',
          },
        ],
      },
      {
        id: 'debitCard',
        displayName: 'Debit Card',
        colDefUrl: 'accountServices/services/accountSummary/private/debitCardAccountColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getDebitCardAccountData',
        totalAccounts: dc.accounts.length,
        accounts: dc.accounts,
        totalAmount: 0,
        creditAmount: 0,
        debitAmount: 0,
        showLimitCard: false,
        limitOrBalance: 'Limit',
        mainLabel: 'Total Credit Limit',
        label1: 'Total Amount Due',
        label2: 'Total Outstanding Amount',
        totalLabel: 'Total Available Limit',
        moreOptionsList: [
          {
            label: 'Statement Download',
            method: 'onStatementDownload',
          },
        ],
      },
      {
        id: 'externalAccountSummery',
        displayName: 'External Account Summary',
        colDefUrl: 'accountServices/services/accountSummary/private/externalAccountColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getExternalAccountData',
        totalAccounts: ea.accounts.length,
        totalAmount: ea.totalAmount,
        creditAmount: ea.creditAmount,
        debitAmount: ea.debitAmount,
        accounts: ea.accounts,
        showLimitCard: true,
        limitOrBalance: 'Balance',
        mainLabel: 'Overall Account Balance',
        label1: 'Total Credit Balance',
        label2: 'Total Debit Balance',
        totalLabel: 'Total Amount',
        moreOptionsList: [
          {
            label: 'View Account Details',
            method: 'onViewAccountDetails',
          },
        ],
      },
      {
        id: 'equitySummery',
        displayName: 'Equity Summary',
        colDefUrl: 'accountServices/services/accountSummary/private/colDefs',
        rowDefUrl: 'accountServices/services/accountSummary/summaryData/private/getData',
        totalAccounts: 15,
        accounts: [],
        totalAmount: 6985230,
        creditAmount: 6812350,
        debitAmount: 6854800,
        showLimitCard: true,
        limitOrBalance: 'Balance',
        mainLabel: 'Overall Account Balance',
        label1: 'Total Credit Balance',
        label2: 'Total Debit Balance',
        totalLabel: 'Total Amount',
        moreOptionsList: [],
      },
      {
        id: 'mfSummery',
        displayName: 'MF Summary',
        colDefUrl: 'accountServices/services/accountSummary/private/colDefs',
        rowDefUrl: 'accountServices/services/accountSummary/summaryData/private/getData',
        totalAccounts: 15,
        accounts: [],
        totalAmount: 698500,
        creditAmount: 68545700,
        debitAmount: 68545300,
        showLimitCard: true,
        limitOrBalance: 'Balance',
        mainLabel: 'Overall Account Balance',
        label1: 'Total Credit Balance',
        label2: 'Total Debit Balance',
        totalLabel: 'Total Amount',
        moreOptionsList: [],
      },
      {
        id: 'commoditySummary',
        displayName: 'Commodity Summary',
        colDefUrl: 'accountServices/services/accountSummary/private/ColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getData',
        totalAccounts: 2,
        accounts: [777003098456],
        totalAmount: 698100,
        creditAmount: 6845700,
        debitAmount: 6857500,
        showLimitCard: true,
        limitOrBalance: 'Balance',
        mainLabel: 'Overall Account Balance',
        label1: 'Total Credit Balance',
        label2: 'Total Debit Balance',
        totalLabel: 'Total Amount',
        moreOptionsList: [],
      },
      {
        id: 'fxSummary',
        displayName: 'FX Summary',
        colDefUrl: 'accountServices/services/accountSummary/private/colDefs',
        rowDefUrl: 'accountServices/services/accountSummary/summaryData/private/getData',
        totalAccounts: 15,
        accounts: [],
        totalAmount: 698100,
        creditAmount: 685700,
        debitAmount: 687500,
        showLimitCard: true,
        limitOrBalance: 'Balance',
        mainLabel: 'Overall Account Balance',
        label1: 'Total Credit Balance',
        label2: 'Total Debit Balance',
        totalLabel: 'Total Amount',
        moreOptionsList: [],
      },
      {
        id: 'trade',
        displayName: 'Trade',
        colDefUrl: 'accountServices/services/accountSummary/private/colDefs',
        rowDefUrl: 'accountServices/services/accountSummary/summaryData/private/getData',
        totalAccounts: 15,
        accounts: [],
        totalAmount: 698500,
        creditAmount: 6855700,
        debitAmount: 687500,
        showLimitCard: true,
        limitOrBalance: 'Balance',
        mainLabel: 'Overall Account Balance',
        label1: 'Total Credit Balance',
        label2: 'Total Debit Balance',
        totalLabel: 'Total Amount',
        moreOptionsList: [],
      },
      {
        id: 'escrow',
        displayName: 'Escrow',
        colDefUrl: 'accountServices/services/accountSummary/private/colDefs',
        rowDefUrl: 'accountServices/services/accountSummary/summaryData/private/getData',
        totalAccounts: 15,
        accounts: [],
        totalAmount: 698300,
        creditAmount: 6855700,
        debitAmount: 685500,
        showLimitCard: true,
        limitOrBalance: 'Balance',
        mainLabel: 'Overall Account Balance',
        label1: 'Total Credit Balance',
        label2: 'Total Debit Balance',
        totalLabel: 'Total Amount',
        moreOptionsList: [],
      },
    ];

    return {
      name: corporate.corporateName,
      image: corporate.corporateImage,
      totalAccounts,
      overallBalance,
      overallLimit,
      chartData,
      summaries,
    };
  }
};

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getSMECorporateSummaryData',
  (req, res) => {
    let corporateId = req.body.dataMap.corporateId;

    let response = {
      data: getSMECorporateSummary(corporateId),
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

const getSMECorporateSummary = (corporateId) => {
  {
    let overallBalance = 0;
    let overallLimit = 0;
    let totalAccounts = 0;

    let casa = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    // let casaIslamic = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    let loan = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    // let loanIslamic = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    let fd = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    let va = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    let cc = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };
    let ea = { accounts: [], totalAmount: 0, creditAmount: 0, debitAmount: 0 };

    const accountsDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

    const accountsWorkbook = XLSX.readFile(accountsDataFilePath);

    const accountsData = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['accounts']);

    const corporates = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['Sheet1']);

    const corporate = corporates.find((record) => corporateId == record.id);

    accountsData
      .filter(
        (record) => record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.mstId,
      )
      .forEach((data) => {
        if (['CURRENT', 'SAVING'].includes(data.accountType.toUpperCase())) {
          casa.totalAmount += +data.balance;
          casa.creditAmount += +data.totalCreditBalance;
          casa.debitAmount += +data.totalDebitBalance;
          casa.accounts.push(data);

          overallBalance += +data.balance;
          totalAccounts++;
        } else if (data.accountType.toUpperCase().includes('LOAN')) {
          loan.totalAmount += +data.balance;
          loan.creditAmount += +data.totalCreditBalance;
          loan.debitAmount += +data.totalDebitBalance;
          loan.accounts.push(data);

          overallLimit += +data.balance;
          totalAccounts++;
        }
      });

    // const islamicAccountsDataFilePath =
    //   './dummyServer/json/setup/corporateOnboarding/corporateMain/islamic-data.xlsx';

    // const islamicAccountsWorkbook = XLSX.readFile(islamicAccountsDataFilePath);

    // const islamicAccountsData = XLSX.utils.sheet_to_json(
    //   islamicAccountsWorkbook.Sheets['accounts'],
    // );

    // islamicAccountsData
    //   .filter(
    //     (record) => record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.mstId,
    //   )
    //   .forEach((data) => {
    //     if (['CURRENT', 'SAVING'].includes(data.accountType.toUpperCase())) {
    //       casaIslamic.totalAmount += +data.balance;
    //       casaIslamic.creditAmount += +data.totalCreditBalance;
    //       casaIslamic.debitAmount += +data.totalDebitBalance;
    //       casaIslamic.accounts.push(data);

    //       overallBalance += +data.balance;
    //       totalAccounts++;
    //     } else if (data.accountType.toUpperCase().includes('LOAN')) {
    //       loanIslamic.totalAmount += +data.balance;
    //       loanIslamic.creditAmount += +data.totalCreditBalance;
    //       loanIslamic.debitAmount += +data.totalDebitBalance;
    //       loanIslamic.accounts.push(data);

    //       overallLimit += +data.balance;
    //       totalAccounts++;
    //     }
    //   });

    const fdDataFilePath = './dummyServer/json/accountServices/fixedDeposit/fdInitiation/data.xlsx';

    const fdWorkbook = XLSX.readFile(fdDataFilePath);

    const fdData = XLSX.utils.sheet_to_json(fdWorkbook.Sheets['Sheet1']);

    fdData
      .filter(
        (record) =>
          record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.corporateId,
      )
      .forEach((data) => {
        fd.totalAmount += +data.depositAmount;
        fd.creditAmount += +data.creditLimit;
        fd.debitAmount += +data.debitLimit;
        fd.accounts.push(data);

        totalAccounts++;
      });

    const vaData = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['virtualAccounts']);

    vaData
      .filter(
        (record) => record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.mstId,
      )
      .forEach((data) => {
        va.totalAmount += +data.availableLimit;
        va.creditAmount += +data.utilizedLimit + 123450;
        va.debitAmount += +data.utilizedLimit;
        va.accounts.push(data);

        totalAccounts++;
      });

    const creditCardDataFilePath = './dummyServer/json/accountServices/creditCard/data.xlsx';

    const creditCardWorkbook = XLSX.readFile(creditCardDataFilePath);

    const creditCardData = XLSX.utils.sheet_to_json(creditCardWorkbook.Sheets['Sheet1']);

    creditCardData
      .filter(
        (record) =>
          record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.corporateId,
      )
      .forEach((data) => {
        cc.totalAmount += +data.cardLimit;
        cc.creditAmount += +data.totalAmountDue;
        cc.debitAmount += +data.outStandingAmount;
        cc.accounts.push(data);

        overallLimit += +data.cardLimit;
      });

    const eaDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateAccount/data.xlsx';

    const eaWorkbook = XLSX.readFile(eaDataFilePath);

    const eaData = XLSX.utils.sheet_to_json(eaWorkbook.Sheets['Sheet1']);

    eaData
      .filter(
        (record) =>
          record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.corporateId,
      )
      .forEach((data) => {
        ea.totalAmount += +data.availableBalance;
        ea.creditAmount += +data.creditLimit;
        ea.debitAmount += +data.debitLimit;
        ea.accounts.push(data);

        overallBalance += +data.availableBalance;
      });

    const chartData = [
      {
        summary: 'CASA',
        accounts: casa.accounts.length,
        amount: casa.totalAmount,
      },
      // {
      //   summary: 'CASA Islamic',
      //   accounts: casaIslamic.accounts.length,
      //   amount: casaIslamic.totalAmount,
      // },
      {
        summary: 'Loan',
        accounts: loan.accounts.length,
        amount: loan.totalAmount,
      },
      // {
      //   summary: 'Loan Islamic',
      //   accounts: loanIslamic.accounts.length,
      //   amount: loanIslamic.totalAmount,
      // },
      {
        summary: 'Virtual Account',
        accounts: va.accounts.length,
        amount: va.totalAmount,
      },
      {
        summary: 'FD Summary',
        accounts: fd.accounts.length,
        amount: fd.totalAmount,
      },
      {
        summary: 'Credit Card',
        accounts: cc.accounts.length,
        amount: cc.totalAmount,
      },
      {
        summary: 'External Account Summary',
        accounts: ea.accounts.length,
        amount: ea.totalAmount,
      },
    ];

    const summaries = [
      {
        id: 'casa',
        displayName: 'CASA',
        colDefUrl: 'accountServices/services/accountSummary/private/casaColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getCasaData',
        totalAccounts: casa.accounts.length,
        totalAmount: casa.totalAmount,
        creditAmount: casa.creditAmount,
        debitAmount: casa.debitAmount,
        accounts: casa.accounts,
        showLimitCard: true,
        limitOrBalance: 'Balance',
        mainLabel: 'Overall Account Balance',
        label1: 'Total Credit Balance',
        label2: 'Total Debit Balance',
        totalLabel: 'Total Balance',
        moreOptionsList: [
          {
            label: 'Single Payment Initiation',
            method: 'onSinglePaymentInitiation',
          },
          {
            label: 'FD Initiation',
            method: 'onFdInitiation',
          },
          {
            label: 'Statement Download',
            method: 'onStatementDownload',
          },
        ],
      },
      // {
      //   id: 'casaIslamic',
      //   displayName: 'CASA Islamic',
      //   colDefUrl: 'accountServices/services/accountSummary/private/casaIslamicColDefs',
      //   rowDefUrl: 'accountServices/services/accountSummary/private/getCasaIslamicData',
      //   totalAccounts: casaIslamic.accounts.length,
      //   totalAmount: casaIslamic.totalAmount,
      //   creditAmount: casaIslamic.creditAmount,
      //   debitAmount: casaIslamic.debitAmount,
      //   accounts: casaIslamic.accounts,
      //   showLimitCard: true,
      //   limitOrBalance: 'Balance',
      //   mainLabel: 'Overall Account Balance',
      //   label1: 'Total Credit Balance',
      //   label2: 'Total Debit Balance',
      //   totalLabel: 'Total Balance',
      //   moreOptionsList: [],
      // },
      {
        id: 'loan',
        displayName: 'Loan',
        colDefUrl: 'accountServices/services/accountSummary/private/loanColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getLoanData',
        totalAccounts: loan.accounts.length,
        totalAmount: loan.totalAmount,
        creditAmount: loan.creditAmount,
        debitAmount: loan.debitAmount,
        accounts: loan.accounts,
        showLimitCard: true,
        limitOrBalance: 'Balance',
        mainLabel: 'Total Approved Amount',
        label1: 'Total Disbursed Amount',
        label2: 'Total Outstanding Amount',
        totalLabel: 'Total Loan Amount',
        moreOptionsList: [
          {
            label: 'View Contract Details',
            method: 'onViewContractDetails',
          },
          {
            label: 'Rate Change History',
            method: 'onRateChangeHistory',
          },
          {
            label: 'Arrears Statement',
            method: 'onArrearsStatement',
          },
          {
            label: 'Mini Statement',
            method: 'onMiniStatement',
          },
          {
            label: 'Repayment Schedule',
            method: 'onRepaymentSchedule',
          },
          {
            label: 'Interest Calculation',
            method: 'onInterestCalculation',
          },
        ],
      },
      // {
      //   id: 'loanIslamic',
      //   displayName: 'Loan Islamic',
      //   colDefUrl: 'accountServices/services/accountSummary/private/loanIslamicColDefs',
      //   rowDefUrl: 'accountServices/services/accountSummary/private/getLoanIslamicData',
      //   totalAccounts: loanIslamic.accounts.length,
      //   totalAmount: loanIslamic.totalAmount,
      //   creditAmount: loanIslamic.creditAmount,
      //   debitAmount: loanIslamic.debitAmount,
      //   accounts: loanIslamic.accounts,
      //   showLimitCard: true,
      //   limitOrBalance: 'Balance',
      //   mainLabel: 'Total Approved Amount',
      //   label1: 'Total Disbursed Amount',
      //   label2: 'Total Outstanding Amount',
      //   totalLabel: 'Total Loan Amount',
      //   moreOptionsList: [
      //     {
      //       label: 'View Contract Details',
      //       method: 'onViewContractDetails',
      //     },
      //     {
      //       label: 'Rate Change History',
      //       method: 'onRateChangeHistory',
      //     },
      //     {
      //       label: 'Arrears Statement',
      //       method: 'onArrearsStatement',
      //     },
      //     {
      //       label: 'Mini Statement',
      //       method: 'onMiniStatement',
      //     },
      //     {
      //       label: 'Repayment Schedule',
      //       method: 'onRepaymentSchedule',
      //     },
      //     {
      //       label: 'Interest Calculation',
      //       method: 'onInterestCalculation',
      //     },
      //   ],
      // },
      {
        id: 'virtualAccount',
        displayName: 'Virtual Account',
        colDefUrl: 'accountServices/services/accountSummary/private/virtualAccountColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getVirtualAccountData',
        totalAccounts: va.accounts.length,
        totalAmount: va.totalAmount,
        creditAmount: va.creditAmount,
        debitAmount: va.debitAmount,
        accounts: va.accounts,
        showLimitCard: true,
        limitOrBalance: 'Balance',
        mainLabel: 'Overall Account Balance',
        label1: 'Total Credit Balance',
        label2: 'Total Debit Balance',
        totalLabel: 'Total Amount',
        moreOptionsList: [
          {
            label: 'Single Payment Initiation',
            method: 'onSinglePaymentInitiation',
          },
          {
            label: 'FD Initiation',
            method: 'onFdInitiation',
          },
          {
            label: 'Statement Download',
            method: 'onStatementDownload',
          },
        ],
      },
      {
        id: 'fdSummery',
        displayName: 'FD Summary',
        colDefUrl: 'accountServices/services/accountSummary/private/fdColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getFdData',
        totalAccounts: fd.accounts.length,
        accounts: fd.accounts,
        totalAmount: fd.totalAmount,
        creditAmount: fd.creditAmount,
        debitAmount: fd.debitAmount,
        showLimitCard: true,
        limitOrBalance: 'Limit',
        mainLabel: 'Total Deposit Amount',
        label1: 'Total Maturity Amount',
        label2: '',
        totalLabel: 'Total FD Amount',
        moreOptionsList: [
          {
            label: 'Additional Details',
            method: 'onAdditionalDetails',
          },
          {
            label: 'FD Advices',
            method: 'onFdAdvices',
          },
          {
            label: 'Change Maturity Instructions',
            method: 'onChangeMaturityInstructions',
          },
        ],
      },
      {
        id: 'creditCard',
        displayName: 'Credit Card',
        colDefUrl: 'accountServices/services/accountSummary/private/creditCardColDefs',
        rowDefUrl: 'accountServices/services/accountSummary/private/getCreditCardData',
        totalAccounts: cc.accounts.length,
        accounts: cc.accounts,
        totalAmount: cc.totalAmount,
        creditAmount: cc.creditAmount,
        debitAmount: cc.debitAmount,
        showLimitCard: true,
        limitOrBalance: 'Limit',
        mainLabel: 'Total Credit Limit',
        label1: 'Total Amount Due',
        label2: 'Total Outstanding Amount',
        totalLabel: 'Total Available Limit',
        moreOptionsList: [
          {
            label: 'Card Payment',
            method: 'onCardPayment',
          },
          {
            label: 'Statement Download',
            method: 'onStatementDownload',
          },
        ],
      },
      {
        id: 'externalAccountSummary',
        displayName: 'External Account Summary',
        colDefUrl: 'accountServices/services/accountSummary/private/externalAccountColDefs',
        rowDefUrl:
          'accountServices/services/accountSummary/summaryData/externalAccount/private/getData',
        totalAccounts: ea.accounts.length,
        totalAmount: ea.totalAmount,
        creditAmount: ea.creditAmount,
        debitAmount: ea.debitAmount,
        accounts: ea.accounts,
        showLimitCard: true,
        limitOrBalance: 'Balance',
        mainLabel: 'Overall Account Balance',
        label1: 'Total Credit Balance',
        label2: 'Total Debit Balance',
        totalLabel: 'Total Amount',
        moreOptionsList: [
          {
            label: 'View Account Details',
            method: 'onViewAccountDetails',
          },
        ],
      },
    ];

    return {
      name: corporate.corporateName,
      image: corporate.corporateImage,
      totalAccounts,
      overallBalance,
      overallLimit,
      chartData,
      summaries,
    };
  }
};

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getAccountStatement',
  (req, res) => {
    const accountNumber = req.body.dataMap.accountNumber;

    let dataXlFile =
      './dummyServer/json/accountServices/services/accountStatement/accountStatement.xlsx';
    let workbook = XLSX.readFile(dataXlFile);
    let xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    const accountStatements = xlData.filter((statement) => {
      return statement.accountNumber == accountNumber;
    });
    accountStatements.forEach((record) => {
      record.actions = [
        {
          index: 1,
          displayName: 'Advice',
          type: 'BUTTON',
          icon: '',
          methodName: 'advice',
          paramList: 'id',
          color: null,
        },
        {
          index: 2,
          displayName: 'Dataflow',
          type: 'ICON',
          icon: 'fa-chart-network',
          methodName: 'swiftGpiDataFlow',
          paramList: 'id',
          color: null,
        },
        {
          index: 3,
          displayName: 'Raise Dispute',
          type: 'ICON',
          icon: 'fa-hand-point-up',
          methodName: 'raiseDispute',
          paramList: 'id',
          color: null,
        },
      ];
    });

    let response = {
      data: accountStatements,
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getVirtualAccountStatement',
  (req, res) => {
    const virtualAccountNumber = req.body.dataMap.virtualAccountNumber;

    let dataXlFile =
      './dummyServer/json/accountServices/services/accountStatement/accountStatement.xlsx';
    let workbook = XLSX.readFile(dataXlFile);
    let xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    const virtualAccountStatements = xlData.filter((statement) => {
      return statement.virtualAccountNumber == virtualAccountNumber;
    });

    virtualAccountStatements.forEach((record) => {
      record.actions = [
        {
          index: 1,
          displayName: 'Advice',
          type: 'BUTTON',
          icon: '',
          methodName: 'advice',
          paramList: 'id',
          color: null,
        },
        {
          index: 2,
          displayName: 'Dataflow',
          type: 'ICON',
          icon: 'fa-chart-network',
          methodName: 'swiftGpiDataFlow',
          paramList: 'id',
          color: null,
        },
      ];
    });

    let response = {
      data: virtualAccountStatements,
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getCreditCardStatement',
  (req, res) => {
    const accountNumber = req.body.dataMap.accountNumber;

    let dataXlFile =
      './dummyServer/json/accountServices/services/accountStatement/creditCardStatement.xlsx';
    let workbook = XLSX.readFile(dataXlFile);
    let xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    const accountStatements = xlData.filter((statement) => {
      return statement.creditCardNumber == accountNumber;
    });

    let response = {
      data: accountStatements,
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getVirtualAccountStatement',
  (req, res) => {
    const accountNumber = req.body.dataMap.accountNumber;

    let dataXlFile =
      './dummyServer/json/accountServices/services/accountStatement/accountStatement.xlsx';
    let workbook = XLSX.readFile(dataXlFile);
    let xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    const accountStatements = xlData.filter((statement) => {
      return statement.virtualAccountNumber == accountNumber;
    });

    let response = {
      data: accountStatements,
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getCountries',
  (req, res) => {
    const countries = getCountries(req.session ? req.session.userDetails.corporateType : 'L');

    let response = {
      data: countries,
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

const getCountries = (corporateType) => {
  const countriesDataFilePath = './dummyServer/json/setup/generalMasters/geography/data.xlsx';

  const countriesWorkbook = XLSX.readFile(countriesDataFilePath);
  const countriesData = XLSX.utils.sheet_to_json(countriesWorkbook.Sheets['Sheet1']);
  const countriesCorporates = XLSX.utils.sheet_to_json(countriesWorkbook.Sheets['corporates']);

  const corporatesDataFilePath =
    './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
  const corporatesWorkbook = XLSX.readFile(corporatesDataFilePath);
  const corporatesData = XLSX.utils.sheet_to_json(corporatesWorkbook.Sheets['Sheet1']);

  const accountsData = XLSX.utils.sheet_to_json(corporatesWorkbook.Sheets['accounts']);

  let totalAccounts = 0;
  let netBalance = 0;
  let assets = 0;
  let liabilities = 0;

  const countries = [];

  countriesData.forEach((row) => {
    row.corporates = countriesCorporates.filter((corp) => corp.mstId === row.id);

    row['balance'] = 0;
    row['totalAccounts'] = 0;

    const corporates = [];

    row.corporates.forEach((corp) => {
      const corporate = corporatesData.find(
        (c) => c.id == corp.corporateId && c.corporateType == corporateType,
      );

      if (corporate) {
        const accounts = accountsData.filter((acc) => acc.mstId == corporate.id);

        let corpBalance = 0;
        let totalAssets = 0;
        let totalLiabilities = 0;

        accounts.forEach((acc) => {
          corpBalance += +acc.balance;
          totalAssets += +acc.balance - 25000;
          totalLiabilities += +acc.balance + 25000;
        });

        row.balance += corpBalance;
        row.totalAccounts += accounts.length;

        corporates.push({
          ...corp,
          ...corporate,
          accounts,
          totalAccounts: accounts.length,
          netBalance: corpBalance,
          totalAssets,
          totalLiabilities,
        });
      }
    });

    row.corporates = corporates;

    totalAccounts += row.totalAccounts;
    netBalance += row.balance / 100;
    assets += (row.balance * 0.75) / 100;
    liabilities += (row.balance * 0.5) / 100;

    countries.push(row);
  });

  return {
    countries,
    totalAccounts,
    netBalance,
    assets,
    liabilities,
  };
};

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getCasaData',
  (req, res) => {
    let corporateId; //= req.session.userDetails.corporateId;
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }

    let accountTypes = ['CURRENT', 'SAVING'];

    if (req.body && req.body.dataMap.accountType) {
      accountTypes = [req.body.dataMap.accountType.toUpperCase()];
    }

    const accountsDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

    const accountsWorkbook = XLSX.readFile(accountsDataFilePath);

    const accountsData = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['accounts']);

    const casaData = [];

    accountsData
      .filter(
        (record) =>
          accountTypes.includes(record.accountType.toUpperCase()) &&
          record.lastAction.indexOf('Authorized') !== -1 &&
          corporateId == record.mstId &&
          (req.session.userDetails.loginPreferenceDetails.bankType == 'Islamic'
            ? record.bankAccountType == 'ISLAMIC'
            : true),
      )
      .forEach((data) => {
        const d = {
          id: data.id,
          accountNo: data.accountNo,
          iban: data?.iBanNumber ? data?.iBanNumber : '-',
          accountName: data.accountTitle,
          accountType: data.accountType,
          currency: data.currencyCode,
          netBalance: data.balance,
          odLimit: data.odLimit,
          availableBalance: data.availableBalance,
          ledgerBalance: data.ledgerBalance,
          status: data.status,
          actions: [
            {
              label: 'Single Payment Initiation',
              method: 'onSinglePaymentInitiation',
            },
            {
              label: 'FD Initiation',
              method: 'onFdInitiation',
            },
            {
              label: 'Statement Download',
              method: 'onStatementDownload',
            },
            {
              label: 'Download Account Details',
              method: 'onDownloadAccountDetails',
            },
            {
              label: 'Email Account Details',
              method: 'onEmailAccountDetails',
            },
          ],
        };

        casaData.push(d);
      });

    let response = {};

    const data = [...casaData];

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getCasaIslamicData',
  (req, res) => {
    let corporateId; //= req.session.userDetails.corporateId;
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }

    let accountTypes = ['CURRENT', 'SAVING'];

    if (req.body && req.body.dataMap.accountType) {
      accountTypes = [req.body.dataMap.accountType.toUpperCase()];
    }

    const accountsDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateMain/islamic-data.xlsx';

    const accountsWorkbook = XLSX.readFile(accountsDataFilePath);

    const accountsData = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['accounts']);

    const casaData = [];

    accountsData
      .filter(
        (record) =>
          accountTypes.includes(record.accountType.toUpperCase()) &&
          record.lastAction.indexOf('Authorized') !== -1 &&
          corporateId == record.mstId &&
          (req.session.userDetails.loginPreferenceDetails.bankType == 'Islamic'
            ? record.bankAccountType == 'ISLAMIC'
            : true),
      )
      .forEach((data) => {
        const d = {
          id: data.id,
          accountNo: data.accountNo,
          iban: data?.iBanNumber ? data?.iBanNumber : '-',
          accountName: data.accountTitle,
          accountType: data.accountType,
          currency: data.currencyCode,
          netBalance: data.balance,
          odLimit: data.odLimit,
          availableBalance: data.availableBalance,
          ledgerBalance: data.ledgerBalance,
          status: data.status,
          actions: [
            {
              label: 'Single Payment Initiation',
              method: 'onSinglePaymentInitiation',
            },
            {
              label: 'FD Initiation',
              method: 'onFdInitiation',
            },
            {
              label: 'Statement Download',
              method: 'onStatementDownload',
            },
            {
              label: 'Download Account Details',
              method: 'onDownloadAccountDetails',
            },
            {
              label: 'Email Account Details',
              method: 'onEmailAccountDetails',
            },
          ],
        };

        casaData.push(d);
      });

    let response = {};

    const data = [...casaData];

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getLoanData',
  (req, res) => {
    let corporateId; //= req.session.userDetails.corporateId;
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }

    const accountsDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

    const accountsWorkbook = XLSX.readFile(accountsDataFilePath);

    const accountsData = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['accounts']);

    const loanData = [];

    accountsData
      .filter(
        (record) =>
          record.accountType.toUpperCase().includes('LOAN') &&
          record.lastAction.indexOf('Authorized') !== -1 &&
          corporateId == record.mstId &&
          (req.session.userDetails.loginPreferenceDetails.bankType == 'Islamic'
            ? record.bankAccountType == 'ISLAMIC'
            : true),
      )
      .forEach((data) => {
        const d = {
          id: data.id,
          accountNo: data.accountNo,
          accountName: data.corporateAccountAlias,
          accountType: 'FCC',
          currency: data.currencyCode,
          product: data.product,
          grantedDate: data.grantedDate,
          tenor: data.tenor,
          amountApproved: data.amountApproved,
          amountDisbursed: data.amountDisbursed,
          outstandingAmount: data.outstandingAmount,
          overdueAmount: data.overdueAmount,
          maturityDate: data.maturityDate,
          status: data.status,
          actions: [
            {
              label: 'View Contract Details',
              method: 'onViewContractDetails',
            },
            {
              label: 'Rate Change History',
              method: 'onRateChangeHistory',
            },
            {
              label: 'Arrears Statement',
              method: 'onArrearsStatement',
            },
            {
              label: 'Mini Statement',
              method: 'onMiniStatement',
            },
            {
              label: 'Repayment Schedule',
              method: 'onRepaymentSchedule',
            },
            {
              label: 'Interest Calculation',
              method: 'onInterestCalculation',
            },
          ],
        };

        loanData.push(d);
      });

    let response = {};

    const data = [...loanData];

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getLoanIslamicData',
  (req, res) => {
    let corporateId; //= req.session.userDetails.corporateId;
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }

    const accountsDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateMain/islamic-data.xlsx';

    const accountsWorkbook = XLSX.readFile(accountsDataFilePath);

    const accountsData = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['accounts']);

    const loanData = [];

    accountsData
      .filter(
        (record) =>
          record.accountType.toUpperCase().includes('LOAN') &&
          record.lastAction.indexOf('Authorized') !== -1 &&
          corporateId == record.mstId &&
          (req.session.userDetails.loginPreferenceDetails.bankType == 'Islamic'
            ? record.bankAccountType == 'ISLAMIC'
            : true),
      )
      .forEach((data) => {
        const d = {
          id: data.id,
          accountNo: data.accountNo,
          accountName: data.corporateAccountAlias,
          accountType: 'FCI',
          currency: data.currencyCode,
          product: data.product,
          grantedDate: data.grantedDate,
          tenor: data.tenor,
          amountApproved: data.amountApproved,
          amountDisbursed: data.amountDisbursed,
          outstandingAmount: data.outstandingAmount,
          overdueAmount: data.overdueAmount,
          maturityDate: data.maturityDate,
          status: data.status,
          actions: [
            {
              label: 'View Contract Details',
              method: 'onViewContractDetails',
            },
            {
              label: 'Rate Change History',
              method: 'onRateChangeHistory',
            },
            {
              label: 'Arrears Statement',
              method: 'onArrearsStatement',
            },
            {
              label: 'Mini Statement',
              method: 'onMiniStatement',
            },
            {
              label: 'Repayment Schedule',
              method: 'onRepaymentSchedule',
            },
            {
              label: 'Interest Calculation',
              method: 'onInterestCalculation',
            },
          ],
        };

        loanData.push(d);
      });

    let response = {};

    const data = [...loanData];

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getFdData',
  (req, res) => {
    let corporateId; //= req.session.userDetails.corporateId;
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }

    const fdDataFilePath = './dummyServer/json/accountServices/fixedDeposit/fdInitiation/data.xlsx';

    const fdWorkbook = XLSX.readFile(fdDataFilePath);

    const fdExcelData = XLSX.utils.sheet_to_json(fdWorkbook.Sheets[fdWorkbook.SheetNames[0]]);

    const fdData = [];

    fdExcelData
      .filter(
        (record) =>
          record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.corporateId,
      )
      .forEach((data) => {
        const d = {
          id: data.id,
          depositNumber: data.batchNo,
          depositType: data.depositType,
          currency: data.currencyName,
          depositAmount: data.depositAmount,
          interestRate: data.interestRate,
          tenor: data.tenor,
          maturityAmount: data.maturityAmount,
          startDate: data.depositStartDate,
          maturityDate: data.maturityDate,
          branch: data.branch,
          status: 'Active',
          maturityInstruction: data.maturityInstructionsName,
          cifName: 'Corporate 1',
          actions: [
            {
              label: 'Additional Details',
              method: 'onAdditionalDetails',
            },
            {
              label: 'FD Advices',
              method: 'onFdAdvices',
            },
            {
              label: 'Change Maturity Instructions',
              method: 'onChangeMaturityInstructions',
            },
          ],
        };

        fdData.push(d);
      });

    let response = {};

    const data = [...fdData];

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getVirtualAccountData',
  (req, res) => {
    let corporateId; //= req.session.userDetails.corporateId;
    if (req.body.dataMap) {
      corporateId = req.body.dataMap.corporateId;
    }

    const accountsDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

    const accountsWorkbook = XLSX.readFile(accountsDataFilePath);

    const vaExcelData = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['virtualAccounts']);

    const vaData = [];

    vaExcelData
      .filter(
        (record) => record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.mstId,
      )
      .forEach((data) => {
        const d = {
          id: data.id,
          virtualAccountNumber: data.virtualAccountNumber,
          virtualAccountAliceName: data.virtualAccountAliceName,
          status: data.status,
          availableLimit: data.availableLimit,
          utilizedLimit: data.utilizedLimit,
          netBalance: data.availableLimit,
          odLimit: data.availableLimit * 0.75,
          availableBalance: data.availableLimit - data.utilizedLimit,
          ledgerBalance: data.availableLimit * 0.5,
          accountNumber: data.accountNumber,
          accountId: data.accountId,
          corporateId: data.corporateId,
          actions: [
            {
              label: 'Single Payment Initiation',
              method: 'onSinglePaymentInitiation',
            },
            {
              label: 'FD Initiation',
              method: 'onFdInitiation',
            },
            {
              label: 'Statement Download',
              method: 'onStatementDownload',
            },
          ],
        };

        vaData.push(d);
      });

    let response = {};

    const data = [...vaData];

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getCreditCardData',
  (req, res) => {
    let corporateId; //= req.session.userDetails.corporateId;
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }

    const ccDataFilePath = './dummyServer/json/accountServices/creditCard/data.xlsx';

    const ccWorkbook = XLSX.readFile(ccDataFilePath);

    const ccExcelData = XLSX.utils.sheet_to_json(ccWorkbook.Sheets[ccWorkbook.SheetNames[0]]);

    const ccData = [];

    ccExcelData
      .filter(
        (record) =>
          record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.corporateId,
      )
      .forEach((data) => {
        const d = {
          id: data.id,
          creditCardNumber: data.cardNo,
          embossedName: data.embossedName,
          cardType: data.cardType,
          dueDate: data.dueDate,
          currency: data.currency,
          creditCardLimit: data.cardLimit,
          availableLimit: Math.abs(data.cardLimit - data.minDueAmount * 20),
          totalAmountDue: data.minDueAmount * 20,
          minAmountDue: data.minDueAmount,
          totalOutstandingAmount: data.outStandingAmount,
          actions: [
            {
              label: 'Card Payment',
              method: 'onCreditCardPayment',
            },
            {
              label: 'Statement Download',
              method: 'onCreditCardStatementDownload',
            },
          ],
        };

        ccData.push(d);
      });

    let response = {};

    const data = [...ccData];

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getDebitCardAccountData',
  (req, res) => {
    let corporateId; //= req.session.userDetails.corporateId;
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }

    let accountTypes = ['CURRENT', 'SAVING'];

    if (req.body && req.body.dataMap.accountType) {
      accountTypes = [req.body.dataMap.accountType.toUpperCase()];
    }

    const accountsDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

    const accountsWorkbook = XLSX.readFile(accountsDataFilePath);

    const accountsData = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['accounts']);

    const casaData = [];

    accountsData
      .filter(
        (record) =>
          accountTypes.includes(record.accountType.toUpperCase()) &&
          record.lastAction.indexOf('Authorized') !== -1 &&
          corporateId == record.mstId &&
          (req.session.userDetails.loginPreferenceDetails.bankType == 'Islamic'
            ? record.bankAccountType == 'ISLAMIC'
            : true),
      )
      .forEach((data) => {
        const d = {
          id: data.id,
          accountNo: data.accountNo,
          accountName: data.accountTitle,
          accountType: data.accountType,
          currency: data.currencyCode,
          netBalance: data.balance,
          odLimit: data.odLimit,
          availableBalance: data.availableBalance,
          ledgerBalance: data.ledgerBalance,
        };

        casaData.push(d);
      });

    let response = {};

    const data = [...casaData];

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getDebitCardData',
  (req, res) => {
    let corporateId; //= req.session.userDetails.corporateId;
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }

    const dcDataFilePath = './dummyServer/json/accountServices/debitCard/data.xlsx';

    const dcWorkbook = XLSX.readFile(dcDataFilePath);

    const dcExcelData = XLSX.utils.sheet_to_json(dcWorkbook.Sheets[dcWorkbook.SheetNames[0]]);

    const dcData = [];

    dcExcelData
      .filter((record) =>
      // record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.corporateId,
      {
        // console.log(record.accountId, req.body.dataMap.accountId);

        return (
          !record?.accountId ||
          !req?.body?.dataMap?.accountId ||
          (req?.body?.dataMap?.accountId &&
            record?.accountId &&
            record.accountId == req.body.dataMap.accountId)
        );
      },
      )
      .forEach((data) => {
        const d = {
          id: data.id,
          accountId: data.accountId,
          accountNumber: data.primaryAccountDisplayName,
          cardNo: data.cardNumber,
          cardType: data.cardType,
          embossedName: data.embossedName,
          cardHolderName: data.cardHolderName,
          cardHolderCid: data.cid,
          cardLimit: data.totalLimit,
          expiryDate: data.expiryDate,
          status: data.status,
          actions: [
            {
              label: 'Card Control',
              method: 'onDebitCardControl',
            },
            {
              label: 'Card Cancellation',
              method: 'onDebitCardCancellation',
            },
            {
              label: 'Card Re-Issue',
              method: 'onDebitCardReissue',
            },
          ],
        };

        dcData.push(d);
      });

    const response = {};

    const data = [...dcData];

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/private/getExternalAccountData',
  (req, res) => {
    let corporateId; //= req.session.userDetails.corporateId;
    if (req.body.dataMap && req.body.dataMap.corporateId) {
      corporateId = req.body.dataMap.corporateId;
    } else {
      corporateId = req.session.userDetails.corporateId;
    }

    const eaDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateAccount/data.xlsx';

    const eaWorkbook = XLSX.readFile(eaDataFilePath);

    const eaExcelData = XLSX.utils.sheet_to_json(eaWorkbook.Sheets['Sheet1']);

    const eaData = [];

    eaExcelData
      .filter(
        (record) =>
          record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.corporateId,
      )
      .forEach((data) => {
        const d = {
          id: data.id,
          accountNo: data.accountNo,
          accountName: data.accountName,
          bankName: data.bank,
          currency: data.currency,
          availableBalance: data.availableBalance,
          availableBalanceBaseCcy: data.availableBalance,
          lastUpdatedDateTime: data.lastUpdatedDate,
          actions: [
            {
              label: 'View Account Details',
              method: 'onViewAccountDetails',
            },
          ],
        };

        eaData.push(d);
      });

    let response = {};

    const data = [...eaData];

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/accountServices/services/accountSummary/**/private/getData',
  (req, res) => {
    const dataFilePath = '.' + req.url.substring(0, req.url.indexOf('private')) + 'data.xlsx';

    let workbook = XLSX.readFile(dataFilePath);

    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    let response = {};

    const data = [...excelData];

    response.data = data;

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

module.exports = router;
