import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Location } from './@models/location.model';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;

  formData: Location = new Location();
  mode: string;
  subModuleNameList = []
  isViewPassword: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'Location',
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
      heading: 'Location',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'General Masters' },
      { label: 'Location' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/generalMasters/location/private/view', data)
        .subscribe((formData: Location) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  };

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.bankProfileForm) {
      return true
    }
    return true;
  };

  countryCodeList = [
    { id: 'India', displayName: 'India' },
    { id: 'Thailand', displayName: 'Thailand' },
    { id: 'Vietnam', displayName: 'Vietnam' },
    { id: 'Bangladesh', displayName: 'Bangladesh' }
  ];

  onChangeCountryCode(code) {
    if (code === 'India') {
      this.formData.countryName = 'India'
    }
    else if (code === 'Thailand') {
      this.formData.countryName = 'Thailand'
    }
    else if (code === 'Vietnam') {
      this.formData.countryName = 'Vietnam'
    }
    else if (code === 'Bangladesh') {
      this.formData.countryName = 'Bangladesh'
    }
  };

  provinceCodeList = [
    { id: 'GJ', displayName: 'GJ' },
    { id: 'DEL', displayName: 'DEL' },
    { id: 'MH', displayName: 'MH' }
  ]

  onChangeProvinceCode(code) {
    if (code === 'GJ') {
      this.formData.provinceName = 'Gujrat'
    }
    else if (code === 'DEL') {
      this.formData.provinceName = 'Delhi'
    }
    else if (code === 'MH') {
      this.formData.provinceName = 'Maharashtra'
    }
  }



}
