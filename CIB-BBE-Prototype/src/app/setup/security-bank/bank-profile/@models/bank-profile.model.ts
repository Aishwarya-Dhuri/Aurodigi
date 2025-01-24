export class BankProfile {
  id?: number | string;
  version?: number | string;
  profileCode: string;
  profileName: string;
  effectiveFrom: string;
  effectiveTill?: string;

  constructor() {
    this.profileCode = '';
    this.profileName = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';
  }
}
