import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ContactInfo, ChargeTemplate } from './@models/charge-template.model';

@Component({
  selector: 'app-charge-template',
  templateUrl: './charge-template.component.html',
  styleUrls: ['./charge-template.component.scss']
})
export class ChargeTemplateComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;

  formData: ChargeTemplate = new ChargeTemplate();
  mode: string;
  stepperDetails: Stepper = {
    masterName: 'Charge Template',
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
      heading: 'Charge Template',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Template' },
      { label: 'Charge Template' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/templates/chargeTemplate/private/view', data)
        .subscribe((formData: ChargeTemplate) => {
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
      return true;
    }
    return true;
  }

  chargeLevel: any = []
  chargeEvent: any = []
  calculationFrequency: any = []



  product: any = [
    { id: 'EIPP', displayName: 'EIPP' },
    { id: 'Seller Finance', displayName: 'Seller Finance' },
    { id: 'Warehouse Finance', displayName: 'Warehouse Finance' }
  ]

  onModuleChange(value) {
    this.chargeLevel = []
    this.chargeEvent = []
    this.calculationFrequency = []

    if (value === 'Setup' || value === 'Receivable' || value === 'Positive Pay' || value === 'Cashflow') {
      this.chargeLevel = [
        { id: 'Corporate', displayName: 'Corporate' }
      ]
    }
    else if (value === 'FSCM') {
      this.chargeLevel = [
        { id: 'Corporate', displayName: 'Corporate' },
        { id: 'Product', displayName: 'Product' }
      ];
      this.chargeEvent = [
        { id: 'Invoice Generation', displayName: 'Invoice Generation' },
        { id: 'Purchase Order Initiate', displayName: 'Purchase Order Initiate' },
        { id: 'Purchase Order', displayName: 'Purchase Order' },
        { id: 'Fixed Charges', displayName: 'Fixed Charges' },
        { id: 'Invoice Entry / Upload Charges', displayName: 'Invoice Entry / Upload Charges' },
        { id: 'PO Entry / Upload Charges', displayName: 'PO Entry / Upload Charges' },
        { id: 'Late Payment Charges', displayName: 'Late Payment Charges' },
        { id: 'Invoice Payment Charges', displayName: 'Invoice Payment Charges' },
        { id: 'Process Finance Charges', displayName: 'Process Finance Charges' }
      ]
      this.calculationFrequency = [
        { id: 'Immediate', displayName: 'Immediate' },
        { id: 'Dialy', displayName: 'Dialy' },
        { id: 'Monthly', displayName: 'Monthly' },
        { id: 'Yearly', displayName: 'Yearly' }
      ]
    }
    else if (value === 'Receivable') {
      this.chargeEvent = [
        { id: 'Invoice Creation', displayName: 'Invoice Creation' },
        { id: 'Amend Invoice', displayName: 'Amend Invoice' },
        { id: 'Cancel Invoice', displayName: 'Cancel Invoice' },
        { id: 'Payment Receipt Entry', displayName: 'Payment Receipt Entry' },
        { id: 'Subscription Charges', displayName: 'Subscription Charges' },
        { id: 'Administration Charges', displayName: 'Administration Charges' },
        { id: 'Bank User Manual Reconciliation', displayName: 'Bank User Manual Reconciliation' },
        { id: 'Bank User Manual Un-Reconciliation', displayName: 'Bank User Manual Un-Reconciliation' },
        { id: 'Auto Reconciliation (With Monthly Charges)', displayName: 'Auto Reconciliation (With Monthly Charges)' }
      ]
    }
    else if (value === 'Cashflow') {
      this.chargeEvent = [
        { id: 'Subscription Charges (Fixed)', displayName: 'Subscription Charges (Fixed)' },
        { id: 'Administrative/Maintenance Charge (Fixed)', displayName: 'Administrative/Maintenance Charge (Fixed)' },
        { id: 'Manual Forecast Entry/Upload Charge (Fixed/Slap)', displayName: 'Manual Forecast Entry/Upload Charge (Fixed/Slap)' },
        { id: 'Report Mapping Charges (Fixed/Slap)', displayName: 'Report Mapping Charges (Fixed/Slap)' },
        { id: 'External Account Mapping Charge (Fixed Charge)', displayName: 'External Account Mapping Charge (Fixed Charge)' }
      ]
    }
  }

  onProductChange(value) {
    this.chargeEvent = []
    if (value === 'EIPP') {
      this.chargeEvent = [
        { id: 'Invoice Generation', displayName: 'Invoice Generation' },
        { id: 'Purchase Order Initiate', displayName: 'Purchase Order Initiate' },
        { id: 'Purchase Order', displayName: 'Purchase Order' },
        { id: 'Fixed Charges', displayName: 'Fixed Charges' },
        { id: 'Invoice Entry / Upload Charges', displayName: 'Invoice Entry / Upload Charges' },
        { id: 'PO Entry / Upload Charges', displayName: 'PO Entry / Upload Charges' },
        { id: 'Late Payment Charges', displayName: 'Late Payment Charges' },
        { id: 'Invoice Payment Charges', displayName: 'Invoice Payment Charges' },
        { id: 'Process Finance Charges', displayName: 'Process Finance Charges' }
      ]
    }
    else if (value === 'Seller Finance') {
      this.chargeEvent = [
        { id: 'Invoice Generation', displayName: 'Invoice Generation' },
        { id: 'Purchase Order Initiate', displayName: 'Purchase Order Initiate' },
        { id: 'Purchase Order', displayName: 'Purchase Order' },
        { id: 'Fixed Charges', displayName: 'Fixed Charges' },
        { id: 'Invoice Entry / Upload Charges', displayName: 'Invoice Entry / Upload Charges' },
        { id: 'PO Entry / Upload Charges', displayName: 'PO Entry / Upload Charges' },
        { id: 'Late Payment Charges', displayName: 'Late Payment Charges' },
        { id: 'Invoice Payment Charges', displayName: 'Invoice Payment Charges' },
        { id: 'Process Finance Charges', displayName: 'Process Finance Charges' }
      ]
    }
    else if (value === 'Warehouse Finance') {
      this.chargeEvent = [
        { id: 'Process Warehouse Finance', displayName: 'Process Warehouse Finance' },
        { id: 'Recovery Charge', displayName: 'Recovery Charge' },
        { id: 'Warehouse Receipt Processing Charge', displayName: 'Warehouse Receipt Processing Charge' },
        { id: 'Inspection Charges', displayName: 'Inspection Charges' }
      ]
    }
  }

  addContactInfo() {
    this.formData.contactInfo.push(new ContactInfo());
  }

  removeContactInfo(index: number) {
    this.formData.contactInfo.splice(index, 1);
  }

}
