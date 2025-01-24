import { Component, OnInit } from '@angular/core';
import { GridsterConfig } from 'angular-gridster2';
import * as _ from 'lodash';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { DEFAULT_FORM_BUILDER_GRIDSTER_CONFIG } from 'src/app/shared/@config/dynamic-form-gridster.config';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'aps-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {
  mode: string;
  formData: any = {};
  gridDataList: any[];
  stepperDetails: Stepper = {
    masterName: '',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };
  options: GridsterConfig = { ...DEFAULT_FORM_BUILDER_GRIDSTER_CONFIG };

  constructor(
    private viewService: ViewService,
    private httpService: HttpService,
    private menuService: MenuService,
  ) {
    this.options.minRows = 12;
    this.options.maxItemRows = 20;
    this.getViewData();
  }

  ngOnInit(): void {}

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost(this.menuService.getSelectedServiceUrl() + '/private/view', data)
        .subscribe((response: any) => {
          delete response.responseStatus;
          this.formData = { ...response };
          this.getDynamicFormData(this.formData.dynamicFormId);
        });
    } else {
      this.getDynamicFormData(this.viewService.getId());
    }
  }

  getDynamicFormData(id: string | number): void {
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('setup/cibSetup/dynamicFormBuilder/private/view', data)
      .subscribe((response: any) => {
        this.formData.dynamicFormId = response.id;
        this.gridDataList = response.gridDataList;
        this.stepperDetails.masterName = response.displayName;
        this.viewService.clearAll();
        if (this.mode == 'VIEW') {
          this.stepperDetails.currentStep = 2;
        }
        this.updateDynamicFormData();
      });
  }

  updateDynamicFormData(): void {
    this.gridDataList.forEach((item: any) => {
      if (item.itemType == 'CARD') {
        item.cardData.forEach((field: any) => {
          if (this.mode && this.formData[_.camelCase(field.label)]) {
            if (
              (field.componentClassName == 'FORM_CALENDER' && field.selectionMode == 'range') ||
              field.componentClassName == 'FORM_CHECKBOX'
            ) {
              this.formData[_.camelCase(field.label)] =
                this.formData[_.camelCase(field.label)].split(',');
            }
            if (field.itemType != 'GENERIC') {
              field.value = this.formData[_.camelCase(field.label)];
              field.displayValue = this.formData[_.camelCase(field.label) + '_DV'];
            }
          }
          field.fieldOptionList = field.fieldOptionList ? JSON.parse(field.fieldOptionList) : '';
          field.configurationFields = field.configurationFields
            ? JSON.parse(field.configurationFields)
            : '';
        });
      } else {
        item.configurationFields = item.configurationFields
          ? JSON.parse(item.configurationFields)
          : '';
      }
    });
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      for (let i = 0; i < this.gridDataList?.length; i++) {
        if (this.gridDataList[i].itemType == 'CARD') {
          for (let j = 0; j < this.gridDataList[i].cardData.length; j++) {
            if (
              this.gridDataList[i].cardData[j].itemType != 'GENERIC' &&
              this.gridDataList[i].cardData[j].required &&
              !this.gridDataList[i].cardData[j].value
            ) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  beforeSubmit(): boolean {
    this.gridDataList.forEach((item: any) => {
      if (item.itemType == 'CARD') {
        item.cardData.forEach((field: any) => {
          if (
            (field.componentClassName == 'FORM_CALENDER' && field.selectionMode == 'range') ||
            field.componentClassName == 'FORM_CHECKBOX'
          ) {
            field.value = field.value.join(',');
          }
          if (field.itemType != 'GENERIC') {
            this.formData[_.camelCase(field.label)] = field.value;
            this.formData[_.camelCase(field.label) + '_DV'] = field.displayValue;
          }
        });
      }
    });
    return true;
  }
}
