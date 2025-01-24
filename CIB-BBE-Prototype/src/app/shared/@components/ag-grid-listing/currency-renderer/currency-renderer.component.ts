import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CurrencyService } from 'src/app/shared/@services/currency.service';

@Component({
  selector: 'app-currency-renderer',
  template: `
    <div class="" [ngClass]="{ 'text-right': isAgGridRenderer }" *ngIf="cellValue">
      <app-base-currency [amount]="cellValue" [currency]="currencyName"></app-base-currency>
    </div>
    <div *ngIf="!cellValue">-</div>
  `,
})
export class CurrencyRendererComponent implements OnInit, AgRendererComponent {
  cellValue!: any;
  currencyName?: string = 'USD';
  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: any;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.cellValue = this.data[this.field];
    }
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = params.value ? params.value.toString() : '';
    if (params.data.currencyName) {
      this.currencyName = params.data.currencyName;
    } else if (params.data.currency) {
      this.currencyName = params.data.currency;
    } else {
      this.currencyService.getCurrencyName().subscribe((currency: string) => {
        this.currencyName = currency;
      });
    }
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
