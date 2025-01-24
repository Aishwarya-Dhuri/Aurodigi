export class BenchmarkRate {
  id?: number | string;
  version?: number | string;

  plrCode: string;
  plrName: string;
  plrRate: string;
  countryCode: string;
  countryName: string;
  effectiveFrom: string;
  effectiveTill: string;

  constructor() {
    this.plrCode = ''
    this.plrName = ''
    this.plrRate = ''
    this.countryCode = ''
    this.countryName = ''
    this.effectiveFrom = ''
    this.effectiveTill = ''
  }
}