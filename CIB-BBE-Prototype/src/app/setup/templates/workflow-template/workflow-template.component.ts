import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { WorkflowTemplate } from './@models/workflow-template.model';

@Component({
  selector: 'app-workflow-template',
  templateUrl: './workflow-template.component.html',
  styleUrls: ['./workflow-template.component.scss']
})
export class WorkflowTemplateComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;

  formData: WorkflowTemplate = new WorkflowTemplate();
  mode: string;
  stepperDetails: Stepper = {
    masterName: 'Workflow Template',
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
      heading: 'Workflow Template',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Templates' },
      { label: 'Workflow Template' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/templates/workflowTemplate/private/view', data)
        .subscribe((formData: WorkflowTemplate) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.onModuleChange(formData.moduleValue);

          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  subProductArray = [];

  onModuleChange(value) {

    this.subProductArray = [];

    if (value == 'FSCM') {

      this.subProductArray = [
        { id: 'EIPP', displayName: 'EIPP' },
        { id: 'Seller Finance', displayName: 'Seller Finance' },
        { id: 'Warehouse Finance', displayName: 'Warehouse Finance' }
      ];

    }

  }

  eippFscmEvent = [
    { eventName: "Purchase order - Manual / Upload", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Purchase order - Acceptance", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Invoice - Manual", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Invoice - Upload", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Invoice - Acceptance", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Amend Invoice", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Cancel Invoice", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Dynamic Discounting - Invoice Selection", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Dynamic Discounting - Invoice Acceptance", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Invoice Payment", stepincluded: true, required: true, actionBySeller: false, actionByBuyer: false, actionByBank: false }

  ];

  sfFscmEvent = [
    { eventName: "Purchase order - Manual / Upload", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Purchase order - Acceptance", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Invoice - Manual", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Invoice - Upload", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Invoice - Acceptance", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Amend Invoice", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Cancel Invoice", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Invoice Payment", stepincluded: true, required: true, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Apply Finance", stepincluded: true, required: true, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Process Finance", stepincluded: true, required: true, actionBySeller: false, actionByBuyer: false, actionByBank: true },
    { eventName: "Finance Repayment", stepincluded: true, required: true, actionBySeller: true, actionByBuyer: true, actionByBank: false },
    { eventName: "Recovery", stepincluded: true, required: true, actionBySeller: false, actionByBuyer: false, actionByBank: true }

  ];

  bfFscmEvent = [
    { eventName: "Purchase order - Manual / Upload", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Purchase order - Acceptance", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Invoice - Manual", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Invoice - Upload", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Invoice - Acceptance", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Amend Invoice", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Cancel Invoice", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Dynamic Discounting - Invoice Selection", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Dynamic Discounting - Invoice Acceptance", stepincluded: false, required: false, actionBySeller: false, actionByBuyer: false, actionByBank: false },
    { eventName: "Invoice Payment", stepincluded: true, required: true, actionBySeller: false, actionByBuyer: false, actionByBank: false }

  ];

  warehouseFscmEvent = [
    { eventName: "Warehouse Receipt - Manual / Upload", stepincluded: false, required: true, actionBySeller: true, actionByBuyer: false, actionByBank: true },
    { eventName: "Warehouse Receipt - Acceptance", stepincluded: false, required: true, actionBySeller: false, actionByBuyer: false, actionByBank: true },
    { eventName: "Apply Warehouse Finance", stepincluded: false, required: true, actionBySeller: true, actionByBuyer: false, actionByBank: true },
    { eventName: "Process Warehouse Finance", stepincluded: false, required: true, actionBySeller: false, actionByBuyer: false, actionByBank: true },
    { eventName: "Repayment", stepincluded: false, required: false, actionBySeller: true, actionByBuyer: true, actionByBank: true }
  ];

  workflowConfigurationFSCM = [];

  onProductChange(value) {
    this.workflowConfigurationFSCM = [];

    if (value == 'EIPP') {
      this.workflowConfigurationFSCM = this.eippFscmEvent;
    }
    else if (value == 'Seller Finance') {
      this.workflowConfigurationFSCM = this.sfFscmEvent;
    }
    else if (value == 'Buyer Finance') {
      this.workflowConfigurationFSCM = this.bfFscmEvent;
    }
    else if (value == 'Warehouse Finance') {
      this.workflowConfigurationFSCM = this.warehouseFscmEvent;
    }

  }

}
