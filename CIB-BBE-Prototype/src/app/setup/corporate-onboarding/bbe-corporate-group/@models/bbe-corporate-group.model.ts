export class BBECorporateGroup {
  id?: number | string;
  version?: number | string;

  groupCode: string;
  groupName: string;
  groupType: string;
  liabilityId: string;
  liabilityName: string;
  isForceDebit: boolean;
  accountPosting: string;
  selectAuthMatrixReq: string;
  selectVerifierMatrixReq: string;
  debitTranChangesFrom: string;
  beneAutoAuth: string;
  sendForReleaseReq: string;
  effectiveFrom: string;
  effectiveTill: string;
  corporateCode: string;
  corporateName: string;
  moduleDetails: string;
  module: string;
  transactionName: string;
  verifierName: string;
  authorizationRule: string;
  transaction?: TransactionDetails[];
  authRule?: AuthorizationRule[];

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
  templateFor: string
  checkDuplicateCrnNo: string
  enrichmentRequired: string
  isMaskingRequired: boolean
  allowRuntimeBene: string
  beneLibUpdate: string
  forceDebit: string
  datalayoutPaymentRequest: string
  isDataLayoutPaymentRequest: boolean
  isH2hPaymentRequest: boolean
  isH2hBillPaymentUpload: boolean
  isH2hBillerRegistration: boolean
  paymentRequestH2hPrefix: ''
  beneUploadH2hPrefix: string
  billerRegH2hPrefix: string
  h2hAuthReqBillerRegistration: string
  aliasNameIFT: string
  aliasNameRTGS: string
  aliasNameNEFT: string
  printCoverNote: string
  emailCoverNote: string
  smsCovernote: string
  useSendToBank: string
  cutOffTime: string
  paymentCurrency: string
  paymentLimit: string
  paymentAccount: string
  chargeAccount: string
  //----------FSCMEDITMODAL------------//

  constructor() {
    this.groupCode = ''
    this.groupName = ''
    this.groupType = 'Transactional'
    this.liabilityId = ''
    this.liabilityName = 'Corp'
    this.isForceDebit = false
    this.accountPosting = 'Transaction'
    this.selectAuthMatrixReq = 'No'
    this.selectVerifierMatrixReq = 'No'
    this.debitTranChangesFrom = 'Transaction Debit Amount'
    this.beneAutoAuth = 'Yes'
    this.sendForReleaseReq = 'No'
    this.effectiveFrom = ''
    this.effectiveTill = ''
    this.corporateCode = ''
    this.corporateName = ''
    this.module = ''
    this.transactionName = ''
    this.verifierName = ''
    this.authorizationRule = ''
    this.moduleDetails = 'Service Details'
    this.transaction = [];
    this.authRule = [];

    //----------FSCMEDITMODAL------------//
    this.servicePackageCode = 'ELECTPAYMETHOD'
    this.servicePackageName = 'ELECTICPAYMENTMETHOD'
    this.moduleName = 'Payments'
    this.product = 'Salary'
    this.customerCategory = 'Gold'
    this.fileUploadBy = ''
    this.uploadType = ''
    this.workflow = ''
    this.dupLogIncNo = ''
    this.normalChargeCategory = ''
    this.promotionalChargeCategory = ''
    this.enrichment = 'PRODETAILS'
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
    this.templateFor = 'Both'
    this.checkDuplicateCrnNo = 'Yes'
    this.enrichmentRequired = 'Yes'
    this.isMaskingRequired = true
    this.allowRuntimeBene = 'Yes'
    this.beneLibUpdate = 'No'
    this.forceDebit = 'Yes'
    this.datalayoutPaymentRequest = 'PAYMETHOD'
    this.isDataLayoutPaymentRequest = true
    this.isH2hPaymentRequest = true
    this.isH2hBillPaymentUpload = false
    this.isH2hBillerRegistration = false
    this.paymentRequestH2hPrefix = ''
    this.beneUploadH2hPrefix = ''
    this.billerRegH2hPrefix = ''
    this.h2hAuthReqBillerRegistration = 'No'
    this.aliasNameIFT = 'Internal Fund Transfer'
    this.aliasNameRTGS = 'RTGS'
    this.aliasNameNEFT = 'NEFT'
    this.printCoverNote = ''
    this.emailCoverNote = ''
    this.smsCovernote = ''
    this.useSendToBank = 'Yes'
    this.cutOffTime = '13:00'
    this.paymentCurrency = ''
    this.paymentLimit = ''
    this.paymentAccount = ''
    this.chargeAccount = ''
    //----------FSCMEDITMODAL------------//
  }
}

export class TransactionDetails {
  corporateId?: string;
  initActions?: any;
  reviewActions?: any;

  constructor(
    public id: string = new Date().getTime().toString(),
    public corporateCode = '',
    public corporateName = '',
  ) {
    this.initActions = [];
    this.reviewActions = [];
    this.corporateCode = '';
    this.corporateName = '';
  }
}

export class AuthorizationRule {
  corporateId?: string;
  initActions?: any;
  reviewActions?: any;

  constructor(
    public id: string = new Date().getTime().toString(),
    public module = '',
    public transactionName = '',
    public verifierName = '',
    public authorizationRule = '',
  ) {
    this.initActions = [];
    this.reviewActions = [];
    this.module = '';
    this.transactionName = '';
    this.verifierName = '';
    this.authorizationRule = '';
  }
}
