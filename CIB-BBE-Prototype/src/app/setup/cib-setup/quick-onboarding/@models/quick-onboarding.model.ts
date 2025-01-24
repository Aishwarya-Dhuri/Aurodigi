export class QuickOnboarding {
  id?: number | string;
  version?: number | string;
  profileCode: string;
  effectiveFrom: string;
  effectiveTill?: string;
  cid: string;
  transactionCharge: string;
  fileProcessingCharge: string;
  rmEmaildId: string;
  molId: string;
  corporateCat: string;
  corporateAccount: string;
  groupName: string;
  moduleCheckbox: string;
  package: string;
  corporateName: string;
  corporateCode: string;

  firstName: string;
  lastName: string;
  userId: string;
  soft: string;
  mobile: string;
  emailId: string;
  mobileNo: string;
  defaultLimit: string;
  profileName: string;
  gender: string;
  category: string;
  corporateRole: string;


  transaction?: TransactionDetails[];


  constructor() {
    this.profileCode = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';
    this.cid = '';
    this.transactionCharge = '';
    this.fileProcessingCharge = '';
    this.rmEmaildId = '';
    this.molId = '';
    this.corporateCat = '';
    this.corporateAccount = '';
    this.moduleCheckbox = '';
    this.package = '';
    this.corporateName = 'Sony Ltd';
    this.groupName = '';
    this.corporateCode = '';

    this.transaction = [];
    this.firstName = '';
    this.lastName = '';
    this.userId = '';
    this.soft = '';
    this.mobile = '';
    this.emailId = '';
    this.mobileNo = '';
    this.defaultLimit = '';
    this.profileName = '';
    this.gender = '';
    this.category = '';
    this.corporateRole = '';






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
    public profileName = '',
    public gender = '',
    public category = '',
    public corporateRole = '',

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
    this.profileName = '';
    this.gender = '';
    this.category = '';
    this.corporateRole = '';

  }
}

