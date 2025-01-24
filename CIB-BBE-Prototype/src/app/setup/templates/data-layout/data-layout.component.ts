import { Component, OnInit, ViewChild } from '@angular/core';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { DataLayout, columnDetails } from './@models/data-layout.model';
import { Select } from 'src/app/shared/@models/select.model';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { cloneDeep } from 'lodash';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-data-layout',
  templateUrl: './data-layout.component.html',
  styleUrls: ['./data-layout.component.scss']
})
export class DataLayoutComponent implements OnInit {
  @ViewChild('dataLayoutForm') dataLayoutForm: any;
  formData: DataLayout = new DataLayout();

  newColumData: columnDetails = new columnDetails();
  columnViewData: columnDetails;

  showHeaderAddModal: boolean = false;
  showDetailAddModal: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'Data Layout',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };
  editIndex: number = -1;

  serviceDetailsCurrentInitiatePage: number = 1;
  showServiceDetailsInititateAnalytics: boolean = false;
  moduleList: Select[] = [];
  submoduleName: any = []
  selectedList: any;
  serviceDetailslistingType = 'grid';
  @ViewChild('serviceDetailslisting') serviceDetailslisting!: AgGridListingComponent;

  sidebarlist: any = [
    { label: "Header", id: 1, checkbox: false, count: 0 },
    { label: "Detail", id: 2, checkbox: false, count: 0 },
    { label: "Footer", id: 3, checkbox: false, count: 0 },
    { label: "Enrichment", id: 4, checkbox: false, count: 0 },

  ]
  transactionInitGridAPI: any;
  columnGridOptions: any = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    pagination: false,
  };
  @ViewChild('headergrid') headergrid!: AgGridListingComponent;
  @ViewChild('detailgrid') detailgrid!: AgGridListingComponent;
  @ViewChild('footergrid') footergrid!: AgGridListingComponent;
  @ViewChild('enrichmentgrid') enrichmentgrid!: AgGridListingComponent;
  showFooterAddModal: boolean;
  showEnrichmentAddModal: boolean;
  mode: string;

  // @ViewChild('currencySellReview') currencySellReview!: AgGridListingComponent;
  constructor(private viewService: ViewService, private httpService: HttpService,) { }

  ngOnInit(): void {
    this.selectedList = this.sidebarlist[0];
    this.getViewData();

  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/templates/dataLayout/private/view', data)
        .subscribe((formData: DataLayout) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  onModuleChange(value) {
    this.submoduleName = []
    if (value === 'FSCM') {
      this.submoduleName = [
        { id: 'selleronboardingupload', displayName: 'Seller onboarding Upload' },
        { id: 'buyeronboardingupload', displayName: 'Buyer onboarding Upload' },
        { id: 'invoiceupload', displayName: 'Invoice Upload' },
        { id: 'poupload', displayName: 'PO Upload' },
        { id: 'creditnoteupload', displayName: 'Credit Note Upload' },
        { id: 'debitnoteupload', displayName: 'Debit Note Upload' },
        { id: 'consolidatedupload', displayName: 'Consolidated Upload' }
      ]
    } else if (value === 'Setup') {
      this.submoduleName = [
        { id: 'corporatebranch', displayName: 'Corporate Branch' },
        { id: 'corporatecluster', displayName: 'Corporate Cluster' },
        { id: 'corporateprofile', displayName: 'Corporate Profile' },
        { id: 'corporatesecuritymapping', displayName: 'Corporate Security Mapping' },
        { id: 'corporateuser', displayName: 'Corporate User' },
        { id: 'role', displayName: 'Role' },
        { id: 'unlockuser', displayName: 'Unlock User' },

      ]
    } else if (value === 'Receivable' || value === 'Positive Pay' || value === 'Cashflow') {
      this.submoduleName = [
        { id: 'invoiceupload', displayName: 'Invoice Upload' },
        { id: 'receiptupload', displayName: 'Receipt Upload' },
        { id: 'reconcilereportdownload', displayName: 'Reconcile Report Download' },

      ]
    } else if (value === 'Warehouse Finance') {
      this.submoduleName = [
        { id: 'receiptdownload', displayName: 'Receipt Upload' },
        { id: 'warehouse', displayName: 'Warehouse' },
      ]

    }

  }

  sidebarSelectededListing(list: any) {
    this.selectedList = list
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

  showModal() {
    this.showHeaderAddModal = true
  }

  showAddDetailColumnModal() {
    this.showDetailAddModal = true
  }

  showAddFooterColumnModal() {
    this.showFooterAddModal = true
  }
  showAddEnrichmentColumnModal() {
    this.showEnrichmentAddModal = true

  }
  onGridReady(api: any): void {
    this.transactionInitGridAPI = api;
    this.transactionInitGridAPI.setRowData(this.formData.newColumn);
  }

  onDetailGridReady(api: any): void {
    this.transactionInitGridAPI = api;
    this.transactionInitGridAPI.setRowData(this.formData.newDetailColumn);
  }

  onFooterGridReady(api: any): void {
    this.transactionInitGridAPI = api;
    this.transactionInitGridAPI.setRowData(this.formData.newFooterColumn);
  }

  onEnrichmentGridReady(api: any): void {
    this.transactionInitGridAPI = api;
    this.transactionInitGridAPI.setRowData(this.formData.newEnrichmentColumn);
  }

  onAddNewColumnClick() {
    this.showHeaderAddModal = true;

    this.newColumData = this.addDocumentGridActions(this.newColumData)
    this.formData.newColumn.push({ ...this.newColumData });
    this.headergrid.setRowData(this.formData.newColumn);


    // this.currencySellReview?.setRowData(this.formData.newColumn);
    this.newColumData = new columnDetails();
    this.showHeaderAddModal = false;
  }



  onUpdateColumn() {

    if (this.editIndex > -1) {
      this.showHeaderAddModal = true;

      this.formData.newColumn[this.editIndex] = {
        ...this.formData.newColumn[this.editIndex],
        ...cloneDeep(this.newColumData),
      };
      if (this.headergrid) {
        this.headergrid.setRowData(this.formData.newColumn);
      }

      this.newColumData = new columnDetails();
      this.editIndex = -1;
      this.showHeaderAddModal = false;

    }
  }

  onEditColumn(value: any): void {
    const index: number = this.formData.newColumn.findIndex((newColumn: columnDetails) => newColumn.id == value);
    if (index > -1) {
      this.showHeaderAddModal = true;

      const formData = cloneDeep(this.formData.newColumn[index]);
      delete formData.id
      this.newColumData = formData;
      this.editIndex = index;
    }

  }

  onDeleteColumn(value: any): void {
    const index: number = this.formData.newColumn.findIndex((newColumn: columnDetails) => newColumn.id == value);
    if (index >= 0) {
      this.formData.newColumn.splice(index, 1);
      this.transactionInitGridAPI.setRowData(this.formData.newColumn);
      // this.transactionReviewGridAPI.setRowData(this.formData.newColumn);
    }
  }

  onViewColumn(value: any): void {
    this.showHeaderAddModal = true;
    const index: number = this.formData.newColumn.findIndex((newColumn: columnDetails) => newColumn.id == value);
    if (index > -1) {
      this.columnViewData = this.formData.newColumn[index]
    }
  }

  addDocumentGridActions(newColumn: columnDetails): columnDetails {
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
      methodName: 'onEditColumn',
      paramList: 'id',
    };
    const deleteAction = {
      index: 3,
      color: 'warn',
      displayName: 'Delete',
      type: 'ICON',
      icon: 'fa-trash-alt',
      methodName: 'onDeleteColumn',
      paramList: 'id',
    };
    newColumn.initActions = [
      // viewAction, 
      editAction, deleteAction];
    newColumn.reviewActions = [
      // viewAction
    ];
    return newColumn;
  }


  //Detail

  onAddNewDetailColumnClick() {
    this.showDetailAddModal = true;
    this.newColumData = this.addDetailGridActions(this.newColumData)
    this.formData.newDetailColumn.push({ ...this.newColumData });
    this.detailgrid.setRowData(this.formData.newDetailColumn);
    // this.currencySellReview?.setRowData(this.formData.newColumn);
    this.newColumData = new columnDetails();
    this.showDetailAddModal = false;
  }


  onUpdateDetailColumn() {
    if (this.editIndex > -1) {
      this.showDetailAddModal = true;

      this.formData.newDetailColumn[this.editIndex] = {
        ...this.formData.newDetailColumn[this.editIndex],
        ...cloneDeep(this.newColumData),
      };
      if (this.detailgrid) {
        this.detailgrid.setRowData(this.formData.newDetailColumn);
      }

      this.newColumData = new columnDetails();
      this.editIndex = -1;
      this.showDetailAddModal = false;
    }

  }


  onEditDetailColumn(value: any): void {
    const index: number = this.formData.newDetailColumn.findIndex((newDetailColumn: columnDetails) => newDetailColumn.id == value);
    if (index > -1) {
      this.showDetailAddModal = true;

      const formData = cloneDeep(this.formData.newDetailColumn[index]);
      delete formData.id
      this.newColumData = formData;
      this.editIndex = index;
    }

  }

  onDeleteDetailColumn(value: any): void {
    const index: number = this.formData.newDetailColumn.findIndex((newDetailColumn: columnDetails) => newDetailColumn.id == value);
    if (index >= 0) {
      this.formData.newDetailColumn.splice(index, 1);
      this.transactionInitGridAPI.setRowData(this.formData.newDetailColumn);
      // this.transactionReviewGridAPI.setRowData(this.formData.newColumn);
    }
  }


  addDetailGridActions(newColumn: columnDetails): columnDetails {
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
      methodName: 'onEditDetailColumn',
      paramList: 'id',
    };
    const deleteAction = {
      index: 3,
      color: 'warn',
      displayName: 'Delete',
      type: 'ICON',
      icon: 'fa-trash-alt',
      methodName: 'onDeleteDetailColumn',
      paramList: 'id',
    };
    newColumn.initActions = [
      // viewAction, 
      editAction, deleteAction];
    newColumn.reviewActions = [
      // viewAction
    ];
    return newColumn;
  }


  //Footer
  onAddNewFooterColumnClick() {
    this.showFooterAddModal = true;
    this.newColumData = this.addFooterGridActions(this.newColumData)
    this.formData.newFooterColumn.push({ ...this.newColumData });
    this.footergrid.setRowData(this.formData.newFooterColumn);
    // this.currencySellReview?.setRowData(this.formData.newColumn);
    this.newColumData = new columnDetails();
    this.showFooterAddModal = false;
  }


  onUpdateFooterColumn() {
    if (this.editIndex > -1) {
      this.showFooterAddModal = true;

      this.formData.newFooterColumn[this.editIndex] = {
        ...this.formData.newFooterColumn[this.editIndex],
        ...cloneDeep(this.newColumData),
      };
      if (this.footergrid) {
        this.footergrid.setRowData(this.formData.newFooterColumn);
      }

      this.newColumData = new columnDetails();
      this.editIndex = -1;
      this.showFooterAddModal = false;
    }

  }


  onEditFooterColumn(value: any): void {
    const index: number = this.formData.newFooterColumn.findIndex((newFooterColumn: columnDetails) => newFooterColumn.id == value);
    if (index > -1) {
      this.showFooterAddModal = true;

      const formData = cloneDeep(this.formData.newFooterColumn[index]);
      delete formData.id
      this.newColumData = formData;
      this.editIndex = index;
    }

  }

  onDeleteFooterColumn(value: any): void {
    const index: number = this.formData.newFooterColumn.findIndex((newFooterColumn: columnDetails) => newFooterColumn.id == value);
    if (index >= 0) {
      this.formData.newFooterColumn.splice(index, 1);
      this.transactionInitGridAPI.setRowData(this.formData.newFooterColumn);
      // this.transactionReviewGridAPI.setRowData(this.formData.newColumn);
    }
  }


  addFooterGridActions(newColumn: columnDetails): columnDetails {
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
      methodName: 'onEditFooterColumn',
      paramList: 'id',
    };
    const deleteAction = {
      index: 3,
      color: 'warn',
      displayName: 'Delete',
      type: 'ICON',
      icon: 'fa-trash-alt',
      methodName: 'onDeleteFooterColumn',
      paramList: 'id',
    };
    newColumn.initActions = [
      // viewAction, 
      editAction, deleteAction];
    newColumn.reviewActions = [
      // viewAction
    ];
    return newColumn;
  }


  //Enrichment
  onAddNewEnrichmentColumnClick() {
    this.showEnrichmentAddModal = true;
    this.newColumData = this.addEnrichmentGridActions(this.newColumData)
    this.formData.newEnrichmentColumn.push({ ...this.newColumData });
    this.enrichmentgrid.setRowData(this.formData.newEnrichmentColumn);
    // this.currencySellReview?.setRowData(this.formData.newColumn);
    this.newColumData = new columnDetails();
    this.showEnrichmentAddModal = false;
  }


  onUpdateEnrichmentColumn() {
    if (this.editIndex > -1) {
      this.showEnrichmentAddModal = true;

      this.formData.newEnrichmentColumn[this.editIndex] = {
        ...this.formData.newEnrichmentColumn[this.editIndex],
        ...cloneDeep(this.newColumData),
      };
      if (this.enrichmentgrid) {
        this.enrichmentgrid.setRowData(this.formData.newEnrichmentColumn);
      }

      this.newColumData = new columnDetails();
      this.editIndex = -1;
      this.showEnrichmentAddModal = false;
    }

  }


  onEditEnrichmentColumn(value: any): void {
    const index: number = this.formData.newEnrichmentColumn.findIndex((newEnrichmentColumn: columnDetails) => newEnrichmentColumn.id == value);
    if (index > -1) {
      this.showEnrichmentAddModal = true;

      const formData = cloneDeep(this.formData.newEnrichmentColumn[index]);
      delete formData.id
      this.newColumData = formData;
      this.editIndex = index;
    }

  }

  onDeleteEnrichmentColumn(value: any): void {
    const index: number = this.formData.newEnrichmentColumn.findIndex((newEnrichmentColumn: columnDetails) => newEnrichmentColumn.id == value);
    if (index >= 0) {
      this.formData.newEnrichmentColumn.splice(index, 1);
      this.transactionInitGridAPI.setRowData(this.formData.newEnrichmentColumn);
      // this.transactionReviewGridAPI.setRowData(this.formData.newColumn);
    }
  }


  addEnrichmentGridActions(newColumn: columnDetails): columnDetails {
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
      methodName: 'onEditEnrichmentColumn',
      paramList: 'id',
    };
    const deleteAction = {
      index: 3,
      color: 'warn',
      displayName: 'Delete',
      type: 'ICON',
      icon: 'fa-trash-alt',
      methodName: 'onDeleteEnrichmentColumn',
      paramList: 'id',
    };
    newColumn.initActions = [
      // viewAction, 
      editAction, deleteAction];
    newColumn.reviewActions = [
      // viewAction
    ];
    return newColumn;
  }


}
