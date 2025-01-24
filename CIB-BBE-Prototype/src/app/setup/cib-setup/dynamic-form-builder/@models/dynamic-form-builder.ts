import { GridsterItem } from 'angular-gridster2';

export class DynamicFormBuilder {
  id?: number | string;
  version?: number | string;
  menuId?: number | string;
  isForAdminPortal: boolean;
  isFullMaster: boolean;
  parentMenu: string;
  isExistingParentMenu: boolean;
  parentMenuId: string;
  moduleId: string;
  moduleName: string;
  menuCategory?: string;
  displayName: string;
  smeDisplayName?: string;
  msmeDisplayName?: string;
  stepDisplayName?: string;
  entityName: string;
  serviceUrl: string;
  linkIds?: string;
  isApplicableForNormalUser: boolean;
  isApplicableForGroupUser: boolean;
  isAvailable: boolean;
  isAvailableForSME: boolean;
  isAvailableForMSME: boolean;
  isViewApplicable: boolean;
  isDataEntryApplicable: boolean;
  isAuthorizeApplicable: boolean;
  isEnableDisableApplicable: boolean;
  isExecuteApplicable: boolean;
  isVeriferApplicable: boolean;
  isSelfAuthApplicable: boolean;

  gridDataList: DraggableItem[] | GridsterItem[];

  constructor() {
    this.isForAdminPortal = false;
    this.isFullMaster = true;
    this.menuId = '';
    this.isExistingParentMenu = true;
    this.parentMenu = '';
    this.parentMenuId = '';
    this.moduleId = '';
    this.moduleName = '';
    // this.menuCategory = '';
    this.displayName = '';
    // this.smeDisplayName = '';
    // this.msmeDisplayName = '';
    this.stepDisplayName = '';
    this.entityName = '';
    this.serviceUrl = '';
    // this.linkIds = '';
    this.isApplicableForNormalUser = true;
    this.isApplicableForGroupUser = true;
    this.isAvailable = true;
    this.isAvailableForSME = true;
    this.isAvailableForMSME = true;
    this.isViewApplicable = true;
    this.isDataEntryApplicable = true;
    this.isAuthorizeApplicable = true;
    this.isEnableDisableApplicable = true;
    this.isExecuteApplicable = false;
    this.isVeriferApplicable = false;
    this.isSelfAuthApplicable = false;

    this.gridDataList = [];
  }
}

export class DraggableItem {
  id?: string | number;
  displayName: string;
  itemType: 'CARD' | 'FIELD' | 'GENERIC';
  componentClassName: string;
  value?: any;
  value1?: any;
  icon?: string;
  elementId?: string;
  label?: string;
  x: number;
  y: number;
  rows: number;
  cols: number;
  maxItemRows?: number;
  minItemRows?: number;
  maxItemCols?: number;
  minItemCols?: number;
  isConfigurable: boolean;
  [propName: string]: any;

  constructor() {
    this.id = '';
    this.displayName = '';
    this.itemType = 'GENERIC';
    this.componentClassName = '';
    this.value = '';
    this.value1 = '';
    this.elementId = '';
    this.x = 0;
    this.y = 0;
    this.rows = 2;
    this.cols = 2;
    this.isConfigurable = true;
    this.icon = '';
  }
}
