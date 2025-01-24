import { Component, OnInit, ViewChild } from '@angular/core';
import { Unlockuser } from './@models/unlock-user.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { UserDetails } from 'src/app/base/@models/user.details';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unlock-user',
  templateUrl: './unlock-user.component.html',
  styleUrls: ['./unlock-user.component.scss']
})
export class UnlockUserComponent implements OnInit {
  formData: Unlockuser = new Unlockuser();
  @ViewChild('unlockUserForm') unlockUserForm: any;
  isShowCorporateSearch: boolean;

  corporateSearchColDefUrl: string = 'commons/searchService/private/corporateSearchColDefs';
  corporateSearchRowDefUrl: string =
    'setup/corporateOnboarding/corporateMain/private/getAuthorizedList';
  userIdArray = [];
  stepperDetails: Stepper = {
    masterName: 'Unlock User',
    currentStep: 1,
    isSecondLastStepLabelAsReview: false,
    isOnlyFooter: true,
    headings: ['', ''],
  };
  userDetails: UserDetails = new UserDetails();
  constructor(private toasterService: ToasterService, private router: Router) { }

  ngOnInit(): void {
    this.userIdArray = [
      { id: 'jaimaker', displayName: 'jaimaker' },
      { id: 'Etisalat', displayName: 'jaichecker' }

    ];
  }

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateId = corporate.id.toString();
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName;
  }


  validateForm() {
    if (this.unlockUserForm.valid) {
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'User Unlocked Successfully',
      });
      this.resetForm();
    }

    return true;

  }

  resetForm() {
    this.formData.corporateCode = '';
    this.formData.userId = ''
    this.formData.corporateName = '';
  }

  onCancelClick() {
    this.router.navigate(['/dashboard/setup'])
  }

}
