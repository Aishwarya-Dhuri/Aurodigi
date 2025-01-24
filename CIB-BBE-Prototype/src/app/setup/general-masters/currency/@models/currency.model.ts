export class Currency {
  id?: number | string;
  version?: number | string;

  currencyCode: string;
  currencyName: string;
  isoCurrencyNo: string;
  currencySymbol: string;
  decimalPlace: string;
  majorUnit: string;
  minorUnit: string;
  effectiveFrom: string;
  effectiveTill: string;

  constructor() {
    this.currencyCode = ''
    this.currencyName = ''
    this.isoCurrencyNo = ''
    this.currencySymbol = ''
    this.decimalPlace = ''
    this.majorUnit = ''
    this.minorUnit = ''
    this.effectiveFrom = ''
    this.effectiveTill = ''
  }
}