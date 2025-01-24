import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { AntiPhishingImage } from './@models/anti-phishing-image.model';

@Component({
  selector: 'app-anti-phishing-image',
  templateUrl: './anti-phishing-image.component.html',
  styleUrls: ['./anti-phishing-image.component.scss']
})
export class AntiPhishingImageComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;

  formData: AntiPhishingImage = new AntiPhishingImage();
  mode: string;
  subModuleNameList = []
  isViewPassword: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'Anti Phishing Image',
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
      heading: 'Anti Phishing Image',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Security-Bank' },
      { label: 'Anti Phishing Image' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/securityBank/antiPhishingImage/private/view', data)
        .subscribe((formData: AntiPhishingImage) => {
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

  beforeSubmit() {
    this.formData.imageCount = this.formData.imageCategory.length;
    return true;
  }

  onImageFileSelected(files: any): void {
    this.formData.imageCategory = files
  }

}
