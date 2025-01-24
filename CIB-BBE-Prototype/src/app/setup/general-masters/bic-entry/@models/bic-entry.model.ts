export class BicEntry {
  id?: number | string;
  version?: number | string;

  codeType: string;
  code: string;
  bankCode: string;
  bankName: string;
  branchCode: string;
  branch: string;
  address1: string;
  city: string;
  locationName: string;
  pinCode: string;
  routingCode: string;
  province: string;
  country: string;
  effectiveFrom: string;
  effectiveTill: string;

  constructor() {
    this.codeType = ''
    this.code = ''
    this.bankCode = ''
    this.bankName = ''
    this.branchCode = ''
    this.branch = ''
    this.address1 = ''
    this.city = ''
    this.locationName = ''
    this.pinCode = ''
    this.routingCode = ''
    this.province = ''
    this.country = ''
    this.effectiveFrom = ''
    this.effectiveTill = ''
  }
}

