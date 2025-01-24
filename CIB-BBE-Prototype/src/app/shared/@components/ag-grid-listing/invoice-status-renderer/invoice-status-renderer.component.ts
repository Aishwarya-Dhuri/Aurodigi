import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-invoice-status-renderer',
  template: `
    <span
      class="p-p-1"
      [ngClass]="{
        'background-color-danger-light text-color-danger': cellValue == 'Overdue',
        'background-color-success-light text-color-success': cellValue == 'Normal'
      }"
    >
      {{ cellValue }}
    </span>
  `,
})
export class InvoiceStatusRendererComponent implements AgRendererComponent {
  cellValue!: any;

  constructor() {}

  agInit(params: ICellRendererParams): void {
    this.cellValue = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
