const fs = require('fs');
var express = require('express');
var moment = require('moment');
var ip = require('ip');
const jwt = require('jsonwebtoken');
var router = express.Router();
var getViewData = require('../../crudAPIs').getViewData;
const appConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
let sessionDetails = {};

router.post('/dummyServer/json/login/public/basicAuthentication', (req, res) => {
  console.log('Checking Username and Password');
  const filters = [
    { name: 'loginId', value: req.body.userName },
    { name: 'enabled', value: 'Y' },
  ];
  var userData = null;
  if (!appConfig.BYPASS_PASSWORD) filters.push({ name: 'password', value: req.body.password });
  userData = getViewData('./dummyServer/json/setup/securityBank/bankUser/data.xlsx', filters);
  if (!userData) {
    res.json({ responseStatus: { message: 'INVALID_USER', status: '1' } });
  } else {
    var userDetails = {
      is2FASuccess: false,
      userId: userData.id,
      userName: userData.loginId,
      ouId: userData.ouId,
      branchName: userData.branchName,
      applicationDate: moment().format('DD-MMM-YYYY'),
      smsVerification: true,
      mobileVerification: true,
      biometricVerification: true,
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: userData.firstName + ' ' + userData.lastName,
      mobileNumber: userData.telephoneNo,
      profilePicFileName: userData.sysProfilePicFileName,
      profilePicUrl:
        'http://' +
        ip.address() +
        ':2000/assets/images/user-profile-pics/' +
        (userData.sysProfilePicFileName
          ? userData.sysProfilePicFileName
          : 'dummy-user-profile-image.png'),
      profileName: userData.profileName,
      isMultiCountryUser: userData.isMultiCountryUser ? 'Y' : 'N',
      authType: ['SOFTTOKEN'],
      landingPage: userData.profileName == 'RM' ? 'relationshipManager' : 'consolidated',
      consolidatedwidget: 'Y',
      currentServerTimeA: moment().format('hh:mm A'),
      lastLoginDateTime: moment().add(-2, 'hours').format('DD-MMM-YYYY hh:mm a'),
      lastFailedLogin: moment().add(-2, 'days').format('DD-MMM-YYYY hh:mm:ss'),
      lastLoginTime: moment().add(-2, 'hours').format('hh:mm a'),
      quickActions: [
        { displayName: 'Single Payment', link: '' },
        { displayName: 'Add Beneficiary', link: '' },
        { displayName: 'Bulk Payment', link: '' },
        { displayName: 'Apply For Loan', link: '' },
        { displayName: 'Start Investing', link: '' },
        { displayName: 'Create VA', link: '' },
      ],
    };
    const securityId = jwt.sign({ userId: userDetails.userId }, appConfig.JWTSecret, {
      /* expiresIn: '20m', */
      expiresIn: '1d',
    });
    userDetails.securityId = securityId;
    sessionDetails[securityId] = userDetails;
    res.json({
      responseStatus: { message: '', status: '0' },
      userDetails: userDetails,
      securityId: securityId,
      entityIdentifier: '',
      entity: '',
      loggable: false,
    });
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
      './dummyServer/json/setup/securityBank/bankUser/generatedOTPs.xlsx',
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
    if (sessionDetails[securityId] && sessionDetails[securityId].userId == decoded.userId)
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
