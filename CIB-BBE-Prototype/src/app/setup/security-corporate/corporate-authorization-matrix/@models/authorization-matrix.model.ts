export class AuthorizationMatrix {
  constructor(
    public product: string = '',
    public productName: string = '',
    public module: string = '',
    public moduleName: string = '',
    public matrixName: string = '',
    public authorizationLevel: string = '',
    public authorizationMode: string = '',
    public allowSkip: string = '',
    public currency: string = '',
    public currencyName: string = '',
    public paymentMethods: string = '',
    public accounts: any[] = [],
    public accountsMapped: string = '',

    public matrixStructureType: string = '',
    public slabs: Slab[] = [],


    public corporateId: string = '',
    public corporateCode: string = '',
    public corporateName: string = '',
    public groupCode: string = '',
    public groupName: string = '',
    public corpType: string = 'Corporate',
  ) { }
}

export class Slab {
  constructor(
    public isExpanded: boolean = false,
    public slabStartRange: string = '',
    public slabEndRange: string = '',
    public noOfUsers: number = 0,
    public noOfProfiles: number = 0,
    public profiles: Profile[] = [],
    public users: User[] = [],
  ) { }
}

export class Profile {
  constructor(
    public profileName: string = '',
    public isChecked: boolean = false,
    public conflictedUsers: boolean = false,
    public noOfSignatories: string = '',
    public priority: string = '0',
    public usersMapped: string = '',
    public users: User[] = [],
  ) { }
}

export class User {
  constructor(
    public userId: string = '',
    public firstName: string = '',
    public lastName: string = '',
  ) { }
}
