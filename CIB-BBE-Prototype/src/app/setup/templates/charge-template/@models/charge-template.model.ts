export class ChargeTemplate {
  id?: number | string;
  version?: number | string;
  profileCode: string;
  profileName: string;
  effectiveFrom: string;
  effectiveTill?: string;


  templateType: string;
  templateCode: string;
  templateName: string;
  module: string;
  chargeLevel: string;
  chargeEvent: string;
  currency: string;
  product: string;
  calculationFrequency: string;
  postingFrequency: string;
  chargeRoundOff: string;
  chargeRoundDecimal: string;
  taxApplicable: string;
  selectTax: string;
  chargeBasis: string;
  strategyType: string;
  variableCharge: string;
  fixedCharge: string;
  minimumCharge: string;
  maximumCharge: string;
  slabStrategySlab: string;
  contactInfo: ContactInfo[];


  constructor() {
    this.profileCode = '';
    this.profileName = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';


    this.templateType = 'Normal';
    this.templateCode = '';
    this.templateName = '';
    this.module = '';
    this.chargeLevel = '';
    this.chargeEvent = '';
    this.currency = '';
    this.product = '';
    this.calculationFrequency = '';
    this.postingFrequency = '';
    this.chargeRoundOff = 'Yes';
    this.chargeRoundDecimal = '';
    this.taxApplicable = 'No';
    this.selectTax = '';
    this.chargeBasis = 'Volume';
    this.strategyType = 'Linear';
    this.variableCharge = '';
    this.fixedCharge = '';
    this.minimumCharge = '';
    this.maximumCharge = '';
    this.slabStrategySlab = 'Incremental';
    this.contactInfo = [new ContactInfo()];

  }
}

export class ContactInfo {
  public startSlab: string;
  public endSlab: string;
  public fixedCharge: string;
  public variableCharge: string;
  public minimumCharge: string;
  public maximumCharge: string;
  public telNo: string;

  constructor() {
    this.startSlab = '';
    this.endSlab = '';
    this.fixedCharge = '';
    this.variableCharge = '';
    this.minimumCharge = '';
    this.maximumCharge = '';
    this.telNo = '';
  }
}