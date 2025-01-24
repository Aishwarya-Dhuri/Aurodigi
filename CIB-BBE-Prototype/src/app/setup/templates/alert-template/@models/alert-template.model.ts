export class AlertTemplate {
  id?: number | string;
  version?: number | string;
  alertCode: string;
  alertName: string;
  moduleId: string;
  categoryId: string;
  eventId: string;
  channelEmail: string;
  channelSMS: string;
  channelOnline: string;
  alertBank: string;
  alertCorporate: string;
  alertcorporateClient: string;

  constructor() {
    this.alertCode = '';
    this.alertName = '';
    this.moduleId = '';
    this.categoryId = '';
    this.eventId = '';
    this.channelEmail = '';
    this.channelSMS = '';
    this.channelOnline = '';
    this.alertBank = '';
    this.alertCorporate = '';
    this.alertcorporateClient = '';
  }
}
