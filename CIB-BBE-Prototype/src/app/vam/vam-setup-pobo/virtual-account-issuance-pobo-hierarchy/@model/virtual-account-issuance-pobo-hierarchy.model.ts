export class VirtualAccountIssuanceHierarchy {
  constructor(
    public vaStructureCreationFor: string = 'POBO',
    public corporateId: string = '',
    public corporateCode: string = '',
    public corporateName: string = '',
    public expiryDate: string = '',
    public typeOfIssuance: string = '',
    public accountId: string = '',
    public accountNumber: string = '',
    public accountNumberName: string = '',
    public accountCurrencyId: string = '',
    public accountBalance: string = '',
    public currencyCode: string = '',
    public bank: string = '',
    public country: string = '',
    public currency: string = '',
    public accType: string = '',
    public type: string = '',
    public corporateStructure: string = '',
    public corporateStructureName: string = '',
    public limitType: string = '',
    public limitCurrency: string = '',
    public limitCurrencyCode: string = '',
    public limitAmount: string = '',
    public limitReplenishPeriod: string = 'Daily',
    public levelName: string = '',
    public childAccountDetails: ChildAccountDetails[] = [],
  ) {}
}

export class ChildAccountDetails {
  constructor(
    public accId: string = '',
    public accountNo: string[] = [],
    public bank: string = '',
    public country: string = '',
    public accType: string = '',
    public type: string = '',
    public levelLabel: string = '',
    public subEntityCode: string = '',
    public subEntityName: string = '',
    public address1: string = '',
    public address2: string = '',
    public address3: string = '',
    public contactDetails: ContactDetails[] = [new ContactDetails()],

    public virtualAccountNumber: string = '',
    public virtualAccountAliceName: string = '',
    public virtualAccountExpiryDate: string = '',
    public virtualAccountAllocatedLimit: string = '',
    public currency: string = '',
    public currencyCode: string = '',

    public limitApplicable: string = 'No',
    public limitType: string = '',
    public limitAmount: string = '',
    public allowLimitOverride: string = 'No',
    public overrideLimitAmount: string = '',
    public overrideLimitPercentage: string = '',
    public limitPeriod: string = '',
    public expiryDate: string = '',
  ) {}
}

export class ContactDetails {
  constructor(
    public name: string = '',
    public emailId: string = '',
    public mobileNo: string = '',
  ) {}
}
