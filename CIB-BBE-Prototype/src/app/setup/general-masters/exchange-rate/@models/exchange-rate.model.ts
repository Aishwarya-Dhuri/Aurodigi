export class ExchangeRate {
  id?: number | string;
  version?: number | string;

  currencyName: string;
  exchangeRate: string;
  effectiveFrom: string;
  effectiveTill: string;

  constructor() {
    this.currencyName = ''
    this.exchangeRate = ''
    this.effectiveFrom = ''
    this.effectiveTill = ''
  }
}