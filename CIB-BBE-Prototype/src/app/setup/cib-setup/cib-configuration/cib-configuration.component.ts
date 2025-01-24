import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { AppSetting, DEFAULT_APP_SETTING } from 'src/app/shared/@models/app-setting';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'app-cib-configuration',
  templateUrl: './cib-configuration.component.html',
  styleUrls: ['./cib-configuration.component.scss'],
})
export class CIBConfigurationComponent implements OnInit, OnDestroy {
  private dashboardRouteUrl: string;
  formData: AppSetting = new AppSetting();
  mode: string;
  stepperDetails: Stepper = {
    masterName: 'UI Configration',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    headings: ['Configration Details', 'Configuration Parameters', 'Review and Submit'],
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private userService: UserService,
    private httpService: HttpService,
    private router: Router,
    private appSettingService: AppSettingService,
    private viewService: ViewService,
  ) {
    this.userService.getDashboardRouteUrl().subscribe((dashboardRouteUrl: string) => {
      this.dashboardRouteUrl = dashboardRouteUrl;
    });
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'CiB UI Configration',
      subHeading: null,
      refresh: true,
      print: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'CIB Setup' },
      { label: 'UI Configration' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.handleBrowserEvents();
    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/cibSetup/uiConfiguration/private/view', data)
        .subscribe((formData: AppSetting) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    } else {
      let data: any = { dataMap: { id: 1 } };
      this.httpService
        .httpPost('setup/cibSetup/uiConfiguration/private/view', data)
        .subscribe((response: any) => {
          delete response.responseStatus;
          this.formData = { ...response };
          this.formData.code = '';
          this.formData.name = '';
          this.formData.corporateCategory = 'Generic';
          this.formData.corporateType = 'Generic';
        });
    }
  }

  private handleBrowserEvents(): void {
    let that = this;
    document.addEventListener('cib-configuration-app-init', function () {
      document.dispatchEvent(
        new CustomEvent('cib-configuration-load-config', { detail: that.formData }),
      );
    });
    document.addEventListener('cib-configuration-cancel-click', function () {
      that.restoreAdminSetting();
      that.removeCIBConfigurationStyle();
      setTimeout(() => {
        that.router.navigateByUrl(that.dashboardRouteUrl);
      }, 100);
    });
    document.addEventListener('cib-configuration-next-click', function (e: any) {
      that.formData = e.detail;
      that.restoreAdminSetting();
      that.removeCIBConfigurationStyle();
      that.stepperDetails.steps[1].completed = true;
      that.stepperDetails.steps[1].active = false;
      that.stepperDetails.steps[1].visited = true;
      that.stepperDetails.currentStep = 3;
      that.stepperDetails.steps[2].active = true;
    });
    document.addEventListener('cib-configuration-previous-click', function (e: any) {
      that.formData = e.detail;
      that.restoreAdminSetting();
      that.removeCIBConfigurationStyle();
      that.stepperDetails.currentStep = 1;
    });
  }

  private addCIBConfigurationStyle() {
    if (!document.getElementById('cib-configuration-style')) {
      let styleTag = document.createElement('link');
      styleTag.id = 'cib-configuration-style';
      styleTag.rel = 'stylesheet';
      styleTag.href = this.httpService.getAssetUrl('assets/cib-configuration/styles.css');
      document.head.appendChild(styleTag);
    }
  }

  private removeCIBConfigurationStyle() {
    if (document.getElementById('cib-configuration-style'))
      document.head.removeChild(document.getElementById('cib-configuration-style'));
  }

  onStepChange(stepNo: number): void {
    if (stepNo == 2) {
      this.addCIBConfigurationStyle();
      this.appSettingService.setIsFullScreen(true);
    }
  }

  getSubHeading(stepNo: number): string {
    if (stepNo == 1) {
      return this.formData.name + ' | ' + this.formData.corporateCategory;
    } else if (stepNo == 2) {
      return this.formData.menuType + ' | ' + this.formData.themeName;
    }
    return '';
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return this.formData.code !== '' && this.formData.name !== '';
    }
    return true;
  }

  ngOnDestroy(): void {
    document.removeEventListener('cib-configuration-app-init', function () {});
    this.restoreAdminSetting();
  }

  restoreAdminSetting(): void {
    this.appSettingService.setIsFullScreen(false);
    this.appSettingService.getAppConfigurations();
  }
}
