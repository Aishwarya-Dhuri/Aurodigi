import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ContactInfo, CorporateMain, TransactionDetails, CorporateSecurityDetails, paymentsRow, Slab, PaymentSlab } from './@models/corporate-main.model';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { cloneDeep, filter } from 'lodash';
import { NgForm, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-corporate-main',
  templateUrl: './corporate-main.component.html',
  styleUrls: ['./corporate-main.component.scss']
})
export class CorporateMainComponent implements OnInit {
  @ViewChild('ipMappedGrid') ipMappedGrid: any;
  @ViewChild('listing') listing!: AgGridListingComponent;
  @ViewChild('serviceDetailslisting') serviceDetailslisting!: AgGridListingComponent;
  @ViewChild('bankProfileForm') bankProfileForm: any;
  @ViewChild('currencySellInit') currencySellInit!: AgGridListingComponent;
  @ViewChild('currencySellReview') currencySellReview!: AgGridListingComponent;
  @ViewChild('paymentMethodslisting') paymentMethodsListing!: AgGridListingComponent;


  formData: CorporateMain = new CorporateMain();
  transactionFormData: TransactionDetails = new TransactionDetails();
  corporateSecurityDetailsFormData: CorporateSecurityDetails = new CorporateSecurityDetails();


  mode: string;
  onFetch = false;
  noOfAddresses = 1;
  transactionViewData: TransactionDetails;

  showFscmViewModal = false;
  showFscmEditModal = false;
  showPaymentsEditModal = false;
  showPaymentsEyeViewModal = false;
  showPaymentsViewModal = false;
  paymentDetailslistingType = 'grid';
  paymentDetailsCurrentInitiatePage: number = 1;
  showPaymentDetailsInititateAnalytics: boolean = false;

  paymentMethodsSelectedListing: any;
  paymentDetailsSelectedListing!: any;
  paymentMethodsListingType = 'grid';
  paymentMethodsIntialPage: number = 1;
  showPaymentMethodInititateAnalytics: boolean = false;



  ipMappingColDefs: string = 'setup/corporateOnboarding/bbecorporateMain/private/getIpMappingColDef';
  ipMappingReviewColDefs: string = 'setup/corporateOnboarding/bbecorporateMain/private/getIpMappingReviewColDef';
  ipMappedGridOptions = {
    rowModelType: 'clientSide',
    pagination: false,
    context: {
      componentParent: this,
    },
  };

  ipMapping = {
    startRange1: '',
    startRange2: '',
    startRange3: '',
    startRange4: '',
    endRange1: '',
    endRange2: '',
    endRange3: '',
    endRange4: '',
  };
  editingIndex: number = -1;
  editing = false;
  stepperDetails: Stepper = {
    masterName: 'Corporate Main',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['Corporate Details', 'Corporate Account', 'Service Details', 'Parameter', 'Authorization Rule', 'Other Information', 'Review Details'],
  };
  paymentNormalChargeCategory = [
    { id: 1, displayName: "PROCESSING PROMOTIONAL IMMEDIATE" },
    { id: 2, displayName: "PROCESSING NORMAL IMMEDIATE" },
    { id: 3, displayName: "MONTHLY" },
    { id: 4, displayName: "PROCESSINGEOD" }

  ];

  paymentServicePackage = [
    { id: 1, displayName: "ST001" },
    { id: 2, displayName: "ST002" },
    { id: 3, displayName: "ST003" }
  ];

  product = [
    { id: 1, displayName: "Salary" },
    { id: 2, displayName: "Vendor" }
  ];
  customerCategoryArr = [
    { id: 1, displayName: "Customer Category 1" },
    { id: 1, displayName: "Customer Category 2" },
  ]


  paymentPromotionalChargeCategory = [
    { id: 1, displayName: "IMM PROMO PROCESSING" },
    { id: 2, displayName: "promotional" },
    { id: 3, displayName: "RAHPROMOTIONALCHARGE" }
  ];

  payments = {
    serviceTemplateCode: 'ADITEMP',
    serviceTemplateName: 'ADITEMP',
    moduleName: 'Payments',
    product: 'Salary',
    customerCategory: 'Silver',
    templateFor: 'Corporate',
    checkDuplicateCrnNo: 'No',
    aacountPosting: 'Consolidated',
    enrichmentRequired: 'No',
    chargeApplicable: 'No',
    maskRequired: 'No',
    allowRuntimeBeneficiary: 'Yes',
    beneficiaryAutoAuthorize: 'Yes',
    beneficiaryLibraryUpdate: 'Yes',
    forceDebit: 'No',
    uploadFor: '',
    dataLayout: '',
    partialUpload: '',
    h2hPrefix: '',
    h2hAuthReq: '',
    iftAliasName: 'Internal Fund Transfer',
    neftAliasName: 'NEFT',
    rtgsAliasName: 'RTGS',
    printCoverNote: '-',
    emailCoverNote: '-',
    smsCoverNote: '-',
    useSendToBank: 'Yes',
    cutOffTime: '17:50',
    currencyName: 'INR: Indian Rupee',
    currencyLimit: '999999999',
    makerName: 'adi maker (adimaker)',
    makerDateTime: 'Maker Date Time',
    checkerName: 'adi checker (adichecker)',
    checkerDateTime: '01-Jan-2022 10:36:55',


  }

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private httpService: HttpService,
    private userService: UserService,
    private viewService: ViewService,
  ) {
    this.userService.getApplicationDate().subscribe((applicationDate: string) => {
      this.formData.effectiveFrom = applicationDate;
    });
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Corporate Main',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Corporate Setup' },
      { label: 'Corporate Onboarding' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();


    this.serviceDetailsSelectedListing = this.serviceDetailsListingTypes[0];
    this.paymentMethodsSelectedListing = this.paymentMethodsInPaymentsModal[0];
    this.paymentDetailsSelectedListing = this.paymentDetailsListingTypes[0];

  }

  onPaymentDetailsListingTypeChange(paymentDetailslistingType: string) {
    this.paymentDetailslistingType = paymentDetailslistingType;
    this.paymentDetailsCurrentInitiatePage = 1;
    this.showPaymentDetailsInititateAnalytics = false;
    if (this.paymentDetailsListingTypes) {
      this.paymentDetailsListingTypes.refreshGridList();
    }
  }

  addNewPaymentsRow() {
    this.formData.paymentsRow.push(new paymentsRow());

  }

  paymentMethodSelected(list: any) {
    this.paymentMethodsSelectedListing = list
    this.onPaymentMethodTypeChange(this.paymentMethodsListingType)
  }

  onPaymentMethodTypeChange(paymentMethodsListingType: string) {
    this.paymentMethodsListingType = paymentMethodsListingType;
    this.paymentMethodsIntialPage = 1;
    this.showPaymentMethodInititateAnalytics = false;
    if (this.paymentMethodsListing) {
      this.paymentMethodsListing.refreshGridList();
    }
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/corporateOnboarding/bbecorporateMain/private/view', data)
        .subscribe((formData: CorporateMain) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
          this.corporateSecurityDetailsFormData = this.formData.corporateSecurityDetails[0];
        });
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.bankProfileForm) {
      return true
    }
    return true;
  }

  getSubHeading(stepNo: number): string {
    if (stepNo === 1) {
      return 'CID : ' + this.formData.CIDNumber;
    }
    return '';
  }

  serviceDetailsSelectedListing!: any;
  serviceDetailslistingType = 'grid';
  serviceDetailsCurrentInitiatePage: number = 1;
  showServiceDetailsInititateAnalytics: boolean = false;

  paymentDetailsListingTypes: any = [
    { label: "IFT", id: 1, checkbox: false, count: 1 },
    { label: "NEFT", id: 2, checkbox: false, count: 2 },
    { label: "RTGS", id: 3, checkbox: false, count: 3 }
  ];


  paymentDetailsSelectededListing(list: any) {
    this.paymentDetailsSelectedListing = list
    this.onPaymentDetailsListingTypeChange(this.paymentDetailslistingType)
  }


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
  ]

  paymentMethodsInPaymentsModal = [
    { label: "IFT", id: 1 },
    { label: "NEFT", id: 2 },
    { label: "RTGS", id: 3 },

  ]
  dataLayoutArr = [
    { id: 1, displayName: "Data Layout 1" },
    { id: 2, displayName: "Data Layout 2" },
    { id: 3, displayName: "Data Layout 3" },
    { id: 3, displayName: "Data Layout 4" },
    { id: 3, displayName: "Data Layout 5" }

  ];

  coverNoteArr = [
    { id: 1, displayName: "IDEA BODY COVERNOTE" },
    { id: 2, displayName: "Cover note For All" },
    { id: 3, displayName: "CNT" },
    { id: 4, displayName: "OAT" }
  ];

  currencyOptions = [
    { id: 1, displayName: "Indian Rupee" }

  ];

  accountNoArr = [
    { id: 1, displayName: "3101410141412" },
    { id: 1, displayName: "31020555102415" }


  ];
  h2hFileProcessingOptions = [
    { id: 1, displayName: "With Authorization" },
    { id: 2, displayName: "Without Authorization" },

  ];

  accountPostingArr = [
    { id: '1', displayName: 'Consolidated' },
    { id: '2', displayName: 'Transaction' }
  ]

  addAddress() {
    if (this.noOfAddresses === 3) {
      return;
    }
    this.noOfAddresses++;
  }
  removeAddress() {
    if (this.noOfAddresses === 2) {
      this.formData.address2 = this.formData.address3;
      this.formData.address3 = '';
    } else if (this.noOfAddresses === 3) {
      this.formData.address3 = '';
    }
    if (this.noOfAddresses === 1) {
      return;
    }
    this.noOfAddresses--;
  }

  onSupportingDocumentUploaded(file: any) {
    this.formData.corporateLogo = file;
  }

  addContactInfo() {
    this.formData.contactInfo.push(new ContactInfo());
  }

  removeContactInfo(index: number) {
    this.formData.contactInfo.splice(index, 1);
  }


  ////////////Authorization Rule///////////////
  editIndex: number = -1;
  isShowViewModal: boolean = false;
  transactionInitGridAPI: any;
  transactionReviewGridAPI: any;




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
      editAction, deleteAction];
    transaction.reviewActions = [
      // viewAction
    ];
    return transaction;
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

  onViewTransaction(value: any): void {
    this.isShowViewModal = true;
    const index: number = this.formData.transaction.findIndex((transaction: TransactionDetails) => transaction.id == value);
    if (index > -1) {
      this.transactionViewData = this.formData.transaction[index]
    }
  }

  onCloseViewModal() {
    this.transactionViewData = new TransactionDetails()
  }

  onDeleteTransaction(value: any): void {
    const index: number = this.formData.transaction.findIndex((transaction: TransactionDetails) => transaction.id == value);
    if (index >= 0) {
      this.formData.transaction.splice(index, 1);
      this.transactionInitGridAPI.setRowData(this.formData.transaction);
      this.transactionReviewGridAPI.setRowData(this.formData.transaction);
    }
  }

  onCurrencySellInitGridReady(api: any): void {
    this.transactionInitGridAPI = api;
    this.transactionInitGridAPI.setRowData(this.formData.transaction);
  }

  onCurrencySellReviewGridReady(api: any): void {
    this.transactionReviewGridAPI = api;
    this.transactionReviewGridAPI.setRowData(this.formData.transaction);
  }

  currencySellGridOptions: any = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    pagination: false,
  };

  onAddTransactionClick() {
    this.transactionFormData = this.addDocumentGridActions(this.transactionFormData)
    this.formData.transaction.push({ ...this.transactionFormData });
    this.currencySellInit.setRowData(this.formData.transaction);
    this.currencySellReview?.setRowData(this.formData.transaction);
    this.transactionFormData = new TransactionDetails();
  }

  onEditTransaction(value: any): void {
    const index: number = this.formData.transaction.findIndex((transaction: TransactionDetails) => transaction.id == value);
    if (index > -1) {
      const formData = cloneDeep(this.formData.transaction[index]);
      delete formData.id
      this.transactionFormData = formData;
      this.editIndex = index;
    }
  }



  ////////////Authorization Rule///////////////


  setupNormalChargeCat = [
    { id: 1, displayName: "NormalChargeType1" },
    { id: 2, displayName: "NormalChargeType2" },
    { id: 3, displayName: "NormalChargeType3" }
  ];

  setupPromotionalChargeCat = [
    { id: 1, displayName: "PromotionalChargeType1" },
    { id: 2, displayName: "PromotionalChargeType2" },
    { id: 3, displayName: "PromotionalChargeType3" }
  ];

  setupChargeAccount = [
    { id: 1, displayName: "101010009388540" },
    { id: 2, displayName: "101010009436777" },
    { id: 3, displayName: "101010009388234" }
  ];

  // fscmServicePackage = [
  //   { id: 1, displayName: "ST001" },
  //   { id: 2, displayName: "ST002" },
  //   { id: 3, displayName: "ST003" }
  // ];


  collectionServicePackage = [
    { id: 1, displayName: "ST001" },
    { id: 2, displayName: "ST002" },
    { id: 3, displayName: "ST003" }
  ];

  collectionCustomerType = [
    { id: 1, displayName: "Guaranteed" },
    { id: 2, displayName: "Clear Funds" },
  ]

  onSubmitIpMapped(form: NgForm) {
    if (form.valid) {
      const startRange =
        this.ipMapping.startRange1 +
        '.' +
        this.ipMapping.startRange2 +
        '.' +
        this.ipMapping.startRange3 +
        '.' +
        this.ipMapping.startRange4;

      const endRange =
        this.ipMapping.startRange1 +
        '.' +
        this.ipMapping.startRange2 +
        '.' +
        this.ipMapping.endRange3 +
        '.' +
        this.ipMapping.endRange4;

      const ipMapping = {
        srNo: this.editing
          ? this.corporateSecurityDetailsFormData.ipMapping[this.editingIndex].srNo
          : this.corporateSecurityDetailsFormData.ipMapping.length + 1,
        startRange: startRange,
        endRange: endRange,
        actions: [
          {
            index: 0,
            methodName: 'editIpMapped',
            type: 'ICON',
            displayName: 'Edit',
            icon: 'pi pi-pencil',
            paramList: 'srNo, startRange, endRange',
          },
          {
            index: 1,
            methodName: 'deleteIpMapped',
            type: 'ICON',
            displayName: 'Delete',
            icon: 'pi pi-trash',
            paramList: 'srNo, startRange, endRange',
          },
        ],
      };


      form.reset();

      if (this.editingIndex >= 0) {
        this.corporateSecurityDetailsFormData.ipMapping[this.editingIndex] = ipMapping;
        this.editingIndex = -1;
        this.editing = false;
      } else {
        this.corporateSecurityDetailsFormData.ipMapping.push(ipMapping);
      }

      if (this.ipMappedGrid) {
        this.ipMappedGrid.setRowData(this.corporateSecurityDetailsFormData.ipMapping);
      }
    }
  }

  editIpMapped(srNo: string, startRangeParam: string, endRangeParam: string) {
    this.editingIndex = this.corporateSecurityDetailsFormData.ipMapping.findIndex(
      (parameters: any) => parameters.srNo === srNo,
    );

    this.editing = true;

    const startRange = startRangeParam.split('.');
    const endRange = endRangeParam.split('.');

    this.ipMapping = {
      startRange1: startRange[0],
      startRange2: startRange[1],
      startRange3: startRange[2],
      startRange4: startRange[3],
      endRange1: endRange[0],
      endRange2: endRange[1],
      endRange3: endRange[2],
      endRange4: endRange[3],
    };
  }

  deleteIpMapped(srNo: string, startRange: string, endRange: string) {
    const i = this.corporateSecurityDetailsFormData.ipMapping.findIndex((parameters: any) => parameters.srNo === srNo);
    if (i >= 0) {
      if (this.editing && i === this.editingIndex) {
        this.editing = false;
        this.editingIndex = -1;
      }

      this.corporateSecurityDetailsFormData.ipMapping.splice(i, 1);

      if (this.ipMappedGrid) {
        this.ipMappedGrid.setRowData(this.corporateSecurityDetailsFormData.ipMapping);
      }
    }
  }

  onBusinessCodeSelection(val: any) {
    this.formData.businessCode = val.businessCode;
  }

  onshowSubBusiness(val: any) {
    this.formData.subBusiness = val.businessCode;
  }

  onshowCustomerType(val: any) {
    // this.formData.customerTypeSelection = val.businessCode;
    this.formData.customerTypeSelection = val.customerTypeCode;
  }

  onshowshowProcessingCentreId(val: any) {
    console.log(val);
    this.formData.processingCentreId = val.processingCentreID;
  }


  servicePackage = [
    { id: 'ST001', displayName: 'ST001' },
    { id: 'ST002', displayName: 'ST002' },
    { id: 'ST003', displayName: 'ST003' }
  ]

  fscmSellerSponsor = false;
  fscmBuyerSponsor = false;
  fscmPortalCheckbox = false;
  fscmH2hCheckbox = false;
  fscmWebService = false;

  fscmEippCheckbox = false
  fscmServicePackage = ''
  fscmProgramRefNo = ''
  fscmProgramName = ''

  fscmSellerFinanceCheckbox = false
  fscmSellerFinanceServicePackage = ''
  fscmSellerFinanceProgramRefNo = ''
  fscmSellerFinanceProgramName = ''

  fscmBuyerFinanceCheckbox = false
  fscmBuyerFinanceServicePackage = ''
  fscmBuyerFinanceProgramRefNo = ''
  fscmBuyerFinanceProgramName = ''

  fscmWarehouseFinanceCheckbox = false
  fscmWarehouseFinanceServicePackage = ''
  fscmWarehouseFinanceProgramRefNo = ''
  fscmWarehouseFinanceProgramName = ''

  onfscmEippClick(val) {
    if (val === false) {
      this.fscmServicePackage = ''
      this.fscmProgramRefNo = ''
      this.fscmProgramName = ''
    }
  }

  onfscmSellerFinanceClick(val) {
    if (val === false) {
      this.fscmSellerFinanceServicePackage = ''
      this.fscmSellerFinanceProgramRefNo = ''
      this.fscmSellerFinanceProgramName = ''
    }
  }

  onfscmBuyerFinanceClick(val) {
    if (val === false) {
      this.fscmBuyerFinanceServicePackage = ''
      this.fscmBuyerFinanceProgramRefNo = ''
      this.fscmBuyerFinanceProgramName = ''
    }
  }

  onfscmWarehouseFinanceClick(val) {
    if (val === false) {
      this.fscmWarehouseFinanceServicePackage = ''
      this.fscmWarehouseFinanceProgramRefNo = ''
      this.fscmWarehouseFinanceProgramName = ''
    }
  }


  //--------------fscmModalData-------------//
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
    h2h: 'Yes',
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
  //--------------fscmModalData-------------//


  subDocs = [
    { name: 'Invoice', aliasName: 'IN', checkbox: true },
    { name: 'Purchase Order', aliasName: 'PO', checkbox: true },
    { name: 'Credit Note', aliasName: 'CN', checkbox: true },
    { name: 'Debit Note', aliasName: 'DN', checkbox: true }
  ]

  addNewSlab() {
    this.formData.slab.push(new Slab());
    // this.formData.rate = ''
    // this.formData.margin = ''
    // this.formData.exchangeRate = null
  }

  addPaymentSlab() {
    this.formData.paymentSlab.push(new PaymentSlab())
    console.log(this.formData.paymentSlab.length);

  }

  removePaymentSlab(paymentSlab: any) {
    this.formData.paymentSlab.splice(paymentSlab, 1)
  }

  removeSlab(slab: any) {
    this.formData.slab.splice(slab, 1);
  }

  rateTypeCodeArr = [
    { id: 'SALARYTEMPLATE1', displayName: 'SALARYTEMPLATE1' },
    { id: 'SALARYTEMPLATE2', displayName: 'SALARYTEMPLATE2' }
  ]

  vendorArr = [
    { id: 'VENDORTEMPLATE1', displayName: 'VENDORTEMPLATE1' },
    { id: 'VENDORTEMPLATE2', displayName: 'VENDORTEMPLATE2' }
  ]

  paymentProgramRefNo = '12900'
  paymentServicePackageData = ''
  paymentProgramName = 'REFName'
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

  normalChargeCategoryList = [
    { id: 'PROCESSINGEOD', displayName: 'PROCESSINGEOD' },
    { id: 'CHARGETEMP', displayName: 'CHARGETEMP' },
  ]

  promotionalChargeCategoryList = [
    { id: 'RAHPROMOTIONALCHARGE', displayName: 'RAHPROMOTIONALCHARGE' }
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
    { id: '301002010121', displayName: '301002010121' },
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
