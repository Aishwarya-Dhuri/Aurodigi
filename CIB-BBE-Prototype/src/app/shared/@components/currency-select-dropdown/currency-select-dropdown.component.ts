import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { _ } from 'ag-grid-community';
import { CurrencyService } from '../../@services/currency.service';

@Component({
  selector: 'app-currency-select-dropdown',
  templateUrl: './currency-select-dropdown.component.html',
  styleUrls: ['./currency-select-dropdown.component.scss'],
})
export class CurrencySelectDropdownComponent implements OnInit {
  @Input('selectStyleClass') selectStyleClass?: string = '';
  @Input('flagStyleClass') flagStyleClass?: string = '';
  @Input('showFlag') showFlag?: boolean = true;
  @Input('classes') classes?: string = '';
  @Output() currencyChanged = new EventEmitter<any>();

  currency: string;
  currencyList: any[] = [];

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.getCurrency().subscribe((currency: any) => {
      if (currency) {
        this.currency = currency.displayName;
      }
    });
    this.currencyService.getCurrencyList().subscribe((currencyList: any[]) => {
      this.currencyList = currencyList;
    });
  }

  currencyChange(currency: any) {
    const selectedCurrency = this.currencyList.find((c: any) => c.displayName === currency);
    if (selectedCurrency) {
      this.currencyChanged.emit(selectedCurrency);
      // this.currencyService.setCurrency(selectedCurrency);
    }
  }
}
