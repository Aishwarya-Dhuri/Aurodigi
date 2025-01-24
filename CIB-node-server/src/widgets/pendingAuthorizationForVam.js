var express = require('express');
var XLSX = require('xlsx');

var router = express.Router();

router.post(
  '/dummyServer/json/dashboard/widgets/private/getPendingAuthorizationForVam',
  (req, res) => {
    let chartData = [];

    if (req.session.userDetails.isGroupUser == 'Y') {
      chartData = getGroupPendingAuthorizationForVam(req.session.userDetails.groupId);
    } else {
      chartData = getCorporatePendingAuthorizationForVam(req.session.userDetails.corporateId);
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

const getGroupPendingAuthorizationForVam = (groupId) => {
  let chartData = [
    {
      xLabel: 'VA Issuance',
      yLabel0: 4,
      yLabel1: 2,
    },
    {
      xLabel: 'VA Issuance Upload',
      yLabel0: 10,
      yLabel1: 5,
    },
    {
      xLabel: 'VA Status Mgmt',
      yLabel0: 60,
      yLabel1: 20,
    },
  ];

  var groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
  var groupWorkbook = XLSX.readFile(groupXlFile);

  var groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

  groupData
    .filter((record) => record.mstId == groupId)
    .forEach((record) => {
      const corporateChartData = getCorporatePendingAuthorizationForVam(record.corporateId);

      chartData[0].yLabel0 += corporateChartData[0].yLabel0;
      chartData[0].yLabel1 += corporateChartData[0].yLabel1;

      chartData[1].yLabel0 += corporateChartData[1].yLabel0;
      chartData[1].yLabel1 += corporateChartData[1].yLabel1;

      chartData[2].yLabel0 += corporateChartData[2].yLabel0;
      chartData[2].yLabel1 += corporateChartData[2].yLabel1;
    });

  return chartData;
};

const getCorporatePendingAuthorizationForVam = (corporateId) => {
  let chartData = [
    {
      xLabel: 'VA Issuance',
      yLabel0: 4,
      yLabel1: 2,
    },
    {
      xLabel: 'VA Issuance Upload',
      yLabel0: 10,
      yLabel1: 5,
    },
    {
      xLabel: 'VA Status Mgmt',
      yLabel0: 60,
      yLabel1: 20,
    },
  ];

  const vaiXlFile = './dummyServer/json/vam/vamSetup/virtualAccountIssuance/data.xlsx';

  const vaiWorkbook = XLSX.readFile(vaiXlFile);

  const vaiXlData = XLSX.utils.sheet_to_json(vaiWorkbook.Sheets['Sheet1']);

  chartData[0].yLabel0 = vaiXlData.filter((payment) => payment.corporateId == corporateId).length;
  chartData[0].yLabel1 = vaiXlData.filter(
    (payment) =>
      payment.corporateId == corporateId &&
      payment.authorized == 'N' &&
      payment.lastAction != 'Rejected',
  ).length;

  const vaiuXlFile = './dummyServer/json/vam/vamSetup/virtualAccountIssuanceUpload/data.xlsx';

  const vaiuWorkbook = XLSX.readFile(vaiuXlFile);

  const vaiuXlData = XLSX.utils.sheet_to_json(vaiuWorkbook.Sheets['Sheet1']);

  chartData[1].yLabel0 = vaiuXlData.filter((payment) => payment.corporateId == corporateId).length;
  chartData[1].yLabel1 = vaiuXlData.filter(
    (payment) =>
      payment.corporateId == corporateId &&
      payment.authorized == 'N' &&
      payment.lastAction != 'Rejected',
  ).length;

  const vasmXlFile = './dummyServer/json/vam/process/virtualAccountStatusManagement/data.xlsx';

  const vasmWorkbook = XLSX.readFile(vasmXlFile);

  const vasmXlData = XLSX.utils.sheet_to_json(vasmWorkbook.Sheets['Sheet1']);

  chartData[2].yLabel0 = vasmXlData.filter((payment) => payment.corporateId == corporateId).length;
  chartData[2].yLabel1 = vasmXlData.filter(
    (payment) =>
      payment.corporateId == corporateId &&
      payment.authorized == 'N' &&
      payment.lastAction != 'Rejected',
  ).length;

  return chartData;
};

module.exports = router;
