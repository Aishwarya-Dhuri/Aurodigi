import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { CurrencyService } from '../../@services/currency.service';

@Component({
  selector: 'app-review-form-field',
  templateUrl: './review-form-field.component.html',
  styleUrls: ['./review-form-field.component.scss'],
})
export class ReviewFormFieldComponent implements OnInit {
  @Input('label') label!: string;
  @Input('value') value!: any;
  @Input('type') type?: 'text' | 'baseCurrency' | 'file' = 'text';
  @Input('baseCurrency') baseCurrency?: string;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    if (this.type == 'baseCurrency' && !this.baseCurrency) {
      this.currencyService
        .getCurrencyName()
        .pipe(first())
        .subscribe((currency: string) => {
          this.baseCurrency = currency;
        });
    }
  }
}
