import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-auth-matrix-accounts-renderer',
  template: ` <span class="p-py-1">{{ accounts[0] }}</span>
    <span
      *ngIf="accounts.length > 1"
      class="p-py-1 pointer text-color-primary"
      (click)="showAccountsInfo($event)"
      >+{{ accounts.length - 1 }}</span
    >`,
})
export class AuthMatrixAccountsRendererComponent implements AgRendererComponent {
  accounts!: string[];
  parentContext!: any;

  constructor() {}

  agInit(params: ICellRendererParams): void {
    this.accounts = params.value;
    this.parentContext = params.context.componentParent;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  showAccountsInfo(e: MouseEvent): void {
    let transform = 'translate(-' + e.offsetX + 'px, ' + (36 + -Math.abs(e.offsetY)) + 'px)';
    this.parentContext.showAuthMatrixAccounts(e.pageY, e.pageX, transform, this.accounts);
  }
}
