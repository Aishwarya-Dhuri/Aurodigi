export class CorporateAccount {
  id?: number | string;
  corporateId?: string;
  version?: number | string;
  account: string
  corporateCode: string
  corporateName: string
  accountNumber: string
  accountDescription: string
  accountAlias: string
  accountTypeName: string
  country: string
  currency: string
  effectiveFrom: string
  effectiveTill: string
  bankCode: string
  bankName: string
  branchName: string
  branchAddress: string

  constructor() {
    this.account = 'External'
    this.corporateCode = ''
    this.corporateName = ''
    this.accountNumber = ''
    this.accountDescription = ''
    this.accountAlias = ''
    this.accountTypeName = ''
    this.country = ''
    this.currency = ''
    this.effectiveFrom = ''
    this.effectiveTill = ''
    this.bankCode = ''
    this.bankName = ''
    this.branchName = ''
    this.branchAddress = ''
  }
}