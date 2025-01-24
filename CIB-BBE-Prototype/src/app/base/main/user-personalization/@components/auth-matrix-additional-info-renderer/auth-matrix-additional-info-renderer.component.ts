import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-auth-matrix-additional-info-renderer',
  template: `<span class="p-p-1 pointer text-color-primary" (click)="showAdditionalInfo($event)"
    >View</span
  >`,
})
export class AuthMatrixAdditionalInfoRendererComponent implements AgRendererComponent {
  additionalInfo!: string;
  parentContext!: any;

  constructor() {}

  agInit(params: ICellRendererParams): void {
    this.additionalInfo = params.value;
    this.parentContext = params.context.componentParent;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  showAdditionalInfo(e: MouseEvent): void {
    this.parentContext.showAuthMatrixAdditionalInfo(e.pageY, e.pageX, this.additionalInfo);
  }
}
