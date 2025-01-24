import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { AlertMapping } from './@models/alert-mapping.model';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { TINYMCE_DEFAULT_CONFIG, TINYMCE_DEFAULT_TEXT_CONFIG } from '../document-designer/@model/tinymce-default';
import * as _ from 'lodash';


@Component({
  selector: 'app-alert-mapping',
  templateUrl: './alert-mapping.component.html',
  styleUrls: ['./alert-mapping.component.scss']
})
export class AlertMappingComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;
  @ViewChild('clusterDetailsList') clusterDetailsList!: AgGridListingComponent;

  formData: AlertMapping = new AlertMapping();
  mode: string;
  isShowCorporateSearch: boolean;
  corporateSearchColDefUrl: string = 'commons/searchService/private/corporateSearchColDefs';
  corporateSearchRowDefUrl: string =
    'setup/corporateOnboarding/corporateMain/private/getAuthorizedList';
  loadingList: boolean = false;
  isShowAlertDetailsModal: boolean = false;
  isShowFscmModal: boolean = false;
  isShowAdditonalIdModal: boolean = false;
  editorInitConfig: any = _.cloneDeep(TINYMCE_DEFAULT_CONFIG);
  plainEditorInitConfig: any = _.cloneDeep(TINYMCE_DEFAULT_TEXT_CONFIG);

  getDataFromRow = {
    moduleName: '',
    alertName: '',
    category: '',
    getDataFromRow: '',
    alertTo: '',
    channel: '',
    eventName: '',
    frequency: 'IMMEDIATE',
  }

  stepperDetails: Stepper = {
    masterName: 'Alert Mapping',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  gridOptions: any = {
    rowModelType: 'clientSide',
    pagination: false,
    rowSelection: 'multiple',
    rowMultiSelectWithClick: true
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
      heading: 'Alert Mapping',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Templates' },
      { label: 'Alert Mapping' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/templates/alertMapping/private/view', data)
        .subscribe((formData: AlertMapping) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.onCorporateSelected({
            id: this.formData.corporateId,
            corporateCode: this.formData.corporateCode,
            corporateName: this.formData.corporateName,
          });
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          } else {
            this.prepareClusterData();
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

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateId = corporate.id.toString();
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName;
  }

  onCopyFromExistingCLuster() {
    this.httpService
      .httpPost(
        'setup/templates/alertMapping/private/' + this.formData.copyClusterFromExisting,
      )
      .subscribe((response: any) => {
        this.formData.clusterDetails = response.clusterDetails;
        console.log(this.formData.clusterDetails);
        this.prepareClusterData();
      });
  }

  private prepareClusterData() {
    this.formData.clusterDetails = this.formData.clusterDetails.map((record: any, i: number) => {
      record.index = i + 1;
      if (!record.actions) {
        record.actions = [
          {
            index: 1,
            displayName: 'View',
            type: 'BUTTON',
            icon: '',
            url: 'route~edit',
            methodName: 'viewModal',
            paramList: 'index',
            color: 'primary',
          },
          {
            index: 2,
            displayName: 'Additional IDs',
            type: 'BUTTON',
            icon: '',
            url: 'private/delete',
            methodName: 'additionalId',
            paramList: 'index',
            color: 'warn',
          },
        ];
      }
      return record;
    });
    this.refreshGrid()
  }

  private refreshGrid() {
    this.loadingList = true;
    setTimeout(() => {
      this.loadingList = false;
    }, 100);
  }

  onRowSelectedAlertDetails(event) {
    this.getDataFromRow.moduleName = event.data.moduleName
    this.getDataFromRow.alertName = event.data.alertName
    this.getDataFromRow.category = event.data.category
    this.getDataFromRow.alertTo = event.data.alertTo
    this.getDataFromRow.channel = event.data.channel
    this.getDataFromRow.eventName = event.data.eventName
  }

  viewModal() {
    this.isShowAlertDetailsModal = true;
  }

  additionalId() {
    this.isShowAdditonalIdModal = true;
  }

  onCancel() {
    this.isShowAdditonalIdModal = false;
  }

  onSubmit() {
    this.isShowAdditonalIdModal = false;
  }
}

