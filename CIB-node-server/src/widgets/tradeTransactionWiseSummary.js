var express = require('express');
var XLSX = require('xlsx');

var router = express.Router();

router.post(
  '/dummyServer/json/dashboard/widgets/private/getTradeTransactionWiseSummary',
  (req, res) => {
    let chartData = [];

    if (req.session.userDetails.isGroupUser == 'Y') {
      chartData = getGroupTradeTransactionWiseSummary(req.session.userDetails.groupId);
    } else {
      chartData = getCorporateTradeTransactionWiseSummary(req.session.userDetails.corporateId);
    }

    const data = {
      data: chartData,
      xKey: 'xLabel',
      xLabel: 'Payment Type',
      yKeys: ['yLabel0', 'yLabel1'],
      yLabels: ['Pending', 'Authorized'],
      chartType: 'groupedColumn',
      chartShadow: false,
      categoryAxesPosition: 'bottom',
      categoryAxesTitle: 'Type of Transaction',
      categoryAxesRotationAngle: '',
      numberAxesPosition: ['left'],
      numberAxesTitle: ['No of Transaction'],
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

const getGroupTradeTransactionWiseSummary = (groupId) => {
  let chartData = [
    {
      xLabel: 'LC',
      yLabel0: 20,
      yLabel1: 25,
    },
    {
      xLabel: 'BG',
      yLabel0: 15,
      yLabel1: 25,
    },
    {
      xLabel: 'SG',
      yLabel0: 20,
      yLabel1: 45,
    },
  ];

  var groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
  var groupWorkbook = XLSX.readFile(groupXlFile);

  var groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

  groupData
    .filter((record) => record.mstId == groupId)
    .forEach((record) => {
      const corporateChartData = getCorporateTradeTransactionWiseSummary(record.corporateId);

      chartData[0].yLabel0 += corporateChartData[0].yLabel0;
      chartData[0].yLabel1 += corporateChartData[0].yLabel1;

      chartData[1].yLabel0 += corporateChartData[1].yLabel0;
      chartData[1].yLabel1 += corporateChartData[1].yLabel1;

      chartData[2].yLabel0 += corporateChartData[2].yLabel0;
      chartData[2].yLabel1 += corporateChartData[2].yLabel1;
    });

  return chartData;
};

const getCorporateTradeTransactionWiseSummary = (corporateId) => {
  let chartData = [
    {
      xLabel: 'LC',
      yLabel0: 20,
      yLabel1: 25,
    },
    {
      xLabel: 'BG',
      yLabel0: 15,
      yLabel1: 25,
    },
    {
      xLabel: 'SG',
      yLabel0: 20,
      yLabel1: 45,
    },
  ];

  const lcXlFile = './dummyServer/json/trade/importTransactions/letterOfCredit/data.xlsx';

  const lcWorkbook = XLSX.readFile(lcXlFile);

  const lcXlData = XLSX.utils.sheet_to_json(lcWorkbook.Sheets['Sheet1']);

  chartData[0].yLabel0 = lcXlData.filter(
    (payment) =>
      payment.corporateId == corporateId &&
      payment.authorized == 'N' &&
      payment.lastAction != 'Rejected',
  ).length;
  chartData[0].yLabel0 = lcXlData.filter(
    (payment) =>
      payment.corporateId == corporateId && payment.authorized == 'Y' && payment.enabled == 'Y',
  ).length;

  const bgXlFile = './dummyServer/json/trade/exportTransactions/bankGuarantee/data.xlsx';

  const bgWorkbook = XLSX.readFile(bgXlFile);

  const bgXlData = XLSX.utils.sheet_to_json(bgWorkbook.Sheets['Sheet1']);

  chartData[1].yLabel0 = bgXlData.filter(
    (payment) =>
      payment.corporateId == corporateId &&
      payment.authorized == 'N' &&
      payment.lastAction != 'Rejected',
  ).length;
  chartData[1].yLabel1 = bgXlData.filter(
    (payment) =>
      payment.corporateId == corporateId && payment.authorized == 'Y' && payment.enabled == 'Y',
  ).length;

  const sgXlFile = './dummyServer/json/trade/importTransactions/shippingGuarantee/data.xlsx';

  const sgWorkbook = XLSX.readFile(sgXlFile);

  const sgXlData = XLSX.utils.sheet_to_json(sgWorkbook.Sheets['Sheet1']);

  chartData[2].yLabel0 = sgXlData.filter(
    (payment) =>
      payment.corporateId == corporateId &&
      payment.authorized == 'N' &&
      payment.lastAction != 'Rejected',
  ).length;
  chartData[2].yLabel0 = sgXlData.filter(
    (payment) =>
      payment.corporateId == corporateId && payment.authorized == 'Y' && payment.enabled == 'Y',
  ).length;

  return chartData;
};

module.exports = router;
