import { Component, OnInit, Input } from '@angular/core';
import { CorporateAuthorizationMatrixComponent } from '../corporate-authorization-matrix.component';

@Component({
  selector: 'app-matrix-details',
  templateUrl: './matrix-details.component.html',
  styleUrls: ['./matrix-details.component.scss']
})
export class MatrixDetailsComponent implements OnInit {
  @Input('parentRef') parentRef: CorporateAuthorizationMatrixComponent;

  isShowAccounts: boolean = false;
  isShowCorporateSearch: boolean;
  isShowGroupSearch: boolean;

  accountColDefUrl = 'setup/security/corporateAuthorizationMatrix/private/accountColDef';
  accountRowDataUrl = 'setup/corporateOnboarding/corporateMain/private/getAllAccounts';

  constructor() { }

  ngOnInit(): void {
  }

  onAccountSelection(accounts: any[]) {
    this.parentRef.formData.accounts = accounts;

    const accountsMapped: string[] = [];

    accounts.forEach((account: any) => {
      accountsMapped.push(account.accountNumber);
    });

    this.parentRef.formData.accountsMapped = accountsMapped.join(', ');
  }

  productList = [
    { id: 'Setup', displayName: 'Setup' },
    { id: 'Payments', displayName: 'Payments' },
    { id: 'VAM', displayName: 'VAM' }
  ];
  moduleList = [];

  onChangeSelectProduct(product) {
    this.moduleList = []
    if (product === 'Setup') {
      this.moduleList = [
        { id: 'Currency', displayName: 'Currency' },
        { id: 'Role', displayName: 'Role' },
        { id: 'Corporate Security Mapping', displayName: 'Corporate Security Mapping' },
        { id: 'Corporate Role', displayName: 'Corporate Role' },
        { id: 'Corporate User', displayName: 'Corporate User' },
        { id: 'User Field Access', displayName: 'User Field Access' }
      ]
    }
    else if (product === 'VAM') {
      this.moduleList = [
        { id: 'Corporate VA Structure', displayName: 'Corporate VA Structure' },
        { id: 'Virtual Account Issuance', displayName: 'Virtual Account Issuance' },
        { id: 'Virtual Account Issuance Upload', displayName: 'Virtual Account Issuance Upload' },
        { id: 'VAM Enquiry', displayName: 'VAM Enquiry' },
        { id: 'Virtua Account Status Management', displayName: 'Virtual Account Status Management' }
      ]
    }
    else if (product === 'Payments') {
      this.moduleList = [
        { id: 'Bill Payment', displayName: 'Bill Payment' },
        { id: 'Payment Request', displayName: 'Payment Request' },
        { id: 'Bill Presentment', displayName: 'Bill Presentment' },
        { id: 'Biller Registration SI', displayName: 'Biller Registration SI' },
        { id: 'SI Management', displayName: 'SI Management' },
        { id: 'Own Account Transfer', displayName: 'Own Account Transfer' },
        { id: 'OAT SI Management', displayName: 'OAT SI Management' },
        { id: 'Bill Payment Upload', displayName: 'Bill Payment Upload' }
      ]
    }
  }

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    this.parentRef.formData.corporateId = corporate.id.toString();
    this.parentRef.formData.corporateCode = corporate.corporateCode.toString();
    this.parentRef.formData.corporateName = corporate.corporateName;
  }

  onGroupSelected(group: any): void {
    if (!group) return;
    this.parentRef.formData.corporateId = group.id.toString();
    this.parentRef.formData.groupCode = group.groupCode.toString();
    this.parentRef.formData.groupName = group.groupName;
  }

}
