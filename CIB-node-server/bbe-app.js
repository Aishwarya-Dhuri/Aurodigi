const fs = require('fs');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
var colors = require('colors');
var authentication = require('./src/bbe/base/authenticationAPIs');

const app = express();
const port = 2000;

const appConfig = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

app.use(express.json({ limit: '50mb' }));
app.use(cors());

app.use((req, res, next) => {
  /* Updating url based on bank in Config Starts */
  /* if(req.url.indexOf('CIMB') == -1) {
    let urlArray = req.url.split('/');
    let url = '/' + urlArray[1] + '/CIMB/';
    urlArray.splice(0, 1);
    urlArray.splice(0, 1);
    const oldUrl = urlArray.join('/');
    url = url + oldUrl;
    req.url = url;
  } */
  /* Updating url based on bank in Config Ends */

  /* Session checking code Starts */
  let validSession = true;
  let securityId = req.headers?.authorization?.split(' ')[1];
  req.session = { userDetails: authentication.getUserDetailFromSession(securityId) };
  if (req.url.indexOf('/private/') != -1 && !appConfig.sessionExcludedURLs.includes(req.url)) {
    if (!securityId || !authentication.isValidJWTToken(securityId) || !req.session.userDetails) {
      validSession = false;
    }
  } else {
    if (appConfig.sessionExcludedURLs.includes(req.url)) {
      console.log('Bypass Request'.bgYellow.red + ' : ' + req.url.underline.yellow);
    } else if (req.url.indexOf('/public/') == -1 && req.url.indexOf('/assets/') == -1) {
      console.log('resource leak'.bgRed + ' : ' + req.url.underline.yellow);
    }
  }

  if (!validSession) {
    console.log('No Session found'.bgRed + ' : ' + req.url.underline.red);
    res.status(401).json({ responseStatus: { message: 'INVALID_SESSION', status: '1' } });
  } else {
    if (req.session && req.session.userDetails) {
      req.session.userDetails.requestBy = 'BANK';
    } else {
      req.session = { userDetails: { requestBy: 'BANK' } };
    }
    next();
  }
  /* Session checking code Ends */
});

app.use('/', require('./src/bbe/base/baseAPIs'));
app.use('/', authentication.router);
app.use('/', require('./src/bbe/dashboard/rmAPIs'));
app.use('/', require('./src/bbe/setup/securityBank/bankProfileAPIs'));
app.use('/', require('./src/bbe/setup/securityBank/bankRoleAPIs'));
app.use('/', require('./src/bbe/setup/securityCorporate/userAccessFieldsAPIs'));
app.use('/', require('./src/bbe/setup/securityCorporate/corporateDetailsAPIs'));
app.use('/', require('./src/roleAPIs'));
app.use('/', require('./src/userAPIs'));
app.use('/', require('./src/setup/mailCategoryAPIs'));
app.use('/', require('./src/setup/mailAPIs'));

app.use('/', require('./src/bbe/setup/cibSetup/dynamicFormBuilderAPIs'));
app.use('/', require('./src/bbe/setup/cibSetup/widgetBuilderAPIs'));
app.use('/', require('./src/bbe/setup/process/jobMonitoringAPIs'));
app.use('/', require('./src/bbe/setup/process/interfaceConfigurationAPIs'));

app.use('/', require('./src/bbe/vam/virtualAccountIssuanceHierarchyAPIs'));
app.use('/', require('./src/bbe/setup/cibSetup/uiConfigurationAPIs'));
app.use('/', require('./src/bbe/setup/templates/documentDesignerAPIs'));

//BBE-CFE common APIs
app.use('/', require('./src/dropdownAPIs'));
// widgets start
app.use('/', require('./src/widgets/pendingAuthorizationForPayments'));
app.use('/', require('./src/widgets/chequePrintingQueue'));
app.use('/', require('./src/widgets/creditLineDetails'));
app.use('/', require('./src/widgets/pendingAuthorizationForVam'));
app.use('/', require('./src/widgets/reconciliationSummary'));
app.use('/', require('./src/widgets/tradeTransactionWiseSummary'));
app.use('/', require('./src/widgets/userMonitoring'));
app.use('/', require('./src/widgets/upcommingTransactions'));
app.use('/', require('./src/widgets/topFiveSuppliers'));
// widgets End
app.use('/', require('./src/crudAPIs').router);
app.use('/', require('./src/listingAPIs').router);
app.use('/', require('./src/genericFilterAPIs'));
app.use('/', require('./src/common/baseAPIs'));
app.use('/', require('./src/common/uploadDownloadFileAPIs'));
app.use('/', require('./src/dashboardAPIs'));
app.use('/', require('./src/reports'));
app.use('/', require('./src/logAPI'));
//below must be at last
app.use('/', require('./src/common/directJsonAPIs'));

app.use('/', require('./src/common/authorizationDashboardBBEAPIs'));


app.use('/assets', express.static(__dirname + '/dummyServer/directDownload/uiAssets'));
app.use('/downloadReport', express.static(__dirname + '/dummyServer/directDownload/reports'));
app.use(
  '/accountStatements',
  express.static(__dirname + '/dummyServer/directDownload/accountStatements'),
);

app.use(express.static(__dirname + '/dummyServer/uploadedFiles'));
app.use(express.static(__dirname + '/dummyServer/json/reports/generatedReports'));

app.listen(port, () => {
  console.log(
    `CIB-BBE-node-server listening at http://localhost:${port}`.bold.underline.brightGreen,
  );
});
