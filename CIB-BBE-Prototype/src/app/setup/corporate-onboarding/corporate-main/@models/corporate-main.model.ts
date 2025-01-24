export class CorporateMain {
  id?: number | string;
  version?: number | string;
  profileCode: string;
  profileName: string;
  corporateSecurityDetails?: CorporateSecurityDetails[];
  paymentsRow: paymentsRow[];
  slab: Slab[];
  paymentSlab: PaymentSlab[];



  /////////----1--------///////
  customerType: string;
  CIDNumber: string;
  corporateCode: string;
  corporateName: string;
  taxtIdentificationNo: string;
  taxBranch: string;
  customercat: string;
  cbsSegCode: string;
  aliasName: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  province: string;
  country: string;
  postal: string;
  accNoCheckbox1: string;
  accNoCheckbox2: string;
  accNoCheckbox3: string;
  accNoCheckbox4: string;
  accNoCheckbox5: string;


  emailId: string;
  telephoneNo: string;
  mobileNo: string;
  module: string;
  transactionName: string;
  authorizationRule: string;
  verifierRule: string;
  corporateLogo: []

  contactInfo: ContactInfo[];
  transaction?: TransactionDetails[];


  //////------------Parameter----------//
  corpUserAdmBy: string
  passwordSetup: string
  defaultPassword: string
  holidayAccess: string
  remoteAccessOnHoliday: string
  verficationRequired: string
  verificationLevel: string
  noOfVerifier: string
  noOfVerifierCutOff: string
  ipMapping: string;
  verifierMatrixRequired: string;
  authMatrixRequired: string;
  //////------------Parameter----------//


  //////------------Other Information----------//
  aggrementDate: string
  expiryDate: string
  noOfDaysForReview: string
  aggrementAttachment: []
  relationshipManagerId: string
  industryDesc: string
  accountManagerId: string
  coreBranchId: string
  effectiveFrom: string
  effectiveTill: string
  businessCode: string
  subBusiness: string
  customerTypeSelection: string
  creditRiskStatus: string
  operatingAccBranch: string
  processingCentreId: string
  segmentCode: string
  segmentType: string
  rmStaffId: string
  rmOfficeCode: string
  iboStaffId: string
  iboOfficeCode: string
  customerTypeCode: string
  customerTypeDescription: string
  processingCentreID: string
  processingCentreDescription: string
  //////------------Other Information----------//


  //----------FSCMEDITMODAL------------//
  servicePackageCode: string
  servicePackageName: string
  moduleName: string
  product: string
  customerCategory: string
  fileUploadBy: string
  uploadType: string
  workflow: string
  dupLogIncNo: string
  normalChargeCategory: string
  promotionalChargeCategory: string
  enrichment: string
  isChargeApplicable: boolean
  invoicePayment: string
  isParialPayment: boolean
  isOutOfSysSettAll: boolean
  isDummyInvoiceAllowed: boolean
  isOverInvoiceAccepted: boolean
  maximumOverdueDays: string
  isOverInvoicePaymentAccepted: boolean
  maximumOverduePaymentDays: string
  isLatePenaltyApplicable: boolean
  latePenaltyTemplate: string
  isCnDnDateValid: boolean
  isCnDnInvoiceValid: boolean
  isWatWhtCalculation: boolean
  ifHoliday: string
  isFutureDatedPayment: boolean
  isFutureHold: boolean
  futureMaxDays: string
  futureChargeAfter: string
  isTrackingId: boolean
  isMultipleTracking: boolean
  isDynamicDiscountApplicable: boolean
  dynamicDiscountTemplate: string
  paymentDisbursementCode: string
  sponsorCASAAccount: string
  sponsorInterestAccount: string
  normalInvoice: string
  invoiceOnDueDate: string
  invoiceAfterDueDate: string
  paymentSalaryCheckbox: string;
  paymentProgramRefNo: string;
  paymentProgramName: string;
  paymentVendorCheckbox: string;
  paymentProgramRefNo2: string;
  paymentProgramName2: string;
  //----------FSCMEDITMODAL------------//
  payments: any;
  serviceTemplateCode: string;
  serviceTemplateName: string;
  templateFor: string;
  checkDuplicateCrnNo: string;
  accountPosting: string;
  enrichmentRequired: string;
  chargeApplicable: boolean;
  maskingRequired: boolean;
  paymentsAllowRuntimeBeneficiary: string;
  paymentsBeneficiaryLibraryUpdate: string;
  forceDebit: string;
  partialUpload: string;
  h2hOn: string;
  h2hPrefix: string;
  h2hAuthorizationRequired: string;
  h2hOn2: string;
  h2hOn1: string;
  useSendToBank: string;
  cutOffTime: string;
  currencyLimit: string;
  accountNo: string;
  chargeAccount: string;
  h2hFileProcessing: string;
  debitTransactionChargesFrom: string;
  allowRuntimeBene: string;
  beneAutoAuth: string;
  beneLibUpdate: string;
  datalayoutPaymentRequest: string;
  paymentAccount: string;
  paymentRequestH2hPrefix: string;
  h2hAuthReqPaymentRequest: string;
  aliasNameIFT: string;
  aliasNameNEFT: string;
  aliasNameRTGS: string;
  isMaskingRequired: boolean;
  isDataLayoutPaymentRequest: boolean;
  isH2hPaymentRequest: boolean;
  isH2hBillPaymentUpload: boolean;
  isH2hBillerRegistration: boolean;


  /////////----1--------///////

  constructor() {
    this.paymentsRow = [new paymentsRow()];

    this.profileCode = '';
    this.profileName = '';

    this.corporateSecurityDetails = [];
    this.slab = [new Slab()];
    this.paymentSlab = [new PaymentSlab()];

    /////////----1--------///////
    this.customerType = 'Bank Customer';
    this.CIDNumber = '';
    this.corporateCode = '';
    this.corporateName = '';
    this.taxtIdentificationNo = '';
    this.taxBranch = '';
    this.customercat = '';
    this.cbsSegCode = '';
    this.aliasName = '';
    this.address1 = '';
    this.address2 = '';
    this.address3 = '';
    this.city = '';
    this.province = '';
    this.country = '';
    this.postal = '';
    this.accNoCheckbox1 = '';
    this.accNoCheckbox2 = '';
    this.accNoCheckbox3 = '';
    this.accNoCheckbox4 = '';
    this.accNoCheckbox4 = '';
    this.emailId = '';
    this.telephoneNo = '';
    this.mobileNo = '';
    this.module = '';
    this.transactionName = '';
    this.authorizationRule = '';
    this.verifierRule = ''
    this.corporateLogo = []
    this.contactInfo = [new ContactInfo()];

    /////////----1--------///////



    //////------------Parameter----------//
    this.corpUserAdmBy = 'Corporate'
    this.passwordSetup = ''
    this.defaultPassword = ''
    this.holidayAccess = 'Yes'
    this.remoteAccessOnHoliday = 'No'
    this.verficationRequired = 'No'
    this.verificationLevel = ''
    this.noOfVerifier = ''
    this.noOfVerifierCutOff = ''
    this.ipMapping = 'No'
    this.verifierMatrixRequired = 'No'
    this.authMatrixRequired = 'No'
    this.h2hFileProcessing = ''
    this.allowRuntimeBene = 'Yes'
    this.beneAutoAuth = 'No'
    this.beneLibUpdate = 'Yes'
    this.datalayoutPaymentRequest = ''
    this.paymentAccount = ''
    this.paymentRequestH2hPrefix = ''
    this.h2hAuthReqPaymentRequest = 'No'
    this.aliasNameIFT = 'Internal Fund Transfer'
    this.aliasNameNEFT = 'NEFT'
    this.aliasNameRTGS = 'RTGS'
    this.debitTransactionChargesFrom = 'Transaction Debit Account'
    this.isMaskingRequired = false
    this.isDataLayoutPaymentRequest = false
    this.isH2hPaymentRequest = false
    this.isH2hBillPaymentUpload = false
    this.isH2hBillerRegistration = false
    //////------------Parameter----------//

    //////------------Other Information----------//
    this.aggrementDate = ''
    this.expiryDate = ''
    this.noOfDaysForReview = ''
    this.aggrementAttachment = []
    this.relationshipManagerId = ''
    this.industryDesc = ''
    this.accountManagerId = ''
    this.coreBranchId = ''
    this.effectiveFrom = ''
    this.effectiveTill = ''
    this.businessCode = ''
    this.subBusiness = ''
    this.customerTypeSelection = ''
    this.creditRiskStatus = ''
    this.operatingAccBranch = ''
    this.processingCentreId = ''
    this.segmentCode = ''
    this.segmentType = ''
    this.rmStaffId = ''
    this.rmOfficeCode = ''
    this.iboStaffId = ''
    this.iboOfficeCode = ''
    this.customerTypeCode = ''
    this.customerTypeDescription = ''
    this.processingCentreID = ''
    this.processingCentreDescription = ''
    //////------------Other Information----------//

    this.transaction = [];

    //----------FSCMEDITMODAL------------//
    this.servicePackageCode = 'ADITEMP'
    this.servicePackageName = 'ADITEMP'
    this.moduleName = 'Payments'
    this.product = 'Salary'
    this.customerCategory = 'Gold'
    this.fileUploadBy = ''
    this.uploadType = ''
    this.workflow = ''
    this.dupLogIncNo = ''
    this.normalChargeCategory = ''
    this.promotionalChargeCategory = ''
    this.enrichment = ''
    this.isChargeApplicable = false
    this.invoicePayment = ''
    this.isParialPayment = false
    this.isOutOfSysSettAll = false
    this.isDummyInvoiceAllowed = false
    this.isOverInvoiceAccepted = false
    this.maximumOverdueDays = ''
    this.isOverInvoicePaymentAccepted = false
    this.maximumOverduePaymentDays = ''
    this.isLatePenaltyApplicable = false
    this.latePenaltyTemplate = ''
    this.isCnDnDateValid = false
    this.isCnDnInvoiceValid = false
    this.isWatWhtCalculation = false
    this.ifHoliday = ''
    this.isFutureDatedPayment = false
    this.isFutureHold = false
    this.futureMaxDays = ''
    this.futureChargeAfter = ''
    this.isTrackingId = false
    this.isMultipleTracking = false
    this.isDynamicDiscountApplicable = false
    this.dynamicDiscountTemplate = ''
    this.paymentDisbursementCode = ''
    this.sponsorCASAAccount = ''
    this.sponsorInterestAccount = ''
    this.normalInvoice = ''
    this.invoiceOnDueDate = ''
    this.invoiceAfterDueDate = ''
    //----------FSCMEDITMODAL------------//


    this.paymentSalaryCheckbox = ''
    this.paymentProgramRefNo = ''
    this.paymentProgramName = ''
    this.paymentVendorCheckbox = ''
    this.paymentProgramRefNo2 = '',
      this.paymentProgramName2 = ''


    this.serviceTemplateCode = ''
    this.serviceTemplateName = ''
    this.templateFor = 'Corporate'
    this.checkDuplicateCrnNo = 'No'
    this.accountPosting = ''
    this.enrichmentRequired = 'No'
    this.chargeApplicable = false
    this.maskingRequired = false;
    this.paymentsAllowRuntimeBeneficiary = 'No'
    this.paymentsBeneficiaryLibraryUpdate = 'No'
    this.forceDebit = ''
    this.partialUpload = ''
    this.h2hOn = '',
      this.h2hOn2 = '',
      this.h2hOn1 = '',

      this.h2hPrefix = ''
    this.h2hAuthorizationRequired = 'No'
    this.useSendToBank = 'No'
    this.cutOffTime = ''
    this.currencyLimit = ''
    this.accountNo = '',
      this.chargeAccount = ''


  }
}

export class paymentsRow {
  paymentRowProgramRefNo: string;
  paymentRowProgramName: string;

  constructor() {
    this.paymentRowProgramRefNo = '';
    this.paymentRowProgramName = ''
  }


}

export class ContactInfo {
  public contactPersonName: string;
  public designation: string;
  public emailId: string;
  public telNo: string;

  constructor() {
    this.contactPersonName = '';
    this.designation = '';
    this.emailId = '';
    this.telNo = '';
  }
}

export class TransactionDetails {

  initActions?: any;
  reviewActions?: any;
  ccy2CurrencyCode?: string;
  totalRequestAmount?: string;
  fxRate?: string
  ccy1CurrencyCode?: string;

  constructor(
    public id: string = new Date().getTime().toString(),
    public transactionType = '',
    public product = '',
    public purpose = '',
    public ccy1 = '',
    public ccy2 = '',
    public ccyName1 = '',
    public ccyName2 = '',
    public amount1 = '',
    public amount2 = '',
    public rateType = '',
    public debitMode = '',
    public visitingCountry = '',
    public sourceOfFunding = '',
    public margin = '',
    public others = '',
    public dealNumber = '',
    public amtInInr = '12,000.00',
    public transactionDate: any = '23-Feb-2022',
    public initiationDate = '01-Mar-2022',
    public status = '',
    public branchId: any = (Math.floor(100000 + Math.random() * 900000)),


    public firstName = '',
    public lastName = '',
    public userId = '',
    public soft = '',
    public mobile = '',
    public emailId = '',
    public mobileNo = '',
    public defaultLimit = '',
    public profile = '',
    public role = '',
    public module = '',
    public transactionName = '',
    public authorizationRule = '',

  ) {
    this.transactionType = '';
    this.product = '';
    this.purpose = '';
    this.ccy1 = '';
    this.ccy2 = '';
    this.ccyName1 = '';
    this.ccyName2 = '';
    this.amount1 = '';
    this.amount2 = '';
    this.rateType = 'Card';
    this.debitMode = '';
    this.visitingCountry = '';
    this.sourceOfFunding = '';
    this.margin = '';
    this.others = '';
    this.dealNumber = '';
    this.initActions = [];
    this.reviewActions = [];
    this.ccy1CurrencyCode = '';
    this.ccy2CurrencyCode = '';
    this.fxRate = '';
    this.totalRequestAmount = '';


    this.firstName = '';
    this.lastName = '';
    this.userId = '';
    this.soft = '';
    this.mobile = '';
    this.emailId = '';
    this.mobileNo = '';
    this.defaultLimit = '';
    this.profile = '';
    this.role = '';
    this.module = '';
    this.transactionName = '';
    this.authorizationRule = '';

  }
}

export class CorporateSecurityDetails {
  userAuthorize?: string;
  defaultDashboardId: string;
  defaultDashboardName: string;
  userAuth?: string;
  ipMappingRestriction?: string;
  ipMapping: IpMapping[];
  transactionSelfAuthorizer?: string;
  masterSelfAuthorizer?: string;
  selfServiceRequest?: string;
  enableOTP?: boolean;
  isMultiCountry: string;
  isGroup: string;
  groupId: string;
  groupName: string;

  constructor() {
    this.userAuthorize = 'Normal User';
    this.defaultDashboardId = '';
    this.defaultDashboardName = '';
    this.userAuth = 'soft';
    this.ipMappingRestriction = 'No';
    this.ipMapping = [];
    this.transactionSelfAuthorizer = '';
    this.masterSelfAuthorizer = '';
    this.selfServiceRequest = '';
    this.enableOTP = false;
    this.isMultiCountry = 'False';
    this.isGroup = 'False';
    this.groupId = '';
    this.groupName = '';
  }
}

class IpMapping {
  constructor(
    public srNo: string | number = '',
    public startRange: string = '',
    public endRange: string = '',
    public actions: any[] = [],
  ) { }
}


export class Slab {
  public salaryPaymentServiceTemplate: string;
  public salaryPaymentProRefNo: string;
  public salaryPaymentProName: string;
  public rate: string;
  public margin: string;
  public exchangeRate: string;

  constructor() {
    this.salaryPaymentServiceTemplate = '';
    this.salaryPaymentProRefNo = '';
    this.salaryPaymentProName = '';
    this.rate = '';
    this.margin = '';
    this.exchangeRate = '';
  }
}

export class PaymentSlab {
  public salaryPaymentServiceTemplate: string;
  public salaryPaymentProRefNo: string;
  public salaryPaymentProName: string;
  public rate: string;
  public margin: string;
  public exchangeRate: string;

  constructor() {
    this.salaryPaymentServiceTemplate = '';
    this.salaryPaymentProRefNo = '';
    this.salaryPaymentProName = '';
    this.rate = '';
    this.margin = '';
    this.exchangeRate = '';
  }
}