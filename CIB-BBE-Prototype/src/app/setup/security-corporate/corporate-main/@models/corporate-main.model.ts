export class CorporateMain {
    cid:string;
    corporateCode: string;
    corporateName: string;
    corporateAliasCode:string
    trnNo: string;
    uniqueIdNo: string;
    holdingCompany: string;
    countryCode: string;
    contactInfo: ContactInfo[];
    accNoCheckbox1: string;

   
    sameAddressAsAbove: string;
    registeredOfficeaddress1: string;
    registeredOfficeaddress2: string;
    registeredOfficeaddress3: string;
    registeredOfficelocationName: string;
    registeredOfficepinCode: string;
    registeredOfficecountry: string;
    registeredOfficeEmailId: string;
    registeredOfficeprovince: string;
    registeredOfficemobileNo:string;
    registeredOfficefaxNo:string;
    registeredOfficecity:string

    address1: string;
    address2: string;
    address3: string;
    locationName: string;
    pinCode: string;
    province: string;
    mobileNo: string;
    country: string;
    faxNo: string;
    city: string;
    emailId: string;
    corpUserAdmBy: string;
    passwordSetup: string;
    corporateLogo: []
    categoryWiseCharges: string;
    holidayAccess: string;
    promotionalCharges: string;
    remoteAccessOnHoliday: string;
    appplyPromotionalCharges: string;
    defaultChargeAmount: string;
    h2hFileProcessing: string;
    debitTransactionChargesFrom: string;
    ipMapping: string;
    IpMappingDetails?: IpMappingDetails[];
    authrule?: authorizationDetails[];
  industryDescription: string;
  relationshipManagerName: string;
  loginId: string;
  employeeCode: string;
  accountManager: string;
  accManagerloginId: string;
  accManageremployeeCode: string;
  coreBranchId: string;
  aggrementDate: string;
  expiryDate: string;
  noOfDaysForReview: string;
  referenceNumber: string;
  effectiveFrom: string;
  effectiveTill: string;
  setupNormalChargeCategory: string;
  setupChargeApplicablecheck: string;
  setupModulecheck: string;
  setuppromotionalChargeCategory: string;
  setupDefaultChargeAccount: string;
  verificationLevel: string;
  verficationRequired1: string;
  verficationRequired2: string;

  noOfVerifier1: string;
  noOfVerifier2: string;
  tradeDefaultChargeAccount: string;
  tradepromotionalChargeCategory: string;
  tradeNormalChargeCategory: string;
  tradeChargeApplicablecheck: string;
  tradeModulecheck: string;
  vamCoboDefaultChargeAccount: string;
  vamCobopromotionalChargeCategory: string;
  vamCoboNormalChargeCategory: string;
  vamCoboChargeApplicablecheck: string;
  vamCoboModulecheck: string;
  vamPoboDefaultChargeAccount: string;
  vamPobopromotionalChargeCategory: string;
  vamPoboNormalChargeCategory: string;
  vamPoboChargeApplicablecheck: string;
  vamPoboModulecheck: string;
  paymentsDefaultChargeAccount: string;
  paymentspromotionalChargeCategory: string;
  paymentsNormalChargeCategory: string;
  paymentsChargeApplicablecheck: string;
  paymentsModulecheck: string;


   

    constructor() {
        this.cid = ''
        this.corporateCode = ''
        this.corporateName = ''
        this.corporateAliasCode = ''
        this.trnNo = ''
        this.uniqueIdNo = ''
        this.holdingCompany = 'Yes'

        this.countryCode = ''
        this.contactInfo = [new ContactInfo()];
        this.accNoCheckbox1 = ''
        this.accNoCheckbox1 = ''

        this.registeredOfficeaddress1 = '';
        this.registeredOfficeaddress2 = '';
        this.registeredOfficeaddress3 = '';


        this.registeredOfficelocationName= ''
        this.registeredOfficepinCode= ''
        this.registeredOfficepinCode= ''
        this.registeredOfficepinCode= ''
        this.registeredOfficecountry= ''
        this.registeredOfficepinCode= ''
        this.registeredOfficecountry= ''
        this.registeredOfficeEmailId= ''
        this.registeredOfficeprovince = ''
        this.registeredOfficemobileNo = ''
        this.registeredOfficefaxNo = ''
        this.registeredOfficecity = ''

        this.address1 = '';
        this.address2 = '';
        this.address3 = '';
   

        this.locationName = '';
        this.pinCode = '';
        this.province = '';
        this.mobileNo = '';
        this.country = '';
        this.faxNo = '';
        this.city = '';
        this.emailId = '';

        
        this.sameAddressAsAbove = '';
        this.corpUserAdmBy = 'Corporate'
        this.passwordSetup = 'autoGeneration'

        this.corporateLogo = [];
        this.categoryWiseCharges = ''   
        this.holidayAccess = 'Yes'
        this.appplyPromotionalCharges = 'Yes'
        this.remoteAccessOnHoliday = 'No'
        this.promotionalCharges ='',
        this.h2hFileProcessing = ''
        this.defaultChargeAmount = ''
        this.debitTransactionChargesFrom = 'Transaction Debit Account'
        this.ipMapping = 'No'
        this.IpMappingDetails = [];
        this.authrule = [];

        this.industryDescription = ''
        this.relationshipManagerName = ''
        this.loginId = ''
        this.employeeCode  = ''
        this.accountManager  = ''
        this.accManagerloginId = ''
        this.accManageremployeeCode = ''
        this.coreBranchId = ''
        this.aggrementDate = ''
        this.expiryDate =''
        this.noOfDaysForReview = '',
        this.referenceNumber = ''
        this.effectiveFrom = ''
        this.effectiveTill = ''

        //Module Mapping
        this.setupNormalChargeCategory = ''
        this.setupChargeApplicablecheck = '',
        this.setupModulecheck  =''
        this.setuppromotionalChargeCategory = ''
        this.setupDefaultChargeAccount = ''
        this.verificationLevel  = '',
        this.verficationRequired1 = ''
        this.verficationRequired2 = ''
        this.noOfVerifier1 = ''
        this.noOfVerifier2 = ''

      this.tradeDefaultChargeAccount = ''
      this.tradepromotionalChargeCategory = ''
      this.tradeNormalChargeCategory = ''
      this.tradeChargeApplicablecheck = ''
      this.tradeModulecheck = ''


      this.vamCoboDefaultChargeAccount = ''
      this.vamCobopromotionalChargeCategory = ''
      this.vamCoboNormalChargeCategory = ''
      this.vamCoboChargeApplicablecheck = ''
      this.vamCoboModulecheck = ''


      this.vamPoboDefaultChargeAccount = ''
      this.vamPobopromotionalChargeCategory = ''
      this.vamPoboNormalChargeCategory = ''
      this.vamPoboChargeApplicablecheck = ''
      this.vamPoboModulecheck = ''


      this.paymentsDefaultChargeAccount = ''
      this.paymentspromotionalChargeCategory = ''
      this.paymentsNormalChargeCategory = ''
      this.paymentsChargeApplicablecheck = ''
      this.paymentsModulecheck = ''




    }

}

export class IpMappingDetails{
    ipMapping: IpMapping[];
    constructor() {
        this.ipMapping = [];


    }
}

export class authorizationDetails{
  module: string;
  transactionName: string;
  authorizationRule: string;
  initActions?: any;
  reviewActions?: any;
  constructor(   public id: string = new Date().getTime().toString(),) {
    this.module = '';
    this.transactionName = '';
    this.authorizationRule = '';

    this.initActions = [];
    this.reviewActions = [];
  }
}
export class IpMapping {
    constructor(
      public srNo: string | number = '',
      public startRange: string = '',
      public endRange: string = '',
      public actions: any[] = [],
    ) { }
  }
export class ContactInfo {
     contactPersonName: string;
     designation: string;
     emailId: string;
     telNo: string;
  
    constructor() {
      this.contactPersonName = '';
      this.designation = '';
      this.emailId = '';
      this.telNo = '';
    }
  }

  