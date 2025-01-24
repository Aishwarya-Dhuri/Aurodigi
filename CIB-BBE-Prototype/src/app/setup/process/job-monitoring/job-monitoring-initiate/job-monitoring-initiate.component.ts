import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { JobMonitoring } from '../@models/job-monitoring.model';

@Component({
  selector: 'app-job-monitoring-initiate',
  templateUrl: './job-monitoring-initiate.component.html',
  styleUrls: ['./job-monitoring-initiate.component.scss'],
})
export class JobMonitoringInitiateComponent implements OnInit {
  formData: JobMonitoring = new JobMonitoring();
  mode: string;

  stepperDetails: Stepper = {
    masterName: 'Job Monitoring',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private httpService: HttpService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Job Monitoring',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Process' },
      { label: 'Job Monitoring' },
      { label: 'Initiate' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/process/jobMonitoring/private/view', data)
        .subscribe((formData: JobMonitoring) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }
}
