var express = require('express');
var router = express.Router();
var _ = require('lodash');

const XLSX = require('xlsx');

router.post(
  '/dummyServer/json/setup/security/downloadSecurityFiles/private/getSecurityFiles',
  (req, res) => {
    const dataXlFile = './dummyServer/json/setup/security/downloadSecurityFile/data.xlsx';

    let workbook = XLSX.readFile(dataXlFile);
    let xlData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

    res.json({
      data: xlData,
      lastRoe: xlData.length,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/setup/security/downloadSecurityFiles/private/generateOTP',
  (req, res) => {
    res.json({
      otpSendStatus: true,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);

router.post(
  '/dummyServer/json/setup/security/downloadSecurityFiles/private/validateOTP',
  (req, res) => {
    res.json({
      otpVerificationStatus: req.body?.dataMap?.otp == 1234,
      responseStatus: { message: 'MSG_KEY_SUCCESS', status: '0' },
    });
  },
);
module.exports = router;
