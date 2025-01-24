export class VirtualAccountIssuanceHierarchy {
  constructor(
    public vaStructureCreationFor: string = 'COBO',
    public corporateId: string = '',
    public corporateCode: string = '',
    public corporateName: string = '',
    public expiryDate: string = '',
    public typeOfVirtualAccount: string = '',
    public accountId: string = '',
    public accountNumber: string = '',
    public accountNumberName: string = '',
    public accountCurrencyId: string = '',
    public currencyCode: string = '',
    public bank: string = '',
    public country: string = '',
    public currency: string = '',
    public accType: string = '',
    public type: string = '',
    public corporateStructure: string = '',
    public corporateStructureName: string = '',
    public entityType: string = '',
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

    public linkedAccountType: string = 'Virtual',
    public linkedActualAccount: string = '',
    public vaIssuanceTemplate: string = '',
    public vaDownloadTemplate: string = '',
    public vaEnrichmentTemplate: string = '',
    public virtualAccountNumber: string = '',
    public currency: string = '',
    public currencyCode: string = '',
  ) {}
}

export class ContactDetails {
  constructor(
    public name: string = '',
    public emailId: string = '',
    public mobileNo: string = '',
  ) {}
}
