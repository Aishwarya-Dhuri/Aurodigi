export class Location {
  id?: number | string;
  version?: number | string;

  locationCode: string;
  locationName: string;
  countryCode: string;
  countryName: string;
  provinceCode: string;
  provinceName: string;
  postalCode: string;
  effectiveFrom: string;
  effectiveTill: string;

  constructor() {
    this.locationCode = ''
    this.locationName = ''
    this.countryCode = ''
    this.countryName = ''
    this.provinceCode = ''
    this.provinceName = ''
    this.postalCode = ''
    this.effectiveFrom = ''
    this.effectiveTill = ''
  }
}