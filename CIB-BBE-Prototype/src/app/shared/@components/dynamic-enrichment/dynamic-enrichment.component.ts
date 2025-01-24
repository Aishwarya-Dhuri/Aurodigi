import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CurrencyService } from '../../@services/currency.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-dynamic-enrichment',
  templateUrl: './dynamic-enrichment.component.html',
  styleUrls: ['./dynamic-enrichment.component.scss'],
})
export class DynamicEnrichmentComponent implements OnInit, OnChanges {
  @Input() mode: string;
  @Input() classes: string;
  @Input() enrichmentModel?: any[];
  @Input() isShowOnlyValues?: boolean;
  @Input() showHeaderBorderBottom?: boolean = false;
  @Output() enrichmentModelChange = new EventEmitter<any[]>();

  currencyName: string;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    if (!this.isShowOnlyValues) this.classes = this.classes ? this.classes + ' aps-card' : '';

    this.currencyService.getCurrencyName().subscribe((currencyName: string) => {
      this.currencyName = currencyName + ' ';
    });

    this.enrichmentModel = _.sortBy(this.enrichmentModel, 'enrichmentSequenceNo');

    this.enrichmentModel.forEach((enrich: any) => {
      if (this.mode == 'VIEW') {
        enrich.value = enrich.value ? enrich.value : '-';
      } else {
        enrich.value = enrich.value && enrich.value != '-' ? enrich.value : '';
        if (enrich.enrichmentDataTypeName == 'Text') enrich.inputType = 'normal';
        else if (enrich.enrichmentDataTypeName == 'AlphaNumeric') enrich.inputType = 'alphaNumeric';
        else if (enrich.enrichmentDataTypeName == 'Numeric') enrich.inputType = 'numeric';
        else if (enrich.enrichmentDataTypeName == 'Amount')
          enrich.inputType = 'currencyFormatNotZero';
      }
    });
  }

  ngOnChanges() {
    this.enrichmentModelChange.emit(this.enrichmentModel);
  }
}
