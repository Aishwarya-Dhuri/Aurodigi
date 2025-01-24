import { Component, OnInit, ViewChild } from '@angular/core';
import { ResetBankUser } from './@models/reset-bank-user.modal';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-bank-user',
  templateUrl: './reset-bank-user.component.html',
  styleUrls: ['./reset-bank-user.component.scss']
})
export class ResetBankUserComponent implements OnInit {
  userIdArray = [];
  branchnameArray = [];

  formData: ResetBankUser = new ResetBankUser();
  @ViewChild('resetBankUserForm') resetBankUserForm: any;
  showBranchName: boolean
  stepperDetails: Stepper = {
    masterName: 'Reset Bank User',
    currentStep: 1,
    isSecondLastStepLabelAsReview: false,
    isOnlyFooter: true,
    headings: ['', 'Submit'],
  };
  constructor(private toasterService: ToasterService, private router: Router) { }

  ngOnInit(): void {
    this.userIdArray = [
      { id: 'abcmaker', displayName: 'abcmaker' },
      { id: 'abcchecker ', displayName: 'abcchecker' }
    ];

    this.branchnameArray = [
      { id: 'Branch1', displayName: 'Branch 1' },
      { id: 'Branch2', displayName: 'Branch 2' },
      { id: 'Branch3', displayName: 'Branch 3' },
    ]
  }



  onBranchCodeSelect(val: any) {
    this.formData.branchName = val.branchName;
  }


  validateForm() {
    if (this.resetBankUserForm.valid) {
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'User Reset Successfully',
      });
      this.resetForm();
    }

    return true;

  }

  resetForm() {
    this.formData.branchName = '';
    this.formData.branchCode = '';
    this.formData.userId = '';
  }

  onCancelClick() {
    this.router.navigate(['/dashboard/setup'])
  }

}
