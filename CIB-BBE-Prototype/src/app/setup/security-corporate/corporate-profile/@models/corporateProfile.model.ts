export class CorporateProfile {
  commonProfile: boolean;
  corporateId: string;
  corporateCode: string;
  corporateName: string;
  profileCode: string;
  profileName: string;
  requestBy: string;
  effectiveFrom: string;
  effectiveTill: string;

  constructor() {
    this.commonProfile = true;
    this.corporateId = '';
    this.corporateCode = '';
    this.corporateName = '';
    this.profileCode = '';
    this.profileName = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';
  }
}
