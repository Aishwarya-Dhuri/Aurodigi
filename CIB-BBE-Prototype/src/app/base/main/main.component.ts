import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppSetting, ExtraSetting } from 'src/app/shared/@models/app-setting';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { DashboardService } from './@services/dashboard.service';
import { SidebarService } from './@services/sidebar.service';
import { WidgetService } from './@services/widget.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [MessageService],
})
export class MainComponent implements OnInit, OnDestroy {
  private dashboardRouteUrl: string;
  isSidebarOpen: boolean = false;
  lastActivities = false;
  menuType: string;
  pinnedMenu: boolean;
  fullScreenWidget: boolean;
  previousMenuType: string;
  isFullScreen: boolean = false;

  constructor(
    public dashboardService: DashboardService,
    public viewportService: ViewportService,
    private widgetService: WidgetService,
    private sidebarService: SidebarService,
    private router: Router,
    private userService: UserService,
    private appSettingService: AppSettingService,
  ) {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.menuType = appSetting.menuType;
      this.pinnedMenu = appSetting.pinnedMenu;
    });
    this.appSettingService.getExtraSettingSubject().subscribe((extraSetting: ExtraSetting) => {
      this.isFullScreen = extraSetting.isFullScreen;
    });
    this.userService.getDashboardRouteUrl().subscribe((dashboardRouteUrl: string) => {
      this.dashboardRouteUrl = dashboardRouteUrl;
    });
  }

  ngOnInit() {
    /* same url reload */
    /* this.router.onSameUrlNavigation = 'reload';
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; */
    /* blank url to default dashboard */
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url == '' || this.router.url == '/') {
          this.router.navigateByUrl(this.dashboardRouteUrl);
        }
      }
    });

    if (window.innerWidth <= 991) {
      if (this.menuType !== 'mobile') {
        this.previousMenuType = this.menuType;

        this.viewportService.setViewport('mobile');

        this.appSettingService.setMenuType('mobile');
      }
    } else {
      const newMenuType: any =
        this.previousMenuType && this.previousMenuType !== 'mobile'
          ? this.previousMenuType
          : 'overlay';
      if (this.menuType !== newMenuType) {
        this.viewportService.setViewport('web');

        this.appSettingService.setMenuType(newMenuType);
      }
    }

    window.addEventListener('resize', (event: any) => {
      if (event.target.innerWidth <= 991) {
        if (this.menuType !== 'mobile') {
          this.previousMenuType = this.menuType;

          this.viewportService.setViewport('mobile');

          this.appSettingService.setMenuType('mobile');
        }
      } else {
        const newMenuType: any =
          this.previousMenuType && this.previousMenuType !== 'mobile'
            ? this.previousMenuType
            : 'overlay';

        if (this.menuType !== newMenuType) {
          this.viewportService.setViewport('web');

          this.appSettingService.setMenuType(newMenuType);
        }
      }
    });

    this.dashboardService.getlastActivities().subscribe((lastActivities) => {
      this.lastActivities = lastActivities;
    });

    this.widgetService.getIsFullScreen().subscribe((isFullscreen: boolean) => {
      this.fullScreenWidget = isFullscreen;
    });
  }

  openSidebar(component: string) {
    if (!component) {
      return;
    }
    this.sidebarService.setComponent(component);
    this.isSidebarOpen = true;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
    this.sidebarService.setComponent(null);
  }

  ngOnDestroy(): void {}
}
