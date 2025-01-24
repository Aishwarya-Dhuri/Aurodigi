import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-alert-status-renderer',
  template: `
    <span
      class="p-p-1"
      [ngClass]="{
        'background-color-danger-light text-color-danger': status == 'Disabled',
        'background-color-success-light text-color-success': status == 'Enabled',
        'background-color-warning-light text-color-warning': status == 'Suspended'
      }"
    >
      {{ status }}
    </span>
  `,
})
export class AlertStatusRendererComponent implements AgRendererComponent {
  status!: string;

  constructor() {}

  agInit(params: ICellRendererParams): void {
    this.status = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
