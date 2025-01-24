import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { cloneDeep, filter } from 'lodash';
import { ChargeMapping, TransactionDetails } from './@models/charge-mapping.model';

@Component({
  selector: 'app-charge-mapping',
  templateUrl: './charge-mapping.component.html',
  styleUrls: ['./charge-mapping.component.scss']
})
export class ChargeMappingComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;
  @ViewChild('currencySellInit') currencySellInit!: AgGridListingComponent;
  @ViewChild('currencySellReview') currencySellReview!: AgGridListingComponent;
  @ViewChild('clusterDetailsList') clusterDetailsList!: AgGridListingComponent;
  @ViewChild('productMappingDetailsList') productMappingDetailsList!: AgGridListingComponent;
  @ViewChild('CorpAddNewTemplate') CorpAddNewTemplate!: AgGridListingComponent;

  formData: ChargeMapping = new ChargeMapping();
  transactionFormData: TransactionDetails = new TransactionDetails()
  copyExistingDataList = []
  isShowCorpTempMappingDetails = false;
  isShowCorpAddNewTemplate = false
  corpMapDetails = {
    templateCode: '222',
    templateName: 'TempJM',
    module: 'Setup',
    chargeLevel: 'Corporate',
    currency: 'THB',
    chargeEvent: 'ADMINISTRATIONCHARGES',
    chargeApplicable: 'Corporate',
    calFrequency: 'Monthly',
    postingFrequency: 'Monthly',
    chargeRoundOff: 'Yes',
    chargeRoundDecimal: '2',
    taxApplicable: 'No',
    chargeBasis: 'Value',
    strategyType: 'Linear',
    varCharge: 'THB 0.00',
    fixedCharge: 'THB 10.00',
    minCharge: 'THB 9.00',
    maxCharge: 'THB 11.00'

  }

  gridOptions: any = {
    rowModelType: 'clientSide',
    pagination: false
  };

  corpAddNewTempGridOptions: any = {
    rowModelType: 'serverSide',
    pagination: false,
    rowSelection: 'multiple',
    rowMultiSelectWithClick: true
  };

  mode: string;

  stepperDetails: Stepper = {
    masterName: 'Charge Mapping',
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
      heading: 'Charge Mapping',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Bank-Security' },
      { label: 'Charge Mapping' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }



  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/templates/chargeMapping/private/view', data)
        .subscribe((formData: ChargeMapping) => {
          this.viewService.clearAll();
          this.onChangeModule(formData.module)
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

  copyChargeMappingList = []

  onChangeModule(module) {
    this.copyChargeMappingList = []
    if (module === 'Setup') {
      this.copyChargeMappingList = [
        { id: 'chargeJm3', displayName: 'Charge JM3' },
        { id: 'normalStepCharge', displayName: 'Normal Step Charge' },
        { id: 'report', displayName: 'Report' }
      ]
    }
    else if (module === 'FSCM') {
      this.copyChargeMappingList = [
        { id: 'Product Charge K01', displayName: 'Product Charge K01' },
        { id: 'EOD Charge', displayName: 'EOD Charge' },
        { id: 'Volume EOD Processing Charge', displayName: 'Volume EOD Processing Charge' },
        { id: 'EIPP EOD Charge Template', displayName: 'EIPP EOD Charge Template' }
      ]
    }
  }

  loadingList: boolean = false;
  productMappingLoadingList: boolean = false;

  onCopyFromExistingCLuster(value) {
    this.httpService
      .httpPost(
        'setup/templates/chargeMapping/private/' + this.formData.copyClusterFromExisting,
      )
      .subscribe((response: any) => {
        this.formData.clusterDetails = response.clusterDetails;
        console.log(this.formData.clusterDetails);
        this.prepareClusterData();
      });

    this.formData.isCopyFromChargeMapping = null;
    this.formData.copyClusterFromExisting = null;

  }

  onCorpAddNewTemplate() {
    this.isShowCorpAddNewTemplate = true
  }

  viewModal(index: number) {
    this.isShowCorpTempMappingDetails = true;
  }

  delete(index: number) {
    this.formData.clusterDetails.splice(index, 1);
    this.prepareClusterData();
  }

  private prepareClusterData() {
    this.formData.clusterDetails = this.formData.clusterDetails.map((record: any, i: number) => {
      record.index = i + 1;
      if (!record.actions) {
        record.actions = [
          {
            index: 1,
            displayName: 'Edit',
            type: 'ICON',
            icon: 'pi pi-eye',
            url: 'route~edit',
            methodName: 'viewModal',
            paramList: 'index',
            color: 'primary',
          },
          {
            index: 2,
            displayName: 'Delete',
            type: 'ICON',
            icon: 'pi pi-trash',
            url: 'private/delete',
            methodName: 'delete',
            paramList: 'index',
            color: 'warn',
          },
        ];
      }
      return record;
    });
    this.refreshGrid()
  }

  private productMappingRefreshGrid() {
    this.productMappingLoadingList = true;
    setTimeout(() => {
      this.productMappingLoadingList = false;
    }, 100);
  }

  private refreshGrid() {
    this.loadingList = true;
    setTimeout(() => {
      this.loadingList = false;
    }, 100);
  }

  onResetCorpMapping() {
    this.formData.search = null;
    this.formData.searchField = null;
  }

  onGoCorpMapping() {
    this.clusterDetailsList.refreshGridList()
  }

  onResetProdcutMapping() {
    this.formData.productTemplateSearch = null;
    this.formData.searchProductField = null;
  }

  onGoProductMapping() {
    this.productMappingDetailsList.refreshGridList()
  }
  //-------COPYMapping------

  templateName = ''
  productName = ''

  onRowSelectedCorpAddNewTemp(event) {
    console.log(event.data);
    this.templateName = event.data.templateCode
    console.log(this.templateName);

  }

}
