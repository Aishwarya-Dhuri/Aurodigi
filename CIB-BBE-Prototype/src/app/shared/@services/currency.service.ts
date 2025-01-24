import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Select } from '../@models/select.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private currencyList = new BehaviorSubject<Select[]>([]);
  private currency = new BehaviorSubject<Select>(null);
  private currencyName = new BehaviorSubject<string>(null);
  private currencyId = new BehaviorSubject<string>(null);

  constructor(private httpService: HttpService) {
    this.fetchCurrencyList();
  }

  fetchCurrencyList() {
    this.httpService
      .httpPost('setup/generalMasters/currency/private/currencyList')
      .subscribe((response: any) => {
        this.setCurrencyList(response.dataList);
      });
  }

  setCurrencyList(currencyList: Select[]) {
    this.currencyList.next(currencyList);
    this.setCurrency(currencyList[0]);
  }

  getCurrencyList() {
    return this.currencyList;
  }

  setCurrency(currency: Select) {
    this.currency.next(currency);
    this.currencyId.next(currency.id);
    this.currencyName.next(currency.displayName);
  }

  getCurrency() {
    return this.currency;
  }

  getCurrencyId() {
    return this.currencyId;
  }

  getCurrencyName() {
    return this.currencyName;
  }

  resetCurrency() {
    this.getCurrencyList().subscribe((currencyList: Select[]) => {
      if (currencyList.length > 0) {
        this.setCurrency(currencyList[0]);
      }
    });
  }
}
