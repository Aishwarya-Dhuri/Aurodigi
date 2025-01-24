import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { QueryBuilder, TransactionDetails } from './@models/query-builder.model';
import { QuerybuildercheckboxComponent } from './@components/querybuildercheckbox/querybuildercheckbox.component';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class QueryBuilderComponent implements OnInit {
  @ViewChild('currencySellInit') currencySellInit!: AgGridListingComponent;
  @ViewChild('currencySellReview') currencySellReview!: AgGridListingComponent;


  formData: QueryBuilder = new QueryBuilder();
  transactionFormData: TransactionDetails = new TransactionDetails();
  editIndex: number = -1;
  transactionInitGridAPI: any;
  transactionReviewGridAPI: any;

  mode: string;
  stepperDetails: Stepper = {
    masterName: 'Alert Template',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };


  moduleList: any[] = [
    { id: '1', displayName: 'Location Code' },
    { id: '2', displayName: 'Location Name' },
    { id: '3', displayName: 'Country Name' },
    { id: '4', displayName: 'State' },
    { id: '5', displayName: 'Effective From' },
    { id: '6', displayName: 'Effective Till' }
  ];

  moduleMapping: any[] = [];

  orderByQueryField: any[] = [
    { id: '1', displayName: 'Location Code' },
    { id: '2', displayName: 'Location Name' },
    { id: '3', displayName: 'Country Name' },
    { id: '4', displayName: 'State' },
    { id: '5', displayName: 'Effective From' },
    { id: '6', displayName: 'Effective Till' }
  ];

  orderByQueryFieldAssign: any[] = [];

  frameworkComponents: any = {
    checkboxRenderer: QuerybuildercheckboxComponent,
  };

  constructor(
    private httpService: HttpService,
  ) { }

  ngOnInit(): void {
  }

  subProductArray = [];

  onModuleChange(value) {

    this.subProductArray = [];

    if (value == 'Setup') {

      this.subProductArray = [
        { id: 'Currency', displayName: 'Currency' },
        { id: 'Location', displayName: 'Location' },
        { id: 'Geography', displayName: 'Geography' },
        { id: 'System Branch', displayName: 'System Branch' },
        { id: 'Account Type', displayName: 'Account Type' },
        { id: 'Corporate Group', displayName: 'Corporate Group' },
        { id: 'Industry', displayName: 'Industry' },
        { id: 'Corporate Main', displayName: 'Corporate Main' },
        { id: 'Corporate Onboarding', displayName: 'Corporate Onboarding' },
        { id: 'Corporate Account', displayName: 'Corporate Account' },
        { id: 'Bank Role', displayName: 'Bank Role' },
        { id: 'Bank Profile', displayName: 'Bank Profile' },
        { id: 'Bank User', displayName: 'Bank User' },
        { id: 'Corporate Role', displayName: 'Corporate Role' },
        { id: 'Corporate Profile', displayName: 'Corporate Profile' },
        { id: 'Corporate User', displayName: 'Corporate User' },
        { id: 'Alert Template', displayName: 'Alert Template' },
        { id: 'Alert Mapping', displayName: 'Alert Mapping' },
        { id: 'Charge Template', displayName: 'Charge Template' },
        { id: 'Service Template', displayName: 'Service Template' },
        { id: 'Data Layout', displayName: 'Data Layout' },
        { id: 'Document Design', displayName: 'Document Design' }
      ];

    }

    else if (value == 'FSCM') {

      this.subProductArray = [
        { id: 'Seller Onboarding', displayName: 'Seller Onboarding' },
        { id: 'Buyer Onboarding', displayName: 'Buyer Onboarding' },
        { id: 'Corporate Programme Limit', displayName: 'Corporate Programme Limit' },
        { id: 'Manage Supply Chain', displayName: 'Manage Supply Chain' },
        { id: 'Entity Mapping', displayName: 'Entity Mapping' },
        { id: 'Account Wise Access', displayName: 'Account Wise Access' },
        { id: 'PO Entry', displayName: 'PO Entry' },
        { id: 'PO Upload', displayName: 'PO Upload' },
        { id: 'PO Acceptance', displayName: 'PO Acceptance' },
        { id: 'Invoice Entry', displayName: 'Invoice Entry' },
        { id: 'Invoice Upload', displayName: 'Invoice Upload' },
        { id: 'Invoice Acceptance', displayName: 'Invoice Acceptance' },
        { id: 'Amend Invoice', displayName: 'Amend Invoice' },
        { id: 'Adjustment Entry', displayName: 'Adjustment Entry' }
      ];

    }

  }

  // this.moduleList = [
  //   { id: 'Cheque Printing', displayName: 'Cheque Printing' },
  //   { id: 'Bill Payment', displayName: 'Bill Payment' },
  //   { id: 'On Due Date', displayName: 'On Due Date' },
  //   { id: 'Disabling Biller', displayName: 'Disabling Biller' },
  //   { id: 'Send For Release', displayName: 'Send For Release' }
  // ];

  // getModules(): void {
  //   this.httpService
  //     .httpPost('commons/commonService/private/getProductList')
  //     .subscribe((response) => {
  //       this.moduleList = response.dataList;
  //     });
  // }

  onAssignClick(i): void {
    const d = cloneDeep(this.moduleList[i]);
    this.formData.moduleMapping.unshift(d);
    this.moduleList.splice(i, 1);
  }

  onRemoveClick(i): void {
    const d = cloneDeep(this.formData.moduleMapping[i]);
    this.moduleList.unshift(d);
    this.formData.moduleMapping.splice(i, 1);
  }

  onAssignOrderByClick(i): void {
    const d = cloneDeep(this.orderByQueryField[i]);
    this.formData.orderByQueryFieldAssign.unshift(d);
    this.orderByQueryField.splice(i, 1);
  }

  onRemoveOrderByClick(i): void {
    const d = cloneDeep(this.formData.orderByQueryFieldAssign[i]);
    this.orderByQueryField.unshift(d);
    this.formData.orderByQueryFieldAssign.splice(i, 1);
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
