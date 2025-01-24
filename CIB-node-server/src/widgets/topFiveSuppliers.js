var express = require('express');
var XLSX = require('xlsx');
const moment = require('moment');

var router = express.Router();

router.post('/dummyServer/json/dashboard/widgets/private/getTopFiveSuppliers', (req, res) => {
  let chartData = [];

  //   const type =
  //     req.body && req.body.dataMap && req.body.dataMap.type ? req.body.dataMap.type : 'count';
  //   const duration =
  //     req.body && req.body.dataMap && req.body.dataMap.duration ? req.body.dataMap.duration : 'daily';

  //   if (req.session.userDetails.isGroupUser == 'Y') {
  //     chartData = getGroupCreditLineDetails(req.session.userDetails.groupId, type, duration);
  //   } else {
  //     chartData = getCorporateCreditLineDetails(req.session.userDetails.corporateId, type, duration);
  //   }

  chartData = getGroupCreditLineDetails('1', 'amount', 'daily');

  const yKeys = [];
  const yLabels = [];

  chartData.forEach((d, i) => {
    yKeys.push('yLabel' + i);
    yLabels.push(d.xLabel);
  });

  const data = {
    data: chartData,
    xKey: 'xLabel',
    xLabel: 'Payment Type',
    yKeys,
    yLabels,
    chartType: 'groupColumn',
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

const getGroupCreditLineDetails = (groupId, type, duration) => {
  let chartData = [
    {
      xLabel: '',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
      yLabel4: 0,
    },
    {
      xLabel: '',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
      yLabel4: 0,
    },
    {
      xLabel: '',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
      yLabel4: 0,
    },
    {
      xLabel: '',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
      yLabel4: 0,
    },
    {
      xLabel: '',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
      yLabel4: 0,
    },
  ];

  var groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
  var groupWorkbook = XLSX.readFile(groupXlFile);

  var groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

  groupData
    .filter((record) => record.mstId == groupId)
    .forEach((record) => {
      const corporateChartData = getCorporateCreditLineDetails(record.corporateId, type, duration);

      for (let i = 0; i < chartData.length; i++) {
        if (corporateChartData[i]) {
          chartData[i].xLabel = corporateChartData[i].xLabel;
          chartData[i]['yLabel' + i] += corporateChartData[i]['yLabel' + i];
        }
      }
    });

  return chartData;
};

const getCorporateCreditLineDetails = (corporateId, type, duration) => {
  let chartData = [
    {
      xLabel: '',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
      yLabel4: 0,
    },
    {
      xLabel: '',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
      yLabel4: 0,
    },
    {
      xLabel: '',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
      yLabel4: 0,
    },
    {
      xLabel: '',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
      yLabel4: 0,
    },
    {
      xLabel: '',
      yLabel0: 0,
      yLabel1: 0,
      yLabel2: 0,
      yLabel3: 0,
      yLabel4: 0,
    },
  ];

  const tfsXlFile = './dummyServer/json/widgets/topFiveSuppliers.xlsx';

  const tfsWorkbook = XLSX.readFile(tfsXlFile);

  const tfsXlData = XLSX.utils.sheet_to_json(tfsWorkbook.Sheets['Sheet1']);
  const tfsXlInvoiceData = XLSX.utils.sheet_to_json(tfsWorkbook.Sheets['invoices']);

  tfsXlData
    .filter((tfs) => tfs.corporateId == corporateId)
    .forEach((tfs, i) => {
      chartData[i].xLabel = tfs.supplierName;
      chartData[i]['yLabel' + i] = 0;

      tfsXlInvoiceData
        .filter(
          (tfsi) =>
            tfsi.supplierId == tfs.supplierId && isDurationMatched(duration, tfsi.invoiceDate),
        )
        .forEach((tfsi) => {
          chartData[i]['yLabel' + i] += type == 'count' ? 1 : tfsi.invoiceAmount;
        });
    });

  return chartData;
};

const isDurationMatched = (duration, date) => {
  const compareDate = moment(new Date(date)).format('YYYY-MM-DD');
  let startDate = moment().format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');

  if (duration == 'daily') {
    startDate = moment().format('YYYY-MM-DD');
  } else if (duration == 'weekly') {
    startDate = moment(moment().subtract(7, 'days')).format('YYYY-MM-DD');
  } else if (duration == 'monthly') {
    startDate = moment(moment().subtract(30, 'days')).format('YYYY-MM-DD');
  }

  return (
    moment(compareDate).isSame(startDate) ||
    moment(compareDate).isBetween(moment(startDate), moment(endDate)) ||
    moment(compareDate).isSame(endDate)
  );
};

module.exports = router;
