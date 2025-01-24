import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { AppSetting } from 'src/app/shared/@models/app-setting';
import { Select } from 'src/app/shared/@models/select.model';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';

@Component({
  selector: 'aps-authorization-dashboard',
  templateUrl: './authorization-dashboard.component.html',
  styleUrls: ['./authorization-dashboard.component.scss'],
})
export class AuthorizationDashboardComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [
    { icon: 'fa-home' },
    { label: 'Common' },
    { label: 'Process' },
    { label: 'Authorization Dashboard' },
  ];
  viewport: string;
  selectedProduct: string;
  productList: Select[] = [];
  productWiseDashbard: any;
  themeColor: any[];
  chartTheme: any;
  overviewPieChartOptions: any = {};
  isLoading: boolean;
  barChartCategory: string = 'Authorization type';
  overviewAuthorizationTypeBarChartOptions: any;
  overviewCriticalityBarChartOptions: any;
  isMinimalView: boolean;
  masterCategory: string = 'ALL';
  listType: string = 'grid';
  parentMenus: any[] = [];
  selectedParentMenu: any;
  parentSearchText: string = '';

  constructor(
    private httpService: HttpService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private userService: UserService,
    private viewportService: ViewportService,
    private menuService: MenuService,
    private listingService: ListingService,
    private appSettingService: AppSettingService,
  ) { }

  ngOnInit(): void {
    /* remove below : starts */
    const actions: Actions = {
      heading: 'Authorization Dashboard',
      refresh: true,
      print: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    /* remove below : ends */

    this.viewportService.getViewport().subscribe((viewport: any) => {
      this.viewport = viewport;
      if (this.viewport == 'mobile') {
        this.listType = 'card';
      }
    });

    // if (this.userService.userDetails.corporateType === 'S') {
    this.isMinimalView = true;
    // }
    this.setChartTheme();
    this.setOverviewPieChartOptions();
    this.setOverviewBarChartOptions();
    this.getProductList();
  }

  getProductList(): void {
    this.httpService
      .httpPost('commons/commonService/private/getProductList')
      .subscribe((response: any) => {
        this.productList = response.dataList;

        const urlProduct = this.router.url.split('/')[1];
        if (urlProduct !== 'common') {
          this.productList.forEach((product: Select) => {
            if (product.enrichments.product.toLowerCase() == urlProduct.toLowerCase()) {
              /* if (product.id == 'payments') { */
              this.selectedProduct = product.id;
              this.breadcrumbs[1].label = product.displayName;
              this.breadcrumbService.setBreadCrumb(this.breadcrumbs);
              this.getProductWiseDashboard(product);
            }
          });
        }
      });
  }

  setChartTheme(): void {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      setTimeout(() => {
        const themeColors = this.appSettingService.getThemeColors();
        this.themeColor = [themeColors[0], themeColors[1], themeColors[2]];
        this.chartTheme = {
          baseTheme: 'default',
          palette: {
            fills: [...this.themeColor],
            strokes: [...this.themeColor],
          },
        };
        this.updateTheme();
      }, 100);
    });
  }

  setOverviewPieChartOptions(): void {
    this.overviewPieChartOptions = {
      data: [],
      series: [
        {
          type: 'pie',
          labelKey: 'displayName',
          angleKey: 'value',
          innerRadiusOffset: 7.5,
          label: { enabled: false },
        },
      ],
      theme: this.chartTheme,
      background: {
        fill: 'transparent',
      },
      legend: {
        item: {
          marker: { shape: 'circle', size: 10 },
          label: {
            fontSize: 14,
            formatter: (params: any) => {
              return `${this.overviewPieChartOptions.data[params.itemId].displayName
                }\t\t\t\t\t\t\t\t\t${this.overviewPieChartOptions.data[params.itemId].value}`;
            },
          },
        },
      },
    };
  }

  setOverviewBarChartOptions(): void {
    this.overviewAuthorizationTypeBarChartOptions = {
      autoSize: true,
      theme: this.chartTheme,
      data: [],
      series: [
        {
          type: 'column',
          xKey: 'parentMenu',
          yKeys: ['partialAuthorized', 'justCreatedCount'],
          yNames: ['Partially Authorized', 'Just Created'],
          shadow: { enabled: false },
        },
      ],
      axes: [
        { type: 'category', position: 'bottom' },
        { type: 'number', position: 'left', tick: { count: 4 } },
      ],
      legend: {
        position: 'bottom',
        spacing: 0,
        item: {
          marker: { shape: 'circle', size: 8 },
          label: {
            fontSize: 12,
          },
        },
      },
      padding: {
        top: 0, // default: 20
        right: 0, // default: 20
        bottom: 5,
        left: 0, // default: 20
      },
    };
    this.overviewCriticalityBarChartOptions = {
      autoSize: true,
      theme: this.chartTheme,
      data: [],
      series: [
        {
          type: 'column',
          xKey: 'parentMenu',
          yKeys: ['pendingCriticalCount', 'pendingNonCriticalCount'],
          yNames: ['Critical', 'Non Critical'],
          shadow: { enabled: false },
        },
      ],
      axes: [
        { type: 'category', position: 'bottom' },
        { type: 'number', position: 'left', tick: { count: 4 } },
      ],
      legend: {
        position: 'bottom',
        spacing: 0,
        item: {
          marker: { shape: 'circle', size: 8 },
          label: {
            fontSize: 12,
          },
        },
      },
      padding: {
        top: 0, // default: 20
        right: 0, // default: 20
        bottom: 5,
        left: 0, // default: 20
      },
    };
  }

  updateTheme(): void {
    if (this.overviewPieChartOptions) {
      const overviewPieChartOptions = cloneDeep(this.overviewPieChartOptions);
      overviewPieChartOptions.theme = this.chartTheme;
      this.overviewPieChartOptions = overviewPieChartOptions;
    }
    if (this.overviewAuthorizationTypeBarChartOptions) {
      const overviewAuthorizationTypeBarChartOptions = cloneDeep(
        this.overviewAuthorizationTypeBarChartOptions,
      );
      overviewAuthorizationTypeBarChartOptions.theme = this.chartTheme;
      this.overviewAuthorizationTypeBarChartOptions = overviewAuthorizationTypeBarChartOptions;
    }
    if (this.overviewCriticalityBarChartOptions) {
      const overviewCriticalityBarChartOptions = cloneDeep(this.overviewCriticalityBarChartOptions);
      overviewCriticalityBarChartOptions.theme = this.chartTheme;
      this.overviewCriticalityBarChartOptions = overviewCriticalityBarChartOptions;
    }
  }

  getProductWiseDashboard(product: Select): void {
    this.breadcrumbs[1].label = product.displayName;
    this.breadcrumbService.setBreadCrumb(this.breadcrumbs);
    const requestData = { dataMap: { productId: product.id } };
    this.httpService
      .httpPost(
        this.selectedProduct + '/authorizationDashboardService/private/getPendingCounts',
        requestData,
      )
      .subscribe((response: any) => {
        this.productWiseDashbard = response;
        this.setOverviewPieChartData();
        this.setOverviewBarChartData();
        this.setParentMenusData();
      });
  }

  setOverviewPieChartData(): void {
    const overviewPieChartOptions = cloneDeep(this.overviewPieChartOptions);
    overviewPieChartOptions.data = [
      {
        displayName: 'Partially Authorized',
        value: this.productWiseDashbard.overallCounts.partialAuthorized,
      },
      {
        displayName: 'Just Created        ',
        value: this.productWiseDashbard.overallCounts.justCreatedCount,
      },
    ];
    this.overviewPieChartOptions = overviewPieChartOptions;
  }

  setOverviewBarChartData(): void {
    const overviewAuthorizationTypeBarChartOptions = cloneDeep(
      this.overviewAuthorizationTypeBarChartOptions,
    );
    const overviewCriticalityBarChartOptions = cloneDeep(this.overviewCriticalityBarChartOptions);

    let overviewBarChartData = [];
    this.productWiseDashbard.pendingCounts.forEach((parentMenu: any) => {
      overviewBarChartData.push({
        parentMenu: parentMenu.displayName,
        justCreatedCount: parentMenu.justCreatedCount,
        pendingCriticalCount: parentMenu.pendingCriticalCount,
        pendingNonCriticalCount: parentMenu.pendingCount - parentMenu.pendingCriticalCount,
        partialAuthorized: parentMenu.partialAuthorized,
      });
    });
    overviewAuthorizationTypeBarChartOptions.data = overviewBarChartData;
    overviewCriticalityBarChartOptions.data = overviewBarChartData;
    this.overviewAuthorizationTypeBarChartOptions = overviewAuthorizationTypeBarChartOptions;
    this.overviewCriticalityBarChartOptions = overviewCriticalityBarChartOptions;
  }

  setParentMenusData(): void {
    this.parentMenus = [];
    this.productWiseDashbard.pendingCounts.forEach((parentMenu: any) => {
      this.parentMenus.push({
        label: parentMenu.displayName,
        count: parentMenu.pendingCount,
        data: parentMenu,
      });
    });
    if (this.parentMenus.length > 0) {
      this.selectedParentMenu = this.parentMenus[0];
      // if (this.userService.userDetails.corporateType !== 'S') {
      this.isMinimalView = false;
      // }
    } else this.isMinimalView = true;
  }

  onParentMenuSearch(): void { }

  onParentMenuSelected(parentMenu: any): void {
    this.selectedParentMenu = parentMenu;
  }

  getParentMenus() {
    if (this.parentSearchText) {
      return this.parentMenus.filter((menu: any) =>
        menu.label.toLowerCase().includes(this.parentSearchText.toLowerCase()),
      );
    }
    return this.parentMenus;
  }

  filterMasterList(masterList: any[]): any[] {
    let list = [];
    if (this.masterCategory == 'ALL') {
      list = masterList;
    } else if (this.masterCategory == 'ONLY_FAVORITES') {
      masterList.forEach((master: any) => {
        if (master.isFavourite) list.push(master);
      });
    } else if (this.masterCategory == 'CRITICAL') {
      masterList.forEach((master: any) => {
        if (master.pendingCriticalCount > 0) list.push(master);
      });
    }
    return list;
  }

  calculateWidth(param1: number, total: number): string {
    return (param1 / total) * 100 + '%';
  }

  navigateTo(serviceUrl: string, url: string): void {
    this.menuService.setSelectedServiceUrl(serviceUrl);
    this.listingService.setBackButton(true);
    this.listingService.setSelectedListCode('PENDINGLIST');
    this.router.navigateByUrl(url);
  }
}
