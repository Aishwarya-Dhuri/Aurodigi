import { Component, OnInit, ViewChild } from '@angular/core';
import { ResetPassword } from './@models/reset-password.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { UserService } from 'src/app/shared/@services/user.service';
import { Router } from '@angular/router';
import { UserDetails } from 'src/app/base/@models/user.details';
import { Breadcrumb } from 'primeng/breadcrumb';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  formData: ResetPassword = new ResetPassword();
  @ViewChild('resetPasswordForm') resetPasswordForm: any;
  isShowCorporateSearch: boolean;
  isShowUserIdSearch: boolean;

  corporateSearchColDefUrl: string = 'commons/searchService/private/corporateSearchColDefs';
  corporateSearchRowDefUrl: string =
    'setup/corporateOnboarding/corporateMain/private/getAuthorizedList';


  userIdSearchColDefUrl: string = 'commons/searchService/private/userIdSearchColDefs';
  userIdSearchRowDefUrl: string =
    'setup/resetPassword/private/getAuthorizedList';


  userIdArray = [];
  stepperDetails: Stepper = {
    masterName: 'Reset Password',
    currentStep: 1,
    isSecondLastStepLabelAsReview: false,
    isOnlyFooter: true,
    headings: ['', 'Submit'],
  };
  userDetails: UserDetails = new UserDetails();

  private dashboardRouteUrl: string;

  constructor(private userService: UserService, private router: Router, private toasterService: ToasterService
  ) {
    this.userService.getDashboardRouteUrl().subscribe((dashboardRouteUrl: string) => {
      this.dashboardRouteUrl = dashboardRouteUrl;
    });
    this.userService.getUserDetails().subscribe((userDetails: UserDetails) => {
      this.userDetails = userDetails;
    });
  }

  ngOnInit(): void {
    this.userIdArray = [
      { id: 'SonyLtd', displayName: 'Sony Ltd' },
      { id: 'Etisalat', displayName: 'Etisalat' },
      { id: 'ARLA', displayName: 'ARLA' },

    ];


  }

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateId = corporate.id.toString();
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName;
  }

  onUserIdSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateId = corporate.id.toString();
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName;
  }





  validateForm() {
    if (this.resetPasswordForm.valid) {
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Password Reset Successfully',
      });
      this.resetForm();
    }

    return true;

  }

  resetForm() {

    this.formData.corporateCode = '';
    this.formData.corporateName = '';
    this.formData.userId = '';
    this.formData.userName = '';
  }

  onCancelClick() {
    this.router.navigate(['/dashboard/setup'])
  }
}