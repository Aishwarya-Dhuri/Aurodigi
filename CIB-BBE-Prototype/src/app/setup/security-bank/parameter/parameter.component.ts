import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ParameterTemplate } from './@models/parameter.model';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent implements OnInit {
  @ViewChild('parameterForm') parameterForm: any;

  formData: ParameterTemplate = new ParameterTemplate();
  editIndex: number = -1;
  mode: string;
  stepperDetails: Stepper = {
    masterName: 'Parameter',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private actionsService: ActionService,
    private viewService: ViewService,
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Parameter',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Security-Bank' },
      { label: 'Parameter' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/securityBank/parameter/private/view', data)
        .subscribe((formData: ParameterTemplate) => {
          this.viewService.clearAll();
          this.formData = formData;

          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.parameterForm) {
      return this.parameterForm.valid;
    }
    return true;
  }

}
