export class RuleMasterTemplate {
  id?: number | string;
  version?: number | string;
  ruleCode: string;
  ruleName: string;
  ruleType: string;
  basedOn: string;
  eventId: string;
  channelEmail: string;
  channelSMS: string;
  channelOnline: string;
  alertBank: string;
  alertCorporate: string;
  alertcorporateClient: string;
  transaction?: TransactionDetails[];

  constructor() {
    this.ruleCode = '';
    this.ruleName = '';
    this.ruleType = '';
    this.basedOn = '';
    this.eventId = '';
    this.channelEmail = '';
    this.channelSMS = '';
    this.channelOnline = '';
    this.alertBank = '';
    this.alertCorporate = '';
    this.alertcorporateClient = '';
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
