const fs = require('fs');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
var colors = require('colors');
var authentication = require('./src/authenticationAPIs');

const app = express();
const port = 3000;

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
    if (
      !securityId ||
      !authentication.isValidJWTToken(securityId) ||
      !req.session.userDetails ||
      !req.session.userDetails.loginPreferenceDetails
    ) {
      validSession = false;
    }
  } else {
    if (appConfig.sessionExcludedURLs.includes(req.url)) {
      console.log('Bypass Request'.bgYellow.red + ' : ' + req.url.underline.yellow);
    } else if (req.url.indexOf('/public/') == -1 && req.url.indexOf('/assets/') == -1) {
      if (!req.url.includes('logApi')) {
        console.log('resource leak'.bgRed + ' : ' + req.url.underline.yellow);
      }
    }
  }

  if (!validSession) {
    console.log('No Session found'.bgRed + ' : ' + req.url.underline.red);
    res.status(401).json({ responseStatus: { message: 'INVALID_SESSION', status: '1' } });
  } else {
    if (req.session && req.session.userDetails) {
      req.session.userDetails.requestBy = 'CORPORATE';
    } else {
      req.session = { userDetails: { requestBy: 'CORPORATE' } };
    }
    next();
  }
  /* Session checking code Ends */
});

app.use('/', require('./src/roleAPIs'));
app.use('/', require('./src/connectivity'));
app.use('/', require('./src/logAPI'));
app.use('/', require('./src/selfOnboardingBBEAPIs'));
app.use('/', require('./src/dashboardAPIs'));
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
app.use('/', require('./src/widgets/rapidPay'));
// widgets End
app.use('/', require('./src/userPersonalizationAPIs'));
app.use('/', require('./src/setup/mailCategoryAPIs'));
app.use('/', require('./src/setup/mailAPIs'));
app.use('/', require('./src/approveSelfServiceRequestBBEAPIs'));
app.use('/', require('./src/billPaymentAPIs'));
app.use('/', require('./src/payments/billPaymentUploadAPIs'));
app.use('/', require('./src/positive-pay/draweeAPIs'));
app.use('/', require('./src/positive-pay/positivePayAPIs'));
app.use('/', require('./src/positive-pay/chequeEntryAPIs'));
app.use('/', require('./src/positive-pay/chequeUploadAPIs'));

app.use('/', require('./src/directDebit/mandateManagement/amendmentAPIs'));
app.use('/', require('./src/directDebit/mandateManagement/cancellationAPIs'));
app.use('/', require('./src/directDebit/mandateManagement/registrationAPIs'));

app.use('/', require('./src/directDebit/mandateManagement/mandateFileUploadAPIs'));

app.use('/', require('./src/directDebit/mandateManagement/stopPaymentRequestAPIs'));
app.use('/', require('./src/directDebit/mandateManagement/stopPaymentRevokeAPIs'));
app.use('/', require('./src/directDebit/transactions/directFileUploadAPIs'));
app.use('/', require('./src/directDebit/enquiry/debitEnquiryAPIs'));
app.use('/', require('./src/directDebit/enquiry/mandateEnquiryAPIs'));
app.use('/', require('./src/fxConnect/fxConnectAPIs'));
app.use('/', require('./src/fxConnect/fxReloadAPIs'));
app.use('/', require('./src/setup/accountWiseAccessAPIs'));
app.use('/', require('./src/setup/security/unlockUser.APIs'));
app.use('/', require('./src/setup/security/resetUserAPIs'));

// app.use('/', require('./src/setup/security/mobilityRegistrationAPIs'));
// app.use('/', require('./src/setup/security/downloadSecurityFileAPIs'));
app.use('/', require('./src/setup/generalMasters/corporateAccountAPIs'));
app.use('/', require('./src/setup/generalMasters/corporateBranchUploadAPIs'));

app.use('/', require('./src/trade/importTransactions/letterOfCreditAPIs'));
app.use('/', require('./src/trade/importTransactions/outwardTelegraphicTransferAPIs'));
app.use('/', require('./src/trade/importTransactions/letterOfCreditAmendAPIs'));
app.use('/', require('./src/trade/importTransactions/shippingGuaranteeAPIs'));
app.use('/', require('./src/trade/importTransactions/cancelShipmentAPIs'));
app.use('/', require('./src/trade/importTransactions/requestFinanceAPIs'));
app.use('/', require('./src/trade/exportTransactions/requestFinanceAPIs'));
app.use('/', require('./src/trade/clauses/clausesAPIs'));
app.use('/', require('./src/trade/termsAndCondition/termsAndConditionAPIs'));
app.use('/', require('./src/trade/exportTransactions/bankGuaranteeAPIs'));
app.use('/', require('./src/trade/exportTransactions/billPresentmentAPIs'));
app.use('/', require('./src/trade/exportTransactions/beneficiaryExportAPIs'));
app.use('/', require('./src/trade/exportTransactions/bankGuaranteeAmendAPIs'));
app.use('/', require('./src/trade/exportTransactions/advisedLcAPIs'));
app.use('/', require('./src/trade/exportTransactions/transferLcAPIs'));
app.use('/', require('./src/trade/importTransactions/billPaymentAndApplyFinanceAPIs'));
app.use('/', require('./src/trade/importTransactions/billAcceptanceAPIs'));
app.use('/', require('./src/payments/wpsRegisteredMolAPIs').router);
app.use('/', require('./src/payments/beneficiaryAPIs'));
app.use('/', require('./src/payments/statutoryPaymentAPIs'));
app.use('/', require('./src/payments/wpsPaymentAPIs'));
app.use('/', require('./src/payments/bulkPaymentAPIs'));
app.use('/', require('./src/payments/singlePaymentRequestAPIs'));

app.use('/', require('./src/collections/process/chequeTransactionQueryAPI'));
app.use('/', require('./src/collections/process/cashTransactionQueryAPI'));


app.use('/', require('./src/payments/billerRegistrationAPIs'));
app.use('/', require('./src/accountSummaryAPIs'));
app.use('/', require('./src/wealthManagementAPIs'));
app.use('/', require('./src/accountServices/creditLineAPIs'));
app.use('/', require('./src/lms/corporateAccountStructureAPIs'));
app.use('/', require('./src/lms/transactionInterestReallocationAPIs'));
app.use('/', require('./src/rms/transactions/receiptUploadAPIs'));
app.use('/', require('./src/fscm/transactions/invoiceEntryAPIs'));
app.use('/', require('./src/fscm/transactions/invoiceAcceptanceAPIs'));
app.use('/', require('./src/fscm/transactions/poAcceptanceAPIs'));
app.use('/', require('./src/fscm/transactions/cancelInvoiceAPIs'));
app.use('/', require('./src/fscm/transactions/amendInvoiceAPIs'));
app.use('/', require('./src/fscm/transactions/redenominationRequestAPIs'));
app.use('/', require('./src/fscm/transactions/creditDebitNoteEntryAPIs'));
app.use('/', require('./src/fscm/transactions/creditDebitNoteAcceptanceAPIs'));
app.use('/', require('./src/payments/templateManagementAPIs'));
app.use('/', require('./src/payments/siManagmentAPIs'));
app.use('/', require('./src/payments/oatAPIs'));
app.use('/', require('./src/payments/oatSiManagementAPIs'));
app.use('/', require('./src/payments/oatTemplateManagementAPIs'));


// app.use('/', require('./src/collections/process/summaryHeadOfficeAPIs'));


// app.use('/', require('./src/payments/fileUploadLogsAPIs'));

// app.use('/', require('./src/bbe/dashboard/rmAPIs'));
app.use('/', require('./src/dashboard/cxoDashboardAPIs'));
app.use('/', require('./src/accountServices/serviceRequestAPIs'));
app.use('/', require('./src/accountServices/cashflowForecastAPIs'));
app.use('/', require('./src/serviceRequestBBEAPIs.js'));
app.use('/', require('./src/corporateDetailsBBEAPIs.js'));
// app.use('/', require('./src/componentGenerator'));
app.use('/', require('./src/cancelPaymentsAPIs'));

app.use('/', require('./src/bbe/setup/securityCorporate/userAccessFieldsAPIs'));
app.use('/', require('./src/sendToBankListingAPIs'));
app.use('/', require('./src/accountServices/creditCard'));
app.use('/', require('./src/accountServices/debitCard/debitCardControlAPIs'));
app.use('/', require('./src/accountServices/debitCard'));
app.use('/', require('./src/accountServices/merchantPaymentAPIs'));
app.use('/', require('./src/accountServices/swiftGpi/swiftGpiAPIs'));

app.use('/', require('./src/vam/virtualAccountIssuance'));
app.use('/', require('./src/vam/virtualAccountStatusManagementAPIs'));

// app.use('/', require('./src/common/uploadDownloadFileAPIs'));
app.use('/', authentication.router);
app.use('/', require('./src/reports'));
app.use('/', require('./src/fixedDeposit'));
// app.use('/', require('./src/accountServices/creditCard'));
app.use('/', require('./src/userAPIs'));
app.use('/', require('./src/chequeServiceAPIs'));
app.use('/', require('./src/undoReconciliationAPIs'));
app.use('/', require('./src/manualReconciliationAPIs'));
app.use('/', require('./src/common/authorizationDashboardAPIs'));
app.use('/', require('./src/fscm/transactions/invoicePaymentApplyFinanceAPIs'));
app.use('/', require('./src/fscm/transactions/financeRepaymentAPIs'));
app.use('/', require('./src/bbe/setup/cibSetup/uiConfigurationAPIs'));

// Add API's Above this line
app.use('/', require('./src/crudAPIs').router);
app.use('/', require('./src/listingAPIs').router);
app.use('/', require('./src/genericFilterAPIs'));
app.use('/', require('./src/baseAPIs'));

//BBE-CFE common APIs
app.use('/', require('./src/dropdownAPIs'));
app.use('/', require('./src/insightAPIs'));
app.use('/', require('./src/common/baseAPIs'));
//below must be at last
app.use('/', require('./src/common/directJsonAPIs'));

// Direct Downloads Below
app.use('/assets', express.static(__dirname + '/dummyServer/directDownload/uiAssets'));
app.use('/downloadReport', express.static(__dirname + '/dummyServer/directDownload/reports'));
app.use(
  '/accountStatements',
  express.static(__dirname + '/dummyServer/directDownload/accountStatements'),
);
app.use(
  '/mailAttachments',
  express.static(__dirname + '/dummyServer/directDownload/mailAttachments'),
);
app.use(
  '/serviceRequest',
  express.static(__dirname + '/dummyServer/directDownload/serviceRequest'),
);
app.use(
  '/accountDetails',
  express.static(__dirname + '/dummyServer/directDownload/accountDetails'),
);
app.use('/securityFiles', express.static(__dirname + '/dummyServer/directDownload/securityFiles'));
app.use('/fixedDeposit', express.static(__dirname + '/dummyServer/directDownload/fixedDeposit'));
app.use('/fileUploadLog', express.static(__dirname + '/dummyServer/directDownload/fileUploadLog'));
app.use('/billPayments', express.static(__dirname + '/dummyServer/directDownload/billPayments'));
app.use(
  '/statutoryPayment',
  express.static(__dirname + '/dummyServer/directDownload/statutoryPayment'),
);
app.use('/bulkPaymentRequest', express.static(__dirname + '/dummyServer/directDownload/bulkPaymentRequest'));


//Template code Generation
app.use(fileUpload());
app.use(
  '/generateComponent',
  express.static(__dirname + '/componentGenerator/form/componetGenerator.html'),
);
app.use(express.static(__dirname + '/componentGenerator/form'));
app.use(express.static(__dirname + '/dummyServer/uploadedFiles'));
app.use(express.static(__dirname + '/dummyServer/json/reports/generatedReports'));
app.use(express.static(__dirname + '/dummyServer/json/reports/generatedReports'));
app.use('/', require('./src/componentGenerator'));

app.listen(port, () => {
  console.log(`CIB-node-server listening at http://localhost:${port}`.bold.underline.brightGreen);
});


