const { response } = require('express');
var express = require('express');
var XLSX = require('xlsx');

var router = express.Router();

router.post(
  '/dummyServer/json/setup/generalMasters/corporateProductPortfolio/private/getGroupData',
  (req, res) => {
    res.send({
      data: [
        getGroupCorporatesData(
          req.session?.userDetails?.groupId ? req.session?.userDetails?.groupId : '1',
        ),
      ],
      responseStatus: { message: '', status: '0' },
    });
  },
);

const getGroupCorporatesData = (groupId) => {
  var groupXlFile = './dummyServer/json/setup/corporateOnboarding/corporateGroup/data.xlsx';
  var groupWorkbook = XLSX.readFile(groupXlFile);

  var groupDataList = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);
  var groupCorporateData = XLSX.utils.sheet_to_json(groupWorkbook.Sheets['corporates']);

  const groupData = groupDataList.find((record) => record.id == groupId);

  var corporates = [];

  groupCorporateData
    .filter((record) => record.mstId == groupId)
    .forEach((record) => {
      dataList.push(getCorporateData(record.corporateId));
    });

  return {
    groupIcon: 'assets/images/' + groupData.groupImage,
    groupName: groupData.groupName,
    groupCode: groupData.groupCode,
    liabilityId: '0073712',
    corporates,
  };
};

router.post(
  '/dummyServer/json/setup/generalMasters/corporateProductPortfolio/private/getCorporateData',
  (req, res) => {
    res.send({
      data: [
        getCorporateData(
          req.session?.userDetails?.corporateId ? req.session?.userDetails?.corporateId : '1',
        ),
      ],
      responseStatus: { message: '', status: '0' },
    });
  },
);

const getCorporateData = (corporateId) => {
  var corporateXlFile = './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx';
  var corporateWorkbook = XLSX.readFile(corporateXlFile);

  var corporateXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['Sheet1']);
  var accountsXlData = XLSX.utils.sheet_to_json(corporateWorkbook.Sheets['accounts']);

  const corporateData = corporateXlData.find((corp) => corp.id == corporateId);

  var totalAccounts = accountsXlData.filter(
    (acc) =>
      acc.mstId === corporateData.id &&
      acc.lastAction.indexOf('Authorized') !== -1 &&
      ['CURRENT', 'SAVING'].includes(acc.accountType.toUpperCase()),
  ).length;

  return {
    corporateId: corporateData.id,
    corporateIcon: 'assets/images/' + corporateData.corporateImage,
    corporateName: corporateData.corporateName,
    category: 'Gold',
    accounts: totalAccounts,
  };
};

router.post(
  '/dummyServer/json/setup/generalMasters/corporateProductPortfolio/private/getCorporateData',
  (req, res) => {},
);

module.exports = router;
