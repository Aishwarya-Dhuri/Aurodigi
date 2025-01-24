var express = require('express');
var XLSX = require('xlsx');
var _ = require('lodash');
var router = express.Router();

router.post(
  '/dummyServer/json/vam/vamSetup/virtualAccountIssuanceHierarchy/private/dropdown/corporateVaStructureList',
  (req, res) => {
    var dataXlFile = './dummyServer/json/vam/vamSetup/corporateVaStructure/data.xlsx';
    var workbook = XLSX.readFile(dataXlFile);
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
    var dataList = [];

    console.log(req.body);

    _.forEach(xlData, function (record) {
      if (
        record.lastAction.indexOf('Authorized') !== -1 &&
        record.corporateId == req.body.dataMap.corporateId &&
        record.structureCreationFor == req.body.dataMap.vaStructureCreationFor
      ) {
        dataList.push({
          id: record.id,
          displayName: record.corporateStructureName,
          enrichments: {},
        });
      }
    });
    res.json({
      dataList: dataList,
      responseStatus: { message: '', status: '0' },
      entityIdentifier: '',
      loggable: false,
    });
  },
);

module.exports = router;
