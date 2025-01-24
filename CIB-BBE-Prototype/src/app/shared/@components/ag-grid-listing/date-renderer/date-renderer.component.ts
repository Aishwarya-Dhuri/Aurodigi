import { Component, Input, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-date-renderer',
  template: `
    <div *ngIf="cellValue">
      {{ cellValue | date: 'dd-LLL-yyyy' }}
    </div>
    <div *ngIf="!cellValue">-</div>
  `,
})
export class DateRendererComponent implements OnInit {
  cellValue!: any;
  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: any;

  constructor() {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.cellValue = this.data[this.field];
    }
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = params.value ? params.value.toString() : '';
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
