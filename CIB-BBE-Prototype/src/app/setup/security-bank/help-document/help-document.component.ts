import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { HelpDocument } from './@models/help-document.model';

@Component({
  selector: 'app-help-document',
  templateUrl: './help-document.component.html',
  styleUrls: ['./help-document.component.scss']
})
export class HelpDocumentComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;

  formData: HelpDocument = new HelpDocument();
  mode: string;
  subModuleNameList = []
  isViewPassword: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'Help Document',
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
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Help Document',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Security-Bank' },
      { label: 'Help Document' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/securityBank/helpDocument/private/view', data)
        .subscribe((formData: HelpDocument) => {
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
      return this.bankProfileForm.valid;
    }
    return true;
  }

  onChangeModule(module) {
    this.subModuleNameList = []
    if (module === 'Setup') {
      this.subModuleNameList = [
        { id: 'Corporate Branch', displayName: 'Corporate Branch' },
        { id: 'Corporate Cluster', displayName: 'Corporate Cluster' },
        { id: 'Corporate User', displayName: 'Corporate User' },
        { id: 'Role', displayName: 'Role' },
        { id: 'Corporate Profile', displayName: 'Corporate Profile' },
        { id: 'Unlock User', displayName: 'Unlock User' },
        { id: 'Change Password', displayName: 'Change Password' },
        { id: 'Reset User', displayName: 'Reset User' },
        { id: 'Corporate Security Mapping', displayName: 'Corporate Security Mapping' },
        { id: 'Request Balance Confirmation', displayName: 'Request Balance Confirmation' },
        { id: 'Download Security Files(s)', displayName: 'Download Security Files(s)' },
        { id: 'Authorization Matrix', displayName: 'Authorization Matrix' },
        { id: 'Adhoc Statement', displayName: 'Adhoc Statement' },
        { id: 'Request Balance Confirmation Letter', displayName: 'Request Balance Confirmation Letter' },
        { id: 'Request New Draft', displayName: 'Request New Draft' },
        { id: 'Stop Payment', displayName: 'Stop Payment' },
        { id: 'Request Own Cheques Leaves', displayName: 'Request Own Cheques Leaves' },
        { id: 'Cheque Book Request', displayName: 'Cheque Book Request' },
        { id: 'Early Termination Enquiry', displayName: 'Early Termination Enquiry' },
        { id: 'Leasing Quotation Request', displayName: 'Leasing Quotation Request' },
        { id: 'Authorization Dashboard', displayName: 'Authorization Dashboard' },
        { id: 'Request for Finance Repayment', displayName: 'Request for Finance Repayment' },
        { id: 'Update Maturity Date', displayName: 'Update Maturity Date' },
        { id: 'Collection of Documents', displayName: 'Collection of Documents' },
        { id: 'Other Generic Requests', displayName: 'Other Generic Requests' },
        { id: 'Request Finance', displayName: 'Request Finance' },
        { id: 'Request Collection', displayName: 'Request Collection' }
      ]
    }
    else if (module === 'Payments') {
      this.subModuleNameList = [
        { id: 'Account Summary', displayName: 'Account Summary' },
        { id: 'Biller Registration', displayName: 'Biller Registration' },
        { id: 'MT Registration', displayName: 'MT Registration' },
        { id: 'Cheque Reprinting Authorization', displayName: 'Cheque Reprinting Authorization' },
        { id: 'Bill Payment History', displayName: 'Bill Payment History' },
        { id: 'Bill Presentment', displayName: 'Bill Presentment' },
        { id: 'H2H-SI Upload Log', displayName: 'H2H-SI Upload Log' },
        { id: 'Account Statement Download', displayName: 'Account Statement Download' },
        { id: 'Own Cheques', displayName: 'Own Cheques' },
        { id: 'Reconcile', displayName: 'Reconcile' },
        { id: 'Accept Inventory from Bank', displayName: 'Accept Inventory from Bank' },
        { id: 'Cheque Services', displayName: 'Cheque Services' },
        { id: 'Cheque Status Inquiry', displayName: 'Cheque Status Inquiry' },
        { id: 'Bill Payment', displayName: 'Bill Payment' },
        { id: 'Bulk Payment Request', displayName: 'Bulk Payment Request' },
        { id: 'Single Payment Request', displayName: 'Single Payment Request' },
        { id: 'Beneficiary', displayName: 'Beneficiary' },
        { id: 'Account Alias Name', displayName: 'Account Alias Name' },
        { id: 'Account Wise Access', displayName: 'Account Wise Access' },
        { id: 'Cancel Payment Request', displayName: 'Cancel Payment Request' },
        { id: 'Send to Bank', displayName: 'Send to Bank' },
        { id: 'Bill Payment Upload', displayName: 'Bill Payment Upload' },
        { id: 'Pay Bills', displayName: 'Pay Bills' },
        { id: 'Subscriber Confirmation', displayName: 'Subscriber Confirmation' },
        { id: 'Template Management', displayName: 'Template Management' },
        { id: 'SI Management', displayName: 'SI Management' }
      ]
    }
    else if (module === 'Collections') {
      this.subModuleNameList = [
        { id: 'Pickup Point Report', displayName: 'Pickup Point Report' },
        { id: 'Corporate Client Report', displayName: 'Corporate Client Report' }
      ]
    }
    else if (module === 'FSCM') {
      this.subModuleNameList = [
        { id: 'Transaction Enquiry', displayName: 'Transaction Enquiry' },
        { id: 'Authorization Dashboard', displayName: 'Authorization Dashboard' },
        { id: 'Seller Onboarding', displayName: 'Seller Onboarding' },
        { id: 'Buyer Onboarding', displayName: 'Buyer Onboarding' },
        { id: 'Entity Sub Code Mapping', displayName: 'Entity Sub Code Mapping' },
        { id: 'Invoice Payment', displayName: 'Invoice Payment' },
        { id: 'Invoice Entry', displayName: 'Invoice Entry' },
        { id: 'Invoice Acceptance', displayName: 'Invoice Acceptance' },
        { id: 'PO Entry', displayName: 'PO Entry' },
        { id: 'PO Acceptance', displayName: 'PO Acceptance' },
        { id: 'Apply Finance', displayName: 'Apply Finance' },
        { id: 'Corporate H2H Log', displayName: 'Corporate H2H Log' },
        { id: 'Credit/Debit Note Entry', displayName: 'Credit/Debit Note Entry' },
        { id: 'Cancel Payment', displayName: 'Cancel Payment' },
        { id: 'Amend Invoice', displayName: 'Amend Invoice' },
        { id: 'Cancel Invoice', displayName: 'Cancel Invoice' },
        { id: 'Consolidated Upload', displayName: 'Consolidated Upload' },
        { id: 'Credit Debit Note Acceptance', displayName: 'Credit Debit Note Acceptance' }
      ]
    }
    else if (module === 'Generic') {
      this.subModuleNameList = [
        { id: 'Generic', displayName: 'Generic' }
      ]
    }

  }
}
