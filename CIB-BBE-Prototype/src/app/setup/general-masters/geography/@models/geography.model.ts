export class Geography {
  id?: number | string;
  version?: number | string;

  continent: boolean;
  country: boolean;
  province: boolean;
  geographyCode: string;
  geographyName: string;
  ouTypeName: string;
  effectiveFrom: string;
  effectiveTill: string;
  belongsTo: string;
  currency: string;

  constructor() {
    this.continent = false
    this.country = false
    this.province = false
    this.geographyCode = ''
    this.geographyName = ''
    this.ouTypeName = ''
    this.effectiveFrom = ''
    this.effectiveTill = ''
    this.belongsTo = ''
    this.currency = ''
  }
}