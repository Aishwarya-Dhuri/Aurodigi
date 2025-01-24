var express = require('express');
var XLSX = require('xlsx');

var router = express.Router();

router.post(
  '/dummyServer/json/dashboard/widgets/private/getPendingAuthorizationForPayments',
  (req, res) => {
    let chartData = [];

    console.log(req.session.userDetails.isGroupUser);

    if (req.session.userDetails.isGroupUser == 'Y') {
      chartData = getGroupPendingAuthorizationForPayments(req.session.userDetails.groupId);
    } else {
      chartData = getCorporatePendingAuthorizationForPayments(req.session.userDetails.corporateId);
    }

    const data = {
      data: chartData,
      xKey: 'xLabel',
      xLabel: 'Payment Type',
      yKeys: ['yLabel0', 'yLabel1'],
      yLabels: ['Total', 'Pending'],
      chartType: 'groupedBar',
      chartShadow: false,
      categoryAxesPosition: 'left',
      categoryAxesTitle: '',
      categoryAxesRotationAngle: '',
      numberAxesPosition: ['bottom'],
      numberAxesTitle: ['Values'],
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
  },
);

const getGroupPendingAuthorizationForPayments = (groupId) => {
  let chartData = [
    {
      xLabel: 'OAT',
      yLabel0: 0,
      yLabel1: 0,
    },
    {
      xLabel: 'Single Payment',
      yLabel0: 0,
      yLabel1: 0,
    },
    {
      xLabel: 'Bulk Pay',
      yLabel0: 0,
      yLabel1: 0,
    },
  ];

  var groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
  var groupWorkbook = XLSX.readFile(groupXlFile);

  var groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

  groupData
    .filter((record) => record.mstId == groupId)
    .forEach((record) => {
      const corporateChartData = getCorporatePendingAuthorizationForPayments(record.corporateId);

      chartData[0].yLabel0 += corporateChartData[0].yLabel0;
      chartData[0].yLabel1 += corporateChartData[0].yLabel1;

      chartData[1].yLabel0 += corporateChartData[1].yLabel0;
      chartData[1].yLabel1 += corporateChartData[1].yLabel1;

      chartData[2].yLabel0 += corporateChartData[2].yLabel0;
      chartData[2].yLabel1 += corporateChartData[2].yLabel1;
    });

  return chartData;
};

const getCorporatePendingAuthorizationForPayments = (corporateId) => {
  let chartData = [
    {
      xLabel: 'OAT',
      yLabel0: 0,
      yLabel1: 0,
    },
    {
      xLabel: 'Single Payment',
      yLabel0: 0,
      yLabel1: 0,
    },
    {
      xLabel: 'Bulk Pay',
      yLabel0: 0,
      yLabel1: 0,
    },
  ];

  const oatXlFile = './dummyServer/json/payments/transactions/ownAccountTransfer/data.xlsx';

  const oatWorkbook = XLSX.readFile(oatXlFile);

  const oatXlData = XLSX.utils.sheet_to_json(oatWorkbook.Sheets['Sheet1']);

  chartData[0].yLabel0 = oatXlData.filter((payment) => payment.corporateId == corporateId).length;
  chartData[0].yLabel1 = oatXlData.filter(
    (payment) =>
      payment.corporateId == corporateId &&
      payment.authorized == 'N' &&
      payment.lastAction != 'Rejected',
  ).length;

  const spXlFile = './dummyServer/json/payments/transactions/singlePaymentRequest/data.xlsx';

  const spWorkbook = XLSX.readFile(spXlFile);

  const spXlData = XLSX.utils.sheet_to_json(spWorkbook.Sheets['Sheet1']);

  chartData[1].yLabel0 = spXlData.filter((payment) => payment.corporateId == corporateId).length;
  chartData[1].yLabel1 = spXlData.filter(
    (payment) =>
      payment.corporateId == corporateId &&
      payment.authorized == 'N' &&
      payment.lastAction != 'Rejected',
  ).length;

  const bpXlFile = './dummyServer/json/payments/transactions/bulkPaymentRequest/data.xlsx';

  const bpWorkbook = XLSX.readFile(bpXlFile);

  const bpXlData = XLSX.utils.sheet_to_json(bpWorkbook.Sheets['Sheet1']);

  chartData[2].yLabel0 = bpXlData.filter((payment) => payment.corporateId == corporateId).length;
  chartData[2].yLabel1 = bpXlData.filter(
    (payment) =>
      payment.corporateId == corporateId &&
      payment.authorized == 'N' &&
      payment.lastAction != 'Rejected',
  ).length;

  return chartData;
};

module.exports = router;
