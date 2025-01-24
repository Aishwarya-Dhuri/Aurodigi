import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { cloneDeep, filter } from 'lodash';
import { QuickOnboarding, TransactionDetails } from './@models/quick-onboarding.model';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';

@Component({
  selector: 'app-quick-onboarding',
  templateUrl: './quick-onboarding.component.html',
  styleUrls: ['./quick-onboarding.component.scss']
})
export class QuickOnboardingComponent implements OnInit {
  @ViewChild('listing') listing!: AgGridListingComponent;
  @ViewChild('bankProfileForm') bankProfileForm: any;
  @ViewChild('userDetailsForm') userDetailsForm: any;
  @ViewChild('currencySellInit') currencySellInit!: AgGridListingComponent;
  @ViewChild('currencySellReview') currencySellReview!: AgGridListingComponent;


  currencySellGridOptions: any = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    pagination: false,
  };

  formData: QuickOnboarding = new QuickOnboarding();
  transactionFormData: TransactionDetails = new TransactionDetails();


  mode: string;


  editIndex: number = -1;
  transactionInitGridAPI: any;
  transactionReviewGridAPI: any;
  isShowViewModal: boolean = false;
  isShowModule: boolean = false;
  onFetch: boolean = false;
  transactionViewData: TransactionDetails;
  moduleHeader: string = ''








  stepperDetails: Stepper = {
    masterName: 'Quick Onboarding',
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
      heading: 'Quick Onboarding',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'CIB Setup' },
      { label: 'Quick Onboarding' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();

  }


  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/cibSetup/quickOnboarding/private/view', data)
        .subscribe((formData: QuickOnboarding) => {
          this.viewService.clearAll();
          this.formData = formData;
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

  ////////////////////////////////////////////////////////
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
    transaction.initActions = [viewAction, editAction, deleteAction];
    transaction.reviewActions = [viewAction];
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

  onEditTransaction(value: any): void {
    const index: number = this.formData.transaction.findIndex((transaction: TransactionDetails) => transaction.id == value);
    if (index > -1) {
      const formData = cloneDeep(this.formData.transaction[index]);
      delete formData.id
      this.transactionFormData = formData;
      this.editIndex = index;
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


  onAddTransactionClick() {
    this.transactionFormData = this.addDocumentGridActions(this.transactionFormData)
    this.formData.transaction.push({ ...this.transactionFormData });
    this.currencySellInit.setRowData(this.formData.transaction);
    this.currencySellReview?.setRowData(this.formData.transaction);
    this.transactionFormData = new TransactionDetails();
  }

  modules = [
    { id: 1, name: 'Payments' },
    { id: 2, name: 'Account Services' },
    { id: 3, name: 'VAM' },
  ];

  onClickCheckbox(value) {
    if (value === 'Payments') {
      this.moduleHeader = 'Payments Package - View'
    }
    else if (value === 'Account Services') {
      this.moduleHeader = 'Account Services Package - View'
    }
    else if (value === 'VAM') {
      this.moduleHeader = 'VAM Package - View'
    }
  }


  viewModuleData = {
    corporateCode: 'International LLC',
    roleCode: 'C101',
    roleName: 'Rname',
    moduleName: 'Setup',
    roleType: 'Normal',
    effectiveFrom: '22-Apr-2023',
    effectiveTill: '24-Apr-2023',
  }

  masters = [
    { name: 'Masters', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: true, executeCheckbox: true },
    { name: 'General Masters', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: true, executeCheckbox: false },
    { name: 'Beneficiary', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: true, executeCheckbox: false },
    { name: 'Beneficiary Payment Mapping', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: true, executeCheckbox: false },
    { name: 'Account Alias Name', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: true, executeCheckbox: false },
    { name: 'Account Wise Access', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: false, executeCheckbox: false },
    { name: 'MT Registration', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: true, executeCheckbox: false },
    { name: 'Corporate Authorization Matrix', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: true, executeCheckbox: false },
    { name: 'Download Security Files', viewCheckbox: false, dataEntryCheckbox: false, authorizeCheckbox: false, enableDisableCheckbox: false, executeCheckbox: true },
    { name: 'Transaction', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: false, executeCheckbox: true },
    { name: 'Own Account Transfer', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: true, executeCheckbox: false },
    { name: 'Cancel Payment Request', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: false, executeCheckbox: false },
    { name: 'WPS Upload', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: false, executeCheckbox: true },
    { name: 'WPS Historic Data', viewCheckbox: true, dataEntryCheckbox: false, authorizeCheckbox: true, enableDisableCheckbox: false, executeCheckbox: true },
    { name: 'Template Management', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: false, enableDisableCheckbox: true, executeCheckbox: true },
    { name: 'SI Management', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: true, executeCheckbox: true },
    { name: 'H2H Report', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: false, enableDisableCheckbox: true, executeCheckbox: true },
    { name: 'Value Data Modification', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: false, executeCheckbox: true },
    { name: 'Corporate Verification Matrix', viewCheckbox: false, dataEntryCheckbox: false, authorizeCheckbox: false, enableDisableCheckbox: true, executeCheckbox: false },
    { name: 'Biller Registration', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: true, executeCheckbox: false },
    { name: 'Bill Payment Upload', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: false, executeCheckbox: false },
    { name: 'Pay Bills', viewCheckbox: true, dataEntryCheckbox: true, authorizeCheckbox: true, enableDisableCheckbox: false, executeCheckbox: false },
    { name: 'Bill Payment History', viewCheckbox: true, dataEntryCheckbox: false, authorizeCheckbox: false, enableDisableCheckbox: false, executeCheckbox: false },
    { name: 'Account Management', viewCheckbox: false, dataEntryCheckbox: false, authorizeCheckbox: false, enableDisableCheckbox: false, executeCheckbox: false },
  ]
}
