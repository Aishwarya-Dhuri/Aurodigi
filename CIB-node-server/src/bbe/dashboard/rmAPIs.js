var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var moment = require('moment');
var viewDetails = require('./../../crudAPIs').getViewData;
var addDataToExcel = require('./../../crudAPIs').addRecordInExcel;
var updateDataTInExcel = require('./../../crudAPIs').updateRecordInExcel;

var router = express.Router();

const defaultReqModel = {
  startRow: 0,
  endRow: 1,
  rowGroupCols: [],
  valueCols: [],
  pivotCols: [],
  pivotMode: false,
  groupKeys: [],
  filterModel: {},
  sortModel: [],
  entityName: '',
};

router.post(
  '/dummyServer/json/dashboard/relationshipManager/private/getRmCorporates',
  (req, res) => {
    let response = {
      dataList: getRmCorporates(req.session.userDetails.userId),
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post('/dummyServer/json/dashboard/relationshipManager/private/getBalances', (req, res) => {
  const data = {
    totalAllocatedLimit: 0,
    utilizedLimit: 0,
    availableLimit: 0,
    ledgerBalance: 0,
    monthlyAverageBalance: 0,
    noOfAccounts: 0,
  };

  const corporateId = req.body.dataMap.corporate;

  const accountsDataFilePath =
    './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

  const accountsWorkbook = XLSX.readFile(accountsDataFilePath);

  const corporates = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['Sheet1']);

  const rmCorporates = getRmCorporates(req.session.userDetails.userId);

  corporates
    .filter((corporate) => {
      const rmCorp = rmCorporates.find((corp) => corp.id == corporate.id);
      return !!rmCorp;
    })
    .filter((corporate) => (corporateId == 'all' ? true : corporate.id == corporateId))
    .forEach((corporate) => {
      const limitDetails = getCorporateLimitDetails(corporate.id);
      const balances = getCorporateBalances(corporate.id);

      data.totalAllocatedLimit += +limitDetails.totalAllocatedLimit;
      data.utilizedLimit += +limitDetails.utilizedLimit;
      data.availableLimit += +limitDetails.availableLimit;
      data.ledgerBalance += +balances.ledgerBalance;
      data.monthlyAverageBalance += +balances.monthlyAverageBalance;
      data.noOfAccounts += +balances.noOfAccounts;
    });

  let response = {
    data,
  };

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

router.post('/dummyServer/json/dashboard/relationshipManager/private/getRmGrid', (req, res) => {
  const rmUser = req.session.userDetails.userId;

  const rmUserGridDataFilePath =
    './dummyServer/json/commons/relationshipManagerService/userGrid/data.xlsx';

  let filters = [{ name: 'userId', value: rmUser }];

  const rmData = viewDetails(rmUserGridDataFilePath, filters);

  let data = rmData.grid;

  // if (data.length == 0) {
  //   const gridDataFilePath = './dummyServer/json/bbe/grid/data.xlsx';
  //   const gridWorkbook = XLSX.readFile(gridDataFilePath);
  //   data = XLSX.utils.sheet_to_json(gridWorkbook.Sheets['Sheet1']);
  // }

  let response = {
    data,
    lastRow: data.length,
  };

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

router.post('/dummyServer/json/dashboard/relationshipManager/private/updateRmGrid', (req, res) => {
  const rmUser = req.body.userDetails.userId;

  const rmUserDataFilePath =
    './dummyServer/json/commons/relationshipManagerService/userGrid/data.xlsx';

  let filters = [{ name: 'userId', value: rmUser }];

  const rmData = viewDetails(rmUserDataFilePath, filters);

  let data = {};

  if (rmData) {
    rmData.grid = req.body.grid;
    data = updateDataTInExcel(rmUserDataFilePath, rmData, req.body.userDetails);
  }

  let response = {
    data,
  };

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

router.post('/dummyServer/json/dashboard/relationshipManager/private/saveRmGrid', (req, res) => {
  const rmUser = req.session.userDetails.userId;

  const rmUserGridDataFilePath =
    './dummyServer/json/commons/relationshipManagerService/userGrid/data.xlsx';

  let filters = [{ name: 'userId', value: rmUser }];

  const rmData = viewDetails(rmUserGridDataFilePath, filters);

  let data = rmData.grid;

  let response = {
    data,
    lastRow: data.length,
  };

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

router.post('/dummyServer/json/dashboard/relationshipManager/private/getLimitData', (req, res) => {
  const data = [];

  const corporateId = req.body.dataMap.corporate;

  const accountsDataFilePath =
    './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

  const accountsWorkbook = XLSX.readFile(accountsDataFilePath);
  const corporates = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['Sheet1']);

  const rmCorporates = getRmCorporates(req.session.userDetails.userId);

  corporates
    .filter((corporate) => {
      const rmCorp = rmCorporates.find((corp) => corp.id == corporate.id);
      return !!rmCorp;
    })
    .filter((corporate) => (corporateId == 'all' ? true : corporate.id == corporateId))
    .forEach((corporate) => {
      const limitDetails = getCorporateLimitDetailsData(corporate.id, corporate.corporateName);

      data.push(...limitDetails);
    });

  let response = {
    data,
    lastRow: data.length,
  };

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

router.post(
  '/dummyServer/json/dashboard/relationshipManager/private/getLedgerBalance',
  (req, res) => {
    const data = [];

    const corporateId = req.body.dataMap.corporate;

    const accountsDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

    const accountsWorkbook = XLSX.readFile(accountsDataFilePath);
    const corporates = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['Sheet1']);

    const rmCorporates = getRmCorporates(req.session.userDetails.userId);

    corporates
      .filter((corporate) => {
        const rmCorp = rmCorporates.find((corp) => corp.id == corporate.id);
        return !!rmCorp;
      })
      .filter((corporate) => (corporateId == 'all' ? true : corporate.id == corporateId))
      .forEach((corporate) => {
        const ledgerBalanceDetails = getCorporateLedgerBalanceData(
          corporate.id,
          corporate.corporateName,
        );

        data.push(...ledgerBalanceDetails);
      });

    let response = {
      data: resData,
      lastRow: data.length,
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/dashboard/relationshipManager/private/getMonthlyAverageBalance',
  (req, res) => {
    const data = [];

    const corporateId = req.body.dataMap.corporate;

    const accountsDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

    const accountsWorkbook = XLSX.readFile(accountsDataFilePath);
    const corporates = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['Sheet1']);

    const rmCorporates = getRmCorporates(req.session.userDetails.userId);

    corporates
      .filter((corporate) => {
        const rmCorp = rmCorporates.find((corp) => corp.id == corporate.id);
        return !!rmCorp;
      })
      .filter((corporate) => (corporateId == 'all' ? true : corporate.id == corporateId))
      .forEach((corporate) => {
        const ledgerBalanceDetails = getCorporateMonthlyAverageBalanceData(
          corporate.id,
          corporate.corporateName,
        );

        data.push(...ledgerBalanceDetails);
      });

    let response = {
      data: resData,
      lastRow: data.length,
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/dashboard/relationshipManager/private/getNewCustomerAcquisition',
  (req, res) => {
    const rmUser = req.session.userDetails.userId;

    const rmDataFilePath = './dummyServer/json/commons/relationshipManagerService/data.xlsx';

    const rmWorkbook = XLSX.readFile(rmDataFilePath);

    const relationshipManagers = XLSX.utils.sheet_to_json(rmWorkbook.Sheets['Sheet1']);

    const relationshipManager = relationshipManagers.find((rm) => rm.rmId == rmUser);

    const corporateMainDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

    const corporateMainWorkbook = XLSX.readFile(corporateMainDataFilePath);

    const corporateMainData = XLSX.utils.sheet_to_json(corporateMainWorkbook.Sheets['Sheet1']);

    const corporates = XLSX.utils.sheet_to_json(rmWorkbook.Sheets['corporates']);

    const data = [];

    corporates
      .filter((corporate) => corporate.mstId == relationshipManager.id)
      .forEach((corporate) => {
        const corporateData = corporateMainData.find((corp) => corp.id == corporate.corporateId);

        data.push({
          corporateId: corporate.corporateId,
          onboardedOn: new Date(corporate.onboardedOn).toDateString(),
          cibActivated: corporate.cibActivated,
          corporateName: corporateData.corporateName,
        });
      });

    let response = {
      data,
      lastRow: data.length,
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/dashboard/relationshipManager/private/getRevenueGeneratedData',
  (req, res) => {
    const rmUser = req.session.userDetails.userId;

    const rmDataFilePath = './dummyServer/json/commons/relationshipManagerService/data.xlsx';

    const rmWorkbook = XLSX.readFile(rmDataFilePath);

    const data = XLSX.utils.sheet_to_json(rmWorkbook.Sheets['revenueGenerated']);

    const response = {
      data,
      // data: {
      //   data,
      //   xKey: 'xLabel',
      //   xLabel: 'Products',
      //   yKeys: ['yLabel0'],
      //   yLabels: ['Amount'],
      //   chartType: 'groupedColumn',
      //   chartShadow: false,
      //   categoryAxesPosition: 'bottom',
      //   categoryAxesTitle: '',
      //   categoryAxesRotationAngle: '',
      //   numberAxesPosition: ['left'],
      //   numberAxesTitle: [''],
      //   numberAxesRotationAngle: [''],
      //   legendPosition: 'bottom',
      //   legendItemMarkerShape: 'circle',
      //   legendItemMarkerSize: 8,
      //   legendItemLabelSize: 12,
      //   legendItemLabelFormatterMethodname: '',
      // },
      lastRow: data.length,
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/dashboard/relationshipManager/private/getOngoingTransactionData',
  (req, res) => {
    const rmUser = req.session.userDetails.userId;

    const rmDataFilePath = './dummyServer/json/commons/relationshipManagerService/data.xlsx';

    const rmWorkbook = XLSX.readFile(rmDataFilePath);

    const data = XLSX.utils.sheet_to_json(rmWorkbook.Sheets['onGoingTransaction']);

    const response = { data, lastRow: data.length };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/dashboard/relationshipManager/private/getDeviationMatrix',
  (req, res) => {
    const rmUser = req.session.userDetails.userId;

    const rmDataFilePath = './dummyServer/json/commons/relationshipManagerService/data.xlsx';

    const rmWorkbook = XLSX.readFile(rmDataFilePath);

    const relationshipManagers = XLSX.utils.sheet_to_json(rmWorkbook.Sheets['Sheet1']);

    const relationshipManager = relationshipManagers.find((rm) => rm.rmId == rmUser);

    const corporateMainDataFilePath =
      './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

    const corporateMainWorkbook = XLSX.readFile(corporateMainDataFilePath);

    const corporateMainData = XLSX.utils.sheet_to_json(corporateMainWorkbook.Sheets['Sheet1']);

    const deviationMatrixData = XLSX.utils.sheet_to_json(
      corporateMainWorkbook.Sheets['deviationMatrix'],
    );

    const corporates = XLSX.utils.sheet_to_json(rmWorkbook.Sheets['corporates']);

    const data = [];

    corporates
      .filter((corporate) => corporate.mstId == relationshipManager.id)
      .forEach((corporate, i) => {
        const corporateData = corporateMainData.find((corp) => corp.id == corporate.corporateId);
        const dmData = deviationMatrixData.find((corp) => corp.mstId == corporate.corporateId);

        data.push({
          srNo: i + 1,
          corporateName: corporateData.corporateName,
          corporateId: corporate.corporateId,
          product: dmData.product,
          transactionRefNo: dmData.transactionRefNo,
          closureDate: dmData.closureDate,
          amount: dmData.amount,
          currency: dmData.currency,
          type: dmData.type,
          noOfTransactions: dmData.noOfTransactions,
          actions: [
            {
              index: 0,
              paramList: 'corporateId',
              methodName: 'onFollowUp',
              type: 'BUTTON',
              displayName: 'FOLLOW UP',
              icon: '',
            },
          ],
        });
      });

    let response = {
      data,
      lastRow: data.length,
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/dashboard/relationshipManager/private/getCorporateProductWiseDistribution',
  (req, res) => {
    const corporateId = req.body.dataMap.corporateId;

    const cldXlFile =
      './dummyServer/json/accountServices/services/creditLineDetails/creditLineData.xlsx';
    const cldWorkbook = XLSX.readFile(cldXlFile);
    const cldXlData = XLSX.utils.sheet_to_json(cldWorkbook.Sheets['Sheet1']);
    const cldXlProductData = XLSX.utils.sheet_to_json(cldWorkbook.Sheets['products']);

    let data = [];

    cldXlData
      .filter((cld) => (!corporateId ? true : cld.corporateId == corporateId))
      .forEach((cld) => {
        cldXlProductData
          .filter((clpd) => cld.creditLineNumber == clpd.creditLineNumber)
          .forEach((clpd) => {
            const index = data.findIndex((d) => d.label == clpd.product);

            if (index >= 0) {
              data[index].amount += clpd.totalAllocatedLimit;
            } else {
              data.push({
                label: clpd.product,
                amount: clpd.totalAllocatedLimit,
              });
            }
          });
      });

    data = data.slice(0, 4);

    const response = { data, lastRow: data.length };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/dashboard/relationshipManager/private/getCorporateDetails',
  (req, res) => {
    let filters = [];

    if (req.body.dataMap && req.body.dataMap.filters) {
      filters = req.body.dataMap.filters;
    } else if (req.body.filters) {
      filters = req.body.filters;
    }
    if (req.body.dataMap && req.body.dataMap.id) {
      filters.push({ name: 'id', value: req.body.dataMap.id });
    }

    const corporateMainDataUrl =
      './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

    const corporateData = viewDetails(corporateMainDataUrl, filters);

    const data = {
      clientInfo: {
        companyName: corporateData.corporateName,
        legalEntityIdentifier: corporateData.legalEntityIdentifier,
        businessGroup: corporateData.businessGroup,
        panNo: corporateData.pan,
        corporateIdentificationNumber: corporateData.cin,
        regionCode: corporateData.regionCode,
        natId: corporateData.natId,
        state: corporateData.state,
        rmMapped: corporateData.rmName,
        amMapped: corporateData.amId,
      },
      accountInfo: {
        sma: corporateData.sba,
        sector: corporateData.sector,
        industry: corporateData.industry,
        accountNo:
          corporateData.accounts[0].accountNo + '-' + corporateData.accounts[0].currencyCode,
      },

      creditRatings: {
        srNo: corporateData.creditRatings[0].srNo,
        rating: corporateData.creditRatings[0].rating,
        analystEmployeeId: corporateData.creditRatings[0].analystEmpId,
        businessGroup: corporateData.creditRatings[0].businessGroup,
        issueDate: corporateData.creditRatings[0].IssueDate,
      },
    };

    const response = { data };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/dashboard/relationshipManager/private/getProcessingData',
  (req, res) => {
    const rmUser = req.session.userDetails.userId;

    const rmDataFilePath = './dummyServer/json/commons/relationshipManagerService/data.xlsx';

    const rmWorkbook = XLSX.readFile(rmDataFilePath);

    const data = XLSX.utils.sheet_to_json(rmWorkbook.Sheets['processing']);

    const response = { data, lastRow: data.length };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/dashboard/relationshipManager/private/getProductWiseDistributionData',
  (req, res) => {
    const rmUser = req.session.userDetails.userId;

    const rmDataFilePath = './dummyServer/json/commons/relationshipManagerService/data.xlsx';

    const rmWorkbook = XLSX.readFile(rmDataFilePath);

    const data = XLSX.utils.sheet_to_json(rmWorkbook.Sheets['productWiseDistribution']);

    const response = { data, lastRow: data.length };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post(
  '/dummyServer/json/dashboard/relationshipManager/private/getChequeCollectionData',
  (req, res) => {
    const rmUser = req.session.userDetails.userId;

    const rmDataFilePath = './dummyServer/json/commons/relationshipManagerService/data.xlsx';

    const rmWorkbook = XLSX.readFile(rmDataFilePath);

    const data = XLSX.utils.sheet_to_json(rmWorkbook.Sheets['chequeCollection']).map((record) => {
      record['actions'] = [
        {
          index: 0,
          paramList: 'chequeNo',
          methodName: 'onHold',
          type: 'ICON',
          displayName: 'Hold',
          icon: 'fa-pause',
        },
        {
          index: 1,
          paramList: 'chequeNo',
          methodName: 'onApprove',
          type: 'ICON',
          displayName: 'Approve',
          icon: 'fa-check',
        },
        {
          index: 2,
          paramList: 'chequeNo',
          methodName: 'onClearFunds',
          type: 'ICON',
          displayName: 'Clear Funds',
          icon: 'fa-times',
        },
      ];
      return record;
    });

    const response = { data, lastRow: data.length };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post('/dummyServer/json/dashboard/relationshipManager/private/addRmReminder', (req, res) => {
  const rmUser = req.session.userDetails.userId;

  const rmRemindersDataFilePath =
    './dummyServer/json/commons/relationshipManagerService/reminders/data.xlsx';

  const data = {
    rmId: rmUser,
    task: req.body.dataMap.task,
    dateTime: moment(
      req.body.dataMap.date + ' ' + req.body.dataMap.time,
      'DD-MMM-YYYY hh:mm',
    ).toString(),
  };

  const response = {
    data: addDataToExcel(rmRemindersDataFilePath, data, req.session.userDetails),
  };

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

router.post(
  '/dummyServer/json/dashboard/relationshipManager/private/getRmReminders',
  (req, res) => {
    const rmUser = req.session.userDetails.userId;

    const rmRemindersDataFilePath =
      './dummyServer/json/commons/relationshipManagerService/reminders/data.xlsx';

    const rmRemindersWorkbook = XLSX.readFile(rmRemindersDataFilePath);

    const data = XLSX.utils
      .sheet_to_json(rmRemindersWorkbook.Sheets['Sheet1'])
      .filter(
        (record) =>
          record.rmId == rmUser &&
          new Date().toLocaleDateString() == new Date(record.dateTime).toLocaleDateString(),
      )
      .map((record) => {
        return record;
      });

    const response = { data, lastRow: data.length };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post('/dummyServer/json/dashboard/relationshipManager/private/getRmTasks', (req, res) => {
  const rmUser = req.session.userDetails.userId;

  const rmTasksDataFilePath =
    './dummyServer/json/commons/relationshipManagerService/tasks/data.xlsx';

  const rmTasksWorkbook = XLSX.readFile(rmTasksDataFilePath);

  const data = XLSX.utils
    .sheet_to_json(rmTasksWorkbook.Sheets['Sheet1'])
    .filter((record) => record.rmId == rmUser)
    .map((record) => {
      var toDay = moment(new Date());
      var dueDate = moment(new Date(record.dueDate));
      const dueDays = toDay.diff(dueDate, 'days');

      record['dueDays'] = dueDays;
      record['status'] =
        dueDays < 0
          ? 'text-color-success'
          : dueDays > 0
          ? 'text-color-danger'
          : 'text-color-warning';
      return record;
    });

  const response = { data, lastRow: data.length };

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

router.post(
  '/dummyServer/json/dashboard/relationshipManager/private/getRmPerformance',
  (req, res) => {
    const rmUser = req.session.userDetails.userId;

    const rmDataFilePath = './dummyServer/json/commons/relationshipManagerService/data.xlsx';

    const rmWorkbook = XLSX.readFile(rmDataFilePath);

    const relationshipManager = XLSX.utils
      .sheet_to_json(rmWorkbook.Sheets['Sheet1'])
      .find((rm) => rm.rmId == rmUser);

    const targetPerformance = XLSX.utils
      .sheet_to_json(rmWorkbook.Sheets['targetPerformance'])
      .find((record) => record.mstId == relationshipManager.id);

    const actualPerformance = XLSX.utils
      .sheet_to_json(rmWorkbook.Sheets['actualPerformance'])
      .find((record) => record.mstId == relationshipManager.id);

    const data = [
      {
        xLabel: 'Ledger Maintenance',
        yLabel0: targetPerformance.ledgerMaintenance,
        yLabel1: actualPerformance.ledgerMaintenance,
      },
      {
        xLabel: 'MAB Maintenance',
        yLabel0: targetPerformance.mabMaintenance,
        yLabel1: actualPerformance.mabMaintenance,
      },
      {
        xLabel: 'Limit Utlization',
        yLabel0: targetPerformance.limitUtlization,
        yLabel1: actualPerformance.limitUtlization,
      },
      {
        xLabel: 'FX Revenue Earned',
        yLabel0: targetPerformance.fxRevenueEarned,
        yLabel1: actualPerformance.fxRevenueEarned,
      },
      {
        xLabel: 'Fee Generated',
        yLabel0: targetPerformance.feeGenerated,
        yLabel1: actualPerformance.feeGenerated,
      },
      {
        xLabel: 'New Client Onboarded',
        yLabel0: targetPerformance.newClientOnboarded,
        yLabel1: actualPerformance.newClientOnboarded,
      },
    ];

    let response = {
      data: {
        data,
        xKey: 'xLabel',
        xLabel: 'Performance',
        yKeys: ['yLabel0', 'yLabel1'],
        yLabels: ['Target', 'Actual'],
        chartType: 'groupedColumn',
        chartShadow: false,
        categoryAxesPosition: 'bottom',
        categoryAxesTitle: '',
        categoryAxesRotationAngle: '',
        numberAxesPosition: ['left'],
        numberAxesTitle: [''],
        numberAxesRotationAngle: [''],
        legendPosition: 'bottom',
        legendItemMarkerShape: 'circle',
        legendItemMarkerSize: 8,
        legendItemLabelSize: 12,
        legendItemLabelFormatterMethodname: '',
      },
    };

    response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

    res.json(response);
  },
);

router.post('/dummyServer/json/dashboard/relationshipManager/private/getReferences', (req, res) => {
  const dataFilePath = './dummyServer/json/commons/relationshipManagerService/references/data.xlsx';

  const dataWorkbook = XLSX.readFile(dataFilePath);

  let response = {
    data: {
      demoVideos: XLSX.utils.sheet_to_json(dataWorkbook.Sheets['demoVideos']),
      guidelines: XLSX.utils.sheet_to_json(dataWorkbook.Sheets['guidelines']),
      presentation: XLSX.utils.sheet_to_json(dataWorkbook.Sheets['presentation']),
      misList: XLSX.utils.sheet_to_json(dataWorkbook.Sheets['misList']),
    },
  };

  response.responseStatus = { message: 'MSG_KEY_SUCCESS', status: '0' };

  res.json(response);
});

const getRmCorporates = (rmUser) => {
  const rmDataFilePath = './dummyServer/json/commons/relationshipManagerService/data.xlsx';

  const rmWorkbook = XLSX.readFile(rmDataFilePath);

  const relationshipManagers = XLSX.utils.sheet_to_json(rmWorkbook.Sheets['Sheet1']);

  const relationshipManager = relationshipManagers.find((rm) => rm.rmId == rmUser);

  const corporateMainDataFilePath =
    './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

  const corporateMainWorkbook = XLSX.readFile(corporateMainDataFilePath);

  const corporateMainData = XLSX.utils.sheet_to_json(corporateMainWorkbook.Sheets['Sheet1']);

  const corporates = XLSX.utils.sheet_to_json(rmWorkbook.Sheets['corporates']);

  const data = [{ id: 'all', displayName: 'Overall Limit Details' }];

  corporates
    .filter((corporate) => corporate.mstId == relationshipManager.id)
    .forEach((corporate) => {
      const corporateData = corporateMainData.find((corp) => corp.id == corporate.corporateId);

      data.push({
        id: corporate.corporateId,
        displayName: corporateData.corporateName,
      });
    });
  return data;
};

const getCorporateLimitDetailsData = (corporateId, corporateName) => {
  let data = [];

  const cldXlFile =
    './dummyServer/json/accountServices/services/creditLineDetails/creditLineData.xlsx';
  const cldWorkbook = XLSX.readFile(cldXlFile);
  const cldXlData = XLSX.utils.sheet_to_json(cldWorkbook.Sheets['Sheet1']);
  const cldXlProductData = XLSX.utils.sheet_to_json(cldWorkbook.Sheets['products']);

  cldXlData
    .filter((cld) => cld.corporateId == corporateId)
    .forEach((cld) => {
      cldXlProductData
        .filter((clpd) => cld.creditLineNumber == clpd.creditLineNumber)
        .forEach((clpd) => {
          data.push({
            client: corporateName,
            product: clpd.product,
            limitNode: clpd.productId,
            totalAllocatedLimit: clpd.totalAllocatedLimit,
            utilizedLimit: clpd.utilizedLimit,
            availableLimit: clpd.totalAllocatedLimit - clpd.utilizedLimit,
          });
        });
    });

  return data;
};

const getCorporateLimitDetails = (corporateId) => {
  let data = {
    totalAllocatedLimit: 0,
    utilizedLimit: 0,
    availableLimit: 0,
  };

  const cldXlFile =
    './dummyServer/json/accountServices/services/creditLineDetails/creditLineData.xlsx';

  const cldWorkbook = XLSX.readFile(cldXlFile);

  const cldXlData = XLSX.utils.sheet_to_json(cldWorkbook.Sheets['Sheet1']);

  const cldXlProductData = XLSX.utils.sheet_to_json(cldWorkbook.Sheets['products']);

  cldXlData
    .filter((cld) => cld.corporateId == corporateId)
    .forEach((cld) => {
      cldXlProductData
        .filter((clpd) => cld.creditLineNumber == clpd.creditLineNumber)
        .forEach((clpd) => {
          data.totalAllocatedLimit = clpd.totalAllocatedLimit;
          data.utilizedLimit = clpd.utilizedLimit;
          data.availableLimit = clpd.totalAllocatedLimit - clpd.utilizedLimit;
        });
    });

  return data;
};

const getCorporateLedgerBalanceData = (corporateId, corporateName) => {
  let data = [];

  const accountsDataFilePath =
    './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

  const accountsWorkbook = XLSX.readFile(accountsDataFilePath);

  const accountsData = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['accounts']);

  accountsData
    .filter(
      (record) => record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.mstId,
    )
    .forEach((record) => {
      data.push({
        // corporateName,
        accountNumber: record.accountNo + '-' + record.currencyCode,
        accountType:
          record.accountType == 'CURRENT'
            ? 'CAA(Current Account)'
            : record.accountType == 'SAVING'
            ? 'SBA(Savings Account)'
            : 'TDA(Term Deposit Account)',
        currency: record.currencyCode,
        ledgerBalance: record.ledgerBalance,
      });
    });

  return data;
};

const getCorporateMonthlyAverageBalanceData = (corporateId, corporateName) => {
  let data = [];

  const accountsDataFilePath =
    './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

  const accountsWorkbook = XLSX.readFile(accountsDataFilePath);

  const accountsData = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['accounts']);

  accountsData
    .filter(
      (record) => record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.mstId,
    )
    .forEach((record) => {
      data.push({
        // corporateName,
        accountNumber: record.accountNo + '-' + record.currencyCode,
        accountType:
          record.accountType == 'CURRENT'
            ? 'CAA(Current Account)'
            : record.accountType == 'SAVING'
            ? 'SBA(Savings Account)'
            : 'TDA(Term Deposit Account)',

        currency: record.currencyCode,
        monthlyAvailableBalance: record.monthlyAvailableBalance,
      });
    });

  return data;
};

const getCorporateBalances = (corporateId) => {
  let data = {
    ledgerBalance: 0,
    monthlyAverageBalance: 0,
    noOfAccounts: 0,
  };

  const accountsDataFilePath =
    './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';

  const accountsWorkbook = XLSX.readFile(accountsDataFilePath);

  const accountsData = XLSX.utils.sheet_to_json(accountsWorkbook.Sheets['accounts']);

  accountsData
    .filter(
      (record) => record.lastAction.indexOf('Authorized') !== -1 && corporateId == record.mstId,
    )
    .forEach((record) => {
      data.ledgerBalance += +record.ledgerBalance;
      data.monthlyAverageBalance += +record.monthlyAvailableBalance;
      data.noOfAccounts++;
    });

  return data;
};

module.exports = router;
