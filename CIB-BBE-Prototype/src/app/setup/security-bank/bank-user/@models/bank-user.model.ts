export class BankUser {
  id?: string | number;
  version?: string | number;
  lastAction?: string;
  enabled?: string;
  active?: string;
  authorized?: string;
  modifiedBy?: string;
  modifiedSysOn?: string;
  modifiedAtOU?: string;
  requestBy?: string;

  loginId: string;
  password: string;
  firstName: string;
  lastName: string;
  sex: string;
  email: string;
  telephoneNo: string;
  faxNo?: string;
  signatureCode?: string;
  uploadedFileName?: string;
  signatureFileName?: string;
  signatureFileSize?: number;
  isAdminUser: boolean;
  employeeCode: string;
  designation: string;
  department: string;
  ouId: string;
  branchName: string;
  category: string;
  profileId: string | number;
  profileName: string;
  effectiveFrom: string;
  effectiveTill?: string;
  roles: BankRoleDetail[];
  isLoginRestrictions: boolean;
  bankLoginRestrictions: BankLoginRestriction[];

  constructor() {
    this.loginId = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.sex = '';
    this.email = '';
    this.telephoneNo = '';
    this.faxNo = '';
    this.signatureCode = '';
    this.uploadedFileName = '';
    this.signatureFileName = '';
    this.signatureFileSize = 0;
    this.isAdminUser = false;
    this.employeeCode = '';
    this.designation = '';
    this.department = '';
    this.ouId = '';
    this.branchName = '';
    this.category = '';
    this.profileId = '';
    this.profileName = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';
    this.roles = [];
    this.isLoginRestrictions = false;
    this.bankLoginRestrictions = [];
  }
}

export class BankRoleDetail {
  id?: string | number;
  version?: string | number;
  lastAction?: string;
  enabled?: string;
  active?: string;
  authorized?: string;
  modifiedBy?: string;
  modifiedSysOn?: string;
  modifiedAtOU?: string;

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

export class BankLoginRestriction {
  id?: string | number;
  version?: string | number;
  lastAction?: string;
  enabled?: string;
  active?: string;
  authorized?: string;
  modifiedBy?: string;
  modifiedSysOn?: string;
  modifiedAtOU?: string;

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
