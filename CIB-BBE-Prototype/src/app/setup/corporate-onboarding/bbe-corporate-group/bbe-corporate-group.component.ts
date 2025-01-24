import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BBECorporateGroup, TransactionDetails, AuthorizationRule } from './@models/bbe-corporate-group.model';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-bbe-corporate-group',
  templateUrl: './bbe-corporate-group.component.html',
  styleUrls: ['./bbe-corporate-group.component.scss']
})
export class BbeCorporateGroupComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;
  @ViewChild('currencySellInit') currencySellInit!: AgGridListingComponent;
  @ViewChild('AuthorizationRuleInit') AuthorizationRuleInit!: AgGridListingComponent;
  @ViewChild('currencySellReview') currencySellReview!: AgGridListingComponent;
  @ViewChild('AuthorizationRuleReview') AuthorizationRuleReview!: AgGridListingComponent;
  @ViewChild('serviceDetailslisting') serviceDetailslisting!: AgGridListingComponent;

  formData: BBECorporateGroup = new BBECorporateGroup();
  transactionFormData: TransactionDetails = new TransactionDetails();
  authorizationRuleData: AuthorizationRule = new AuthorizationRule();

  mode: string;
  subModuleNameList = []
  isViewPassword: boolean = false;
  editIndex: number = -1;
  editauthRuleIndex: number = -1;
  transactionInitGridAPI: any;
  authRuleInitGridAPI: any;
  transactionReviewGridAPI: any;
  authRuleReviewGridGridAPI: any;
  isShowCorporateSearch: boolean;
  corporateSearchColDefUrl: string = 'commons/searchService/private/corporateSearchColDefs';
  corporateSearchRowDefUrl: string =
    'setup/corporateOnboarding/corporateMain/private/getAuthorizedList';

  stepperDetails: Stepper = {
    masterName: 'Corporate Group',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private httpService: HttpService,
    private userService: UserService,
    private viewService: ViewService,
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Corporate Group',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Corporate Onboarding' },
      { label: 'Corporate Group' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();

    this.serviceDetailsSelectedListing = this.serviceDetailsListingTypes[0];
    this.paymentDetailsSelectedListing = this.paymentDetailsListingTypes[0];
  }


  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/corporateOnboarding/corporateGroup/private/view', data)
        .subscribe((formData: BBECorporateGroup) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.onCorporateSelected({
            id: this.transactionFormData.corporateId,
            corporateCode: this.transactionFormData.corporateCode,
            corporateName: this.transactionFormData.corporateName,
          });
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.bankProfileForm) {
      return true
    }
    return true;
  }

  currencySellGridOptions: any = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    pagination: false,
  };

  authRuleGridOptions: any = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    pagination: false,
  };

  onCurrencySellInitGridReady(api: any): void {
    this.transactionInitGridAPI = api;
    this.transactionInitGridAPI.setRowData(this.formData.transaction);
  }

  onAuthRuleInitGridReady(api: any): void {
    this.authRuleInitGridAPI = api;
    this.authRuleInitGridAPI.setRowData(this.formData.authRule);
  }

  onCurrencySellReviewGridReady(api: any): void {
    this.transactionReviewGridAPI = api;
    this.transactionReviewGridAPI.setRowData(this.formData.transaction);
  }

  onAuthRuleReviewGridReady(api: any): void {
    this.transactionReviewGridAPI = api;
    this.authRuleReviewGridGridAPI.setRowData(this.formData.authRule);
  }

  addDocumentGridActions(transaction: TransactionDetails): TransactionDetails {
    const viewAction = {
      index: 1,
      displayName: 'View',
      type: 'ICON',
      icon: 'fa-eye',
      methodName: 'onViewTransaction',
      paramList: 'id',
    };
    const editAction = {
      index: 2,
      displayName: 'Edit',
      type: 'ICON',
      icon: 'fa-pencil',
      methodName: 'onEditTransaction',
      paramList: 'id',
    };
    const deleteAction = {
      index: 3,
      color: 'warn',
      displayName: 'Delete',
      type: 'ICON',
      icon: 'fa-trash-alt',
      methodName: 'onDeleteTransaction',
      paramList: 'id',
    };
    transaction.initActions = [
      // viewAction, 
      // editAction,
      deleteAction];
    transaction.reviewActions = [
      // viewAction
    ];
    return transaction;
  }

  addGridActions(authRule: AuthorizationRule): AuthorizationRule {
    const viewAction = {
      index: 1,
      displayName: 'View',
      type: 'ICON',
      icon: 'fa-eye',
      methodName: 'onViewTransaction',
      paramList: 'id',
    };
    const editAction = {
      index: 2,
      displayName: 'Edit',
      type: 'ICON',
      icon: 'fa-pencil',
      methodName: 'onEditAuthRule',
      paramList: 'id',
    };
    const deleteAction = {
      index: 3,
      color: 'warn',
      displayName: 'Delete',
      type: 'ICON',
      icon: 'fa-trash-alt',
      methodName: 'onDeleteAuthRule',
      paramList: 'id',
    };
    authRule.initActions = [
      // viewAction, 
      editAction,
      deleteAction];
    authRule.reviewActions = [
      // viewAction
    ];
    return authRule;
  }

  onAddTransactionClick() {
    this.transactionFormData = this.addDocumentGridActions(this.transactionFormData)
    this.formData.transaction.push({ ...this.transactionFormData });
    this.currencySellInit.setRowData(this.formData.transaction);
    this.currencySellReview?.setRowData(this.formData.transaction);
    this.transactionFormData = new TransactionDetails();
  }

  onAddAuthRuleClick() {
    this.authorizationRuleData = this.addGridActions(this.authorizationRuleData)
    this.formData.authRule.push({ ...this.authorizationRuleData });
    this.AuthorizationRuleInit.setRowData(this.formData.authRule);
    this.AuthorizationRuleReview?.setRowData(this.formData.authRule);
    this.authorizationRuleData = new AuthorizationRule();
  }

  onUpdateTransaction() {
    if (this.editIndex > -1) {
      this.formData.transaction[this.editIndex] = {
        ...this.formData.transaction[this.editIndex],
        ...cloneDeep(this.transactionFormData),
      };
      if (this.currencySellInit) {
        this.currencySellInit.setRowData(this.formData.transaction);
      }
      if (this.currencySellReview) {
        this.currencySellReview.setRowData(this.formData.transaction);
      }
      this.transactionFormData = new TransactionDetails();
      this.editIndex = -1;
    }
  }

  onUpdateAuthRule() {
    if (this.editauthRuleIndex > -1) {
      this.formData.authRule[this.editauthRuleIndex] = {
        ...this.formData.authRule[this.editauthRuleIndex],
        ...cloneDeep(this.authorizationRuleData),
      };
      if (this.AuthorizationRuleInit) {
        this.AuthorizationRuleInit.setRowData(this.formData.authRule);
      }
      if (this.AuthorizationRuleReview) {
        this.AuthorizationRuleReview.setRowData(this.formData.authRule);
      }
      this.authorizationRuleData = new AuthorizationRule();
      this.editauthRuleIndex = -1;
    }
  }

  onDeleteTransaction(value: any): void {
    const index: number = this.formData.transaction.findIndex((transaction: TransactionDetails) => transaction.id == value);
    if (index >= 0) {
      this.formData.transaction.splice(index, 1);
      this.transactionInitGridAPI.setRowData(this.formData.transaction);
      this.transactionReviewGridAPI.setRowData(this.formData.transaction);
    }
  }

  onDeleteAuthRule(value: any): void {
    const index: number = this.formData.authRule.findIndex((authRule: AuthorizationRule) => authRule.id == value);
    if (index >= 0) {
      this.formData.authRule.splice(index, 1);
      this.authRuleInitGridAPI.setRowData(this.formData.authRule);
      this.authRuleReviewGridGridAPI.setRowData(this.formData.authRule);
    }
  }

  onEditAuthRule(value: any): void {
    const index: number = this.formData.authRule.findIndex((authRule: AuthorizationRule) => authRule.id == value);
    if (index > -1) {
      const formData = cloneDeep(this.formData.authRule[index]);
      delete formData.id
      this.authorizationRuleData = formData;
      this.editauthRuleIndex = index;
    }
  }

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    // this.transactionFormData.corporateId = corporate.id.toString();
    this.transactionFormData.corporateCode = corporate.corporateCode.toString();
    this.transactionFormData.corporateName = corporate.corporateName;
  }

  verifierRuleList = [
    { id: 'Verification Matrix', displayName: 'Verification Matrix' },
    { id: 'Maker Verifier', displayName: 'Maker Verifier' },
    { id: 'None', displayName: 'None' }
  ]

  serviceDetailsSelectedListing!: any;
  paymentDetailsSelectedListing!: any;
  serviceDetailslistingType = 'grid';
  paymentDetailslistingType = 'grid';
  serviceDetailsCurrentInitiatePage: number = 1;
  paymentDetailsCurrentInitiatePage: number = 1;
  showServiceDetailsInititateAnalytics: boolean = false;
  showPaymentDetailsInititateAnalytics: boolean = false;

  serviceDetailsSelectededListing(list: any) {
    this.serviceDetailsSelectedListing = list
    this.onServiceDetailsListingTypeChange(this.serviceDetailslistingType)
  }

  paymentDetailsSelectededListing(list: any) {
    this.paymentDetailsSelectedListing = list
    this.onPaymentDetailsListingTypeChange(this.paymentDetailslistingType)
  }

  onServiceDetailsListingTypeChange(serviceDetailslistingType: string) {
    this.serviceDetailslistingType = serviceDetailslistingType;
    this.serviceDetailsCurrentInitiatePage = 1;
    this.showServiceDetailsInititateAnalytics = false;
    if (this.serviceDetailslisting) {
      this.serviceDetailslisting.refreshGridList();
    }
  }

  onPaymentDetailsListingTypeChange(paymentDetailslistingType: string) {
    this.paymentDetailslistingType = paymentDetailslistingType;
    this.paymentDetailsCurrentInitiatePage = 1;
    this.showPaymentDetailsInititateAnalytics = false;
    if (this.paymentDetailsListingTypes) {
      this.paymentDetailsListingTypes.refreshGridList();
    }
  }

  serviceDetailsListingTypes: any = [
    { label: "Setup", id: 1, checkbox: false, count: 1 },
    { label: "FSCM", id: 2, checkbox: false, count: 2 },
    { label: "Payments", id: 3, checkbox: false, count: 3 },
    { label: "Collections", id: 4, checkbox: false, count: 1 },
    { label: "LMS", id: 5, checkbox: false, count: 1 },
    { label: "Virtual Account", id: 6, checkbox: false, count: 1 },
    { label: "Trade", id: 7, checkbox: false, count: 1 },
    { label: "Receivable", id: 8, checkbox: false, count: 1 },
    { label: "Cashflow", id: 9, checkbox: false, count: 1 },
    { label: "Positive Pay", id: 10, checkbox: false, count: 1 }
  ];

  paymentDetailsListingTypes: any = [
    { label: "IFT", id: 1, checkbox: false, count: 1 },
    { label: "NEFT", id: 2, checkbox: false, count: 2 },
    { label: "RTGS", id: 3, checkbox: false, count: 3 }
  ];

  setupCheckbox = false
  showFscmViewModal = false;
  showFscmEditModal = false;
  showPaymentsViewModal = false;
  showPaymentsEyeViewModal = false;
  showPaymentsEditModal = false;
  fscmProgramRefNo = ''
  fscmProgramName = ''
  fscmSellerFinanceProgramRefNo = ''
  fscmSellerFinanceProgramName = ''
  fscmBuyerFinanceProgramRefNo = ''
  fscmBuyerFinanceProgramName = ''
  setupNormalChargeCat = [
    { id: 'Setup Monthly', displayName: 'Setup Monthly' },
    { id: 'New Charge', displayName: 'New Charge' },
    { id: 'Setup Charge', displayName: 'Setup Charge' }
  ]

  setupPromotionalChargeCat = [
    { id: 'Promotional Setup', displayName: 'Promotional Setup' }
  ]

  setupChargeAccount = [
    { id: 1, displayName: "101010009388540" },
    { id: 2, displayName: "101010009436777" },
    { id: 3, displayName: "101010009388234" }
  ]



  fscm = {
    servicePackageCode: 'EIPPALLON',
    servicePackageName: 'EIPPALLON',
    moduleName: 'FSCM',
    product: 'EIPP',
    customerCategory: 'GOLD',
    fileUploadBy: 'Seller',
    uploadFor: 'Consolidated Upload',
    dataLayout: 'SCG01',
    partialUpload: 'Yes',
    h2hPrefix: 'New',
    h2hAuthReq: 'No',
    enrichment: 'EnrichTemp1',
    workflowTemplate: 'WorkFlow1',
    normalChargeCategory: 'ChargeType1',
    promotionalChargeCategory: 'ChargeType1',
    invoicePayment: 'Manual',
    partialPayment: 'On',
    outOffSysAllowed: 'Off',
    dummyInvoiceAllowed: 'On',
    oberdueInvoiceAccepted: 'On',
    maximumOverdueDays: '20',
    overdueInvoicesPaymentAllowed: 'Yes',
    maximumOverduePaymentDays: '5',
    cnDnDateValidation: 'On',
    cnDnInvoiceValidation: 'On',
    vatWhtCalculation: 'On',
    ifHoliday: 'Postpone',
    futureDatedPayment: 'On',
    futureHold: 'On',
    trackingId: 'On',
    multipleTrackingPerFile: '',
    dynamicDiscountApplicable: 'On',
    dynamicDiscountTemplate: 'DynamicTemp1',
    incEntryCutOffTime: '09:00',
    incPaymentCutOffTime: '23:55',
    financePaymentMode: 'Internal fund Transfer',
    sponsorCasaAcc: '101010009388539',
    sponsroInterestAccount: '101010009388539',
    invoice: 'INV1200',
    purchaseOrder: 'PO5212',
    creditNote: 'CD150',
    debitNote: 'DB120',
    normalInvoice: 'Blue',
    invoiceOnDueDate: 'Green',
    invoiceAfterDueDate: 'Yellow',
    invoiceDaysBeforDueDate: 'Orange',
    programRefNo: '12',
    programName: '12',
    currency: '-',
    serviceTemplateCode: 'ELECTPAYMETHOD',
    serviceTemplateName: 'ELECTICPAYMENTMETHOD',
    paymentModuleName: 'Payments',
    paymentProduct: 'Salary',
    paymentCustomerCategory: 'Gold',
    templateFor: 'Both',
    checkDupCrnNo: 'Yes',
    accountPosting: 'Transaction',
    enrichmentReq: 'Yes',
    paymentEnrichment: 'PRODDETAILS-PRODUCT DETAILS',
    chargeApplicable: 'Yes',
    chargeType: 'File Based Charge',
    normalChargeGroup: 'TOVCHARGESN',
    promotionalChargeGroup: '-',
    allowRuntimeBene: "Yes",
    beneAutoAuth: "Yes",
    beneLibraryUpdate: "No",
    forceDebit: 'Yes',
    aliasName: 'Internal Fund Transfer',
    printCoverNote: 'CNT',
    emailCoverNote: '-',
    smsCoverNote: '-',
    useSendToBank: 'Yes',
    cutOffTime: '13:00',
    currencyLimit: 'INR : INDIAN RUPEE',
    limit: '5000000',
    aliasNameNeft: 'NEFT',
    cutOffTimeNeft: '15:00',
    aliasNameRtgs: 'RTGS',
    cutOffTimeRtgs: '22:00',
    maskingRequired: 'Yes',
    paymentUploadFor: 'Payment Request',
    paymentDataLayout: 'PAYMENTREQXLST',
    account: '-',
    chargeAccount: '-',
  }

  subDocs = [
    { name: 'Invoice', aliasName: 'IN', checkbox: true },
    { name: 'Purchase Order', aliasName: 'PO', checkbox: true },
    { name: 'Credit Note', aliasName: 'CN', checkbox: true },
    { name: 'Debit Note', aliasName: 'DN', checkbox: true }
  ]

  isShowLiabilityName = false;
  onValidate() {
    this.isShowLiabilityName = true
  }

  // paymentChargeCat = [
  //   { id: 'PROCESSINGEOD', displayName: 'PROCESSINGEOD' },
  //   { id: 'PAYMENTCHARGES', displayName: 'PAYMENTCHARGES' },
  //   { id: 'MONTHLY', displayName: 'MONTHLY' },
  // ]

  paymentChargeCat = [
    { id: 1, displayName: "PROCESSING PROMOTIONAL IMMEDIATE" },
    { id: 2, displayName: "PROCESSING NORMAL IMMEDIATE" },
    { id: 3, displayName: "MONTHLY" },
    { id: 4, displayName: "PROCESSINGEOD" }

  ];

  // paymentPromotionalChargeCat = [
  //   { id: 'RAHPROMOTIONALCHARGE', displayName: 'RAHPROMOTIONALCHARGE' },
  // ]
  paymentPromotionalChargeCat = [
    { id: 1, displayName: "IMM PROMO PROCESSING" },
    { id: 2, displayName: "promotional" },
    { id: 3, displayName: "RAHPROMOTIONALCHARGE" }
  ];

  paymentServicePackageList = [
    { id: 'SALARYTEMPLATE1', displayName: 'SALARYTEMPLATE1' },
    { id: 'SALARYTEMPLATE2', displayName: 'SALARYTEMPLATE2' }
  ]

  paymentServicePackageVendorList = [
    { id: 'VENDORTEMPLATE1', displayName: 'VENDORTEMPLATE1' },
    { id: 'VENDORTEMPLATE2', displayName: 'VENDORTEMPLATE2' }
  ]

  paymentProgramRefNo = ''
  paymentServicePackage = ''
  paymentProgramName = ''
  paymentVendorServicePackage = ''
  paymentVendorProgramRefNo = ''
  paymentVendorProgramName = ''
  currency = ''

  currencyList = [
    { id: 'USD', displayName: 'USD' },
    { id: 'INR', displayName: 'INR' },
  ]

  dataLayoutPaymentRequestList = [
    { id: 'PAYMETHOD', displayName: 'PAYMETHOD' },
    { id: 'PAYUPlOAD', displayName: 'PAYUPlOAD' },
    { id: 'PROD12938', displayName: 'PROD12938' }
  ]

  dataLayoutBeneUploadList = [
    { id: 'AUTOBENEUPLOAD', displayName: 'AUTOBENEUPLOAD' },
    { id: 'BENEUPLOAD', displayName: 'BENEUPLOAD' }
  ]

  dataLayoutBillPaymentUploadList = [
    { id: 'PAYMETHOD', displayName: 'PAYMETHOD' },
    { id: 'PAYUPlOAD', displayName: 'PAYUPlOAD' },
  ]

  dataLayoutBillerRegistrationList = [
    { id: 'PAYMETHOD', displayName: 'PAYMETHOD' },
    { id: 'PAYUPlOAD', displayName: 'PAYUPlOAD' },
  ]

  paymentCurrencyList = [
    { id: 'INR', displayName: 'INR' },
  ]

  accountList = [
    { id: '12900012999', displayName: '12900012999' },
    { id: '12000192991', displayName: '12000192991' },
  ]

  chargeAccountList = [
    { id: 'chargeAcc1', displayName: 'chargeAcc1' },
  ]

  onCancelPayment() {
    this.showPaymentsEditModal = false
  }

  onSubmitPayment() {
    this.showPaymentsEditModal = false
  }

  transactionNameList = []

  onChangeModule(module) {
    this.transactionNameList = []
    if (module === 'Setup') {
      this.transactionNameList = [
        { id: 'Service Request', displayName: 'Service Request' }
      ]
    }
    else if (module === 'Payments') {
      this.transactionNameList = [
        { id: 'Payment Request', displayName: 'Payment Request' },
        { id: 'Special Request', displayName: 'Special Request' },
        { id: 'Bill Payment', displayName: 'Bill Payment' },
        { id: 'Bill Presentment', displayName: 'Bill Presentment' },
        { id: 'Biller Registration SI', displayName: 'Biller Registration SI' },
        { id: 'SI Management', displayName: 'SI Management' },
        { id: 'Own Account Transfer', displayName: 'Own Account Transfer' },
      ]
    }
    else if (module === 'FSCM') {
      this.transactionNameList = [
        { id: 'Apply Finance', displayName: 'Apply Finance' },
        { id: 'Consolidated Upload', displayName: 'Consolidated Upload' },
        { id: 'Finance Repayment', displayName: 'Finance Repayment' },
        { id: 'Invoice Entry', displayName: 'Invoice Entry' },
      ]
    }
    else if (module === 'Receivable') {
      this.transactionNameList = [
        { id: 'Receivable', displayName: 'Receivable' }
      ]
    }
    else if (module === 'Collection') {
      this.transactionNameList = [
        { id: 'Collection', displayName: 'Collection' }
      ]
    }
    else if (module === 'VAM') {
      this.transactionNameList = [
        { id: 'VAM', displayName: 'VAM' }
      ]
    }
    else if (module === 'Cashflow') {
      this.transactionNameList = [
        { id: 'Cashflow', displayName: 'Cashflow' }
      ]
    }
    else if (module === 'Positive Pay') {
      this.transactionNameList = [
        { id: 'Positive Pay', displayName: 'Positive Pay' }
      ]
    }

  }


}
