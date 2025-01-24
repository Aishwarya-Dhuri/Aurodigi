import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Geography } from './@models/geography.model';

@Component({
  selector: 'app-geography',
  templateUrl: './geography.component.html',
  styleUrls: ['./geography.component.scss']
})
export class GeographyComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;

  formData: Geography = new Geography();
  mode: string;
  continent = false
  country = false
  province = false
  subModuleNameList = []
  isViewPassword: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'Geography',
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
      heading: 'Geography',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'General Masters' },
      { label: 'Geography' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/generalMasters/geography/private/view', data)
        .subscribe((formData: Geography) => {
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
      return true
    }
    return true;
  }

  ouTypeNameList = [
    { id: 'Continent', displayName: 'Continent' },
    { id: 'Country', displayName: 'Country' },
    { id: 'Province', displayName: 'Province' }
  ]

  belongsToList = [
    { id: 'India', displayName: 'India' },
    { id: 'Thailand', displayName: 'Thailand' }
  ]

  currencyList = [
    { id: 'INR', displayName: 'INR' },
    { id: 'AED', displayName: 'AED' },
    { id: 'THB', displayName: 'THB' },
    { id: 'VND', displayName: 'VND' },
    { id: 'USD', displayName: 'USD' },
    { id: 'SGD', displayName: 'SGD' }
  ];


  onClickGeography(val, data) {
    this.continent = false
    this.country = false
    this.province = false
    if (val === true && data === 'continent') {
      this.continent = true
      this.formData.ouTypeName = 'Continent'
    }
    else if (val === true && data === 'country') {
      this.country = true
      this.formData.continent = true
      this.formData.ouTypeName = 'Country'
    }
    else if (val === true && data === 'province') {
      this.province = true
      this.formData.continent = true
      this.formData.country = true
      this.formData.belongsTo = null
      this.formData.currency = null
      this.formData.ouTypeName = 'Province'
    }
    else if (val === false && data === 'province') {
      this.province = false
      this.formData.continent = false
      this.formData.country = false
    }
    else if (val === false && data === 'country') {
      this.country = false
      this.formData.continent = false
    }
  }

}