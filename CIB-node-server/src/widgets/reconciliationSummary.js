var express = require('express');
var XLSX = require('xlsx');

var router = express.Router();

router.post('/dummyServer/json/dashboard/widgets/private/getReconciliationSummary', (req, res) => {
  let chartData = [
    {
      xLabel: 'Jan',
      yLabel0: 180,
      yLabel1: 20,
    },
    {
      xLabel: 'Feb',
      yLabel0: 110,
      yLabel1: 100,
    },
    {
      xLabel: 'March',
      yLabel0: 90,
      yLabel1: 90,
    },
    {
      xLabel: 'April',
      yLabel0: 50,
      yLabel1: 40,
    },
    {
      xLabel: 'May',
      yLabel0: 60,
      yLabel1: 10,
    },
  ];

  const data = {
    data: chartData,
    xKey: 'xLabel',
    xLabel: 'Months',
    yKeys: ['yLabel0', 'yLabel1'],
    yLabels: ['Matched', 'Unmatched'],
    chartType: 'groupedColumn',
    chartShadow: false,
    categoryAxesPosition: 'bottom',
    categoryAxesTitle: 'Months',
    categoryAxesRotationAngle: '',
    numberAxesPosition: ['left'],
    numberAxesTitle: ['Amount'],
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
