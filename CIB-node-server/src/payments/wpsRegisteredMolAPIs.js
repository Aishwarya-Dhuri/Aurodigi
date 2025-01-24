var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var router = express.Router();

router.post('/dummyServer/json/dashboard/widgets/private/getTopFivePaidMolIds', (req, res) => {
  let dataList = [];

  if (req.session.userDetail) {
    if (req.session.userDetails.isGroupUser == 'Y') {
      dataList = getGroupRegisteredMolList(req.session.userDetails.groupId);
    } else {
      dataList = getCorporateRegisteredMolList(req.session.userDetails.corporateId);
    }
  } else {
    dataList = getCorporateRegisteredMolList(req.body.dataMap.corporateId);
  }

  const chartData = dataList.map((d) => {
    return {
      xLabel: d.molId,
      yLabel0: d.paidAmount,
    };
  });

  const data = {
    data: chartData,
    xKey: 'xLabel',
    xLabel: 'Top 5 Paid MOL IDs',
    yKeys: ['yLabel0'],
    yLabels: ['Amount'],
    chartType: 'donut',
    chartShadow: false,
    categoryAxesPosition: 'bottom',
    categoryAxesTitle: 'Amount',
    categoryAxesRotationAngle: '',
    numberAxesPosition: ['left'],
    numberAxesTitle: [''],
    numberAxesRotationAngle: [''],
    legendPosition: 'bottom',
    legendItemMarkerShape: 'circle',
    legendItemMarkerSize: 8,
    legendItemLabelSize: 12,
    legendItemLabelFormatterMethodname: '',
  };

  res.json({
    data,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

router.post(
  '/dummyServer/json/payment/transactions/wpsRegisteredMol/private/getRegisteredMolList',
  (req, res) => {
    let dataList = [];

    if (req.session?.userDetails?.loginPreferenceDetails?.loginType == 'group') {
      const groupCorporateList = getGroupCorporate(req.session.userDetails.groupId);

      groupCorporateList.forEach((corporate) => {
        dataList.push(
          ...getCorporateRegisteredMolList(corporate.corporateId).map((record) => {
            return { id: record.id, displayName: record.molId, enrichments: { ...record } };
          }),
        );
      });
    } else {
      dataList = getCorporateRegisteredMolList(req.session.userDetails.corporateId).map(
        (record) => {
          return { id: record.id, displayName: record.molId, enrichments: { ...record } };
        },
      );
    }

    res.json({
      dataList,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payment/transactions/wpsRegisteredMol/private/getGroupRegisteredMolList',
  (req, res) => {
    const dataList = getGroupRegisteredMolList(req);

    res.json({
      data: dataList,
      lastRow: dataList.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

const getGroupRegisteredMolList = (req) => {
  const dataList = [];

  const groupCorporateList = getGroupCorporate(req.session.userDetails.groupId);

  groupCorporateList.forEach((corporate) => {
    dataList.push(...getCorporateRegisteredMolList(corporate.corporateId));
  });

  return dataList;
};

router.post(
  '/dummyServer/json/payment/transactions/wpsRegisteredMol/private/dropdown/getGroupRegisteredMolList',
  (req, res) => {
    const dataList = [];

    const groupCorporateList = getGroupCorporate(req.session.userDetails.groupId);

    groupCorporateList.forEach((corporate) => {
      const data = {
        id: corporate.corporateId,
        displayName: corporate.corporateName,
        items: [],
      };

      data.items.push(
        ...getCorporateRegisteredMolList(corporate.corporateId).map((record) => {
          return { id: record.id, displayName: record.molId, enrichments: { ...record } };
        }),
      );

      dataList.push(data);
    });

    res.json({
      dataList,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payment/transactions/wpsRegisteredMol/private/getCorporateRegisteredMolList',
  (req, res) => {
    const dataList = getCorporateRegisteredMolList(req.session.userDetails.corporateId);

    res.json({
      data: dataList,
      lastRow: dataList.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/payment/transactions/wpsRegisteredMol/private/dropdown/getCorporateRegisteredMolList',
  (req, res) => {
    const dataList = getCorporateRegisteredMolList(req.session.userDetails.corporateId).map(
      (record) => {
        return { id: record.id, displayName: record.molId, enrichments: { ...record } };
      },
    );

    res.json({
      dataList,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

const getCorporateRegisteredMolList = (corporateId) => {
  var dataFilePath = './dummyServer/json/payments/transactions/wpsRegisteredMol/data.xlsx';
  var workbook = XLSX.readFile(dataFilePath);
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
  var molAccountXlData = XLSX.utils.sheet_to_json(workbook.Sheets['accounts']);

  const dataList = [];

  const corporate = getCorporate(corporateId);

  xlData
    .filter((record) => record.corporateId == corporateId)
    .forEach((record) => {
      dataList.push({
        ...corporate,
        id: record.id,
        molId: record.molId,
        paidAmount: record.paidAmount,
        debitAccountNo: getCorporateAccount(
          molAccountXlData.filter((acc) => acc.mstId == record.id)[0].accountNo,
        ).displayName,
        fileFormat: record.fileFormat,
        fileCharge: record.fileCharge,
        transactionCharge: record.transactionCharge,
      });
    });

  return dataList;
};

router.post(
  '/dummyServer/json/payment/transactions/wpsRegisteredMol/private/getMolLinkedAccountList',
  (req, res) => {
    var dataFilePath = './dummyServer/json/payments/transactions/wpsRegisteredMol/data.xlsx';
    var workbook = XLSX.readFile(dataFilePath);
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['accounts']);

    const molAccounts = xlData.filter((record) => record.mstId == req.body.dataMap.molId);

    const dataList = [];

    molAccounts.forEach((record) => {
      dataList.push(getCorporateAccount(record.accountNo));
    });

    res.json({
      dataList,
      lastRow: dataList.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

const getGroupCorporate = (groupId) => {
  var groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
  var groupWorkbook = XLSX.readFile(groupXlFile);
  var groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

  var dataList = [];

  groupData
    .filter((record) => record.mstId == groupId)
    .forEach((record) => {
      dataList.push(getCorporate(record.corporateId));
    });

  return dataList;
};

const getCorporate = (corporateId) => {
  var corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
  var corporateWorkbook = XLSX.readFile(corporateXlFile);
  var corporateXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['Sheet1']);

  const corporateData = corporateXlData.find((corp) => corp.id == corporateId);

  return {
    corporateId: corporateData.id,
    corporateCode: corporateData.corporateCode,
    corporateName: corporateData.corporateName,
  };
};

const getCorporateAccount = (accountId) => {
  var corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
  var corporateWorkbook = XLSX.readFile(corporateXlFile);
  var corporateAccountXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['accounts']);

  const corporateAccountData = corporateAccountXlData.find((acc) => acc.id == accountId);

  return {
    id: accountId,
    displayName: corporateAccountData.accountNo + '-' + corporateAccountData.currencyCode,
    enrichments: {
      ...corporateAccountData,
    },
  };
};

module.exports = { router, getGroupRegisteredMolList, getCorporateRegisteredMolList };
