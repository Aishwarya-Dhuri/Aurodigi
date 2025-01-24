import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BenchmarkRate } from './@models/benchmark-rate.model';

@Component({
  selector: 'app-benchmark-rate',
  templateUrl: './benchmark-rate.component.html',
  styleUrls: ['./benchmark-rate.component.scss']
})
export class BenchmarkRateComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;

  formData: BenchmarkRate = new BenchmarkRate();
  mode: string;
  subModuleNameList = []
  isViewPassword: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'Benchmark Rate',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };
  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private httpService: HttpService,
    private userService: UserService,
    private viewService: ViewService,
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Benchmar kRate',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'General Masters' },
      { label: 'Benchmark Rate' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/generalMasters/benchmarkRate/private/view', data)
        .subscribe((formData: BenchmarkRate) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.bankProfileForm) {
      return this.bankProfileForm.valid;
    }
    return true;
  }

  countryCodeList = [
    { id: 'IND12091', displayName: 'IND12091' },
    { id: 'USA01883', displayName: 'USA01883' },
    { id: 'THAILAND21009', displayName: 'THAILAND21009' }
  ];

  onChangeCountryCode(code) {
    if (code === 'IND12091') {
      this.formData.countryName = 'INDIA'
    }
    else if (code === 'USA01883') {
      this.formData.countryName = 'USA'
    }
    else if (code === 'THAILAND21009') {
      this.formData.countryName = 'THAILAND'
    }
  }

}
