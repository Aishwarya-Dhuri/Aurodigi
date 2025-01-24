var express = require('express');
var XLSX = require('xlsx');
const moment = require('moment');

var router = express.Router();

router.post('/dummyServer/json/dashboard/widgets/private/getUpcomingTransactions', (req, res) => {
  let data = [];

  if (req.session.userDetails.isGroupUser == 'Y') {
    data = getGroupUpcomingTransactions(req.session.userDetails.groupId);
  } else {
    data = getCorporateUpcomingTransactions(req.session.userDetails.corporateId);
  }

  res.json({
    data,
    responseStatus: { message: '', status: '0' },
    entityIdentifier: '',
    loggable: false,
  });
});

const getGroupUpcomingTransactions = (groupId) => {
  let data = [];

  var groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
  var groupWorkbook = XLSX.readFile(groupXlFile);

  var groupData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

  groupData
    .filter((record) => record.mstId == groupId)
    .forEach((record) => {
      const corporateData = getCorporateUpcomingTransactions(record.corporateId);

      data.push(corporateData);
    });

  return chartData;
};

const getCorporateUpcomingTransactions = (corporateId) => {
  let data = [];

  const oatXlFile = './dummyServer/json/payments/transactions/ownAccountTransfer/data.xlsx';

  const oatWorkbook = XLSX.readFile(oatXlFile);

  const oatXlData = XLSX.utils.sheet_to_json(oatWorkbook.Sheets['Sheet1']);

  oatXlData
    .filter(
      (payment) =>
        payment.corporateId == corporateId &&
        payment.authorized == 'Y' &&
        isSameOrAfter(payment.ValueDate),
    )
    .forEach((payment) => {
      data.push({
        heading: `You have a payable due on ${moment(payment.ValueDate).format(
          'DD MMM YYYY',
        )} for ${payment.payableAmount} ${payment.debitCurrencyCode}`,
        subHeading: `Due by ${moment(payment.ValueDate).diff(moment())} days`,
      });
    });

  const spXlFile = './dummyServer/json/payments/transactions/singlePaymentRequest/data.xlsx';

  const spWorkbook = XLSX.readFile(spXlFile);

  const spXlData = XLSX.utils.sheet_to_json(spWorkbook.Sheets['Sheet1']);

  spXlData
    .filter(
      (payment) =>
        payment.corporateId == corporateId &&
        payment.authorized == 'Y' &&
        isSameOrAfter(payment.ValueDate),
    )
    .forEach((payment) => {
      data.push({
        heading: `You have a payable due on ${moment(payment.ValueDate).format(
          'DD MMM YYYY',
        )} for ${payment.payableAmount} ${payment.debitCurrencyCode}`,
        subHeading: `Due by ${moment(payment.ValueDate).diff(moment())} days`,
      });
    });

  return data;
};

const isSameOrAfter = (date) => {
  return moment(moment(date).format('DD MMM YYYY')).isSameOrAfter(
    moment(moment().format('DD MMM YYYY')),
  );
};

module.exports = router;
