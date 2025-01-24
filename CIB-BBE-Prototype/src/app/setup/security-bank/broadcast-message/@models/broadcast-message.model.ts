export class BroadcastMessage {
  id?: number | string;
  version?: number | string;
  displayType: string;
  messageFor: string;
  briefMassage: string;
  message: string;
  sendTo: string;
  selectCategory: string;
  selectCode: string;
  selectUser: string;
  startDate: string;
  toDate: string;

  constructor() {
    this.displayType = 'Online'
    this.messageFor = 'Bank'
    this.briefMassage = ''
    this.message = ''
    this.sendTo = 'Corporate Category'
    this.selectCategory = ''
    this.selectCode = ''
    this.selectUser = ''
    this.startDate = ''
    this.toDate = ''
  }
}
