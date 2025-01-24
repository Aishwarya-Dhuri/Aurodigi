const fs = require('fs');
var express = require('express');
var moment = require('moment');
var XLSX = require('xlsx');
var _ = require('lodash');
var ip = require('ip');
const jwt = require('jsonwebtoken');
var router = express.Router();
var getViewData = require('./crudAPIs').getViewData;
var updateWorkbook = require('./crudAPIs').updateWorkbook;
const appConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
let sessionDetails = {};

router.post('/dummyServer/json/login/public/getPhishingDetails', (req, res) => {
  console.log('Checking username');
  const filters = [
    { name: 'userId', value: req.body.dataMap.userName },
    { name: 'authorized', value: 'Y' },
    { name: 'enabled', value: 'Y' },
  ];
  userData = getViewData('./dummyServer/json/setup/security/corporateUser/data.xlsx', filters);
  if (!userData) {
    res.json({ responseStatus: { message: 'INVALID_USER', status: '1' } });
  } else {
    corpFilters = [{ name: 'id', value: userData.corporateId }];
    if (req.body.dataMap.corporateCode)
      corpFilters.push({ name: 'corporateCode', value: req.body.dataMap.corporateCode });
    const corporate = getViewData(
      './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx',
      corpFilters,
    );
    if (!corporate) res.json({ responseStatus: { message: 'INVALID_USER', status: '1' } });
    else {
      res.json({
        responseStatus: { message: '', status: '0' },
        dataMap: {
          userName: req.body.dataMap.userName,
          corporateId: corporate.id,
          corporateCode: corporate.corporateCode,
          corporateName: corporate.corporateName,
          applicationDate: moment().format('DD-MMM-YYYY'),
          categoryCode: userData.phishingDetails[0].categoryCode,
          phishingImageFileName: userData.phishingDetails[0].phishingImageFileName,
          message: userData.phishingDetails[0].message,
          categoryName: userData.phishingDetails[0].categoryName,
          phishingImageId: userData.phishingDetails[0].phishingImageId,
          systemGeneratedImageFileName: userData.phishingDetails[0].systemGeneratedImageFileName,
          appSettingId: corporate.appSettingId ? corporate.appSettingId : 1,
        },
        entityIdentifier: '',
        entity: '',
        loggable: false,
      });
    }
  }
});

router.post('/dummyServer/json/login/public/basicAuthentication', (req, res) => {
  console.log('Checking Username and Password');
  const filters = [
    { name: 'userId', value: req.body.userName },
    { name: 'authorized', value: 'Y' },
    { name: 'enabled', value: 'Y' },
  ];
  var userData = null;
  if (!appConfig.BYPASS_PASSWORD) filters.push({ name: 'password', value: req.body.password });
  userData = getViewData('./dummyServer/json/setup/security/corporateUser/data.xlsx', filters);
  if (!userData) {
    res.json({ responseStatus: { message: 'INVALID_USER', status: '1' } });
  } else {
    corpFilters = [{ name: 'id', value: userData.corporateId }];
    if (req.body.corporateCode)
      corpFilters.push({ name: 'corporateCode', value: req.body.corporateCode });
    const corporate = getViewData(
      './dummyServer/json/setup/corporateOnboarding/corporateMain/data.xlsx',
      corpFilters,
    );
    if (!corporate) res.json({ responseStatus: { message: 'INVALID_USER', status: '1' } });
    else {
      var userDetails = {
        appSettingId: corporate.appSettingId ? corporate.appSettingId : 1,
        is2FASuccess: false,
        userId: userData.id,
        userName: req.body.userName,
        corporateId: corporate.id,
        corporateCode: corporate.corporateCode,
        corporateName: corporate.corporateName,
        corporateType: corporate.corporateType,
        isIslamicCorporate: corporate.isIslamicApplicable ? 'Y' : 'N',
        applicationDate: moment().format('DD-MMM-YYYY'),
        smsVerification: true,
        mobileVerification: true,
        deviceVerification: true,
        webVerification: true,
        isSelfAuth: false,
        fullName: userData.firstName + ' ' + userData.lastName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobileNumber: userData.mobileNumber,
        profileName: userData.profileName ? userData.profileName : '',
        isGroupUser: userData.isGroupUser.toString().toLowerCase() == 'true' ? 'Y' : 'N',
        groupId: userData.isGroupUser.toString().toLowerCase() == 'true' ? userData.groupId : '',
        groupName:
          userData.isGroupUser.toString().toLowerCase() == 'true' ? userData.groupName : '',
        isMultiCountryUser:
          userData.isMultiCountryUser?.toString().toLowerCase() == 'true' ? 'Y' : 'N',
        authType: ['SOFTTOKEN'],
        landingPage: 'Payments',
        consolidatedwidget: 'Y',
        currentServerTimeSec: moment().format('HH:mm:ss'),
        currentServerTimeA: moment().format('hh:mm A'),
        lastLoginDateTime: moment().add(-2, 'hours').format('DD-MMM-YYYY hh:mm a'),
        lastFailedLogin: moment().add(-2, 'days').format('DD-MMM-YYYY hh:mm:ss'),
        lastLoginTime: moment().add(-2, 'hours').format('hh:mm a'),
        lastCorporateLoginDateTime: moment().add(-1, 'hours').format('hh:mm A, DD MMM YYYY'),
        tokenUsed: 'TI12456',
        token: 'xxx12456',
        profilePicFileName: userData.sysProfilePicFileName,
        displayWelcomeCardAtLogin: userData?.loginPreferenceDetails[0]?.displayWelcomeCardAtLogin,
        profilePicUrl:
          'http://' +
          ip.address() +
          ':3000/assets/images/user-profile-pics/' +
          (userData.sysProfilePicFileName
            ? userData.sysProfilePicFileName
            : 'dummy-user-profile-image.png'),
        corporateImage: './../../../assets/images/' + corporate.corporateImage,
        // corporate.corporateType == 'L'
        //   ? './../../../assets/images/corporate-L.png'
        //   : './../../../assets/images/corporate-S.png',
        groupImage:
          corporate.corporateType == 'L'
            ? './../../../assets/images/group-L.png'
            : './../../../assets/images/group-S.png',
        quickActions: [
          { displayName: 'Single Payment', link: '' },
          { displayName: 'Add Beneficiary', link: '' },
          { displayName: 'Bulk Payment', link: '' },
          { displayName: 'Apply For Loan', link: '' },
          { displayName: 'Dispute Status', link: '' },
          { displayName: 'Create VA', link: '' },
        ],
        accountDetails: {
          accountNumber: corporate.accounts[0] ? corporate.accounts[0].accountNo : 'JD123456789008',
          accountType: corporate.accounts[0]
            ? corporate.accounts[0].accountType
            : 'Business Savings',
          accountBalance: corporate.accounts[0] ? corporate.accounts[0].balance : '455635467',
        },
      };
      const securityId = jwt.sign({ userName: userData.userId }, appConfig.JWTSecret, {
        /* expiresIn: '20m', */
        expiresIn: '1d',
      });
      userDetails.securityId = securityId;
      sessionDetails[securityId] = userDetails;
      res.json({
        responseStatus: { message: '', status: '0' },
        userDetails: userDetails,
        securityId: securityId,
        loginPreferenceDetails:
          userData.loginPreferenceDetails?.length > 0 ? userData.loginPreferenceDetails[0] : {},
        entityIdentifier: '',
        entity: '',
        loggable: false,
      });
    }
  }
});

router.post('/dummyServer/json/login/public/generateOTP', (req, res) => {
  console.log('Generating OTP');
  res.json({ responseStatus: { message: '', status: '0' } });
});

router.post('/dummyServer/json/login/public/validateOTP', (req, res) => {
  console.log('Validationg OTP : ' + req.body.password);
  const filters = [{ name: 'userId', value: req.session.userDetails.userName }];
  var response = {};
  if (!appConfig.BYPASS_OTP) {
    filters.push({ name: 'generatedOTP', value: req.body.password });
    OTPData = getViewData(
      './dummyServer/json/setup/security/corporateUser/generatedOTPs.xlsx',
      filters,
    );
    if (!OTPData) {
      response = { responseStatus: { message: 'INVALID_TOKEN', status: '1' } };
      sessionDetails[req.session.userDetails.securityId].is2FASuccess = false;
    } else {
      response = { responseStatus: { message: '', status: '0' } };
      sessionDetails[req.session.userDetails.securityId].is2FASuccess = true;
    }
  } else {
    response = { responseStatus: { message: '', status: '0' } };
    sessionDetails[req.session.userDetails.securityId].is2FASuccess = true;
  }
  res.json(response);
});

router.post('/dummyServer/json/login/public/updateLoginDetails', (req, res) => {
  console.log('Saving Login Details in Session : ' + req.body.loginType);

  /* Update Login Preference is user wants to */
  if (req.body.isLoginPreference) {
    req.body.mstId = req.session.userDetails.userId;
    let dataXlFile = './dummyServer/json/setup/security/corporateUser/data.xlsx';
    let existingWb = XLSX.readFile(dataXlFile);
    var sheets = {};

    var sheetList = existingWb.SheetNames;
    _.forEach(sheetList, function (sheetName) {
      sheets[sheetName] = XLSX.utils.json_to_sheet(
        XLSX.utils.sheet_to_json(existingWb.Sheets[sheetName]),
      );
    });

    if (!sheets.loginPreferenceDetails) {
      sheets.loginPreferenceDetails = XLSX.utils.json_to_sheet([...req.body]);
    } else {
      sheets.loginPreferenceDetails = XLSX.utils.sheet_to_json(sheets.loginPreferenceDetails);
      let found = false;
      _.forEach(sheets.loginPreferenceDetails, function (loginPreferenceDetail) {
        if (loginPreferenceDetail.mstId == req.session.userDetails.userId) {
          loginPreferenceDetail = req.body;
          found = true;
        }
      });
      if (!found) {
        sheets.loginPreferenceDetails.push(req.body);
      }
      sheets.loginPreferenceDetails = XLSX.utils.json_to_sheet(sheets.loginPreferenceDetails);
    }
    updateWorkbook(existingWb, sheets, dataXlFile);
  }

  sessionDetails[req.session.userDetails.securityId].loginPreferenceDetails = req.body;

  if (req.body.loginType == 'group') {
    sessionDetails[req.session.userDetails.securityId].groupId = req.body.groupId;
    sessionDetails[req.session.userDetails.securityId].groupName = req.body.groupName;
  }

  console.log('Session loginDetails Updated'.green);
  res.json({
    responseStatus: { message: '', status: '0' },
    userDetails: sessionDetails[req.session.userDetails.securityId],
    entityIdentifier: '',
    entity: '',
    loggable: false,
  });
});

router.post('/dummyServer/json/login/private/logout', (req, res) => {
  console.log('clearing User Session');
  delete sessionDetails[req.session?.userDetails?.securityId];
  res.json({ responseStatus: { message: '', status: '0' } });
});

router.post('/dummyServer/json/login/private/getUserSessionData', (req, res) => {
  res.json({
    responseStatus: { message: '', status: '0' },
    userDetails: sessionDetails[req.session.userDetails.securityId],
    entityIdentifier: '',
    entity: '',
    loggable: false,
  });
});

var isValidJWTToken = function (securityId) {
  try {
    const decoded = jwt.verify(securityId, appConfig.JWTSecret);
    if (sessionDetails[securityId] && sessionDetails[securityId].userName == decoded.userName)
      return true;
    else return false;
  } catch (err) {
    return false;
  }
};

var getUserDetailFromSession = function (securityId) {
  return sessionDetails[securityId];
};

module.exports = {
  router: router,
  isValidJWTToken: isValidJWTToken,
  getUserDetailFromSession: getUserDetailFromSession,
};
