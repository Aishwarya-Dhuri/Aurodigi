import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BankProfile } from '../../security-bank/bank-profile/@models/bank-profile.model';
import { CMS } from './@models/cms.model';
@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss']
})
export class CmsComponent implements OnInit {
  // @ViewChild('bankProfileForm') bankProfileForm: any;

  // formData: BankProfile = new BankProfile();

  @ViewChild('bankProfileForm') bankProfileForm: any;

  formData: CMS = new CMS();
  mode: string;
  isShowModal = false;
  isShowFooterModal = false;
  isShowLandingPageModal = false;
  isShowLogoutImageModal = false;
  isShowLogoutFooterModal = false;
  defaultImage = [];
  defaultImage2 = [];
  defaultImage3 = []
  genericdefaultImage = []
  genericWidgetOtherImage = [];
  otherImage = [];
  otherImage2 = [];

  otherImage3 = [];
  rdFileUpload1 = [];
  rdFileUpload2 = [];
  rdFileUpload3 = [];
  rdFileUpload4 = [];
  rdFileUpload5 = [];

  widgetImage1 = [];
  widgetImage2 = [];
  widgetImage3 = [];

  stepperDetails: Stepper = {
    masterName: 'Content Management',
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
    // this.userService.getApplicationDate().subscribe((applicationDate: string) => {
    //   this.formData.effectiveFrom = applicationDate;
    // });
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Content Management',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Process' },
      { label: 'Content Management' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
    // this.formData.categoryName = 'Generic';
    // this.formData.screenName = 'Login Page'

  }
  onImageUploaded(file: any) {
    this.formData.otherImage = file;

  }
  onDefaultImageUploaded(file: any) {
    this.formData.defaultImage = file;

  }
  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/process/cms/private/view', data)
        .subscribe((formData: CMS) => {
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
}
