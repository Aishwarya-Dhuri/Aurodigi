var express = require('express');
var XLSX = require('xlsx');

var router = express.Router();

router.post('/dummyServer/json/dashboard/widgets/private/getUserMonitoring', (req, res) => {
  let chartData = [
    {
      xLabel: 'Active',
      yLabel0: 21,
      yLabel1: 0,
      yLabel2: 0,
    },
    {
      xLabel: 'LoggedIn User',
      yLabel0: 0,
      yLabel1: 10,
      yLabel2: 0,
    },
    {
      xLabel: 'Locked User',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 2,
    },
  ];

  const data = {
    data: chartData,
    xKey: 'xLabel',
    xLabel: 'User Status',
    yKeys: ['yLabel0', 'yLabel1', 'yLabel2'],
    yLabels: ['Active', 'LoggedIn User', 'Locked User'],
    chartType: 'column',
    chartShadow: false,
    categoryAxesPosition: 'bottom',
    categoryAxesTitle: 'User Status',
    categoryAxesRotationAngle: '',
    numberAxesPosition: ['left'],
    numberAxesTitle: ['No of Users'],
    numberAxesRotationAngle: [''],
    legendEnabled: false,
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

module.exports = router;
