import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ReportMapping } from './@models/report-mapping.model';

@Component({
  selector: 'app-report-mapping',
  templateUrl: './report-mapping.component.html',
  styleUrls: ['./report-mapping.component.scss']
})
export class ReportMappingComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;

  formData: ReportMapping = new ReportMapping();

  isShowCorporateSearch: boolean;
  corporateSearchColDefUrl: string = 'commons/searchService/private/corporateSearchColDefs';
  corporateSearchRowDefUrl: string =
    'setup/corporateOnboarding/corporateMain/private/getAuthorizedList';


  mode: string;
  stepperDetails: Stepper = {
    masterName: 'Report Mapping',
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
    private viewService: ViewService,) {
    this.userService.getApplicationDate().subscribe((applicationDate: string) => {
      this.formData.effectiveFrom = applicationDate;
    });
  }

  ngOnInit(): void {

    const actions: Actions = {
      heading: 'Report Mapping',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Process' },
      { label: 'Report Mapping' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/process/reportMapping/private/view', data)
        .subscribe((formData: ReportMapping) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
          this.formData.corporateName
          this.onChangeModule(formData.module)
          this.onChangeReportType(formData.module, formData.reportType)
          this.onChangeReportFrequency(formData.reportFrequency)
        });
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.bankProfileForm) {
      return true;
    }
    return true;
  };

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateId = corporate.id.toString();
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName;
  };

  reportTypeData = [];
  reportNameData = [];
  activationDayData = [];

  onChangeModule(value) {
    this.reportTypeData = []
    if (value === 'Setup') {
      this.reportTypeData = [
        { id: 'Internal', displayName: 'Internal' },
        { id: 'Corporate', displayName: 'Corporate' },
        { id: 'Audit Trail', displayName: 'Audit Trail' },
        { id: 'Query Builder - Bank', displayName: 'Query Builder - Bank' },
        { id: 'Query Builder - Corporate', displayName: 'Query Builder - Corporate' },
      ]
    }
    else if (value === 'FSCM') {
      this.reportTypeData = [
        { id: 'Internal', displayName: 'Internal' },
        { id: 'Corporate', displayName: 'Corporate' },
        { id: 'Audit Trail', displayName: 'Audit Trail' },
        { id: 'Query Builder - Bank', displayName: 'Query Builder - Bank' },
        { id: 'Query Builder - Corporate', displayName: 'Query Builder - Corporate' },
      ]
    }
  };

  onChangeReportType(data, value) {
    this.reportNameData = [];
    this.formData.channelEmail = false
    if (data === 'Setup' && value === 'Internal') {
      this.reportNameData = [
        { id: 'Corporate Expiration', displayName: 'Corporate Expiration' },
        { id: 'Security User Activity', displayName: 'Security User Activity' },
        { id: 'Self Service Request Report', displayName: 'Self Service Request Report' },
        { id: 'User Activity Log', displayName: 'User Activity Log' },
        { id: 'User List Report', displayName: 'User List Report' },
        { id: 'User Role Wise Report', displayName: 'User Role Wise Report' }
      ]
      this.formData.channelEmail = true
    }
    else if (data === 'Setup' && value === 'Corporate') {
      this.reportNameData = [
        { id: 'Security User Activity', displayName: 'Security User Activity' },
        { id: 'User Activity Log', displayName: 'User Activity Log' },
        { id: 'User Role Wise Report', displayName: 'User Role Wise Report' }
      ]
    }
    else if (data === 'Setup' && value === 'Audit Trail') {
      this.reportNameData = [
        { id: 'Account Type Report', displayName: 'Account Type Report' },
        { id: 'Alert Mapping Report', displayName: 'Alert Mapping Report' },
        { id: 'Alerts Report', displayName: 'Alerts Report' },
        { id: 'Approve Self Service Request', displayName: 'Approve Self Service Request' },
        { id: 'BIC Code Report', displayName: 'BIC Code Report' },
        { id: 'Bank Profile Report', displayName: 'Bank Profile Report' },
        { id: 'Bank User Report', displayName: 'Bank User Report' },
        { id: 'Broadcast Message Report', displayName: 'Broadcast Message Report' },
        { id: 'Charge Mapping Report', displayName: 'Charge Mapping Report' },
        { id: 'Charge Template', displayName: 'Charge Template' },
        { id: 'Content Management', displayName: 'Content Management' }
      ]
      this.formData.channelEmail = false
    }
    else if (data === 'Setup' && value === 'Query Builder - Bank') {
      this.reportNameData = [
        { id: 'TestQuery1', displayName: 'TestQuery1' },
      ]
    }
    else if (data === 'Setup' && value === 'Query Builder - Corporate') {
      this.reportNameData = [
        { id: 'TestQuery2', displayName: 'TestQuery2' },
      ]
    }
    else if (data === 'FSCM' && value === 'Internal') {
      this.reportNameData = [
        { id: 'Buyer - Seller Centric Income Report', displayName: 'Buyer - Seller Centric Income Report' },
        { id: 'Buyer - Seller Centric Limit Report', displayName: 'Buyer - Seller Centric Limit Report' },
        { id: 'CIT Report', displayName: 'CIT Report' },
        { id: 'Cancel Invoice', displayName: 'Cancel Invoice' },
        { id: 'Charge Income Report', displayName: 'Charge Income Report' },
        { id: 'Consolidated Upload', displayName: 'Consolidated Upload' },
        { id: 'Document Detail Report', displayName: 'Document Detail Report' },
        { id: 'EIPP Report', displayName: 'EIPP Report' },
        { id: 'Finance Status', displayName: 'Finance Status' },
        { id: 'GL Daily Movement Report', displayName: 'GL Daily Movement Report' },
        { id: 'Industry Wise Income Report', displayName: 'Industry Wise Income Report' },
        { id: 'Industry Wise Limit Report', displayName: 'Industry Wise Limit Report' },
        { id: 'Invoice Accounting Entry Report', displayName: 'Invoice Accounting Entry Report' },
      ]
    }
    else if (data === 'FSCM' && value === 'Corporate') {
      this.reportNameData = [
        { id: 'Consolidated Download Report', displayName: 'Consolidated Download Report' },
        { id: 'Corporate Limit Report', displayName: 'Corporate Limit Report' },
        { id: 'Document Detail Report', displayName: 'Document Detail Report' },
        { id: 'EIPP Report', displayName: 'EIPP Report' },
        { id: 'Finance Status', displayName: 'Finance Status' },
        { id: 'Invoice Life Cycle Report', displayName: 'Invoice Life Cycle Report' },
        { id: 'Invoice Maturity Due Report', displayName: 'Invoice Maturity Due Report' }
      ]
    }
    else if (data === 'FSCM' && value === 'Audit Trail') {
      this.reportNameData = [
        { id: 'Adjustment Entry', displayName: 'Adjustment Entry' },
        { id: 'Amend Invoice', displayName: 'Amend Invoice' },
        { id: 'Bank Authorization Matrix Report', displayName: 'Bank Authorization Matrix Report' },
        { id: 'Buyer Onboarding', displayName: 'Buyer Onboarding' },
        { id: 'Cancel Invoice', displayName: 'Cancel Invoice' },
        { id: 'Cancel Payment', displayName: 'Cancel Payment' },
        { id: 'Consolidated Upload', displayName: 'Consolidated Upload' }
      ]
    }
    else if (data === 'FSCM' && value === 'Query Builder - Bank') {
      this.reportNameData = [
        { id: 'CN/DN Report', displayName: 'CN/DN Report' },
        { id: 'Amend Invoice', displayName: 'Amend Invoice' },
        { id: 'Invoice Data', displayName: 'Invoice Data' },
        { id: 'Payment Report', displayName: 'Payment Report' }
      ]
    }
    else if (data === 'FSCM' && value === 'Query Builder - Corporate') {
      this.reportNameData = [
        { id: 'ADJUSTMENTENTRY_BUILDER', displayName: 'ADJUSTMENTENTRY_BUILDER' },
        { id: 'CNDN', displayName: 'CNDN' },
        { id: 'MANUALRECOVERY_REPORT', displayName: 'MANUALRECOVERY_REPORT' }
      ]
    }
  };

  onChangeReportFrequency(value) {
    this.activationDayData = [];
    if (value === 'Weekly') {
      this.activationDayData = [
        { id: 'Sunday', displayName: 'Sunday' },
        { id: 'Monday', displayName: 'Monday' },
        { id: 'Tuesday', displayName: 'Tuesday' },
        { id: 'Wednesday', displayName: 'Wednesday' },
        { id: 'Thursday', displayName: 'Thursday' },
        { id: 'Friday', displayName: 'Friday' },
        { id: 'Saturday', displayName: 'Saturday' },
      ]
    }
    else if (value === 'Monthly') {
      this.activationDayData = [
        { id: '1', displayName: '1' },
        { id: '2', displayName: '2' },
        { id: '3', displayName: '3' },
        { id: '4', displayName: '4' },
        { id: '5', displayName: '5' },
        { id: '6', displayName: '6' },
        { id: '7', displayName: '7' },
        { id: '8', displayName: '8' },
        { id: '9', displayName: '9' },
        { id: '10', displayName: '10' },
        { id: '11', displayName: '11' },
        { id: '12', displayName: '12' },
        { id: '13', displayName: '13' },
        { id: '14', displayName: '14' },
        { id: '15', displayName: '15' },
        { id: '16', displayName: '16' },
        { id: '17', displayName: '17' },
        { id: '18', displayName: '18' },
        { id: '19', displayName: '19' },
        { id: '20', displayName: '20' },
        { id: '21', displayName: '21' },
        { id: '22', displayName: '22' },
        { id: '23', displayName: '23' },
        { id: '24', displayName: '24' },
        { id: '25', displayName: '25' },
        { id: '26', displayName: '26' },
        { id: '27', displayName: '27' },
        { id: '28', displayName: '28' },
        { id: '29', displayName: '29' },
        { id: '30', displayName: '30' },
        { id: '31', displayName: '31' },
      ]
    }
  };
}
