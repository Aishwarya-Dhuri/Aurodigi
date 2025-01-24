export class ServiceTemplate {
  id?: number | string;
  version?: number | string;
  profileCode: string;
  profileName: string;
  effectiveFrom: string;
  effectiveTill?: string;
  corporateId?: string;


  corporateCode: string;
  corporateName: string;
  corporateProductCode: string;
  serviceTemplateCode: string;
  serviceTemplateName: string;
  corporateProductName: string;
  product: string;
  subProduct: string;
  customerCategory: string;
  enrichmentRequired: string;
  templateFor: string;
  checkDuplicateCrnNo: string;
  accountPosting: string;
  instrumentPrinting: string;
  signaturePrinting: string;
  logoPrinting: string;
  useDefaultBranch: string;
  instrumentLayout: string;
  printClusterName: string;
  defaultPrintBranch: string;
  printFormat: string;
  instrumentDispatchMode: string;
  printCovernote: string;
  emailCovernote: string;
  smsCovernote: string;
  instrumentDispatchTo: string;
  signatories: string;
  cutOffTime: string;
  ignoreCluster: string;
  forceDebit: boolean;
  uploadFormat: string;
  defaultEnrichmentTemplate: string;
  instrumentEnrichmentTemplate: string;
  chargeWaive: string;
  chargeTemplate: string;
  alertTemplate: string;
  customerCreditType: string;
  guaranteedDays: string;
  clearfundsDays: string;
  isOutOffFundApplicable: boolean;
  gracePeriod: string;
  plrRate: string;
  isReversalOfGuaranteedCredit: boolean;
  reversalDays: string;
  isIntOnDelayed: boolean
  gracePeriodIntOnDelayed: string
  plrRateIntOnDelayed: string
  isDeferredDataEntry: boolean
  maximumDays: string
  isCorporateClient: boolean
  isVAMappingRequired: boolean
  creditMode: string
  payOrderFavouring: string
  selectAccount: string
  externalAccountNo: string
  debitMode: string
  selectAccountOn: string
  accountDescription: string
  accountDescription1: string
  accountingEntries: string
  isReturnApplicable: boolean
  isLateReturnApplicable: boolean
  isReturnToCmsHub: boolean
  physicalChequeReturn: boolean
  returnCategory: string
  chargeCategory: string
  fileUploadBy: string
  enrichment: string
  uploadType: string
  workflow: string
  duplicateLogicInvNo: string
  chargeType: string
  isChargeApplicable: boolean
  isMaskingRequired: boolean
  normalChangeCategory: string
  allowRuntimeBene: string
  beneAutoAuth: string
  beneLibUpdate: string
  promotionalChargeCategory: string
  recovery: string
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
  isTrackingId: false
  isMultipleTracking: string
  isDynamicDiscountApplicable: boolean
  dynamicDiscountTemplate: string
  normalInvoice: string
  invoiceOnDueDate: string
  invoiceAfterDueDate: string
  maxLengthOfVA: string
  vaStatusOnCreation: string
  issuanceUploadFormat: string
  issuanceDownloadFormat: string
  actualEnricmentTemplate: string
  vaEnrichmentTemplate: string
  aliasName: string
  printCoverNote: string
  useSendToBank: string

  constructor() {
    this.profileCode = '';
    this.profileName = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';


    this.corporateCode = '';
    this.corporateName = '';
    this.corporateProductCode = '';
    this.serviceTemplateCode = '';
    this.serviceTemplateName = '';
    this.corporateProductName = '';
    this.product = '';
    this.subProduct = '';
    this.customerCategory = '';
    this.templateFor = 'Corporate';
    this.enrichmentRequired = 'No';
    this.checkDuplicateCrnNo = 'No';
    this.accountPosting = '';
    this.instrumentPrinting = '';
    this.signaturePrinting = '';
    this.logoPrinting = '';
    this.useDefaultBranch = '';
    this.instrumentLayout = '';
    this.printClusterName = '';
    this.defaultPrintBranch = '';
    this.printFormat = '';
    this.instrumentDispatchMode = '';
    this.printCovernote = '';
    this.emailCovernote = '';
    this.smsCovernote = '';
    this.instrumentDispatchTo = '';
    this.signatories = '';
    this.cutOffTime = '';
    this.ignoreCluster = '';
    this.forceDebit = false;
    this.uploadFormat = '';
    this.defaultEnrichmentTemplate = '';
    this.instrumentEnrichmentTemplate = '';
    this.chargeWaive = 'No';
    this.chargeTemplate = '';
    this.alertTemplate = '';
    this.customerCreditType = '';
    this.guaranteedDays = '';
    this.clearfundsDays = '';
    this.isOutOffFundApplicable = false;
    this.gracePeriod = '';
    this.plrRate = '';
    this.isReversalOfGuaranteedCredit = false;
    this.reversalDays = '';
    this.isIntOnDelayed = false;
    this.gracePeriodIntOnDelayed = ''
    this.plrRateIntOnDelayed = ''
    this.isDeferredDataEntry = false
    this.maximumDays = ''
    this.isCorporateClient = false
    this.isVAMappingRequired = false
    this.creditMode = ''
    this.payOrderFavouring = ''
    this.selectAccount = ''
    this.externalAccountNo = ''
    this.debitMode = ''
    this.selectAccountOn = ''
    this.accountDescription = ''
    this.accountDescription1 = ''
    this.accountingEntries = ''
    this.isReturnApplicable = false
    this.isLateReturnApplicable = false
    this.isReturnToCmsHub = false
    this.physicalChequeReturn = false
    this.returnCategory = ''
    this.chargeCategory = ''
    this.fileUploadBy = ''
    this.enrichment = ''
    this.uploadType = ''
    this.workflow = ''
    this.duplicateLogicInvNo = ''
    this.isChargeApplicable = false
    this.isMaskingRequired = false
    this.chargeType = 'Per Transaction Charge'
    this.normalChangeCategory = ''
    this.allowRuntimeBene = 'No'
    this.beneAutoAuth = 'No'
    this.beneLibUpdate = 'No'
    this.promotionalChargeCategory = ''
    this.recovery = ''
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
    this.isCnDnDateValid = true
    this.isCnDnInvoiceValid = true
    this.isWatWhtCalculation = true
    this.ifHoliday = ''
    this.isFutureDatedPayment = false
    this.isFutureHold = false
    this.futureMaxDays = ''
    this.futureChargeAfter = ''
    this.isTrackingId = false
    this.isMultipleTracking = ''
    this.isDynamicDiscountApplicable = false
    this.dynamicDiscountTemplate = ''
    this.normalInvoice = ''
    this.invoiceOnDueDate = ''
    this.invoiceAfterDueDate = ''
    this.maxLengthOfVA = ''
    this.vaStatusOnCreation = 'Active'
    this.issuanceUploadFormat = ''
    this.issuanceDownloadFormat = ''
    this.actualEnricmentTemplate = ''
    this.vaEnrichmentTemplate = ''
    this.aliasName = ''
    this.printCoverNote = ''
    this.useSendToBank = 'No'
  }
}
