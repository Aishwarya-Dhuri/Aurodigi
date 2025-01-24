export class ChargeMapping {
  id?: number | string;
  version?: number | string;
  profileCode: string;
  profileName: string;


  templateType: string;
  chargeCatCode: string;
  chargeCatName: string;
  module: string;
  effectiveFrom: string;
  effectiveTill: string;
  isCopyFromChargeMapping: boolean;
  copyChargeMapping: string;
  search: string;
  productTemplateSearch: string;
  searchProductField: string;
  searchField: string;
  transaction?: TransactionDetails[];

  //-------CopyCluster---
  public clusterName: string;
  public copyClusterFromExisting: string;
  public copyClusterFromExistingName: string;
  public clusterDetails: ClusterDetail[];
  //-------CopyCluster---

  constructor() {
    this.profileCode = '';
    this.profileName = '';


    this.templateType = 'Normal';
    this.chargeCatCode = '';
    this.chargeCatName = '';
    this.module = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';
    this.isCopyFromChargeMapping = false;
    this.copyChargeMapping = '';
    this.search = '';
    this.productTemplateSearch = '';
    this.searchProductField = '';
    this.searchField = '';
    this.transaction = [];

    ///---------COPYCLuster
    this.clusterName = '';
    this.copyClusterFromExisting = '';
    this.copyClusterFromExistingName = '';
    this.clusterDetails = [];
    ///---------COPYCLuster

  }
}

export class ClusterDetail {
  public printBranch: string;
  public branches: string;

  constructor() {
    this.printBranch = '';
    this.branches = '';
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
