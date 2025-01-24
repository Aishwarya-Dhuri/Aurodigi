var express = require('express');
var XLSX = require('xlsx');

var router = express.Router();

router.post('/dummyServer/json/dashboard/widgets/private/getChequePrintingQueue', (req, res) => {
  let chartData = [
    {
      xLabel: 'Pending',
      yLabel0: 4,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
    },
    {
      xLabel: 'Reconciled',
      yLabel0: 0,
      yLabel1: 3,
      yLabel2: 0,
      yLabel3: 0,
    },
    {
      xLabel: 'RePrint',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 2,
      yLabel3: 0,
    },
    {
      xLabel: 'Payments',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 2,
    },
  ];

  const data = {
    data: chartData,
    xKey: 'xLabel',
    xLabel: 'User Status',
    yKeys: ['yLabel0', 'yLabel1', 'yLabel2', 'yLabel3'],
    yLabels: ['Pending', 'Reconciled', 'Re-Print', 'Printed'],
    chartType: 'column',
    chartShadow: false,
    categoryAxesPosition: 'bottom',
    categoryAxesTitle: 'Status',
    categoryAxesRotationAngle: '',
    numberAxesPosition: ['left'],
    numberAxesTitle: ['Printing Volume'],
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
