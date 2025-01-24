import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../@services/currency.service';

@Pipe({
  name: 'baseCurrency',
})
export class CurrencyPipe implements PipeTransform {
  baseCurrency: any;

  constructor(private currencyService: CurrencyService) {}

  transform(currency: string): string {
    return currency;
  }
}
