export class ReportMapping {
  id?: number | string;
  version?: number | string;
  profileCode: string;
  profileName: string;
  effectiveFrom: string;
  effectiveTill?: string;

  corporateId?: string;
  module: string;
  reportType: string;
  reportName: string;
  corporateCode: string;
  corporateName: string;
  groupName: string;
  channelEmail: boolean;
  channelH2h: boolean;
  holidayRuleProcess: boolean;
  holidayRulePrepone: boolean;
  holidayRulePostpone: boolean;
  channelOnline: string;
  reportFormat: string;
  reportFrequency: string;
  activationDay: string;
  generationAt: string;
  executionDateFrom: string;
  executionDateTill: string;
  manualEntry: string;
  addtionalEmailId: string;
  startTime: string;
  endTime: string;
  repeatEvery: string;
  productProgramMapping: string;

  constructor() {
    this.profileCode = '';
    this.profileName = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';


    this.module = '';
    this.reportType = '';
    this.reportName = '';
    this.corporateCode = '';
    this.corporateName = '';
    this.groupName = '';
    this.channelEmail = false;
    this.channelH2h = false;
    this.holidayRuleProcess = false;
    this.holidayRulePrepone = false;
    this.holidayRulePostpone = false;
    this.channelOnline = '';
    this.reportFormat = '';
    this.reportFrequency = '';
    this.activationDay = '';
    this.generationAt = '';
    this.executionDateFrom = '';
    this.executionDateTill = '';
    this.manualEntry = 'Manual Entry';
    this.addtionalEmailId = '';
    this.startTime = '';
    this.endTime = '';
    this.repeatEvery = '';
    this.productProgramMapping = '';
  }
}
