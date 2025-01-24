import { Component, OnInit, ViewChild } from '@angular/core';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { ContactInfo, CorporateMain, IpMappingDetails, authorizationDetails } from './@models/corporate-main.model';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { NgForm } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';

@Component({
  selector: 'app-corporate-main',
  templateUrl: './corporate-main.component.html',
  styleUrls: ['./corporate-main.component.scss']
})
export class CorporateMainComponent implements OnInit {

  formData: CorporateMain = new CorporateMain();
  @ViewChild('corporateMainForm') corporateMainForm: any;

  @ViewChild('ipMappedGrid') ipMappedGrid: any;

  ipMappinForm: IpMappingDetails = new IpMappingDetails();

  authorizationRuleFormData: authorizationDetails = new authorizationDetails();

  corporateSearchColDefUrl: string = 'commons/searchService/private/corporateSearchColDefs';
  corporateSearchRowDefUrl: string =
    'setup/corporateOnboarding/corporateMain/private/getAuthorizedList';


  ipMappingColDefs: string = 'setup/security/corporateMain/private/getIpMappingColDef';
  ipMappingReviewColDefs: string = 'setup/security/corporateMain/private/getIpMappingReviewColDef';
  ipMappingData: IpMappingDetails = new IpMappingDetails();

  authRuleGridOptions: any = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    pagination: false,
  };
  stepperDetails: Stepper = {
    masterName: 'Corporate Main',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  mode: string;
  isShowCorporateSearch: boolean;
  countryCodeArr = [
    { id: 'Sri Lanka', displayName: 'Sri Lanka' },
    { id: 'USA', displayName: 'USA' },
  ];
  categoryWiseChargesArr = [
    { id: 'Charge1', displayName: 'Charge1' }
  ];
  promotionalChargesArr = [
    { id: 'Promotional Charge1', displayName: 'Promotional Charge1' }
  ];
  h2hFileProcessingArr = [
    { id: '1', displayName: '1' },
    { id: '2', displayName: '2' },
    { id: '3', displayName: '3' }

  ];

  industryDescriptionArr = [
    { id: 'Industry1', displayName: 'Industry1' },
    { id: 'Industry2', displayName: 'Industry2' },
    { id: 'Industry3', displayName: 'Industry3' },
  ];
  loginIdArr = [
    { id: 'dvmmaker', displayName: 'dvmmaker' },
    { id: 'patelchecker', displayName: 'patelchecker' },
    { id: 'testalert', displayName: 'testalert' },
  ]

  defaultChargeAmountArr = [
    { id: 'Account Charge', displayName: 'Account Charge' }
  ];

  coreBranchIdArr = [
    { id: 'Branch1', displayName: 'Branch1' },
    { id: 'Branch2', displayName: 'Branch2' },
    { id: 'Branch3', displayName: 'Branch3' },

  ];
  normalChargeCategoryArr = [
    { id: 'ChargeType1', displayName: 'ChargeType1' },
    { id: 'ChargeType2', displayName: 'ChargeType2' },
    { id: 'ChargeType3', displayName: 'ChargeType3' },
    { id: 'ChargeType4', displayName: 'ChargeType4' },
    { id: 'ChargeType5', displayName: 'ChargeType5' },
    { id: 'ChargeType6', displayName: 'ChargeType6' },
  ];

  promotionalChargeCategoryArr = [
    { id: 'PromotionalChargeType1', displayName: 'PromotionalChargeType1' },
    { id: 'PromotionalChargeType2', displayName: 'PromotionalChargeType2' },
    { id: 'PromotionalChargeType3', displayName: 'PromotionalChargeType3' },
    { id: 'PromotionalChargeType4', displayName: 'PromotionalChargeType4' },
    { id: 'PromotionalChargeType5', displayName: 'PromotionalChargeType5' },
    { id: 'PromotionalChargeType6', displayName: 'PromotionalChargeType6' },

  ];

  defaultChargeAccountArr = [
    { id: '101010009388539', displayName: '101010009388539' },
    { id: '101010009388540', displayName: '101010009388540' },
    { id: '101010009388541', displayName: '101010009388541' },
    { id: '101010009388542', displayName: '101010009388542' },
    { id: '101010009388543', displayName: '101010009388543' },

  ]
  noOfAddresses = 1;
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
  ipMappedGridOptions = {
    rowModelType: 'clientSide',
    pagination: false,
    context: {
      componentParent: this,
    },
  };

  editIndex: number = -1;
  transactionInitGridAPI: any;
  transactionReviewGridAPI: any;
  @ViewChild('authRulegrid') authRulegrid!: AgGridListingComponent;

  // setupChargeApplicablecheck :false


  addDocumentGridActions(transaction: authorizationDetails): authorizationDetails {
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
  constructor(private viewService: ViewService, private httpService: HttpService) { }

  ngOnInit(): void {
    this.getViewData();

  }



  onCorporateCodeSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName;
  }

  addContactInfo() {
    this.formData.contactInfo.push(new ContactInfo());
  }

  addAddress() {
    if (this.noOfAddresses === 3) {
      return;
    }
    this.noOfAddresses++;
  }

  removeAddress() {
    if (this.noOfAddresses === 2) {
      this.formData.registeredOfficeaddress1 = this.formData.registeredOfficeaddress3;
      this.formData.registeredOfficeaddress3 = '';

      this.formData.address1 = this.formData.address3;
      this.formData.address3 = '';

    } else if (this.noOfAddresses === 3) {
      this.formData.registeredOfficeaddress3 = '';
      this.formData.address3 = '';

    }
    if (this.noOfAddresses === 1) {
      return;
    }
    this.noOfAddresses--;
  }

  hideCorporateAddressFields() {

  }


  onSupportingDocumentUploaded(file: any) {
    this.formData.corporateLogo = file;
  }

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
        this.ipMapping.endRange1 +
        '.' +
        this.ipMapping.endRange2 +
        '.' +
        this.ipMapping.endRange3 +
        '.' +
        this.ipMapping.endRange4;

      const ipMapping = {
        srNo: this.editing
          ? this.ipMappingData.ipMapping[this.editingIndex].srNo
          : this.ipMappingData.ipMapping.length + 1,
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
        this.ipMappingData.ipMapping[this.editingIndex] = ipMapping;
        this.editingIndex = -1;
        this.editing = false;
      } else {
        this.ipMappingData.ipMapping.push(ipMapping);
      }

      if (this.ipMappedGrid) {
        this.ipMappedGrid.setRowData(this.ipMappingData.ipMapping);
      }
    }
  }

  onAddTransactionClick() {
    this.authorizationRuleFormData = this.addDocumentGridActions(this.authorizationRuleFormData)
    this.formData.authrule.push({ ...this.authorizationRuleFormData });
    this.authRulegrid.setRowData(this.formData.authrule);
    // this.currencySellReview?.setRowData(this.formData.authrule);
    this.authorizationRuleFormData = new authorizationDetails();
  }

  onUpdateTransaction() {
    if (this.editIndex > -1) {
      this.formData.authrule[this.editIndex] = {
        ...this.formData.authrule[this.editIndex],
        ...cloneDeep(this.authorizationRuleFormData),
      };
      if (this.authRulegrid) {
        this.authRulegrid.setRowData(this.formData.authrule);
      }
      // if (this.currencySellReview) {
      //   this.currencySellReview.setRowData(this.formData.authrule);
      // }
      this.authorizationRuleFormData = new authorizationDetails();
      this.editIndex = -1;
    }
  }

  onEditTransaction(value: any): void {
    const index: number = this.formData.authrule.findIndex((authrule: authorizationDetails) => authrule.id == value);
    if (index > -1) {
      const formData = cloneDeep(this.formData.authrule[index]);
      delete formData.id
      this.authorizationRuleFormData = formData;
      this.editIndex = index;
    }
  }

  onAuthRuleGridReady(api: any): void {
    this.transactionInitGridAPI = api;
    this.transactionInitGridAPI.setRowData(this.formData.authrule);
  }

  onDeleteTransaction(value: any): void {
    const index: number = this.formData.authrule.findIndex((transaction: authorizationDetails) => transaction.id == value);
    if (index >= 0) {
      this.formData.authrule.splice(index, 1);
      this.transactionInitGridAPI.setRowData(this.formData.authrule);
      this.transactionReviewGridAPI.setRowData(this.formData.authrule);
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
        });
    }
  }
}
