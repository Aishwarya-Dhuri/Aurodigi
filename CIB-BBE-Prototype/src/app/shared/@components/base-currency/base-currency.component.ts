import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Select } from '../../@models/select.model';
import { CurrencyService } from '../../@services/currency.service';

@Component({
  selector: 'app-base-currency',
  templateUrl: './base-currency.component.html',
  styleUrls: ['./base-currency.component.scss'],
})
export class BaseCurrencyComponent implements OnInit, OnChanges {
  @Input('amount') amount!: string;
  @Input('amountStyleClass') amountStyleClass?: string = '';
  @Input('digitsInfo') digitsInfo?: string = '1.2-2';
  @Input('display') display?: string = 'code'; // code, symbol
  @Input('flagStyleClass') flagStyleClass?: string = '';
  @Input('showFlag') showFlag?: boolean = false;
  @Input('currency') currency: string = '';
  baseCurrency: Select;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    if (!this.amount) {
      this.amount = '0.00';
    }
    if (!this.currency) {
      this.currencyService.getCurrency().subscribe((currency: any) => {
        if (currency) {
          this.baseCurrency = currency;
          this.currency = currency.displayName + (this.display === 'code' ? ' ' : '');
        }
      });
    } else if (this.currency.length == 3) {
      this.currency = this.currency + (this.display === 'code' ? ' ' : '');
    } else if (this.currency) {
      this.currency = this.currency + (this.display === 'code' ? ' ' : '');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.currency && this.baseCurrency && this.baseCurrency.displayName) {
      this.currency = this.baseCurrency.displayName + (this.display === 'code' ? ' ' : '');
    } else if (this.currency && this.currency.length == 3) {
      this.currency = this.currency + (this.display === 'code' ? ' ' : '');
    } else if (this.currency) {
      this.currency = this.currency + (this.display === 'code' ? ' ' : '');
    }
  }
}
