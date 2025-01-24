export interface Personalization {
  userDetail?: User;
  addressDetails?: UserAddress;
  loginRestrictionDetails?: LoginRestrictions;
  securityCriteriaDetails?: SecurityCriteria;
  corporateMainDetails?: CorporateMain;
  officeDetails?: Office;
  antiPhishingDetails?: AntiPhishing;
  securityQuestionsDetails?: SecurityQuestionDetail;
  defaultLanguageDetails?: DefaultLanguage;
  loginPreferenceDetails?: LoginPreferences;
  widgetMappingDetails?: WidgetMapping;
  themeSelectionDetails?: ThemeSelection;
  alertsAndNotificationsDetails?: AlertsAndNotifications;
  makerCheckerLimitDetails?: MakerCheckerLimits;
  authMatrixInfoDetails?: AuthMatrixInfo;
  accountWiseAccessInfoDetails?: AccountWiseAccessInfo;
}

export interface User {
  id?: string;
  name?: string;
  userName?: string;
  designation?: string;
  profilePicUrl?: string;
  aliasName?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  employeeCode?: string;
  department?: string;
  category?: string;
  profileName?: string;
  corporateBranch?: string;
  isEdit?: boolean;
  isExpand?: boolean;
}

export interface Address {
  id?: string;
  contactNo?: string;
  faxNo?: string;
  emailId?: string;
  address1?: string;
  address2?: string;
  address3?: string;
}

export interface UserAddress extends Address {
  isEdit?: boolean;
  isExpand?: boolean;
}

export interface GridHeader {
  headerName?: string;
  field?: string;
  headerClass?: string;
  cellRenderer?: string;
  width?: number;
  children?: GridHeader[];
}

export interface LoginRestrictionData {
  id?: string;
  day?: string;
  startTime?: string;
  endTime?: string;
}

export interface LoginRestrictions {
  isEdit?: boolean;
  isExpand?: boolean;
  headers?: GridHeader[];
  data?: LoginRestrictionData[];
}

export interface SecurityCriteria {
  isEdit?: boolean;
  isExpand?: boolean;
  ipMappingRestriction?: string;
  userTypeHeader?: string;
}

export interface CorporateMain {
  isExpand?: boolean;
  isEdit?: boolean;
  groupName?: string;
  corporateCode?: string;
  corporateName?: string;
  CID?: string;
  holdingCompany?: string;
  parentName?: string;
}

export interface RegisteredOfficeLocation extends Address {
  registeredOfficeLocation?: string;
  corporateBranch?: string;
}

export interface CorporateOfficeLocation extends Address {
  corporateOfficeLocation?: string;
}

export interface Office {
  isExpand?: boolean;
  isEdit?: boolean;
  registeredOfficeLocationDetails?: RegisteredOfficeLocation;
  corporateOfficeLocationDetails?: CorporateOfficeLocation;
}

export interface AntiPhishing {
  isExpand?: boolean;
  isEdit?: boolean;
  image?: string;
  message?: string;
}

export interface SecurityQuestionAnswer {
  question?: string;
  answer?: string;
  isView?: boolean;
}

export interface SecurityQuestionDetail {
  isExpand?: boolean;
  isEdit?: boolean;
  questionAnswers?: SecurityQuestionAnswer[];
}

export interface DefaultLanguage {
  isExpand?: boolean;
  isEdit?: boolean;
  defaultLanguage?: string;
}

export interface LoginPreferences {
  isExpand?: boolean;
  isEdit?: boolean;
  country?: string;
  bankType?: string;
  loginType?: string;
  displayWelcomeCardAtLogin?: boolean;
  displayLoginPreferencesAfterLogin?: boolean;
}

export interface Widget {
  name?: string;
  description?: string;
  isSelected?: boolean;
  type?: string;
}

export interface ProductWidgets {
  name?: string;
  widgets?: Widget[];
  isExpand?: boolean;
}

export interface WidgetDetails {
  FSCM?: string[];
  Payments?: string[];
  Collection?: string[];
  VAM?: string[];
  RMS?: string[];
}

export interface WidgetMapping {
  isExpand?: boolean;
  isEdit?: boolean;
  defaultLandingPage?: string;
  enableConsolidatedView?: boolean;
  widgets?: WidgetDetails;
}

export interface ThemeSelection {
  isExpand?: boolean;
  isEdit?: boolean;
  isLightMode?: boolean;
  theme?: string;
}

export interface ProductToggle {
  name?: string;
  isExpand?: boolean;
}

export interface Alert {
  id?: string;
  category?: string;
  eventName?: string;
  alertType?: string[];
  status?: string;
  actions?: any;
}

export interface ProductWiseAlerts {
  FSCM?: Alert[];
  Payments?: Alert[];
  Collection?: Alert[];
  VAM?: Alert[];
  RMS?: Alert[];
  Trade?: Alert[];
}

export interface AlertsAndNotifications {
  isExpand?: boolean;
  isEdit?: boolean;
  alertHeaders?: GridHeader[];
  productWiseAlertsDetails?: ProductWiseAlerts;
}

export interface MakerCheckerLimits {
  isExpand?: boolean;
  isEdit?: boolean;
  headers?: GridHeader[];
  data?: MakerCheckerData[];
}

export interface MakerCheckerData {
  id?: string;
  product?: string[];
  makerAlottedLimit?: string;
  makerAvailableLimit?: string;
  checkerAlottedLimit?: string;
  checkerAvailableLimit?: string;
}

export interface AuthMatrix {
  id?: string;
  product?: string;
  accounts?: string[];
  currency?: string;
  authType?: string;
  slab?: string;
  additionalInfo?: string;
}

export interface ProductWiseAuthMatrix {
  FSCM?: AuthMatrix[];
  Payments?: AuthMatrix[];
  Collection?: AuthMatrix[];
  VAM?: AuthMatrix[];
  RMS?: AuthMatrix[];
  Trade?: AuthMatrix[];
}

export interface AuthMatrixInfo {
  isExpand?: boolean;
  isEdit?: boolean;
  headers?: GridHeader[];
  productWiseAuthMatrixDetails?: ProductWiseAuthMatrix;
}

export interface AccountToggle {
  no?: string;
  isExpand?: boolean;
}

export interface ProductAccountAccess {
  id?: string;
  subProduct?: string[];
  accounts?: string;
  rights?: string;
}

export interface ProductWiseAccountAccess {
  FSCM?: ProductAccountAccess[];
  Payments?: ProductAccountAccess[];
  Collection?: ProductAccountAccess[];
  VAM?: ProductAccountAccess[];
  RMS?: ProductAccountAccess[];
  Trade?: ProductAccountAccess[];
}

export interface AccountWiseAccessInfo {
  isExpand?: boolean;
  isEdit?: boolean;
  productWiseHeaders?: GridHeader[];
  productWiseAccountAccessDetails?: ProductWiseAccountAccess;
  accountWiseHeaders?: GridHeader[];
  accountWiseAccountAccessDetails?: any;
}
