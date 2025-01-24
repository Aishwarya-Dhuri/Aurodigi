export class CorporateUser {
  corporateId: string;
  userId?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  genderId: string;
  genderName: string;
  email?: string;
  telephoneNo?: string;
  faxNo?: string;
  userAlias?: string;
  signatureCode?: string;
  uploadedFileName?: string;
  signatureFileName?: string;
  signatureFileSize?: number;
  isAdminUser: boolean;
  employeeCode: string;
  designation: string;
  department: string;
  categoryId: string;
  categoryName: string;
  profileId: string | number;
  profileName: string;
  corporateBranchId: string | number;
  corporateBranchName: string;
  address?: string;
  city?: string;
  pinCode?: string;
  locationName?: string;
  state?: string;
  country?: string;
  effectiveFrom: string;
  effectiveTill?: string;
  isLoginRestrictions: boolean;
  isGroupUser: string;
  isMultiCountryUser: string;
  groupId: string;
  groupName: string;
  roles?: CorporateRoleDetail[];
  groupUser?: GroupUser[];
  corporateSecurityDetails?: CorporateSecurityDetails[];
  corporateLoginRestrictions?: CorporateLoginRestriction[];
  loginPreferenceDetails?: LoginPreferenceDetails[];
  phishingDetails?: PhishingDetails[];
  corporateCode: string;
  corporateName: string;

  constructor() {
    this.corporateId = '';
    this.userId = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.genderId = '';
    this.genderName = '';
    this.email = '';
    this.telephoneNo = '';
    this.faxNo = '';
    this.userAlias = '';
    this.signatureCode = '';
    this.uploadedFileName = '';
    this.signatureFileName = '';
    this.signatureFileSize = 0;
    this.isAdminUser = false;
    this.employeeCode = '';
    this.designation = '';
    this.department = '';
    this.categoryId = '';
    this.categoryName = '';
    this.profileId = '';
    this.profileName = '';
    this.address = '';
    this.city = '';
    this.pinCode = '';
    this.locationName = '';
    this.state = '';
    this.country = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';
    this.isLoginRestrictions = false;
    this.isMultiCountryUser = 'False';
    this.isGroupUser = 'False';
    this.groupId = '';
    this.groupName = '';
    this.roles = [];
    this.groupUser = [];
    this.corporateLoginRestrictions = [];
    this.corporateSecurityDetails = [];
    this.loginPreferenceDetails = [];
    this.phishingDetails = [new PhishingDetails()];
    this.corporateCode = '';
    this.corporateName = '';
  }
}
export class CorporateRoleDetail {
  mstId?: string | number;
  moduleId: string | number;
  moduleName: string;
  roleId: string | number;
  roleName: string;
  initActions?: any;
  reviewActions?: any;

  constructor() {
    this.moduleId = '';
    this.moduleName = '';
    this.roleId = '';
    this.roleName = '';
    this.initActions = [];
    this.reviewActions = [];
  }
}

export class GroupUser {
  isGroupAdmin: boolean;
  groupId?: string | number;
  groupName?: string;
  groupProfileId?: string | number;
  groupProfile?: string;
  mstId?: string | number;
  moduleId: string | number;
  moduleName: string;
  roleId: string | number;
  roleName: string;
  initActions?: any;
  reviewActions?: any;
  isSelfAuthorizer?: boolean;
  isTransactionSelfAuthorizer?: boolean;
  isMasterSelfAuthorizer?: boolean;
  isSelftServiceRequest?: boolean;

  constructor() {
    this.isGroupAdmin = false;
    this.groupId = '';
    this.groupName = '';
    this.groupProfileId = '';
    this.groupProfile = '';
    this.moduleId = '';
    this.moduleName = '';
    this.roleId = '';
    this.roleName = '';
    this.initActions = [];
    this.reviewActions = [];
    this.isSelfAuthorizer = false;
    this.isTransactionSelfAuthorizer = false;
    this.isMasterSelfAuthorizer = false;
    this.isSelftServiceRequest = false;
  }
}

export class CorporateSecurityDetails {
  userAuthorize?: string;
  defaultDashboardId: string;
  defaultDashboardName: string;
  userAuth?: string;
  ipMappingRestriction?: string;
  ipMapping: IpMapping[];
  transactionSelfAuthorizer?: string;
  masterSelfAuthorizer?: string;
  selfServiceRequest?: string;
  enableOTP?: boolean;
  isMultiCountry: string;
  isGroup: string;
  maskingReq: string;
  groupId: string;
  groupName: string;

  constructor() {
    this.userAuthorize = 'Normal User';
    this.defaultDashboardId = '';
    this.defaultDashboardName = '';
    this.userAuth = 'Soft Token';
    this.ipMappingRestriction = 'No';
    this.ipMapping = [];
    this.transactionSelfAuthorizer = '';
    this.masterSelfAuthorizer = '';
    this.selfServiceRequest = '';
    this.enableOTP = false;
    this.isMultiCountry = 'False';
    this.isGroup = 'False';
    this.maskingReq = 'False';
    this.groupId = '';
    this.groupName = '';
  }
}
export class CorporateLoginRestriction {
  mstId?: string | number;
  weekday: string;
  startTime: string;
  endTime: string;
  restriction: boolean;
  restrictionType: string;
  weekdayno: string | number;
  actions?: any;

  constructor() {
    this.weekdayno = '';
    this.weekday = '';
    this.startTime = '10:00';
    this.endTime = '17:00';
    this.restriction = true;
    this.restrictionType = 'D';
    this.actions = [];
  }
}

export class PhishingDetails {
  categoryCode: string;
  phishingImageFileName: string;
  message: string;
  categoryName: string;
  phishingImageId: number;
  systemGeneratedImageFileName: string;

  constructor() {
    this.categoryCode = 'NATURE';
    this.phishingImageFileName = 'phishing0.jpg';
    this.message = "Welcome to Integro's Corporate Internet Banking Portal.";
    this.categoryName = 'Nature';
    this.phishingImageId = 1;
    this.systemGeneratedImageFileName = 'NATURE\\phishing0.jpg';
  }
}
export class LoginPreferenceDetails {
  countryId: string | number;
  countryName: string;
  bankType: 'Conventional' | 'Islamic';
  loginType: 'individual' | 'group';
  groupId: string | number;
  groupName: string;
  defaultDashboardId: string | number;
  defaultDashboardName: string;
  defaultDashboardUrl: string;
  isLoginPreference: boolean;

  constructor() {
    this.countryId = '';
    this.countryName = '';
    this.bankType = 'Conventional';
    this.loginType = 'individual';
    this.groupId = '';
    this.groupName = '';
    this.defaultDashboardId = '101';
    this.defaultDashboardName = 'Consolidated Dashboard';
    this.defaultDashboardUrl = '/dashboard/consolidated';
    this.isLoginPreference = false;
  }
}

// export class userParameters {
//   constructor(public isIpMapping: string = '', public ipMapping: IpMapping[] = []) {}
// }
class IpMapping {
  constructor(
    public srNo: string | number = '',
    public startRange: string = '',
    public endRange: string = '',
    public actions: any[] = [],
  ) { }
}
