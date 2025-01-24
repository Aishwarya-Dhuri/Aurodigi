export class QueryBuilder {
  id?: number | string;
  version?: number | string;
  userType: string;
  queryName: string;
  moduleId: string;
  subModule: string;
  outputFormat: string;
  channelEmail: string;
  channelSMS: string;
  channelOnline: string;
  alertBank: string;
  alertCorporate: string;
  alertcorporateClient: string;
  moduleMapping: any[];
  orderByQueryFieldAssign: any[];
  transaction?: TransactionDetails[];

  constructor() {
    this.userType = '';
    this.queryName = '';
    this.moduleId = '';
    this.subModule = '';
    this.outputFormat = '';
    this.channelEmail = '';
    this.channelSMS = '';
    this.channelOnline = '';
    this.alertBank = '';
    this.alertCorporate = '';
    this.alertcorporateClient = '';
    this.moduleMapping = [];
    this.orderByQueryFieldAssign = [];

    this.transaction = [];
  }
}

export class TransactionDetails {

  initActions?: any;
  reviewActions?: any;
  editCheckbox?: any;

  constructor(
    public id: string = new Date().getTime().toString(),
    public fieldSelect = '',
    public operator = '',
    public fieldValue = '',
    public condition = '',

  ) {
    this.fieldSelect = '';
    this.operator = '';
    this.fieldValue = '';
    this.condition = '';

  }
}