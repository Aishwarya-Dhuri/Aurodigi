import { Component, OnInit, ViewChild } from '@angular/core';
import { UnlockBankUser } from './@models/unlock-bank-user.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { UserDetails } from 'src/app/base/@models/user.details';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unlock-bank-user',
  templateUrl: './unlock-bank-user.component.html',
  styleUrls: ['./unlock-bank-user.component.scss']
})
export class UnlockBankUserComponent implements OnInit {
  formData: UnlockBankUser = new UnlockBankUser();
  @ViewChild('unlockBankUserForm') unlockBankUserForm: any;
  isShowCorporateSearch: boolean;
  branchnameArray = [];

  showBranchName: boolean

  userIdArray = [];

  constructor(private toasterService: ToasterService, private router: Router) { }

  ngOnInit(): void {
    this.userIdArray = [
      { id: 'jaimaker', displayName: 'jaimaker' },
      { id: 'Etisalat', displayName: 'jaichecker' }

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
    if (this.unlockBankUserForm.valid) {
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