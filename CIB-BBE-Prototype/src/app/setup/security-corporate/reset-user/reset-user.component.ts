import { Component, OnInit, ViewChild } from '@angular/core';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { UserDetails } from 'src/app/base/@models/user.details';
import { ResetUser } from './@models/reset-user.model';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/shared/@services/toaster.service';

@Component({
  selector: 'app-reset-user',
  templateUrl: './reset-user.component.html',
  styleUrls: ['./reset-user.component.scss']
})
export class ResetUserComponent implements OnInit {
  formData: ResetUser = new ResetUser();
  @ViewChild('resetUserForm') resetUserForm: any;
  isShowCorporateSearch: boolean;

  corporateSearchColDefUrl: string = 'commons/searchService/private/corporateSearchColDefs';
  corporateSearchRowDefUrl: string =
    'setup/corporateOnboarding/corporateMain/private/getAuthorizedList';
  userIdArray = [];
  stepperDetails: Stepper = {
    masterName: 'Reset User',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };
  userDetails: UserDetails = new UserDetails();
  constructor(private router: Router, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.userIdArray = [
      { id: 'abcmaker', displayName: 'abcmaker' },
      { id: 'abcchecker ', displayName: 'abcchecker' }
    ];
  }

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateId = corporate.id.toString();
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName;
  }

  validateForm() {
    if (this.resetUserForm.valid) {
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'User Reset Successfully',
      });
      this.resetForm();
    }

    return true;

  }

  resetForm() {
    this.formData.corporateCode = '';
    this.formData.userId = ''
  }

  onCancelClick() {
    this.router.navigate(['/dashboard/setup'])
  }

}
