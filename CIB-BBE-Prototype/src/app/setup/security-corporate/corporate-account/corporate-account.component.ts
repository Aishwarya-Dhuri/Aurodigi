import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { CorporateAccount } from './@models/corporate-account.model';

@Component({
  selector: 'app-corporate-account',
  templateUrl: './corporate-account.component.html',
  styleUrls: ['./corporate-account.component.scss']
})
export class CorporateAccountComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;

  formData: CorporateAccount = new CorporateAccount();
  mode: string;
  subModuleNameList = []
  isViewPassword: boolean = false;
  isShowCorporateSearch: boolean;
  corporateSearchColDefUrl: string = 'commons/searchService/private/corporateSearchColDefs';
  corporateSearchRowDefUrl: string =
    'setup/corporateOnboarding/corporateMain/private/getAuthorizedList';

  stepperDetails: Stepper = {
    masterName: 'Corporate Account',
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
      heading: 'Corporate Account',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Bank-Corporate' },
      { label: 'Corporate Account' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/security/corporateAccount/private/view', data)
        .subscribe((formData: CorporateAccount) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.onCorporateSelected({
            id: this.formData.corporateId,
            corporateName: this.formData.corporateName
          });
          this.onBankCodeSelection({
            ifscCode: this.formData.bankCode,
            bankName: this.formData.bankName,
            branchName: this.formData.branchName
          });
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

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateId = corporate.id.toString();
    this.formData.corporateName = corporate.corporateName.toString();
  }

  onBankCodeSelection(val: any) {
    this.formData.bankCode = val.ifscCode;
    this.formData.bankName = val.bankName;
    this.formData.branchName = val.branchName;
    this.formData.branchAddress = val.city + ', ' + val.country;
  }
}
