import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ServiceTemplate } from './@models/service-template.model';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';

@Component({
  selector: 'app-service-template',
  templateUrl: './service-template.component.html',
  styleUrls: ['./service-template.component.scss']
})
export class ServiceTemplateComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;
  @ViewChild('serviceDetailslisting') serviceDetailslisting!: AgGridListingComponent;

  formData: ServiceTemplate = new ServiceTemplate();
  mode: string;
  isShowCorporateSearch: boolean;
  serviceDetailsSelectedListing!: any;
  serviceDetailslistingType = 'grid';
  serviceDetailsCurrentInitiatePage: number = 1;
  showServiceDetailsInititateAnalytics: boolean = false;

  isShowModal = false;
  rejectReason = ''


  corporateSearchColDefUrl: string = 'commons/searchService/private/corporateSearchColDefs';
  corporateSearchRowDefUrl: string =
    'setup/corporateOnboarding/corporateMain/private/getAuthorizedList';




  stepperDetails: Stepper = {
    masterName: 'Service Package',
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
  ) {
    this.userService.getApplicationDate().subscribe((applicationDate: string) => {
      this.formData.effectiveFrom = applicationDate;
    });
  }

  ngOnInit(): void {

    const actions: Actions = {
      heading: 'Service Package',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Templates' },
      { label: 'Service Package' },
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
        .httpPost('setup/security/serviceTemplate/private/view', data)
        .subscribe((formData: ServiceTemplate) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.onCorporateSelected({
            id: this.formData.corporateId,
            corporateCode: this.formData.corporateCode,
            corporateName: this.formData.corporateName,
          });
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
          this.oncChangeProduct(formData.product)
        });
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.bankProfileForm) {
      return true
    }
    return true;
  }

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateId = corporate.id.toString();
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName;
  }

  //////Dropdown Values///////
  productArray = [
    { id: 'Payments', displayName: 'Payments' },
    { id: 'Collection', displayName: 'Collection' },
    { id: 'FSCM', displayName: 'FSCM' },
    { id: 'LMS', displayName: 'LMS' },
    { id: 'VAM', displayName: 'VAM' },
    { id: 'Trade', displayName: 'Trade' },
    { id: 'Receivable', displayName: 'Receivable' },
    { id: 'Cashflow', displayName: 'Cashflow' },
    { id: 'Positive Pay', displayName: 'Positive Pay' },
  ]

  subProductArray = []
  customerCategoryArray = []

  //////Dropdown Values///////


  oncChangeProduct(value) {
    this.subProductArray = [];
    this.customerCategoryArray = [];
    if (value == 'Payments') {
      this.subProductArray = [
        { id: 'Salary', displayName: 'Salary' },
        { id: 'Vendor', displayName: 'Vendor' },
        { id: 'Electronic', displayName: 'Electronic' }
      ];
      this.customerCategoryArray = [
        { id: 'Gold', displayName: 'Gold' },
        { id: 'Silver', displayName: 'Silver' },
        { id: 'Platinum', displayName: 'Platinum' },
        { id: 'Exclusive', displayName: 'Exclusive' },
        { id: 'Generic', displayName: 'Generic' }
      ];
    }
    else if (value == 'Collection') {
      this.subProductArray = [
        { id: 'UCC_OWN', displayName: 'UCC_OWN' },
        { id: 'UCC_DRAWEE', displayName: 'UCC_DRAWEE' },
        { id: 'ECS', displayName: 'ECS' },
        { id: 'LCC_OWN', displayName: 'LCC_OWN' },
        { id: 'CASH', displayName: 'CASH' },
        { id: 'LCC_CORP', displayName: 'LCC_CORP' }
      ];
      this.customerCategoryArray = [
        { id: 'Gold', displayName: 'Gold' },
        { id: 'Silver', displayName: 'Silver' },
        { id: 'Platinum', displayName: 'Platinum' },
        { id: 'Exclusive', displayName: 'Exclusive' },
        { id: 'Generic', displayName: 'Generic' }
      ];
    }
    else if (value == 'FSCM') {
      this.subProductArray = [
        { id: 'EIPP', displayName: 'EIPP' },
        { id: 'Seller Finance', displayName: 'Seller Finance' },
        { id: 'Buyer Finance', displayName: 'Buyer Finance' },
        { id: 'Warehouse Finance', displayName: 'Warehouse Finance' }
      ];
      this.customerCategoryArray = [
        { id: 'Gold', displayName: 'Gold' },
        { id: 'Silver', displayName: 'Silver' },
        { id: 'Platinum', displayName: 'Platinum' },
        { id: 'Exclusive', displayName: 'Exclusive' },
        { id: 'Generic', displayName: 'Generic' }
      ];
    }
    else if (value == 'LMS') {
      this.subProductArray = [
        { id: 'Sweep', displayName: 'Sweep' },
        { id: 'Pool', displayName: 'Pool' },
        { id: 'Inter Company', displayName: 'Inter Company' }
      ];
      this.customerCategoryArray = [
        { id: 'Gold', displayName: 'Gold' },
        { id: 'Silver', displayName: 'Silver' },
        { id: 'Platinum', displayName: 'Platinum' },
        { id: 'Exclusive', displayName: 'Exclusive' },
        { id: 'Generic', displayName: 'Generic' }
      ];
    }
    else if (value == 'VAM') {
      this.subProductArray = [
        { id: 'Product1', displayName: 'Product1' }
      ];
      this.customerCategoryArray = [
        { id: 'Gold', displayName: 'Gold' },
        { id: 'Silver', displayName: 'Silver' },
        { id: 'Platinum', displayName: 'Platinum' },
        { id: 'Exclusive', displayName: 'Exclusive' },
        { id: 'Generic', displayName: 'Generic' }
      ];
    }
    else if (value == 'Trade') {
      this.subProductArray = [
        { id: 'Import Letter of Credit', displayName: 'Import Letter of Credit' },
        { id: 'Import Bank Guarantee', displayName: 'Import Bank Guarantee' },
        { id: 'Import Shipping Guarantee', displayName: 'Import Shipping Guarantee' },
        { id: 'Import Bill Payments', displayName: 'Import Bill Payments' },
        { id: 'Import Finance', displayName: 'Import Finance' },
        { id: 'Export LC Acceptance', displayName: 'Export LC Acceptance' },
        { id: 'Export Trade Bill', displayName: 'Export Trade Bill' },
        { id: 'Export Finance', displayName: 'Export Finance' },
      ];
      this.customerCategoryArray = [
        { id: 'Gold', displayName: 'Gold' },
        { id: 'Silver', displayName: 'Silver' },
        { id: 'Platinum', displayName: 'Platinum' },
        { id: 'Exclusive', displayName: 'Exclusive' },
        { id: 'Generic', displayName: 'Generic' }
      ];
    }
    else if (value == 'Receivable') {
      this.subProductArray = [
        { id: 'Receivable', displayName: 'Receivable' }
      ];
      this.customerCategoryArray = [
        { id: 'Gold', displayName: 'Gold' },
        { id: 'Silver', displayName: 'Silver' },
        { id: 'Platinum', displayName: 'Platinum' },
        { id: 'Exclusive', displayName: 'Exclusive' },
        { id: 'Generic', displayName: 'Generic' }
      ];
    }
    else if (value == 'Cashflow') {
      this.subProductArray = [
        { id: 'Cashflow', displayName: 'Cashflow' }
      ];
      this.customerCategoryArray = [
        { id: 'Gold', displayName: 'Gold' },
        { id: 'Silver', displayName: 'Silver' },
        { id: 'Platinum', displayName: 'Platinum' },
        { id: 'Exclusive', displayName: 'Exclusive' },
        { id: 'Generic', displayName: 'Generic' }
      ];
    }
    else if (value == 'Positive Pay') {
      this.subProductArray = [
        { id: 1, displayName: 'Positive Pay' }
      ];
      this.customerCategoryArray = [
        { id: 'Gold', displayName: 'Gold' },
        { id: 'Silver', displayName: 'Silver' },
        { id: 'Platinum', displayName: 'Platinum' },
        { id: 'Exclusive', displayName: 'Exclusive' },
        { id: 'Generic', displayName: 'Generic' }
      ];
    }

  }

  serviceDetailsListingTypes: any = [
    { label: "IFT", id: 1, checkbox: false, count: 1 },
    { label: "NEFT", id: 2, checkbox: false, count: 2 },
    { label: "IMPS", id: 3, checkbox: false, count: 3 },
    { label: "UPI", id: 4, checkbox: false, count: 1 },
    { label: "Nach-Credit", id: 5, checkbox: false, count: 1 },
    { label: "RTGS", id: 6, checkbox: false, count: 1 },
  ];

  serviceDetailsSelectededListing(list: any) {
    if (list.label === 'IFT') {
      this.formData.aliasName = 'IFT'
    }
    else if (list.label === 'NEFT') {
      this.formData.aliasName = 'NEFT'
    }
    else if (list.label === 'IMPS') {
      this.formData.aliasName = 'IMPS'
    }
    else if (list.label === 'UPI') {
      this.formData.aliasName = 'UPI'
    }
    else if (list.label === 'Nach-Credit') {
      this.formData.aliasName = 'Nach-Credit'
    }
    else if (list.label === 'RTGS') {
      this.formData.aliasName = 'RTGS'
    }


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

  onYesRadioBtnClick(value) {
    if (value === 'Yes') {
      this.formData.chargeTemplate = null;
      this.isShowModal = true;
    }
  }

  onSelectAccountOnChange(value) {
    if (value === 10100785689) {
      this.formData.accountDescription = 'Payable Account 1'
    }
    else if (value === 10100785690) {
      this.formData.accountDescription = 'Payable Account 2'
    }
    else if (value === 10100785699) {
      this.formData.accountDescription = 'Payable Account 3'
    }
  }

  onSelectAccountChange(value) {
    if (value === 10100785689) {
      this.formData.accountDescription1 = 'Payable Account 1'
    }
    else if (value === 10100785690) {
      this.formData.accountDescription1 = 'Payable Account 2'
    }
    else if (value === 10100785699) {
      this.formData.accountDescription1 = 'Payable Account 3'
    }
  }

  fileUploads = [
    {
      uploadFor: 'Recovery Upload',
      dataLayout: [
        { id: 1, displayName: "Recovery" }
      ]
    },
    {
      uploadFor: 'Consolidated Upload',
      dataLayout: [
        { id: 1, displayName: "PPP" },
        { id: 2, displayName: "TCC" },
        { id: 3, displayName: "PPM01" }
      ]
    },
    {
      uploadFor: 'Consolidated Download',
      dataLayout: [
        { id: 1, displayName: "NTH" },
        { id: 2, displayName: "SIS" },
        { id: 3, displayName: "NSKF" }
      ]
    },
  ]

  dataLayoutDetails = [
    {
      uploadFor: 'Payment Request',
      dataLayout: [
        { id: 1, displayName: "PayDataLayout" },
        { id: 1, displayName: "PaymentMethod" }
      ]
    },
    {
      uploadFor: 'Beneficiary Upload',
      dataLayout: [
        { id: 1, displayName: "AUTOBENEUPLOAD" },
        { id: 2, displayName: "BENEUPLOAD" },
        { id: 3, displayName: "AUTOBENEUPLOADXLS" }
      ]
    },
    {
      uploadFor: 'Bill Payment Upload',
      dataLayout: [
        { id: 1, displayName: "BILLPAYMENTUPLOAD" }
      ]
    },
    {
      uploadFor: 'Biller Registration',
      dataLayout: [
        { id: 1, displayName: "BILLERREGISTRATION" }
      ]
    }
  ]





  dataLayoutPaymentRequestList = [
    { id: 1, displayName: "PayDataLayout" },
    { id: 1, displayName: "PaymentMethod" }
  ]
  isDataLayoutPaymentRequest = false
  isH2hPaymentRequest = false
  h2hAuthReqPaymentRequest = 'No'



  dataLayoutBeneUploadList = [
    { id: 1, displayName: "AUTOBENEUPLOAD" },
    { id: 2, displayName: "BENEUPLOAD" },
    { id: 3, displayName: "AUTOBENEUPLOADXLS" }
  ]

  dataLayoutBillPaymentUploadList = [
    { id: 1, displayName: "BILLPAYMENTUPLOAD" }
  ]
  isH2hBillPaymentUpload = false
  h2hAuthReqBillPaymentUpload = 'No'

  dataLayoutBillerRegistrationList = [
    { id: 1, displayName: "BILLERREGISTRATION" }
  ]
  isH2hBillerRegistration = false
  h2hAuthReqBillerRegistration = 'No'

















  subDocs = [
    { name: 'Invoice', aliasName: 'IN', checkbox: true },
    { name: 'Purchase Order', aliasName: 'PO', checkbox: true },
    { name: 'Credit Note', aliasName: 'CN', checkbox: true },
    { name: 'Debit Note', aliasName: 'DN', checkbox: true }
  ]

  normalChargeCategoryList = [
    { id: 'PROCESSINGEOD', displayName: 'PROCESSINGEOD' },
    { id: 'PAYMENTCATEGORYWISE', displayName: 'PAYMENTCATEGORYWISE' },
    { id: 'PAYMENTCHARGES', displayName: '' },
    { id: 'PROCESSINGMONTHLY', displayName: 'PROCESSINGMONTHLY' },
    { id: 'TRANCATEGORYWISE', displayName: 'TRANCATEGORYWISE' },
  ]

  promotionalChargeCategoryList = [
    { id: 'PROMOTIONALCHARGE', displayName: 'PROMOTIONALCHARGE' }
  ]

}
