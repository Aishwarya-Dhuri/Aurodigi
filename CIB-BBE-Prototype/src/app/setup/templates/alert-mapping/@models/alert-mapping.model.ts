export class AlertMapping {
  id?: number | string;
  version?: number | string;
  effectiveFrom: string;
  effectiveTill?: string;
  corporateId?: string;

  corporateCode: string;
  corporateName: string;
  copyFromExistingUser: string;
  module: string;
  text: string;
  addtionalEmailId: string;
  mobileNo: string;

  //-------CopyCluster---
  public clusterName: string;
  public copyClusterFromExisting: string;
  public copyClusterFromExistingName: string;
  public clusterDetails: ClusterDetail[];
  //-------CopyCluster---

  constructor() {
    this.effectiveFrom = '';
    this.effectiveTill = '';

    this.corporateCode = '';
    this.corporateName = '';
    this.copyFromExistingUser = '';
    this.module = '';
    this.text = '';
    this.addtionalEmailId = '';
    this.mobileNo = '';

    ///---------COPYCLuster
    this.clusterName = '';
    this.copyClusterFromExisting = '';
    this.copyClusterFromExistingName = '';
    this.clusterDetails = [];
    ///---------COPYCLuster
  }
}

export class ClusterDetail {
  public printBranch: string;
  public branches: string;

  constructor() {
    this.printBranch = '';
    this.branches = '';
  }
}
