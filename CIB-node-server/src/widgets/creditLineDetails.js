var express = require('express');
var XLSX = require('xlsx');

var router = express.Router();

router.post('/dummyServer/json/dashboard/widgets/private/getCreditLineDetails', (req, res) => {
  let chartData = [];

  if (req.session.userDetails.isGroupUser == 'Y') {
    chartData = getGroupCreditLineDetails(req.session.userDetails.groupId);
  } else {
    chartData = getCorporateCreditLineDetails(req.session.userDetails.corporateId);
  }
  // chartData = getCorporateCreditLineDetails('100082');

  const data = {
    data: chartData,
    xKey: 'xLabel',
    xLabel: 'Payment Type',
    yKeys: ['yLabel0', 'yLabel1'],
    yLabels: ['Utilized Limit', 'Available Limit'],
    chartType: 'groupedColumn',
    chartShadow: false,
    categoryAxesPosition: 'bottom',
    categoryAxesTitle: 'Products',
    categoryAxesRotationAngle: '',
    numberAxesPosition: ['left'],
    numberAxesTitle: ['Credit Line Amount'],
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

const getGroupCreditLineDetails = (groupId) => {
  let chartData = [
    {
      xLabel: 'Trade Finance',
      yLabel0: 0,
      yLabel1: 0,
    },
    {
      xLabel: 'FSCM',
      yLabel0: 0,
      yLabel1: 0,
    },
    {
      xLabel: 'Collection',
      yLabel0: 0,
      yLabel1: 0,
    },
    {
      xLabel: 'Loans / Working Capitals',
      yLabel0: 0,
      yLabel1: 0,
    },
    {
      xLabel: 'Islamic Finance',
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
      const corporateChartData = getCorporateCreditLineDetails(record.corporateId);

      for (let i = 0; i < chartData.length; i++) {
        chartData[i].yLabel0 += corporateChartData[i].yLabel0;
        chartData[i].yLabel1 += corporateChartData[i].yLabel1;
      }
    });

  return chartData;
};

const getCorporateCreditLineDetails = (corporateId) => {
  let chartData = [
    {
      xLabel: 'Trade Finance',
      yLabel0: 0,
      yLabel1: 0,
    },
    {
      xLabel: 'FSCM',
      yLabel0: 0,
      yLabel1: 0,
    },
    {
      xLabel: 'Collection',
      yLabel0: 0,
      yLabel1: 0,
    },
    {
      xLabel: 'Loans / Working Capitals',
      yLabel0: 0,
      yLabel1: 0,
    },
    {
      xLabel: 'Islamic Finance',
      yLabel0: 0,
      yLabel1: 0,
    },
  ];

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
          if (clpd.productId == 1) {
            chartData[0].yLabel0 = clpd.utilizedLimit;
            chartData[0].yLabel1 = clpd.totalAllocatedLimit - clpd.utilizedLimit;
          } else if (clpd.productId == 2) {
            chartData[1].yLabel0 = clpd.utilizedLimit;
            chartData[1].yLabel1 = clpd.totalAllocatedLimit - clpd.utilizedLimit;
          } else if (clpd.productId == 3) {
            chartData[2].yLabel0 = clpd.utilizedLimit;
            chartData[2].yLabel1 = clpd.totalAllocatedLimit - clpd.utilizedLimit;
          } else if (clpd.productId == 4) {
            chartData[3].yLabel0 = clpd.utilizedLimit;
            chartData[3].yLabel1 = clpd.totalAllocatedLimit - clpd.utilizedLimit;
          } else if (clpd.productId == 5) {
            chartData[4].yLabel0 = clpd.utilizedLimit;
            chartData[4].yLabel1 = clpd.totalAllocatedLimit - clpd.utilizedLimit;
          }
        });
    });

  return chartData;
};

module.exports = router;
