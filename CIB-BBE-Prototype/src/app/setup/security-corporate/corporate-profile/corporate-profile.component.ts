import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { CorporateProfile } from './@models/corporateProfile.model';

@Component({
  selector: 'app-corporate-profile',
  templateUrl: './corporate-profile.component.html',
  styleUrls: ['./corporate-profile.component.scss'],
})
export class CorporateProfileComponent implements OnInit {
  @ViewChild('corporateProfileForm') corporateProfileForm: any;

  formData: CorporateProfile = new CorporateProfile();
  mode: string;
  stepperDetails: Stepper = {
    masterName: 'Corporate Profile',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };
  isShowCorporateSearch: boolean;

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
    /* remove below : starts */
    const actions: Actions = {
      heading: 'Corporate Profile',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Setup' },
      { label: 'Security-Corporate' },
      { label: 'Corporate Profile' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */
    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/security/corporateProfile/private/view', data)
        .subscribe((formData: CorporateProfile) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateId = corporate.id.toString();
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName;
  }

  resetCorporate(): void {
    if (this.formData.commonProfile) {
      this.formData.corporateId = '';
      this.formData.corporateCode = '';
      this.formData.corporateName = '';
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (this.corporateProfileForm && this.corporateProfileForm.valid) {
        return true;
      }
      return false;
    }
    return true;
  }
}
