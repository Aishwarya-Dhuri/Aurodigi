export class BankRole {
  id?: number | string;
  version?: number | string;
  moduleId: string;
  moduleName: string;
  roleCode: string;
  roleName: string;
  roleType: string;
  effectiveFrom: string;
  effectiveTill?: string;
  assignRightList?: RoleRights[];
  widgetList?: RoleWidget[];

  constructor() {
    this.moduleId = '';
    this.moduleName = '';
    this.roleCode = '';
    this.roleName = '';
    this.roleType = 'BANK';
    this.effectiveFrom = '';
    this.effectiveTill = '';
    this.assignRightList = [];
    this.widgetList = [];
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
