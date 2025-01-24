var express = require('express');
var XLSX = require('xlsx');

var router = express.Router();

router.post(
  '/dummyServer/json/lms/corporate/accountStructure/private/getAccountStructure',
  (req, res) => {
    var accountStructureXlFile =
      './dummyServer/json/lms/corporate/accountStructure/accountStructure.xlsx';
    var accountStructureWorkbook = XLSX.readFile(accountStructureXlFile);

    const accountStructureData = XLSX.utils.sheet_to_json(
      accountStructureWorkbook.Sheets['Sheet1'],
    );

    const data = accountStructureData.map((accounts) => {
      accounts.accountNo = accounts.accountNo.split(',');

      accounts.accountNo = accounts.accountNo.map((accountNo) => {
        return accounts.country + '-' + accounts.bank + '-' + accountNo + '-' + accounts.currency;
      });

      return accounts;
    });

    res.json(data);
  },
);

module.exports = router;
