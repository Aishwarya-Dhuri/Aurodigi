import { Component, OnInit, ViewChild } from '@angular/core';
import { ChangePassword } from './@models/change-password.model';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  userIdArray = [];
  branchnameArray = [];

  formData: ChangePassword = new ChangePassword();
  @ViewChild('changePasswordForm') changePasswordForm: any;
  showBranchName: boolean
  isViewPassword: boolean = false;
  isInvalidCredentials: boolean = false;
  isViewconfirmPassword: boolean = false;

  constructor(private toasterService: ToasterService, private router: Router) { }

  ngOnInit(): void {
    this.userIdArray = [
      { id: 'SonyLtd', displayName: 'Sony Ltd' },
      { id: 'Etisalat', displayName: 'Etisalat' },
      { id: 'ARLA', displayName: 'ARLA' },
    ];
  }

  onBranchCodeSelect(val: any) {
    this.formData.branchName = val.branchName;
  }


  validateForm() {

    if (this.checkPasswordMatch() && this.changePasswordForm.valid) {
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Password Changed Successfully',
      });
      this.resetForm();
    }

    return true;

  }

  checkPasswordMatch() {
    if (this.formData.newPassword == this.formData.confirmPassword) {
      return true
    } else {
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Password and Confirm Password dont match',
      });
      return false

    }
  }

  resetForm() {
    this.formData.branchName = null
    this.formData.branchCode = '';
    this.formData.userId = '';
    this.formData.newPassword = '';
    this.formData.confirmPassword = '';
    this.changePasswordForm.reset()
  }

  onCancelClick() {
    this.router.navigate(['/dashboard/setup'])
  }
}
