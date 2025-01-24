import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicDiscounting } from './@models/dynamic-discounting-template.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-dynamic-discounting-template',
  templateUrl: './dynamic-discounting-template.component.html',
  styleUrls: ['./dynamic-discounting-template.component.scss']
})
export class DynamicDiscountingTemplateComponent implements OnInit {
  @ViewChild('dynamicDiscountingForm') dynamicDiscountingForm: any;
  formData: DynamicDiscounting = new DynamicDiscounting();
  mode: string;

  stepperDetails: Stepper = {
    masterName: 'Dynamic Discounting',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  constructor(private viewService: ViewService, private httpService: HttpService) { }

  ngOnInit(): void {
    this.getViewData();

  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/templates/dynamicDiscountingTemplate/private/view', data)
        .subscribe((formData: DynamicDiscounting) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

}
