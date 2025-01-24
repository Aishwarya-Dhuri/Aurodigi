import { ResponseStatus } from 'src/app/shared/@models/response-status';
import { Widget } from './widget-details';

export interface Menu_response {
  responseStatus?: ResponseStatus;
  currentDate?: Date;
  modules?: Module[];
  entityIdentifier?: string;
  loggable?: boolean;
}

export interface Module {
  index?: number;
  moduleId?: string;
  moduleName?: string;
  menusLink?: string;
  menus?: Menu[] | Widget[];
  icon?: string;
  isLock?: boolean;
  isShortMenu?: boolean;
}

export interface Menu {
  displayName?: string;
  id?: string;
  entityId?: string;
  originalEntity?: string;
  url?: string;
  entityName?: string;
  menuCategory?: string;
  allowCorporateVsGroup?: string;
  showAccountServicesOnly?: string;
  reportServicesOnly?: string;
  showInOtherServices?: string;
  belongsTo?: string;
  faIcon?: string;
  icon?: string;
  menus?: Menu[];
  access?: string[];
  serviceUrl?: string;
  serviceUrl1?: string;
  isCorporateEnable?: string;
  defaultURL?: string;
  menuLinksDetail?: { link?: Link[] };
  dynamicFormId?: string | number;
}

export interface Link {
  displayName?: string;
  url?: string;
  access?: string;
  key?: string;
  hide?: string;
  icon?: string;
}
