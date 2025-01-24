import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '../base/@models/actions';
import { Breadcrumb } from '../base/main/@models/breadcrumb.model';
import { ActionService } from '../base/main/@services/action.service';
import { BreadcrumbService } from '../base/main/@services/breadcrumb.service';
import { MenuService } from '../base/main/@services/menu.service';
import { GenericListingComponent } from 'src/app/shared/@components/generic-listing/generic-listing.component';
import { HttpService } from '../shared/@services/http.service';
import { ViewportService } from '../shared/@services/viewport.service';
import { ViewService } from '../shared/services/view-service/view-service';
import { DownloadReportRendererComponent } from './@components/download-report-renderer/download-report-renderer.component';
import { ReportService } from './@services/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent extends GenericListingComponent implements OnInit {
  @ViewChild('generatedReportGrid') generatedReportGrid: any;

  parentComponentRef: any = this;
  mostFrequentReports: any[] = [];
  product: string;
  reportType: string;
  viewPort: string;
  dataSource: any;
  reportUrl: any;

  colDefsUrl: string = 'reports/private/colDef';
  rowDefsUrl: string = 'reports/private/getReportList';
  rowData: any[] = [];

  frameworkComponents = {
    downloadReportRenderer: DownloadReportRendererComponent,
  };

  gridOptions = {
    // rowModelType: "clientSide",
    context: { componentParent: this },
  };

  constructor(
    protected actionsService: ActionService,
    protected breadcrumbService: BreadcrumbService,
    protected httpService: HttpService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected menuService: MenuService,
    protected viewPortService: ViewportService,
    protected viewService: ViewService,
    protected reportService: ReportService,
  ) {
    super(actionsService, breadcrumbService, menuService, router, viewService, httpService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.viewPortService.getViewport().subscribe((res) => {
      this.viewPort = res;
    });
    this.getParams();
    this.getMostFrequentReports();
    const actions: Actions = {
      heading: 'Reports - Listing',
      subHeading: null,
      widgetsActions: false,
      refresh: true,
      widgets: false,
      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { label: this.getProductByParams(this.product) },
      { label: this.getCategoryByParams(this.reportType) },
      { label: 'Report' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
  }

  // getGridData() {
  //   const reqData = {
  //     dataMap: {
  //       productName: this.getProductByParams(this.product),
  //       category: this.getCategoryByParams(this.reportType)
  //     }
  //   }
  //   this.httpService.httpPost('reports/private/getGridFilteredData', reqData).subscribe(res => {
  //     this.rowData = res.dataList
  //     if (this.generatedReportGrid) {
  //       this.generatedReportGrid.setRowData(this.rowData)
  //     }

  //   })
  // }

  getProductByParams(product) {
    var str: string;
    switch (product) {
      case 'setup':
        str = 'Setup';
        return str;
      case 'payments':
        str = 'Payments';
        return str;
      case 'vam':
        str = 'Vam';
        return str;
    }
    return str;
  }

  getCategoryByParams(reportType) {
    var str: string;
    switch (reportType) {
      case 'audit':
        str = 'Audit';
        return str;
      case 'generic':
        str = 'Generic';
        return str;
      case 'master':
        str = 'Master';
        return str;
    }
    return str;
  }

  getMostFrequentReports() {
    this.httpService
      .httpPost('reports/private/mostFrequentReportData')
      .subscribe((mostFrequentReports) => {
        this.mostFrequentReports = mostFrequentReports;
      });
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.product = params['product'];
      this.reportType = params['reportType'];
      // this.getGridData();
    });
  }

  onFrequentReportClick(selectedReport) {
    this.reportService.selectedFrequentReportId = selectedReport.id;
    this.router.navigateByUrl('/reports/' + this.product + '/' + this.reportType + '/initiate');
  }

  createNewReport() {
    this.router.navigateByUrl('/reports/' + this.product + '/' + this.reportType + '/initiate');
  }

  downloadReport(id, reportId, reportFileType) {
    const reqData = {
      dataMap: {
        id: id,
        reportId: reportId,
        fileType: reportFileType,
      },
    };
    this.httpService
      .httpPost('reports/private/downloadReport', reqData)
      .subscribe((response: any) => {
        if (response.responseStatus.status == 0) {
          this.httpService.httpDownload(response.dataMap.filePath);
        }
      });
  }

  // onDownloadClick(data) {
  //   const reqData = {
  //     reportId: data.id
  //   }
  //   this.httpService.httpPost('reports/private/donwloadReport', reqData).subscribe((res: any) => {
  //     res
  //   })
  //   // window.open(environment.serverUrl + URL, '_blank')
  // }
}
