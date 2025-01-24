import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { LatePaymentPenaltyTemplate } from './@models/late-payment-penalty-template.model';

@Component({
  selector: 'app-late-payment-penalty-template',
  templateUrl: './late-payment-penalty-template.component.html',
  styleUrls: ['./late-payment-penalty-template.component.scss']
})
export class LatePaymentPenaltyTemplateComponent implements OnInit {

  formData: LatePaymentPenaltyTemplate = new LatePaymentPenaltyTemplate();
  mode: string;
  stepperDetails: Stepper = {
    masterName: 'Late Payment Penalty Template',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private actionsService: ActionService,
    private viewService: ViewService,) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Alert Template',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Security-Corporate' },
      { label: 'Service Template' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/templates/alertTemplate/private/view', data)
        .subscribe((formData: LatePaymentPenaltyTemplate) => {
          this.viewService.clearAll();
          this.formData = formData;
          // this.onModuleChange(formData.moduleId);
          // this.onCategoryChange(formData.categoryId);
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }
}
