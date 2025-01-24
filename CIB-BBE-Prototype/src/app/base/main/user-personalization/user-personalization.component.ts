import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { UserDetails } from '../../@models/user.details';
import { AlertCheckboxRendererComponent } from './@components/alert-checkbox-renderer/alert-checkbox-renderer.component';
import { AlertStatusRendererComponent } from './@components/alert-status-renderer/alert-status-renderer.component';
import { AuthMatrixAccountsRendererComponent } from './@components/auth-matrix-accounts-renderer/auth-matrix-accounts-renderer.component';
import { AuthMatrixAdditionalInfoRendererComponent } from './@components/auth-matrix-additional-info-renderer/auth-matrix-additional-info-renderer.component';
import { PersonalizationTab } from './@models/personalization-tab.model';
import {
  AccountToggle,
  Alert,
  Personalization,
  ProductToggle,
  ProductWidgets,
} from './@models/personalization.model';

@Component({
  selector: 'app-user-personalization',
  templateUrl: './user-personalization.component.html',
  styleUrls: ['./user-personalization.component.scss'],
})
export class UserPersonalizationComponent implements OnInit {
  personalizationData: Personalization;
  personalizationEditData: Personalization;

  viewport: string;
  isLoaded: boolean = true;
  tabDetails: PersonalizationTab[];
  selectedTab: string;
  selectedTabIndex: number;

  tempMessage: string;
  messageSuggestions: Select[];
  isShowPhishingImages: boolean;
  tempPhishingImage: string;
  securityQuestions: Select[];
  languages: Select[];
  countries: Select[];
  dashboardList: Select[];
  productWidgets: ProductWidgets[];
  themes: string[];

  productToggleList: ProductToggle[];

  selectedAlertFilters: string[] = ['Enabled', 'Suspended', 'Disabled'];
  @ViewChild('productAlerts') alertGrid: any;
  alertGridOptions: any = {
    rowModelType: 'clientSide',
    pagination: false,
    context: { componentParent: this },
  };
  alertFrameworkComponents: any = {
    alertCheckboxRenderer: AlertCheckboxRendererComponent,
    alertStatusRenderer: AlertStatusRendererComponent,
  };

  makerCheckerGridOptions: any = {
    rowModelType: 'clientSide',
    treeData: true,
    autoGroupColumnDef: {
      headerName: 'Product / Sub-Product',
      cellRendererParams: { suppressCount: true },
    },
    getDataPath: function (data) {
      return data.product;
    },
  };

  authMatrixGridOptions: any = {
    rowModelType: 'clientSide',
    pagination: true,
    context: { componentParent: this },
  };
  authMatrixFrameworkComponents: any = {
    authMatrixAccountsRenderer: AuthMatrixAccountsRendererComponent,
    authMatrixAdditionalInfoRenderer: AuthMatrixAdditionalInfoRendererComponent,
  };
  authMatrixAdditionalInfo: string;
  isShowAuthMatrixAdditionalInfo: boolean;
  authMatrixModalStyles: any;
  authMatrixAccounts: string[];
  isShowAuthMatrixAccounts: boolean;

  accountWiseAccessViewBy: string = 'Products';
  accountWiseAccessProductGridOptions: any = {
    rowModelType: 'clientSide',
    treeData: true,
    autoGroupColumnDef: {
      headerName: 'Sub-Product / Module',
      cellRendererParams: { suppressCount: true },
    },
    getDataPath: function (data) {
      return data.subProduct;
    },
  };
  accountWiseAccessAccountGridOptions: any = {
    rowModelType: 'clientSide',
    treeData: true,
    autoGroupColumnDef: {
      headerName: 'Product',
      cellRendererParams: { suppressCount: true },
    },
    getDataPath: function (data) {
      return data.product;
    },
  };
  accountToggleList: AccountToggle[];

  antiPhishingPath: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewportService: ViewportService,
    private userService: UserService,
  ) {
    this.antiPhishingPath = this.httpService.getAssetUrl('assets/images/anti-phishing/');
  }

  ngOnInit(): void {
    /* remove below : starts */
    const actions: Actions = {
      heading: 'Setting',
      subHeading: null,
      widgetsActions: false,
      refresh: true,
      widgets: false,
      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [{ label: 'Setting' }];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });

    this.messageSuggestions = [
      {
        id: 'Welcome to authentic CIB web-portal.',
        displayName: 'Welcome to authentic CIB web-portal.',
      },
      { id: 'This is authentic CIB web-portal.', displayName: 'This is authentic CIB web-portal.' },
      {
        id: 'Anti phishing feature of CIB web-portal.',
        displayName: 'Anti phishing feature of CIB web-portal.',
      },
    ];

    this.securityQuestions = [
      { id: 'What is your pet’s name?', displayName: 'What is your pet’s name?' },
      { id: 'What is your first mobile number?', displayName: 'What is your first mobile number?' },
      { id: 'What is your date of birth?', displayName: 'What is your date of birth?' },
    ];

    this.languages = [
      { id: 'English(US)', displayName: 'English(US)' },
      { id: 'Arabic', displayName: 'Arabic' },
    ];

    this.countries = [
      { id: 'India', displayName: 'India' },
      { id: 'United Kingdom', displayName: 'United Kingdom' },
    ];

    this.dashboardList = [
      { id: 'Consolidated Dashboard', displayName: 'Consolidated Dashboard' },
      { id: 'FSCM Dashboard', displayName: 'FSCM Dashboard' },
      { id: 'Payments Dashboard', displayName: 'Payments Dashboard' },
      { id: 'Collection Dashboard', displayName: 'Collection Dashboard' },
      { id: 'VAM Dashboard', displayName: 'VAM Dashboard' },
      { id: 'RMS Dashboard', displayName: 'RMS Dashboard' },
    ];

    this.productWidgets = [
      {
        name: 'FSCM',
        isExpand: true,
        widgets: [
          {
            name: 'Top 3 Suppliers',
            type: 'DONUT',
            description: 'This widget displays data about top 3 suppliers- on basis of Invoice',
          },
          {
            name: 'Top 5 Dealers',
            type: 'BAR',
            description: 'This widget displays data about top 5 dealers - on basis of Invoice',
          },
          {
            name: 'Top 3 Accounts',
            type: 'DONUT',
            description: 'This widget displays data about top 3 accounts- on basis of Invoice',
          },
        ],
      },
      {
        name: 'Payments',
        isExpand: false,
        widgets: [
          {
            name: 'Top 3 Suppliers',
            type: 'DONUT',
            description: 'This widget displays data about top 3 suppliers- on basis of Invoice',
          },
          {
            name: 'Top 5 Dealers',
            type: 'BAR',
            description: 'This widget displays data about top 5 dealers - on basis of Invoice',
          },
          {
            name: 'Top 3 Accounts',
            type: 'DONUT',
            description: 'This widget displays data about top 3 accounts- on basis of Invoice',
          },
        ],
      },
      {
        name: 'Collection',
        isExpand: false,
        widgets: [
          {
            name: 'Top 3 Suppliers',
            type: 'DONUT',
            description: 'This widget displays data about top 3 suppliers- on basis of Invoice',
          },
          {
            name: 'Top 5 Dealers',
            type: 'BAR',
            description: 'This widget displays data about top 5 dealers - on basis of Invoice',
          },
          {
            name: 'Top 3 Accounts',
            type: 'DONUT',
            description: 'This widget displays data about top 3 accounts- on basis of Invoice',
          },
        ],
      },
      {
        name: 'VAM',
        isExpand: false,
        widgets: [],
      },
      {
        name: 'RMS',
        isExpand: false,
        widgets: [],
      },
    ];

    this.themes = ['Teal', 'Ruby', 'Ocean'];

    this.productToggleList = [
      { name: 'Payments', isExpand: false },
      { name: 'Collection', isExpand: false },
      { name: 'FSCM', isExpand: false },
      { name: 'Trade', isExpand: false },
      { name: 'VAM', isExpand: false },
      { name: 'RMS', isExpand: false },
    ];

    this.tabDetails = [
      {
        name: 'userInfo',
        displayName: 'User Information',
        icon: 'fa-user',
        isActive: true,
        isHover: false,
        dataObjs: [
          'userDetail',
          'addressDetails',
          'loginRestrictionDetails',
          'securityCriteriaDetails',
        ],
      },
      /* {
        name: 'corporateInfo',
        displayName: 'Branch Information',
        icon: 'fa-users',
        isActive: false,
        isHover: false,
        dataObjs: ['corporateMainDetails', 'officeDetails'],
      }, */
      {
        name: 'security',
        displayName: 'Security',
        icon: 'fa-user-shield',
        isActive: false,
        isHover: false,
        dataObjs: ['antiPhishingDetails', 'securityQuestionsDetails'],
      },
      {
        name: 'personalisation',
        displayName: 'Personalisation',
        icon: 'fa-sliders-v',
        isActive: false,
        isHover: false,
        dataObjs: ['defaultLanguageDetails', 'loginPreferenceDetails'],
      },
      {
        name: 'alertsAndNotifications',
        displayName: 'Alerts and Notifications',
        icon: 'fa-bell',
        isActive: false,
        isHover: false,
        dataObjs: ['alertsAndNotificationsDetails'],
      },
      {
        name: 'makerCheckerLimits',
        displayName: 'Maker/Checker Limits',
        icon: 'fa-user-check',
        isActive: false,
        isHover: false,
        dataObjs: ['makerCheckerLimitDetails'],
      },
      {
        name: 'authMatrixInfo',
        displayName: 'Authorisation Matrix Information',
        icon: 'fa-user-tie',
        isActive: false,
        isHover: false,
        dataObjs: ['authMatrixInfoDetails'],
      },
      {
        name: 'accountWiseAccessInfo',
        displayName: 'Account Wise Access Information',
        icon: 'fa-university',
        isActive: false,
        isHover: false,
        dataObjs: ['accountWiseAccessInfoDetails'],
      },
    ];
    this.selectedTabIndex = 0;
    this.selectedTab = this.tabDetails[0].name;

    this.personalizationData = {};
    this.personalizationData.userDetail = {};
    this.userService.getUserDetails().subscribe((userDetails: UserDetails) => {
      this.personalizationData.userDetail = {
        isEdit: false,
        isExpand: true,
        userName: userDetails.userName,
        name: userDetails.fullName,
        designation: userDetails.profileName,
        profilePicUrl: null,
        aliasName: '-',
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        gender: 'Male',
        employeeCode: 'CFO001',
        department: 'Finance',
        category: 'Operations',
        profileName: 'OPER - Operations',
        corporateBranch: '9990001HUB',
      };
    });
    this.personalizationData.addressDetails = {
      isEdit: false,
      isExpand: false,
      contactNo: '998877661002',
      emailId: 'james.tan@aps.com',
      address1: '40/4,',
      address2: '2nd Lane Madapathala,',
      address3: 'KL',
    };
    this.personalizationData.loginRestrictionDetails = {
      isExpand: false,
      headers: [
        { headerName: 'Days', field: 'day' },
        { headerName: 'Start Time', field: 'startTime' },
        { headerName: 'End Time', field: 'endTime' },
      ],
      data: [
        { id: '01', day: 'Monday', startTime: '00:00', endTime: '00:00' },
        { id: '02', day: 'Tuesday', startTime: '00:00', endTime: '00:00' },
        { id: '03', day: 'Wednesday', startTime: '00:00', endTime: '00:00' },
        { id: '04', day: 'Thursday', startTime: '00:00', endTime: '00:00' },
        { id: '05', day: 'Friday', startTime: '00:00', endTime: '00:00' },
        { id: '06', day: 'Saturday', startTime: '00:00', endTime: '00:00' },
        { id: '07', day: 'Sunday', startTime: '00:00', endTime: '00:00' },
      ],
    };
    this.personalizationData.securityCriteriaDetails = {
      isExpand: false,
      ipMappingRestriction: 'Yes',
      userTypeHeader: 'Self Authorisation and Corporate Authorisation Matrix',
    };
    this.personalizationData.corporateMainDetails = {
      isExpand: true,
      isEdit: false,
      groupName: 'Toyota Motors Group',
      corporateCode: '0001003',
      corporateName: 'Toyota Motors Malaysia',
      CID: '0001003',
      holdingCompany: 'True',
      parentName: '-',
    };
    this.personalizationData.officeDetails = {
      isExpand: false,
      isEdit: false,
      registeredOfficeLocationDetails: {
        registeredOfficeLocation: 'Kadwatha',
        address1: '272/25,',
        address2: 'Sudarshna Mawatha',
        address3: 'Malabe',
        contactNo: '9876543210',
        corporateBranch: '9990001HUB',
        emailId: 'abc@aps.com',
      },
      corporateOfficeLocationDetails: {
        corporateOfficeLocation: 'Kadwatha',
        address1: '272/25,',
        address2: 'Sudarshna Mawatha',
        address3: 'Malabe',
        contactNo: '9876543210',
        faxNo: '77665544',
        emailId: 'abc@aps.com',
      },
    };
    this.personalizationData.antiPhishingDetails = {
      isExpand: true,
      isEdit: false,
      image: 'phishing10.jpg',
      message: 'Welcome to CIB web-portal.',
    };
    this.personalizationData.securityQuestionsDetails = {
      isExpand: false,
      isEdit: false,
      questionAnswers: [
        { question: 'What is your pet’s name?', answer: 'Francesca', isView: false },
        { question: 'What is your first mobile number?', answer: '9876543210', isView: false },
        { question: 'What is your date of birth?', answer: '31AUG1982', isView: false },
      ],
    };
    this.personalizationData.defaultLanguageDetails = {
      isExpand: true,
      isEdit: false,
      defaultLanguage: 'English(US)',
    };
    this.personalizationData.loginPreferenceDetails = {
      isExpand: false,
      isEdit: false,
      country: 'India',
      bankType: 'Conventional',
      loginType: 'Individual',
      displayWelcomeCardAtLogin: true,
      displayLoginPreferencesAfterLogin: true,
    };
    this.personalizationData.widgetMappingDetails = {
      isExpand: false,
      isEdit: false,
      defaultLandingPage: 'Consolidated Dashboard',
      enableConsolidatedView: true,
      widgets: {
        FSCM: ['Top 3 Suppliers', 'Top 5 Dealers'],
        Payments: [],
        Collection: [],
        VAM: [],
        RMS: [],
      },
    };
    this.personalizationData.themeSelectionDetails = {
      isExpand: false,
      isEdit: false,
      isLightMode: true,
      theme: 'Teal',
    };
    this.personalizationData.alertsAndNotificationsDetails = {
      isExpand: true,
      isEdit: false,
      alertHeaders: [
        { headerName: 'Category', field: 'category' },
        { headerName: 'Event Name', field: 'eventName' },
        {
          headerName: 'Email SMS Online',
          field: 'alertType',
          headerClass: 'aps-word-spacing-5',
          cellRenderer: 'alertCheckboxRenderer',
          width: 270,
        },
        { headerName: 'Status', field: 'status', cellRenderer: 'alertStatusRenderer' },
        { headerName: 'Actions', field: 'actions', cellRenderer: 'actionCellRenderer' },
      ],
      productWiseAlertsDetails: {
        Payments: [
          {
            id: '01',
            category: 'Process',
            eventName: 'Modification of Parameter',
            alertType: ['Email', 'Online'],
            status: 'Enabled',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'disableAlert',
                paramList: 'id',
                displayName: 'Disable',
                type: 'ICON',
                icon: 'pi pi-times-circle',
              },
              {
                index: 1,
                methodName: 'suspendAlert',
                paramList: 'id',
                displayName: 'Suspend',
                type: 'ICON',
                icon: 'pi pi-minus-circle',
              },
            ],
          },
          {
            id: '02',
            category: 'Corporate',
            eventName: 'Disable Corporate User',
            alertType: [],
            status: 'Disabled',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'enableAlert',
                paramList: 'id',
                displayName: 'Enable',
                type: 'ICON',
                icon: 'pi pi-play',
              },
            ],
          },
          {
            id: '03',
            category: 'Corporate',
            eventName: 'Creation of Bank User',
            alertType: ['SMS', 'Online'],
            status: 'Suspended',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'enableAlert',
                paramList: 'id',
                displayName: 'Enable',
                type: 'ICON',
                icon: 'pi pi-play',
              },
            ],
          },
        ],
        FSCM: [
          {
            id: '04',
            category: 'Process',
            eventName: 'Modification of Parameter',
            alertType: ['Email', 'Online'],
            status: 'Enabled',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'disableAlert',
                paramList: 'id',
                displayName: 'Disable',
                type: 'ICON',
                icon: 'pi pi-times-circle',
              },
              {
                index: 1,
                methodName: 'suspendAlert',
                paramList: 'id',
                displayName: 'Suspend',
                type: 'ICON',
                icon: 'pi pi-minus-circle',
              },
            ],
          },
          {
            id: '05',
            category: 'Corporate',
            eventName: 'Disable Corporate User',
            alertType: [],
            status: 'Disabled',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'enableAlert',
                paramList: 'id',
                displayName: 'Enable',
                type: 'ICON',
                icon: 'pi pi-play',
              },
            ],
          },
          {
            id: '06',
            category: 'Corporate',
            eventName: 'Creation of Bank User',
            alertType: ['SMS', 'Online'],
            status: 'Suspended',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'enableAlert',
                paramList: 'id',
                displayName: 'Enable',
                type: 'ICON',
                icon: 'pi pi-play',
              },
            ],
          },
        ],
        Collection: [
          {
            id: '07',
            category: 'Process',
            eventName: 'Modification of Parameter',
            alertType: ['Email', 'Online'],
            status: 'Enabled',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'disableAlert',
                paramList: 'id',
                displayName: 'Disable',
                type: 'ICON',
                icon: 'pi pi-times-circle',
              },
              {
                index: 1,
                methodName: 'suspendAlert',
                paramList: 'id',
                displayName: 'Suspend',
                type: 'ICON',
                icon: 'pi pi-minus-circle',
              },
            ],
          },
          {
            id: '08',
            category: 'Corporate',
            eventName: 'Disable Corporate User',
            alertType: [],
            status: 'Disabled',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'enableAlert',
                paramList: 'id',
                displayName: 'Enable',
                type: 'ICON',
                icon: 'pi pi-play',
              },
            ],
          },
          {
            id: '09',
            category: 'Corporate',
            eventName: 'Creation of Bank User',
            alertType: ['SMS', 'Online'],
            status: 'Suspended',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'enableAlert',
                paramList: 'id',
                displayName: 'Enable',
                type: 'ICON',
                icon: 'pi pi-play',
              },
            ],
          },
        ],
        RMS: [
          {
            id: '10',
            category: 'Process',
            eventName: 'Modification of Parameter',
            alertType: ['Email', 'Online'],
            status: 'Enabled',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'disableAlert',
                paramList: 'id',
                displayName: 'Disable',
                type: 'ICON',
                icon: 'pi pi-times-circle',
              },
              {
                index: 1,
                methodName: 'suspendAlert',
                paramList: 'id',
                displayName: 'Suspend',
                type: 'ICON',
                icon: 'pi pi-minus-circle',
              },
            ],
          },
          {
            id: '11',
            category: 'Corporate',
            eventName: 'Disable Corporate User',
            alertType: [],
            status: 'Disabled',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'enableAlert',
                paramList: 'id',
                displayName: 'Enable',
                type: 'ICON',
                icon: 'pi pi-play',
              },
            ],
          },
          {
            id: '12',
            category: 'Corporate',
            eventName: 'Creation of Bank User',
            alertType: ['SMS', 'Online'],
            status: 'Suspended',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'enableAlert',
                paramList: 'id',
                displayName: 'Enable',
                type: 'ICON',
                icon: 'pi pi-play',
              },
            ],
          },
        ],
        Trade: [
          {
            id: '13',
            category: 'Process',
            eventName: 'Modification of Parameter',
            alertType: ['Email', 'Online'],
            status: 'Enabled',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'disableAlert',
                paramList: 'id',
                displayName: 'Disable',
                type: 'ICON',
                icon: 'pi pi-times-circle',
              },
              {
                index: 1,
                methodName: 'suspendAlert',
                paramList: 'id',
                displayName: 'Suspend',
                type: 'ICON',
                icon: 'pi pi-minus-circle',
              },
            ],
          },
          {
            id: '14',
            category: 'Corporate',
            eventName: 'Disable Corporate User',
            alertType: [],
            status: 'Disabled',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'enableAlert',
                paramList: 'id',
                displayName: 'Enable',
                type: 'ICON',
                icon: 'pi pi-play',
              },
            ],
          },
          {
            id: '15',
            category: 'Corporate',
            eventName: 'Creation of Bank User',
            alertType: ['SMS', 'Online'],
            status: 'Suspended',
            actions: [
              {
                index: 1,
                methodName: 'viewAlert',
                paramList: 'id',
                displayName: 'View',
                type: 'ICON',
                icon: 'pi pi-eye',
              },
              {
                index: 1,
                methodName: 'enableAlert',
                paramList: 'id',
                displayName: 'Enable',
                type: 'ICON',
                icon: 'pi pi-play',
              },
            ],
          },
        ],
        VAM: [],
      },
    };
    this.personalizationData.makerCheckerLimitDetails = {
      isExpand: true,
      isEdit: false,
      headers: [
        {
          headerName: 'Maker Limit',
          children: [
            { headerName: 'Alotted Limit', field: 'makerAlottedLimit' },
            { headerName: 'Available Limit', field: 'makerAvailableLimit' },
          ],
        },
        {
          headerName: 'Checker Limit',
          children: [
            { headerName: 'Alotted Limit', field: 'checkerAlottedLimit' },
            { headerName: 'Available Limit', field: 'checkerAvailableLimit' },
          ],
        },
      ],
      data: [
        {
          id: '01',
          product: ['FSCM'],
          makerAlottedLimit: 'MYR 100,000',
          makerAvailableLimit: 'MYR 20,000',
          checkerAlottedLimit: 'MYR 100,000',
          checkerAvailableLimit: 'MYR 20,000',
        },
        {
          id: '02',
          product: ['Payments'],
          makerAlottedLimit: '',
          makerAvailableLimit: '',
          checkerAlottedLimit: '',
          checkerAvailableLimit: '',
        },
        {
          id: '03',
          product: ['Payments', 'Salary'],
          makerAlottedLimit: 'MYR 100,000',
          makerAvailableLimit: 'MYR 20,000',
          checkerAlottedLimit: 'MYR 100,000',
          checkerAvailableLimit: 'MYR 20,000',
        },
        {
          id: '04',
          product: ['Payments', 'Trade'],
          makerAlottedLimit: 'MYR 200,000',
          makerAvailableLimit: 'MYR 10,000',
          checkerAlottedLimit: 'MYR 200,000',
          checkerAvailableLimit: 'MYR 10,000',
        },
        {
          id: '05',
          product: ['Collection'],
          makerAlottedLimit: 'MYR 100,000',
          makerAvailableLimit: 'MYR 20,000',
          checkerAlottedLimit: 'MYR 100,000',
          checkerAvailableLimit: 'MYR 20,000',
        },
        {
          id: '06',
          product: ['Trade'],
          makerAlottedLimit: 'MYR 100,000',
          makerAvailableLimit: 'MYR 20,000',
          checkerAlottedLimit: 'MYR 100,000',
          checkerAvailableLimit: 'MYR 20,000',
        },
        {
          id: '07',
          product: ['Loan'],
          makerAlottedLimit: 'MYR 100,000',
          makerAvailableLimit: 'MYR 20,000',
          checkerAlottedLimit: 'MYR 100,000',
          checkerAvailableLimit: 'MYR 20,000',
        },
        {
          id: '08',
          product: ['FX Connect'],
          makerAlottedLimit: 'MYR 100,000',
          makerAvailableLimit: 'MYR 20,000',
          checkerAlottedLimit: 'MYR 100,000',
          checkerAvailableLimit: 'MYR 20,000',
        },
        {
          id: '09',
          product: ['Direct Debit'],
          makerAlottedLimit: 'MYR 100,000',
          makerAvailableLimit: 'MYR 20,000',
          checkerAlottedLimit: 'MYR 100,000',
          checkerAvailableLimit: 'MYR 20,000',
        },
        {
          id: '10',
          product: ['Statutory Payments'],
          makerAlottedLimit: 'MYR 100,000',
          makerAvailableLimit: 'MYR 20,000',
          checkerAlottedLimit: 'MYR 100,000',
          checkerAvailableLimit: 'MYR 20,000',
        },
      ],
    };
    this.personalizationData.authMatrixInfoDetails = {
      isExpand: true,
      isEdit: false,
      headers: [
        { headerName: 'Product/Sub-Product', field: 'product' },
        {
          headerName: 'Accounts',
          field: 'accounts',
          cellRenderer: 'authMatrixAccountsRenderer',
          width: 250,
        },
        { headerName: 'Authorisation Type', field: 'authType' },
        { headerName: 'Slab', field: 'slab', width: 280 },
        {
          headerName: 'Additional Information',
          field: 'additionalInfo',
          cellRenderer: 'authMatrixAdditionalInfoRenderer',
        },
      ],
      productWiseAuthMatrixDetails: {
        Payments: [
          {
            id: '01',
            product: 'Salary',
            accounts: [
              '10002000123110-MYR',
              '10002000123111-MYR',
              '10002000123112-MYR',
              '10002000123114-MYR',
              '10002000123115-MYR',
              '10002000123116-MYR',
              '10002000123117-MYR',
              '10002000123118-MYR',
              '10002000123113-MYR',
            ],
            slab: '>200,000.00',
            authType: 'Transaction Wise',
            additionalInfo:
              'You are the 2 level authorizer. 1 more authorizer is required at your level.',
          },
          {
            id: '02',
            product: 'Vendor',
            accounts: [
              '10002000124110-MYR',
              '10002000124111-MYR',
              '10002000124112-MYR',
              '10002000124114-MYR',
              '10002000124115-MYR',
            ],
            slab: '100,000.00 - 10,000,000.00',
            authType: 'Transaction Wise',
            additionalInfo:
              'You are the 2 level authorizer. 1 more authorizer is required at your level.',
          },
        ],
        FSCM: [],
        Collection: [],
        RMS: [],
        Trade: [],
        VAM: [],
      },
    };
    this.personalizationData.accountWiseAccessInfoDetails = {
      isExpand: true,
      isEdit: false,
      productWiseHeaders: [
        { headerName: 'Accounts', field: 'accounts' },
        { headerName: 'Profile (Rights)', field: 'rights' },
      ],
      productWiseAccountAccessDetails: {
        Payments: [
          {
            id: '01',
            subProduct: ['Salary Payment'],
            accounts: '10002000123110-MYR',
            rights: 'Maker',
          },
          {
            id: '02',
            subProduct: ['Vendor Payment'],
            accounts: '4 Accounts',
            rights: 'Maker,Checker',
          },
          {
            id: '03',
            subProduct: ['Vendor Payment', '-'],
            accounts: '10002000123110-MYR',
            rights: 'Maker',
          },
          {
            id: '04',
            subProduct: ['Vendor Payment', ' -'],
            accounts: '10002000123112-MYR',
            rights: 'Maker',
          },
          {
            id: '05',
            subProduct: ['Vendor Payment', '- '],
            accounts: '10002000123113-MYR',
            rights: 'Maker,Checker',
          },
          {
            id: '06',
            subProduct: ['Vendor Payment', ' - '],
            accounts: '10002000123114-MYR',
            rights: 'Checker',
          },
          {
            id: '07',
            subProduct: ['Bill Payment'],
            accounts: '2 Accounts',
            rights: 'Maker,Checker',
          },
          {
            id: '08',
            subProduct: ['Bill Payment', '-'],
            accounts: '10002000123110-MYR',
            rights: 'Maker',
          },
          {
            id: '09',
            subProduct: ['Bill Payment', '- '],
            accounts: '10002000123116-MYR',
            rights: 'Maker',
          },
        ],
        FSCM: [],
        Collection: [
          {
            id: '10',
            subProduct: ['Cheque Collection'],
            accounts: '10002000122110-MYR',
            rights: 'Maker',
          },
        ],
        RMS: [],
        Trade: [
          {
            id: '11',
            subProduct: ['Letter of Credit'],
            accounts: '10002000123110-MYR',
            rights: 'Maker',
          },
        ],
        VAM: [
          {
            id: '12',
            subProduct: ['E-Collection'],
            accounts: '10002000123113-MYR',
            rights: 'Maker,Checker',
          },
        ],
      },
      accountWiseHeaders: [
        { headerName: 'Sub-Product / Module', field: 'subProduct' },
        { headerName: 'Profile (Rights)', field: 'rights' },
      ],
      accountWiseAccountAccessDetails: {
        '10002000123110-MYR': [
          { id: '01', product: ['Collection'], subProduct: '', rights: 'Maker' },
          {
            id: '02',
            product: ['Account Services'],
            subProduct: '2 Products',
            rights: 'Maker,Checker',
          },
          {
            id: '03',
            product: ['Account Services', '-'],
            subProduct: 'Account Balance',
            rights: 'Maker',
          },
          {
            id: '04',
            product: ['Account Services', '- '],
            subProduct: 'Account Statement',
            rights: 'Checker',
          },
          { id: '05', product: ['Payments'], subProduct: '2 Products', rights: 'Maker,Checker' },
          { id: '06', product: ['Payments', '-'], subProduct: 'Salary', rights: 'Checker' },
          { id: '07', product: ['Payments', '- '], subProduct: 'Single Payment', rights: 'Maker' },
          { id: '09', product: ['Trade'], subProduct: 'Letter Of Credit', rights: 'Maker' },
          {
            id: '10',
            product: ['VAM (COBO)'],
            subProduct: 'E-Collection',
            rights: 'Maker,Checker',
          },
        ],
        '10002000122110-MYR': [
          { id: '11', product: ['Collection'], subProduct: 'Cheque Collection', rights: 'Maker' },
          {
            id: '02',
            product: ['Account Services'],
            subProduct: '2 Products',
            rights: 'Maker,Checker',
          },
          {
            id: '03',
            product: ['Account Services', '-'],
            subProduct: 'Account Balance',
            rights: 'Maker',
          },
          {
            id: '04',
            product: ['Account Services', '- '],
            subProduct: 'Account Statement',
            rights: 'Checker',
          },
        ],
        '10002000123112-MYR': [
          { id: '11', product: ['Collection'], subProduct: 'Cheque Collection', rights: 'Maker' },
          { id: '05', product: ['Payments'], subProduct: '2 Products', rights: 'Maker,Checker' },
          { id: '06', product: ['Payments', '-'], subProduct: 'Salary', rights: 'Checker' },
          { id: '07', product: ['Payments', '- '], subProduct: 'Single Payment', rights: 'Maker' },
        ],
        '10002000123113-MYR': [
          { id: '11', product: ['Collection'], subProduct: 'Cheque Collection', rights: 'Maker' },
          { id: '09', product: ['Trade'], subProduct: 'Letter Of Credit', rights: 'Maker' },
          {
            id: '10',
            product: ['VAM (COBO)'],
            subProduct: 'E-Collection',
            rights: 'Maker,Checker',
          },
        ],
        '10002000123114-MYR': [
          { id: '11', product: ['Collection'], subProduct: 'Cheque Collection', rights: 'Maker' },
          { id: '05', product: ['Payments'], subProduct: '2 Products', rights: 'Maker,Checker' },
          { id: '06', product: ['Payments', '-'], subProduct: 'Salary', rights: 'Checker' },
          { id: '07', product: ['Payments', '- '], subProduct: 'Single Payment', rights: 'Maker' },
        ],
        '10002000123116-MYR': [
          { id: '11', product: ['Collection'], subProduct: 'Cheque Collection', rights: 'Maker' },
          { id: '05', product: ['Payments'], subProduct: '2 Products', rights: 'Maker,Checker' },
          { id: '06', product: ['Payments', '-'], subProduct: 'Salary', rights: 'Checker' },
          { id: '07', product: ['Payments', '- '], subProduct: 'Single Payment', rights: 'Maker' },
        ],
      },
    };
    this.accountToggleList = [];
    Object.keys(
      this.personalizationData.accountWiseAccessInfoDetails.accountWiseAccountAccessDetails,
    ).forEach((accountNumber: string) => {
      this.accountToggleList.push({ isExpand: false, no: accountNumber });
    });
    this.personalizationEditData = _.cloneDeep(this.personalizationData);
  }

  getOverallProgress(): number {
    //calculate progress
    return 95;
  }

  updateProfilePic(files: any[]): void {
    if (files && files.length > 0) {
      //upload file to server and get Url
      //this.personalizationData.userDetail.profilePicUrl = "";
    }
  }

  onTabClick(i: number): void {
    if (this.tabDetails[i].isActive) return;
    this.tabDetails.forEach((tab: PersonalizationTab) => {
      tab.isActive = false;
    });
    this.tabDetails[i].dataObjs.forEach((obj: string) => {
      this.personalizationData[obj].isExpand = false;
      this.personalizationData[obj].isEdit = false;
    });
    this.productToggleList.forEach((product: ProductToggle) => {
      product.isExpand = false;
    });
    this.personalizationData[this.tabDetails[i].dataObjs[0]].isExpand = true;
    this.selectedTab = this.tabDetails[i].name;
    this.selectedTabIndex = i;
    this.tabDetails[i].isActive = true;
  }

  onOpenCloseClick(currentObj: string): void {
    this.tabDetails[this.selectedTabIndex].dataObjs.forEach((obj: string) => {
      if (obj != currentObj) {
        this.personalizationData[obj].isExpand = false;
        this.personalizationData[obj].isEdit = false;
      }
    });
    this.personalizationData[currentObj].isExpand = !this.personalizationData[currentObj].isExpand;
  }

  onEditClick(): void {
    this.personalizationEditData = _.cloneDeep(this.personalizationData);
  }

  onSaveClick(): void {
    this.personalizationData = _.cloneDeep(this.personalizationEditData);
  }

  onMessageSelection(): void {
    this.isLoaded = false;
    this.personalizationEditData.antiPhishingDetails.message = this.tempMessage;
    setTimeout(() => {
      this.tempMessage = null;
      this.isLoaded = true;
    }, 10);
  }

  getTotalSelectedWidgets(): number {
    const widgets = this.personalizationData.widgetMappingDetails.isEdit
      ? this.personalizationEditData.widgetMappingDetails.widgets
      : this.personalizationData.widgetMappingDetails.widgets;
    return (
      widgets.FSCM.length +
      widgets.Collection.length +
      widgets.RMS.length +
      widgets.Payments.length +
      widgets.VAM.length
    );
  }

  showHideWidgetDetails(name: string): void {
    this.productWidgets.forEach((productWidget: ProductWidgets) => {
      if (productWidget.name == name) productWidget.isExpand = !productWidget.isExpand;
      else productWidget.isExpand = false;
    });
  }

  showHideProductDetails(name: string): void {
    this.productToggleList.forEach((alert: ProductToggle) => {
      if (alert.name == name) alert.isExpand = !alert.isExpand;
      else alert.isExpand = false;
    });
  }

  getTotalAlerts(): number {
    const alerts = this.personalizationData.alertsAndNotificationsDetails.isEdit
      ? this.personalizationEditData.alertsAndNotificationsDetails.productWiseAlertsDetails
      : this.personalizationData.alertsAndNotificationsDetails.productWiseAlertsDetails;
    return (
      alerts.FSCM.length +
      alerts.Collection.length +
      alerts.RMS.length +
      alerts.Payments.length +
      alerts.VAM.length +
      alerts.Trade.length
    );
  }

  getAlertStatusCountByProduct(product: string, status: string): number {
    const productAlerts = this.personalizationData.alertsAndNotificationsDetails.isEdit
      ? this.personalizationEditData.alertsAndNotificationsDetails.productWiseAlertsDetails[product]
      : this.personalizationData.alertsAndNotificationsDetails.productWiseAlertsDetails[product];
    const statusAlerts = _.filter(productAlerts, function (a: Alert) {
      return a.status == status;
    });
    return statusAlerts.length;
  }

  suspendAllAlertsByProduct(product: string, isPreventRefresh?: boolean): void {
    this.personalizationEditData.alertsAndNotificationsDetails.productWiseAlertsDetails[
      product
    ].forEach((alert: Alert) => {
      alert.status = 'Suspended';
    });
    if (!isPreventRefresh) this.alertGrid.refreshGridList();
  }

  suspendAll(): void {
    this.productToggleList.forEach((alert: ProductToggle) => {
      this.suspendAllAlertsByProduct(alert.name, !alert.isExpand);
    });
  }

  getAlertSelectedProduct(): string {
    let product = null;
    this.productToggleList.forEach((alert: ProductToggle) => {
      if (alert.isExpand) product = alert.name;
    });
    return product;
  }

  updateAlert(id: string, alertType: string[]): void {
    let product = this.getAlertSelectedProduct();
    this.personalizationEditData.alertsAndNotificationsDetails.productWiseAlertsDetails[
      product
    ].forEach((alert: Alert) => {
      if (alert.id == id) {
        alert.alertType = alertType;
      }
    });
  }

  viewAlert(id: string): void {}

  enableAlert(id: string): void {
    let product = this.getAlertSelectedProduct();
    this.personalizationEditData.alertsAndNotificationsDetails.productWiseAlertsDetails[
      product
    ].forEach((alert: Alert) => {
      if (alert.id == id) {
        alert.status = 'Enabled';
        alert.actions = [
          {
            index: 1,
            methodName: 'viewAlert',
            paramList: 'id',
            displayName: 'View',
            type: 'ICON',
            icon: 'pi pi-eye',
          },
          {
            index: 1,
            methodName: 'disableAlert',
            paramList: 'id',
            displayName: 'Disable',
            type: 'ICON',
            icon: 'pi pi-times-circle',
          },
          {
            index: 1,
            methodName: 'suspendAlert',
            paramList: 'id',
            displayName: 'Suspend',
            type: 'ICON',
            icon: 'pi pi-minus-circle',
          },
        ];
      }
    });
    this.alertGrid.refreshGridList();
  }

  disableAlert(id: string): void {
    let product = this.getAlertSelectedProduct();
    this.personalizationEditData.alertsAndNotificationsDetails.productWiseAlertsDetails[
      product
    ].forEach((alert: Alert) => {
      if (alert.id == id) {
        alert.status = 'Disabled';
        alert.actions = [
          {
            index: 1,
            methodName: 'viewAlert',
            paramList: 'id',
            displayName: 'View',
            type: 'ICON',
            icon: 'pi pi-eye',
          },
          {
            index: 1,
            methodName: 'enableAlert',
            paramList: 'id',
            displayName: 'Enable',
            type: 'ICON',
            icon: 'pi pi-play',
          },
        ];
      }
    });
    this.alertGrid.refreshGridList();
  }

  suspendAlert(id: string): void {
    let product = this.getAlertSelectedProduct();
    this.personalizationEditData.alertsAndNotificationsDetails.productWiseAlertsDetails[
      product
    ].forEach((alert: Alert) => {
      if (alert.id == id) {
        alert.status = 'Suspended';
        alert.actions = [
          {
            index: 1,
            methodName: 'viewAlert',
            paramList: 'id',
            displayName: 'View',
            type: 'ICON',
            icon: 'pi pi-eye',
          },
          {
            index: 1,
            methodName: 'enableAlert',
            paramList: 'id',
            displayName: 'Enable',
            type: 'ICON',
            icon: 'pi pi-play',
          },
        ];
      }
    });
    this.alertGrid.refreshGridList();
  }

  showAuthMatrixAdditionalInfo(top: number, left: number, info: string): void {
    this.authMatrixAdditionalInfo = info;
    this.authMatrixModalStyles = {
      position: 'absolute',
      top: top + 'px',
      left: left + 'px',
      width: 'auto',
      'z-index': '1',
      padding: '0.5rem',
    };
    this.isShowAuthMatrixAccounts = false;
    this.isShowAuthMatrixAdditionalInfo = true;
  }

  showAuthMatrixAccounts(top: number, left: number, transform: string, accounts: string[]): void {
    this.authMatrixAccounts = accounts;
    this.authMatrixModalStyles = {
      position: 'absolute',
      top: top + 'px',
      left: left + 'px',
      transform: transform,
      width: 'auto',
      'z-index': '1',
      padding: '0.5rem',
    };
    this.isShowAuthMatrixAdditionalInfo = false;
    this.isShowAuthMatrixAccounts = true;
  }

  showHideAccountDetails(no: string): void {
    this.accountToggleList.forEach((account: AccountToggle) => {
      if (account.no == no) account.isExpand = !account.isExpand;
      else account.isExpand = false;
    });
  }
}
