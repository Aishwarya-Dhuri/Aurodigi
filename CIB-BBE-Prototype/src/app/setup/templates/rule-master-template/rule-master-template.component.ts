import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { RuleMasterTemplate, TransactionDetails } from './@models/rule-master-template.model';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-rule-master-template',
  templateUrl: './rule-master-template.component.html',
  styleUrls: ['./rule-master-template.component.scss']
})
export class RuleMasterTemplateComponent implements OnInit {
  @ViewChild('currencySellInit') currencySellInit!: AgGridListingComponent;
  @ViewChild('currencySellReview') currencySellReview!: AgGridListingComponent;

  formData: RuleMasterTemplate = new RuleMasterTemplate();
  transactionFormData: TransactionDetails = new TransactionDetails();
  editIndex: number = -1;
  transactionInitGridAPI: any;
  transactionReviewGridAPI: any;

  mode: string;
  stepperDetails: Stepper = {
    masterName: 'Rule Master Template',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private actionsService: ActionService,
    private viewService: ViewService,
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Alert Template',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Security-Corporate' },
      { label: 'Service Template' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/templates/alertTemplate/private/view', data)
        .subscribe((formData: RuleMasterTemplate) => {
          this.viewService.clearAll();
          this.formData = formData;

          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  subProductArray = [];

  onModuleChange(value) {

    this.subProductArray = [];

    if (value == 'FIFO') {

      this.subProductArray = [
        { id: 'Invoice Entry Date', displayName: 'Invoice Entry Date' },
        { id: 'Invoice Date', displayName: 'Invoice Date' },
        { id: 'Invoice Due Date', displayName: 'Invoice Due Date' }
      ];

    }

    else if (value == 'LIFO') {
      this.subProductArray = [
        { id: 'Invoice Entry Date', displayName: 'Invoice Entry Date' },
        { id: 'Invoice Date', displayName: 'Invoice Date' },
        { id: 'Invoice Due Date', displayName: 'Invoice Due Date' }
      ];

    }

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
    // const checkboxShow = {}
    transaction.initActions = [
      // viewAction, 
      editAction, deleteAction];
    transaction.reviewActions = [
      // viewAction
    ];
    transaction.editCheckbox = [];
    return transaction;
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

  onAddTransactionClick() {
    this.transactionFormData = this.addDocumentGridActions(this.transactionFormData)
    this.formData.transaction.push({ ...this.transactionFormData });
    this.currencySellInit.setRowData(this.formData.transaction);
    this.currencySellReview?.setRowData(this.formData.transaction);
    this.transactionFormData = new TransactionDetails();
  }
}
