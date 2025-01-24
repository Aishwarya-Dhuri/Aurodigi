import { QuickAction } from './quick-link';

export class UserDetails {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  mobileNumber: string;
  profilePicUrl: string;
  profileName: string;
  landingPage: string;
  consolidatedwidget: string;
  currentServerTimeA: string;
  lastLoginDateTime: string;
  lastFailedLogin: string;
  lastLoginTime: string;
  securityId: string;
  requestBy: string;
  ouId: string;
  branchName: string;
  applicationDate: string;
  smsVerification: string;
  mobileVerification: string;
  biometricVerification: string;
  quickActions: QuickAction[];

  constructor() {
    this.userId = '';
    this.userName = '';
    this.firstName = '';
    this.lastName = '';
    this.fullName = '';
    this.mobileNumber = '';
    this.profilePicUrl = '';
    this.profileName = '';
    this.landingPage = '';
    this.consolidatedwidget = '';
    this.currentServerTimeA = '';
    this.lastLoginDateTime = '';
    this.lastFailedLogin = '';
    this.lastLoginTime = '';
    this.securityId = '';
    this.requestBy = '';
    this.ouId = '';
    this.branchName = '';
    this.applicationDate = '';
    this.smsVerification = '';
    this.mobileVerification = '';
    this.biometricVerification = '';
  }
}
