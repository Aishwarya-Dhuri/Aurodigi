import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { StepStatus } from '../../@model/stepper.model';
import { StepperService } from '../../@services/stepper.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-stepper-footer',
  templateUrl: './stepper-footer.component.html',
  styleUrls: ['./stepper-footer.component.scss'],
})
export class StepperFooterComponent implements OnInit {
  @Input('parentRef') parentRef: any;
  @Output('stepsReady') stepsReady: EventEmitter<void> = new EventEmitter<void>();

  private dashboardRouteUrl: string = 'dashboard/consolidated';
  isLoaded: boolean;
  draft: any = {};
  template: any = {};
  isShowSaveAsDraftModal: boolean;
  isShowSaveAsTemplateModal: boolean;
  viewport: string = 'web';

  isDynamicFormAvailable: boolean = false;

  constructor(
    private httpService: HttpService,
    private menuService: MenuService,
    private userService: UserService,
    private router: Router,
    private location: Location,
    private toasterService: ToasterService,
    private stepperService: StepperService,
    private viewportService: ViewportService,
  ) {
    this.userService.getDashboardRouteUrl().subscribe((dashboardRouteUrl: string) => {
      this.dashboardRouteUrl = dashboardRouteUrl;
    });
    if (!this.menuService.getSelectedServiceUrl()) {
      this.router.navigateByUrl(this.dashboardRouteUrl);
    }
  }

  ngOnInit(): void {
    this.viewportService.getViewport().subscribe((viewPort: string) => {
      this.viewport = viewPort;
    });

    if (!this.parentRef) {
      console.error("Kindly pass @input('context') to app-stepper-footer");
      this.parentRef = { mode: 'VIEW' };
      return;
    }

    if (!this.parentRef.stepperDetails) {
      console.error('Kindly give defination for stepperDetails: Stepper');
      this.parentRef.stepperDetails = {
        currentStep: 1,
        isSaveDraftApplicable: false,
        isSaveAsTemplateApplicable: false,
        isSecondLastStepLabelAsReview: false,
        isHideStepFooter: false,
        isAuthMatrixMaster: false,
        headings: [],
        steps: [],
      };
    }

    // Optional
    if (!this.parentRef.beforeSubmit) {
      //console.warn('Kindly give implementation for beforeSubmit(): boolean');
      this.parentRef.beforeSubmit = function () {
        return true;
      };
    }

    // Optional
    if (!this.parentRef.afterSubmit) {
      //console.warn('Kindly give implementation for afterSubmit(response: any): boolean');
      this.parentRef.afterSubmit = function (response) {
        return true;
      };
    }

    if (this.parentRef.stepperDetails.isOnlyFooter) {
      if (!this.parentRef.getNoOfSubSteps) {
        //console.warn('Kindly give implementation for getNoOfSubSteps(stepNo: number): number');
        this.parentRef.getNoOfSubSteps = function (stepNo: number) {
          return 0;
        };
      }

      if (!this.parentRef.validateForm) {
        console.warn('Kindly give implementation for validateForm(stepNo: number): boolean');
        this.parentRef.validateForm = function (stepNo: number, subStep: number) {
          return true;
        };
      }

      //Optional
      if (!this.parentRef.getSubHeading) {
        // console.warn('Kindly give implementation for getSubHeading(stepNo: number): string');
        this.parentRef.getSubHeading = function (stepNo: number) {
          return 'Step' + stepNo + ' Details';
        };
      }
    }

    if (!this.parentRef.validateDraftForm) {
      if (this.parentRef.stepperDetails.isSaveAsTemplateApplicable)
        console.warn('Kindly give implementation for validateDraftForm(): boolean');
      this.parentRef.validateDraftForm = function () {
        return true;
      };
    }

    // Optional
    if (!this.parentRef.beforeSaveDraft) {
      if (this.parentRef.stepperDetails.isSaveDraftApplicable)
        // console.warn('Kindly give implementation for beforeSaveDraft(): boolean');
        this.parentRef.beforeSaveDraft = function () {
          return true;
        };
    }

    // Optional
    if (!this.parentRef.beforeSaveTemplate) {
      if (this.parentRef.stepperDetails.isSaveAsTemplateApplicable)
        // console.warn('Kindly give implementation for beforeSaveTemplate(): boolean');
        this.parentRef.beforeSaveTemplate = function () {
          return true;
        };
    }

    this.getDynamicFormDetails();

    this.isLoaded = true;
  }

  getDynamicFormDetails(): void {
    const data = {
      filters: [
        { name: 'menuId', value: this.menuService.getSelectedMenu().id },
        { name: 'isForAdminPortal', value: true },
        { name: 'authorized', value: 'Y' },
        { name: 'enabled', value: 'Y' },
      ],
    };
    this.httpService
      .httpPost('setup/cibSetup/dynamicFormBuilder/private/view', data)
      .subscribe((response: any) => {
        if (response.id && response.serviceUrl != this.menuService.getSelectedServiceUrl()) {
          this.isDynamicFormAvailable = true;
          this.parentRef.formData.dynamicFormId = response.id;
          this.parentRef.gridDataList = response.gridDataList;
          this.parentRef.stepperDetails.headings.splice(
            this.parentRef.stepperDetails.headings.length - 1,
            0,
            response.stepDisplayName ? response.stepDisplayName : 'Extra Details',
          );
          this.updateDynamicFormDetails();
        } else {
          this.isDynamicFormAvailable = false;
        }
        this.generateStepperData();
      });
  }

  updateDynamicFormDetails(): void {
    if (this.parentRef.mode && !this.parentRef.formData.id) {
      setTimeout(() => {
        this.updateDynamicFormDetails();
      }, 100);
    } else {
      this.parentRef.gridDataList.forEach((item: any) => {
        if (item.itemType == 'CARD') {
          item.cardData.forEach((field: any) => {
            if (
              this.parentRef.mode &&
              this.parentRef.formData.dynamicFormDetails &&
              this.parentRef.formData.dynamicFormDetails[0][_.camelCase(field.label)]
            ) {
              if (
                (field.componentClassName == 'FORM_CALENDER' && field.selectionMode == 'range') ||
                field.componentClassName == 'FORM_CHECKBOX'
              ) {
                this.parentRef.formData.dynamicFormDetails[0][_.camelCase(field.label)] =
                  this.parentRef.formData.dynamicFormDetails[0][_.camelCase(field.label)].split(
                    ',',
                  );
              }
              if (field.itemType != 'GENERIC') {
                field.value =
                  this.parentRef.formData.dynamicFormDetails[0][_.camelCase(field.label)];
                field.displayValue =
                  this.parentRef.formData.dynamicFormDetails[0][_.camelCase(field.label) + '_DV'];
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
      if (this.parentRef.mode == 'VIEW') {
        this.parentRef.stepperDetails.currentStep = this.parentRef.stepperDetails.headings.length;
      }
    }
  }

  generateStepperData(): void {
    this.parentRef.stepperDetails.steps = [];
    this.parentRef.stepperDetails.headings.forEach((heading: string, i: number) => {
      let step: StepStatus = {
        displayLabel: heading,
        completed: false,
        active: false,
        visited: false,
        stepStatus: 'progress',
        completePercentage: 0,
        subSteps: [],
      };
      const noOfSubStep = this.parentRef.getNoOfSubSteps(i + 1);
      if (noOfSubStep > 0) {
        let subSteps: StepStatus[] = [];
        for (let j = 0; j < noOfSubStep; j++) {
          subSteps.push({
            completed: false,
            active: false,
            visited: false,
            stepStatus: 'progress',
            completePercentage: 0,
            subSteps: [],
          });
        }
        step.subSteps = subSteps;
      }
      this.parentRef.stepperDetails.steps.push(step);
      setTimeout(() => {
        this.stepsReady.emit();
      });
    });
    if (this.parentRef.stepperDetails.steps.length > 0) {
      // this.parentRef.stepperDetails.currentStep = 1;
      this.parentRef.stepperDetails.currentSubStep = 1;
      this.parentRef.stepperDetails.steps[0].active = true;
    }
  }

  resetDraft(): void {
    if (this.parentRef.stepperDetails.isUpdateDraft) {
      this.draft = {
        name: this.parentRef.formData.draftName,
        description: this.parentRef.formData.draftDesc,
      };
    } else {
      this.draft = { name: '', description: '' };
    }
  }

  resetTemplate(): void {
    this.template = { name: '', description: '' };
  }

  isFinalStep(): boolean {
    return this.parentRef.stepperDetails.currentStep == this.parentRef.stepperDetails.steps?.length;
  }

  getNextSubmitButtonCaption(): string {
    let caption = 'NEXT';
    if (this.isFinalStep() && (!this.parentRef.mode || this.parentRef.mode != 'EDIT')) {
      caption = 'SUBMIT';
    } else if (this.isFinalStep() && this.parentRef.mode && this.parentRef.mode == 'EDIT') {
      caption = 'UPDATE';
    } else if (
      this.parentRef.stepperDetails.isSecondLastStepLabelAsReview &&
      this.parentRef.stepperDetails.currentStep == this.parentRef.stepperDetails.steps?.length - 1
    ) {
      caption = 'REVIEW';
    }
    return caption;
  }

  getNextSubmitButtonIcon(): string {
    let caption = 'fa-chevron-right';
    if (this.isFinalStep() && !this.parentRef.mode) {
      caption = 'fa-paper-plane';
    } else if (this.isFinalStep() && this.parentRef.mode) {
      caption = 'fa-save';
    } else if (
      this.parentRef.stepperDetails.isSecondLastStepLabelAsReview &&
      this.parentRef.stepperDetails.currentStep == this.parentRef.stepperDetails.steps?.length - 1
    ) {
      caption = 'fa-search';
    }
    return caption;
  }

  public onNextClick(currentStep: number): void {
    const currentSubSteps = this.parentRef.stepperDetails.steps[currentStep - 1].subSteps;
    if (
      currentSubSteps &&
      currentSubSteps.length > 0 &&
      this.parentRef.stepperDetails.currentSubStep < currentSubSteps.length
    ) {
      this.parentRef.stepperDetails.currentSubStep =
        this.parentRef.stepperDetails.currentSubStep + 1;
    } else if (currentStep < this.parentRef.stepperDetails.steps.length) {
      this.parentRef.stepperDetails.steps[currentStep - 1].completed = true;
      this.parentRef.stepperDetails.steps[currentStep - 1].active = false;
      this.parentRef.stepperDetails.steps[currentStep - 1].visited = true;
      this.parentRef.stepperDetails.currentStep = currentStep + 1;
      this.parentRef.stepperDetails.steps[currentStep].active = true;
    } else {
      this.submitFormData();
    }

    if (this.parentRef.onStepChange)
      this.parentRef.onStepChange(currentStep + 1, this.parentRef.stepperDetails.currentSubStep);

    this.calculatePercentageCompletedAngle();
  }

  onPreviousClick(currentStep: number): void {
    const currentSubSteps = this.parentRef.stepperDetails.steps[currentStep - 1].subSteps;

    if (
      currentSubSteps &&
      currentSubSteps.length > 0 &&
      this.parentRef.stepperDetails.currentSubStep != 1
    ) {
      this.parentRef.stepperDetails.currentSubStep =
        this.parentRef.stepperDetails.currentSubStep - 1;
    } else {
      this.parentRef.stepperDetails.steps[currentStep - 1].visited = true;
      this.parentRef.stepperDetails.currentStep = this.parentRef.stepperDetails.currentStep - 1;
    }

    if (this.parentRef.onStepChange)
      this.parentRef.onStepChange(currentStep - 1, this.parentRef.stepperDetails.currentSubStep);

    this.calculatePercentageCompletedAngle();
  }

  onCancelClick(): void {
    if (this.parentRef.onCancelClick) this.parentRef.onCancelClick();
    else this.router.navigateByUrl(this.dashboardRouteUrl);
  }

  onBackClick(): void {
    if (this.parentRef.onBackClick) {
      this.parentRef.onBackClick();
    } else {
      this.location.back();
    }
  }

  onSaveAsDraftClick(): void {
    if (this.parentRef.beforeSaveDraft()) {
      this.isShowSaveAsDraftModal = false;
      this.parentRef.formData.draftName = this.draft.name;
      this.parentRef.formData.draftDesc = this.draft.description;
      let url = this.menuService.getSelectedServiceUrl();
      if (!this.parentRef.stepperDetails.isUpdateDraft) url = url + '/private/createDraft';
      else url = url + '/private/updateDraft';

      this.httpService.httpPost(url, this.parentRef.formData).subscribe((response: any) => {
        const viewData = { dataMap: { id: response.dataMap.id } };
        this.httpService
          .httpPost(this.menuService.getSelectedServiceUrl() + '/private/viewDraft', viewData)
          .subscribe((viewResponse: any) => {
            const msg = this.parentRef.stepperDetails.isUpdateDraft
              ? 'Draft updated successfully'
              : 'Draft saved successfully';
            this.toasterService.showToaster({ severity: 'success', detail: msg });
            this.parentRef.formData = viewResponse;
            this.parentRef.formData.draftId = viewResponse.id;
            this.parentRef.stepperDetails.isUpdateDraft = true;
          });
      });
    }
  }

  onSaveAsTemplateClick(): void {
    if (this.parentRef.beforeSaveTemplate()) {
      this.isShowSaveAsTemplateModal = false;
      this.parentRef.formData.templateName = this.template.name;
      this.parentRef.formData.templateDesc = this.template.description;
      let url = this.menuService.getSelectedServiceUrl();
      if (!this.parentRef.stepperDetails.isUpdateTemplate) url = url + '/private/createTemplate';
      else url = url + '/private/updateTemplate';

      this.httpService.httpPost(url, this.parentRef.formData).subscribe((response: any) => {
        const viewData = { dataMap: { id: response.dataMap.id } };
        this.httpService
          .httpPost(this.menuService.getSelectedServiceUrl() + '/private/viewTemplate', viewData)
          .subscribe((viewResponse: any) => {
            const msg = this.parentRef.stepperDetails.isUpdateTemplate
              ? 'Template updated successfully'
              : 'Template saved successfully';
            this.toasterService.showToaster({ severity: 'success', detail: msg });
            this.parentRef.formData = viewResponse;
            this.parentRef.stepperDetails.isUpdateTemplate = true;
          });
      });
    }
  }

  validateForm(stepNo: number): boolean {
    if (
      this.isDynamicFormAvailable &&
      stepNo == this.parentRef.stepperDetails.headings.length - 1
    ) {
      for (let i = 0; i < this.parentRef.gridDataList?.length; i++) {
        if (this.parentRef.gridDataList[i].itemType == 'CARD') {
          for (let j = 0; j < this.parentRef.gridDataList[i].cardData.length; j++) {
            if (
              this.parentRef.gridDataList[i].cardData[j].itemType != 'GENERIC' &&
              this.parentRef.gridDataList[i].cardData[j].required &&
              !this.parentRef.gridDataList[i].cardData[j].value
            ) {
              return false;
            }
          }
        }
      }
      return true;
    } else {
      return this.parentRef.validateForm(stepNo);
    }
  }

  submitFormData(): void {
    if (this.parentRef.beforeSubmit()) {
      this.updateDynamicFormData();
      delete this.parentRef.formData.daftName;
      delete this.parentRef.formData.DescDesc;
      delete this.parentRef.formData.templateName;
      delete this.parentRef.formData.templateDesc;
      let url = this.menuService.getSelectedServiceUrl();
      if (!this.parentRef.mode || this.parentRef.mode !== 'EDIT') url = url + '/private/create';
      else url = url + '/private/update';

      this.httpService.httpPost(url, this.parentRef.formData).subscribe((response: any) => {
        if (this.parentRef.afterSubmit(response)) {
          let msg = this.parentRef.getSuccessMessage ? this.parentRef.getSuccessMessage() : '';
          msg =
            this.parentRef.stepperDetails.masterName +
            (this.parentRef.mode ? ' updated successfully' : ' initiated successfully');
          this.toasterService.showToaster({ severity: 'success', detail: msg });
          this.router.navigateByUrl(this.menuService.getSelectedServiceUrl() + '/listing');
        }
      });
    }
  }

  updateDynamicFormData(): void {
    if (!this.isDynamicFormAvailable) return;
    this.parentRef.formData.dynamicFormDetails = [{}];
    this.parentRef.gridDataList?.forEach((item: any) => {
      if (item.itemType == 'CARD') {
        item.cardData.forEach((field: any) => {
          if (
            (field.componentClassName == 'FORM_CALENDER' && field.selectionMode == 'range') ||
            field.componentClassName == 'FORM_CHECKBOX'
          ) {
            field.value = field.value.join(',');
          }
          if (field.itemType != 'GENERIC') {
            this.parentRef.formData.dynamicFormDetails[0][_.camelCase(field.label)] = field.value;
            this.parentRef.formData.dynamicFormDetails[0][_.camelCase(field.label) + '_DV'] =
              field.displayValue;
          }
        });
      }
    });
  }

  calculatePercentageCompletedAngle() {
    const noOfSteps = this.parentRef.stepperDetails.steps.length;
    let noOfStepsCompleted = 0;
    this.parentRef.stepperDetails.steps?.forEach((step: any) => {
      if (step.completed) {
        noOfStepsCompleted++;
      }
    });

    const percentageCompleted = (noOfStepsCompleted * 100) / noOfSteps;

    const percentageCompletedAngle = Math.ceil(3.6 * percentageCompleted + 270) % 360;

    this.stepperService.setPercentageCompletedAngle(percentageCompletedAngle);
  }
}
