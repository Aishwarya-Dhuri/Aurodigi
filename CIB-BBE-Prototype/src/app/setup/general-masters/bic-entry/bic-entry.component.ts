import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BicEntry } from './@models/bic-entry.model';

@Component({
  selector: 'app-bic-entry',
  templateUrl: './bic-entry.component.html',
  styleUrls: ['./bic-entry.component.scss']
})
export class BicEntryComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;

  formData: BicEntry = new BicEntry();
  mode: string;
  code = ''
  subModuleNameList = []
  isViewPassword: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'BIC Entry',
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
      heading: 'BIC Entry',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'General Masters' },
      { label: 'BIC Entry' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/generalMasters/bicEntry/private/view', data)
        .subscribe((formData: BicEntry) => {
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

  codeTypeList = [
    { id: 'BIC Code', displayName: 'BIC Code' },
    { id: 'MICR Code', displayName: 'MICR Code' },
    { id: 'RTGS IFSC Code', displayName: 'RTGS IFSC Code' },
    { id: 'IMPS IFSC Code', displayName: 'IMPS IFSC Code' },
    { id: 'NEFT IFSC Code', displayName: 'NEFT IFSC Code' },
    { id: 'NACH IFSC Code', displayName: 'NACH IFSC Code' }
  ];

  onChangeCodeType(codeType) {
    this.code = ''
    if (codeType === 'BIC Code') {
      this.code = 'BIC Code'
    }
    else if (codeType === 'MICR Code') {
      this.code = 'MICR Code'
    }
    else if (codeType === 'RTGS IFSC Code') {
      this.code = 'RTGS IFSC Code'
    }
    else if (codeType === 'IMPS IFSC Code') {
      this.code = 'IMPS IFSC Code'
    }
    else if (codeType === 'NEFT IFSC Code') {
      this.code = 'NEFT IFSC Code'
    }
    else if (codeType === 'NACH IFSC Code') {
      this.code = 'NACH IFSC Code'
    }
  }

}
