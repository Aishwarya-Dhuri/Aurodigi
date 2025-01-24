import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { CorporateGroup, TransactionDetails, AuthorizationRule } from './@models/corporate-group.model';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-corporate-group',
  templateUrl: './corporate-group.component.html',
  styleUrls: ['./corporate-group.component.scss']
})
export class CorporateGroupComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;
  @ViewChild('currencySellInit') currencySellInit!: AgGridListingComponent;
  @ViewChild('AuthorizationRuleInit') AuthorizationRuleInit!: AgGridListingComponent;
  @ViewChild('currencySellReview') currencySellReview!: AgGridListingComponent;
  @ViewChild('AuthorizationRuleReview') AuthorizationRuleReview!: AgGridListingComponent;
  @ViewChild('serviceDetailslisting') serviceDetailslisting!: AgGridListingComponent;

  formData: CorporateGroup = new CorporateGroup();
  transactionFormData: TransactionDetails = new TransactionDetails();
  authorizationRuleData: AuthorizationRule = new AuthorizationRule();

  mode: string;
  isShowLiabilityName = false;
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
      { label: 'Bank-Corporate' },
      { label: 'Corporate Group' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();

    this.serviceDetailsSelectedListing = this.serviceDetailsListingTypes[0];
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/security/corporateGroup/private/view', data)
        .subscribe((formData: CorporateGroup) => {
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
  serviceDetailslistingType = 'grid';
  serviceDetailsCurrentInitiatePage: number = 1;
  showServiceDetailsInititateAnalytics: boolean = false;

  serviceDetailsSelectededListing(list: any) {
    this.serviceDetailsSelectedListing = list
    this.onServiceDetailsListingTypeChange(this.serviceDetailslistingType)
  }

  onServiceDetailsListingTypeChange(serviceDetailslistingType: string) {
    this.serviceDetailslistingType = serviceDetailslistingType;
    this.serviceDetailsCurrentInitiatePage = 1;
    this.showServiceDetailsInititateAnalytics = false;
    if (this.serviceDetailslisting) {
      this.serviceDetailslisting.refreshGridList();
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

  setupCheckbox = false
  showFscmViewModal = false;
  showFscmEditModal = false;
  showPaymentsViewModal = false;
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
    { id: 'Promotional Setup', displayName: 'Setup Monthly' }
  ]

  setupChargeAccount = [
    { id: 'Charge Account', displayName: 'Charge Account' }
  ]


  fscm = {
    servicePackageCode: 'EIPPALLON',
    servicePackageName: 'EIPPALLON',
    moduleName: 'FSCM',
    product: 'EIPP',
    customerCategory: 'GOLD',
    fileUploadBy: 'Seller',
    uploadFor: 'Consolidate Upload',
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
  }

  subDocs = [
    { name: 'Invoice', aliasName: 'IN', checkbox: true },
    { name: 'Purchase Order', aliasName: 'PO', checkbox: true },
    { name: 'Credit Note', aliasName: 'CN', checkbox: true },
    { name: 'Debit Note', aliasName: 'DN', checkbox: true }
  ]


}
