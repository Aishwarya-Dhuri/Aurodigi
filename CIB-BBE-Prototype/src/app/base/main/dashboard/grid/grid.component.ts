import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DirTypes, GridsterConfig, GridsterItem } from 'angular-gridster2';
import { cloneDeep } from 'lodash';
import { AppSetting, ExtraSetting } from 'src/app/shared/@models/app-setting';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { gridsterConfig } from '../../../../shared/@config/gridster.config';
import { DashboardService } from '../../@services/dashboard.service';
import { WidgetService } from '../../@services/widget.service';
import { ActionType } from './@enums/widget-actions';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, OnDestroy {
  private userName: string;
  private mainDashboard: Array<GridsterItem>;
  private maxGridCol: number;
  loadingDashboard: boolean;

  showSearchModal: boolean = false;
  searchModalData: { colDefUrl: string; rowDefUrl: string } = null;

  // gridDestroyed: boolean = false;

  constDashboardType: string;
  dashboardType: string;

  options: GridsterConfig;
  dashboard: Array<GridsterItem>;
  grid: any;

  isFullScreen: boolean;
  changeTitle: boolean;
  outputs: any;
  gridType: number;
  title: string;
  index: number;

  visibleWidgetComponent: { title: string; component: any; serviceUrl?: any } = null;

  constructor(
    private widgetService: WidgetService,
    private dashboardService: DashboardService,
    private userService: UserService,
    private httpService: HttpService,
    private route: ActivatedRoute,
    private appSettingService: AppSettingService,
  ) {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      if (this.options) {
        this.reloadGrid();
      }
    });
    this.appSettingService.getExtraSettingSubject().subscribe((extraSetting: ExtraSetting) => {
      if (this.options) {
        this.reloadGrid();
        this.changeDirection(extraSetting.direction);
      }
    });

    this.userService.getUserName().subscribe((userName: string) => {
      this.userName = userName;
    });
  }

  ngOnInit() {
    this.loadingDashboard = true;
    this.changeTitle = false;
    this.title = '';
    this.index = -1;

    this.widgetService.getSelectModalData().subscribe((searchModalData: any) => {
      this.showSearchModal = !!searchModalData;
      this.searchModalData = searchModalData;
    });

    this.widgetService.getIsFullScreen().subscribe((fullScreen: boolean) => {
      this.isFullScreen = fullScreen;
    });

    this.maxGridCol = 24;

    this.options = gridsterConfig;

    this.outputs = {
      action: (event: any) => this.outputAction(event),
    };

    this.dashboardService.getDashboardType().subscribe((dashboardType: string) => {
      if (this.dashboardType !== dashboardType && this.grid) {
        const api = `commons/dashboardService/usersDashboard/private/update`;
        this.grid[this.dashboardType] = [...this.dashboard];
        // component is not destroyed but dashboard type is changed
        this.httpService.httpPost(api, cloneDeep(this.grid)).subscribe((grid: any) => {});
      }

      this.dashboardType = dashboardType;

      this.widgetService.getDashboard().subscribe((dashboard: any[]) => {
        if (
          dashboard &&
          dashboard.length > 0 &&
          this.widgetService.dashboardType === this.dashboardType
        ) {
          this.prepareDashboard(dashboard);
        }
        //  if (!this.gridDestroyed)
        else {
          this.widgetService.dashboardType = this.dashboardType;

          const api = `commons/dashboardService/usersDashboard/private/view`;
          this.httpService
            .httpPost(api, {
              dataMap: {
                filters: [
                  { name: 'loginId', value: this.userName },
                  { name: 'requestBy', value: 'BANK' },
                ],
              },
            })
            .subscribe((userWidgets: any) => {
              this.grid = userWidgets;

              const dashboardWidgets: any[] =
                userWidgets && userWidgets[this.dashboardType]
                  ? userWidgets[this.dashboardType]
                  : [];

              if (dashboardWidgets.length > 0) {
                this.widgetService.setDashboard(dashboardWidgets);
              } else {
                this.prepareDashboard([]);
              }
            });
        }
      });
    });

    this.widgetService.getGridType().subscribe((gridType: number) => {
      if (gridType === 0) {
        this.grid1();
      } else {
        this.gridx(gridType + 1);
      }
    });
  }

  onSelectSearchData(searchData: any) {
    this.widgetService.setSelectModalResponse(searchData);
    this.widgetService.setSelectModalData(null);
  }

  private prepareDashboard(dashboard: any) {
    dashboard.forEach((item: any) => {
      item.componentType = this.widgetService.getWidgetComponent(item.componentName);
      item.isBoxShadow = item.componentName != 'quickLinks';
    });

    this.mainDashboard = dashboard;

    this.dashboard = [...this.mainDashboard];
    this.loadingDashboard = false;
  }

  add(chart: string) {
    this.dashboard.push({
      cols: 12,
      rows: 6,
      y: 0,
      x: 0,
      title: chart.split('-').join(' '),
      componentName: chart,
      componentType: this.widgetService.getWidgetComponent(chart),
    });
  }

  reloadGrid() {
    if (this.options.api) {
      this.options.api.optionsChanged();
    }
  }

  resetGrid() {
    this.options = gridsterConfig;
    if (this.mainDashboard) {
      this.dashboard = [...this.mainDashboard];
    }

    if (this.options.api) {
      this.options.api.optionsChanged();
    }
  }

  changeDirection(direction: string) {
    this.options.dirType = direction === 'rtl' ? DirTypes.RTL : DirTypes.LTR;
    gridsterConfig.dirType = direction === 'rtl' ? DirTypes.RTL : DirTypes.LTR;
    if (this.options.api) {
      setTimeout(() => {
        this.options?.api?.optionsChanged();
      }, 10);
    }
  }

  grid1() {
    if (this.dashboard) {
      this.dashboard = [];
      this.dashboard = [...this.mainDashboard];

      let x = 0;
      let y = 0;
      this.maxGridCol = 24;
      this.options.maxCols = this.maxGridCol;
      this.options.maxItemCols = this.maxGridCol;
      this.options.maxItemRows = this.maxGridCol;
      this.options.minItemCols = 6;
      this.options.minItemRows = 6;
      this.dashboard = this.dashboard.map((item, i) => {
        item.cols = 24;
        item.rows = 12;

        item.minItemCols = 6;
        item.minItemRows = 6;

        if (i !== 0) {
          y += 12;
          x = 0;
        }
        item.x = x;
        item.y = y;

        return item;
      });

      this.options.api.optionsChanged();
    }
  }

  gridx(grid: number) {
    if (!this.dashboard) {
      return;
    }
    this.dashboard = [];

    this.dashboard = [...this.mainDashboard];

    let x = 0;
    let y = 0;

    const cols = 24 / grid;

    // this.maxGridCol = cols;
    // this.options.maxCols = this.maxGridCol;
    // this.options.maxItemCols = this.maxGridCol;
    // this.options.maxItemRows = this.maxGridCol;
    // this.options.minItemCols = 6;
    // this.options.minItemRows = 6;
    this.dashboard = this.dashboard.map((item, i) => {
      item.cols = cols;
      item.rows = cols;

      /* item.minItemCols = 6;
      item.minItemRows = 6; */

      if (i % grid === 0 && i !== 0) {
        x += cols;
        y = 0;
      }
      item.x = y;
      item.y = x;
      y += cols;

      return item;
    });

    if (this.options.api) {
      this.options.api.optionsChanged();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('dashboard', JSON.stringify(this.dashboard));
  }

  outputAction(e: any) {
    switch (e.type) {
      case ActionType.removeWidget:
        this.deleteWidget(e.i);
        break;
      case ActionType.fullScreen:
        this.fullScreenWidget(e.i);
        break;
      case ActionType.closeFullScreen:
        this.closeFullScreenWidget();
        break;
      case ActionType.openModal:
        this.openModalWidget(e.i);
        break;
      case ActionType.closeModal:
        this.closeModal();
        break;
      case ActionType.changeTitle:
        this.openChangeTitleModal(e.i);
        break;
    }
  }

  private fullScreenWidget(i: number) {
    this.options.maxCols = 16;

    this.options.draggable.enabled = false;
    this.options.resizable.enabled = false;

    this.mainDashboard = [...this.dashboard];
    this.dashboard = [{ ...this.mainDashboard[i] }];
    this.dashboard[0].cols = 16;
    this.dashboard[0].rows = 7;
    this.dashboard[0].minItemRows = 6;

    this.options.api.optionsChanged();
  }

  private closeFullScreenWidget() {
    this.dashboard = [...this.mainDashboard];

    this.options.maxCols = this.maxGridCol;

    this.options.draggable.enabled = true;

    this.options.resizable.enabled = true;

    this.options.api.optionsChanged();
  }

  private openModalWidget(i: number) {
    this.visibleWidgetComponent = {
      title: this.dashboard[i].title,
      component: this.dashboard[i].componentType,
      serviceUrl: this.dashboard[i].serviceUrl,
    };

    this.widgetService.setIsModal(true);
  }

  closeModal() {
    this.visibleWidgetComponent = null;
    this.widgetService.setIsModal(false);
  }

  private openChangeTitleModal(i: number) {
    this.title = this.dashboard[i].title;
    this.index = i;
    this.changeTitle = true;
  }

  saveChangeTitle() {
    this.dashboard[this.index].title = this.title;
    this.title = '';
    this.index = -1;
    this.changeTitle = false;
  }

  private deleteWidget(i: number) {
    this.dashboard[i].isShow = false;
    this.widgetService.setDashboard(this.dashboard);
  }

  ngOnDestroy() {
    if (this.grid && this.dashboardType && this.grid[this.dashboardType]) {
      const api = `commons/dashboardService/usersDashboard/private/update`;

      this.grid[this.dashboardType] = [...this.dashboard];

      this.httpService.httpPost(api, cloneDeep(this.grid)).subscribe((grid: any) => {
        // this.gridDestroyed = true;
        if (this.grid[this.dashboardType].length > 0) {
          this.widgetService.setDashboard(this.dashboard);
        } else {
          this.widgetService.setDashboard([]);
        }
      });
    }
  }
}
