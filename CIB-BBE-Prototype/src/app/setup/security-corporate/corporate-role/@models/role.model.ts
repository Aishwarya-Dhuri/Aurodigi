export class CorporateRole {
  id?: number | string;
  version?: number | string;
  moduleId: string;
  moduleName: string;
  roleCode: string;
  roleName: string;
  roleType: string;
  requestedBy: string;
  effectiveFrom: string;
  effectiveTill?: string;
  groupId?: string;
  corporateId?: string;
  assignRightList?: RoleRights[];
  widgetList?: RoleWidget[];
  isGroupRole?: boolean;
  corporateCode: string;
  corporateName: string;

  constructor() {
    this.moduleId = '';
    this.moduleName = '';
    this.roleCode = '';
    this.roleName = '';
    this.roleType = 'NORMAL';
    this.requestedBy = 'BANK';
    this.effectiveFrom = '';
    this.effectiveTill = '';
    this.corporateId = '';
    this.groupId = '';
    this.isGroupRole = false;
    this.assignRightList = [];
    this.widgetList = [];
    this.corporateCode = '';
    this.corporateName = '';
  }
}
export class RoleRights {
  id?: number | string;
  version?: number | string;
  mstId?: number | string;
  menuId: string;
  parentMenuId: string;
  moduleId: string;
  VIEW: boolean;
  DATA_ENTRY: boolean;
  AUTHORIZE: boolean;
  ENABLE_DISABLE: boolean;
  EXECUTE: boolean;
  SELFAUTH: boolean;
  VERIFER: boolean;
}

export class RoleWidget {
  id?: number | string;
  version?: number | string;
  mstId?: number | string;
  widgetId: number | string;
}
