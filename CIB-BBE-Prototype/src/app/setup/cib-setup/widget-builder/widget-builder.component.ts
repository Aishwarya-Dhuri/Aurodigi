import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { WidgetBuilder } from './@model/widget-builder';

@Component({
  selector: 'app-widget-builder',
  templateUrl: './widget-builder.component.html',
  styleUrls: ['./widget-builder.component.scss'],
})
export class WidgetBuilderComponent implements OnInit {
  @ViewChild('step1Details') step1Details: any;
  mode: string;
  formData: WidgetBuilder = new WidgetBuilder();
  stepperDetails: Stepper = {
    masterName: 'Widget Builder',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    headings: ['Widget Details', 'Widget Generation', 'Review and Submit'],
  };
  isRefreshed: boolean = true;
  uploadedAdvertisementList: any[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private httpService: HttpService,
    private viewService: ViewService,
  ) {
    this.getViewData();
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Widget Builder',
      refresh: true,
      print: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'CIB Setup' },
      { label: 'Widget Builder' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/cibSetup/widgetBuilder/private/view', data)
        .subscribe((response: any) => {
          this.setViewData(response);
        });
    }
  }

  setViewData(response: any): void {
    this.viewService.clearAll();
    delete response.responseStatus;
    this.formData = response;
    //massage start
    this.fetchChartData();
    this.formData.chartOptions[0].yKeys = this.formData.chartOptions[0].yKeysStr.split(',');
    this.formData.chartOptions[0].yLabels = this.formData.chartOptions[0].yLabelsStr.split(',');
    this.formData.chartOptions[0].numberAxesPosition =
      this.formData.chartOptions[0].numberAxesPositionStr.split(',');
    this.formData.chartOptions[0].numberAxesTitle =
      this.formData.chartOptions[0].numberAxesTitleStr.split(',');
    let numberAxesRotationAngles =
      this.formData.chartOptions[0].numberAxesRotationAngleStr.split(',');
    this.formData.chartOptions[0].numberAxesRotationAngle = [];
    numberAxesRotationAngles.forEach((angle) => {
      this.formData.chartOptions[0].numberAxesRotationAngle.push(parseInt(angle));
    });
    if (
      this.formData.widgetType == 'Table/Grid' &&
      this.formData.tableGridOptions[0].isApiBasedColDefs
    ) {
      this.fetchTableGridColumnDef();
    }
    this.fetchTableGridData();
    //massage end
    if (this.mode == 'VIEW') {
      this.stepperDetails.currentStep = 3;
    }
  }

  getSubHeading(stepNo: number): string {
    return '';
  }

  onProductChange(module: Select): void {
    this.formData.moduleName = module.displayName;
  }

  fetchChartData(): void {
    if (this.formData.widgetType != 'Chart') return;
    this.formData.chartOptions[0].data = [
      {
        xLabel: 'Jan',
        yLabel0: 180,
        yLabel1: 20,
        yLabel2: 30,
        yLabel3: 180,
        yLabel4: 20,
        yLabel5: 30,
        yLabel6: 180,
        yLabel7: 20,
        yLabel8: 30,
        yLabel9: 30,
      },
      {
        xLabel: 'Feb',
        yLabel0: 110,
        yLabel1: 100,
        yLabel2: 110,
        yLabel3: 180,
        yLabel4: 20,
        yLabel5: 30,
        yLabel6: 180,
        yLabel7: 20,
        yLabel8: 30,
        yLabel9: 30,
      },
      {
        xLabel: 'March',
        yLabel0: 90,
        yLabel1: 90,
        yLabel2: 100,
        yLabel3: 180,
        yLabel4: 20,
        yLabel5: 30,
        yLabel6: 180,
        yLabel7: 20,
        yLabel8: 30,
        yLabel9: 30,
      },
      {
        xLabel: 'April',
        yLabel0: 50,
        yLabel1: 40,
        yLabel2: 50,
        yLabel3: 180,
        yLabel4: 20,
        yLabel5: 30,
        yLabel6: 180,
        yLabel7: 20,
        yLabel8: 30,
        yLabel9: 30,
      },
      {
        xLabel: 'May',
        yLabel0: 60,
        yLabel1: 10,
        yLabel2: 20,
        yLabel3: 180,
        yLabel4: 20,
        yLabel5: 30,
        yLabel6: 180,
        yLabel7: 20,
        yLabel8: 30,
        yLabel9: 30,
      },
    ];
    this.refreshChart();
  }

  addChartY(): void {
    const l = this.formData.chartOptions[0].yLabels.length;
    this.formData.chartOptions[0].yLabels.splice(l, 0, 'YLabel' + (l + 1));
    this.formData.chartOptions[0].yKeys.splice(l, 0, 'yLabel' + l);
    this.refreshChart();
  }

  removeChartY(index: number): void {
    this.formData.chartOptions[0].yLabels.splice(index, 1);
    this.formData.chartOptions[0].yKeys.splice(index, 1);
    this.refreshChart();
  }

  refreshChart(): void {
    this.isRefreshed = false;
    this.formData.chartOptions[0].leftPadding = parseInt(
      this.formData.chartOptions[0].leftPadding.toString(),
    );
    this.formData.chartOptions[0].rightPadding = parseInt(
      this.formData.chartOptions[0].rightPadding.toString(),
    );
    this.formData.chartOptions[0].topPadding = parseInt(
      this.formData.chartOptions[0].topPadding.toString(),
    );
    this.formData.chartOptions[0].bottomPadding = parseInt(
      this.formData.chartOptions[0].bottomPadding.toString(),
    );
    this.formData.chartOptions[0].legendItemMarkerSize = parseInt(
      this.formData.chartOptions[0].legendItemMarkerSize.toString(),
    );
    this.formData.chartOptions[0].legendItemLabelSize = parseInt(
      this.formData.chartOptions[0].legendItemLabelSize.toString(),
    );
    setTimeout(() => {
      this.isRefreshed = true;
    }, 50);
  }

  fetchTableGridColumnDef(): void {
    this.formData.tableGridOptions[0].tableGridWidgetColDefList = [];
    for (let i = 0; i < 4; i++) {
      this.formData.tableGridOptions[0].tableGridWidgetColDefList.push({
        headerName: 'Column' + (i + 1),
        field: 'column1',
        sortable: true,
      });
    }
    this.refreshAgGrid();
  }

  fetchTableGridData(): void {
    this.formData.tableGridOptions[0].rowData = [];
    for (let i = 0; i < 25; i++) {
      let row = {};
      this.formData.tableGridOptions[0].tableGridWidgetColDefList.forEach((col: any) => {
        row[col.field] = col.headerName + Math.floor(Math.random() * 100);
      });
      this.formData.tableGridOptions[0].rowData.push(row);
    }
    this.refreshAgGrid();
  }

  refreshAgGrid(): void {
    this.isRefreshed = false;
    setTimeout(() => {
      this.isRefreshed = true;
    }, 100);
  }

  onAdvertisementFileSelected(files: any[]): void {
    let filesToUpload = _.cloneDeep(files);
    if (!filesToUpload || filesToUpload.length == 0) return;
    this.formData.advertisementOptions[0].advertisementFileList = [];

    filesToUpload.forEach((file: any) => {
      const data = new FormData();
      data.append('files', file);
      this.httpService
        .httpPost('fileUploadService/dashboard/advertisements', data)
        .subscribe((res: any) => {
          if (res && res.dataMap && res.dataMap.file) {
            this.uploadedAdvertisementList.push(res.dataMap.file.filename);
            file.sysFileName = 'assets/dashboard/advertisements/' + res.dataMap.file.filename;
            this.formData.advertisementOptions[0].advertisementFileList.push(file);
            this.refreshAdvertisement();
          }
        });
    });
  }

  refreshAdvertisement(): void {
    if (this.formData.advertisementOptions[0].isUrlBased) {
      this.formData.advertisementOptions[0].advertisementImgUrl =
        this.formData.advertisementOptions[0].advertisementUrl;
    } else {
      this.formData.advertisementOptions[0].advertisementImgUrl = this.httpService.getAssetUrl(
        this.formData.advertisementOptions[0].advertisementFileList[0]?.sysFileName,
      );
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.step1Details) {
      return this.step1Details.valid;
    } else if (stepNo == 2) {
      return true;
    }
    return true;
  }

  beforeSubmit(): boolean {
    //if (this.formData.widgetType == 'Chart') {
    delete this.formData.chartOptions[0].data;
    this.formData.chartOptions[0].yKeysStr = this.formData.chartOptions[0].yKeys.join(',');
    delete this.formData.chartOptions[0].yKeys;
    this.formData.chartOptions[0].yLabelsStr = this.formData.chartOptions[0].yLabels.join(',');
    delete this.formData.chartOptions[0].yLabels;
    this.formData.chartOptions[0].numberAxesPositionStr =
      this.formData.chartOptions[0].numberAxesPosition.join(',');
    delete this.formData.chartOptions[0].numberAxesPosition;
    this.formData.chartOptions[0].numberAxesTitleStr =
      this.formData.chartOptions[0].numberAxesTitle.join(',');
    delete this.formData.chartOptions[0].numberAxesTitle;
    this.formData.chartOptions[0].numberAxesRotationAngleStr =
      this.formData.chartOptions[0].numberAxesRotationAngle.join(',');
    delete this.formData.chartOptions[0].numberAxesRotationAngle;
    //} else if (this.formData.widgetType == 'Table/Grid') {
    delete this.formData.tableGridOptions[0].rowData;
    //} else if (this.formData.widgetType == 'Advertisement') {
    //remove unwanted images
    //}
    return true;
  }
}
