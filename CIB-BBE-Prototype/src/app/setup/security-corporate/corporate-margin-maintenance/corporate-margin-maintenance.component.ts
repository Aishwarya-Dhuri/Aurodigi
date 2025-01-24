import { Component, OnInit, ViewChild } from '@angular/core';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { CorporateMarginMaintenance, CurrencyPair, Slab } from './@models/corporate-margin-maintenance.model';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-corporate-margin-maintenance',
  templateUrl: './corporate-margin-maintenance.component.html',
  styleUrls: ['./corporate-margin-maintenance.component.scss']
})
export class CorporateMarginMaintenanceComponent implements OnInit {
  corporateSearchColDefUrl: string = 'commons/searchService/private/corporateSearchColDefs';
  corporateSearchRowDefUrl: string =
    'setup/corporateOnboarding/corporateMain/private/getAuthorizedList';

  formData: CorporateMarginMaintenance = new CorporateMarginMaintenance();
  @ViewChild('corporateMarginMaintenanceForm') corporateMarginMaintenanceForm: any;


  isShowCorporateSearch: boolean;

  stepperDetails: Stepper = {
    masterName: 'Corporate Margin Maintenance',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };
  startSlab = ''
  endSlab = ''
  rateTypeCode = ''
  margin = ''
  exchangeRate = ''
  mode: string;
  rateTypeCodeArr = [
    {
      id: '1',
      displayName: 'Counter Rate',
      value: '30'
    }]



  // currencies = ['VND', 'USD', 'THB', 'CNY', 'SGD', 'JPY', 'INR'];
  currencies = [

    { id: 'VND', displayName: 'VND' },
    { id: 'USD', displayName: 'USD' },
    { id: 'THB', displayName: 'THB' },
    { id: 'CNY', displayName: 'CNY' },
    { id: 'SGD', displayName: 'SGD' },
    { id: 'JPY', displayName: 'JPY' },
    { id: 'INR', displayName: 'INR' }
  ];


  selectedCurrency1: string;
  selectedCurrency2: string;

  slab: any;
  constructor(private viewService: ViewService, private httpService: HttpService) { }

  ngOnInit(): void {
    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/security/corporateMarginMaintenance/private/view', data)
        .subscribe((formData: CorporateMarginMaintenance) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  onCorporateCodeSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName;
  }

  // onCurrencySelected(selectedCurrency: any) {
  //   if (selectedCurrency === this.formData.currency2) {
  //     this.formData.currency2 != selectedCurrency
  //   }
  // }

  onCurrency1Change() {
    // Remove the selected currency from the options of currency2 dropdown
    this.currencies = this.currencies.filter((currency) => currency.displayName !== this.formData.currency2
    );
  }



  addCurrencyPair() {
    this.formData.currencypair.push(new CurrencyPair());

  }

  addNewSlab() {
    this.formData.slab.push(new Slab());
    // this.formData.rate = ''
    // this.formData.margin = ''
    // this.formData.exchangeRate = null
  }

  removeSlab(slab: any) {
    this.formData.slab.splice(slab, 1);
  }

  onRateTypeCodeChage(value: any) {
    if (!value) return;

    this.formData.rate = value.value

  }

  calculateExchangeRate() {

    this.formData.exchangeRate = Number(this.formData.margin) + Number(this.formData.rate)
    console.log(this.slab.exchangeRate);
    console.log(this.slab.margin)
    console.log(this.slab.rate)
  }
}
