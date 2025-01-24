import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSetting } from 'src/app/shared/@models/app-setting';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { Menu, Module } from '../@models/menus';
import { Widget } from '../@models/widget-details';
import { BreadcrumbService } from '../@services/breadcrumb.service';
import { DashboardService } from '../@services/dashboard.service';
import { MainComponent } from '../main.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public model: any[];

  activeMenu: string;
  selectedMenu: string;

  mobileMenus: { activeMenu: string; isSubMenus: boolean; menus: Widget[] | Menu[] } = null;

  menus: Module[];
  menuExpand: boolean = false;
  menuType: string;
  pinnedMenu: boolean;
  shortMenu: boolean = false;
  fullScreenMenu: boolean = false;
  fullScreenMenus: Menu[] = [];

  constructor(
    public app: DashboardService,
    public mainComponent: MainComponent,
    private httpService: HttpService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
    private appSettingService: AppSettingService,
  ) {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.menuType = appSetting.menuType;
      this.pinnedMenu = appSetting.pinnedMenu;

      if (!this.pinnedMenu) {
        this.activeMenu = '';

        if (this.menuType == 'sidebar') this.closeMenu();

        if (this.menuType === 'mobile') {
          this.mobileMenus = null;
        }
      } else {
        if (this.menuType == 'sidebar') this.openMenu();
      }
    });
  }

  ngOnInit() {
    this.httpService
      .httpPost('commons/menuService/private/getMenus')
      .subscribe((menus: Module[]) => {
        this.menus = menus;
        this.selectedMenu = menus[0].moduleName;
      });
  }

  openMobileMenu(activeMenu: string, isShortMenu: boolean, menus: Menu[] | Widget[]) {
    this.activeMenu = activeMenu;
    this.mobileMenus = { activeMenu, isSubMenus: !isShortMenu, menus };
  }

  closeOverlayMenu() {
    this.appSettingService.setPinnedMenu(false);
  }

  toggleMenuPin() {
    this.appSettingService.setPinnedMenu(!this.pinnedMenu);
  }

  closeMenus() {
    this.fullScreenMenu = false;
    this.shortMenu = false;
    this.activeMenu = null;
    this.mobileMenus = null;
    this.fullScreenMenus = [];

    this.mouseLeave();
  }

  toggleShortMenu(activeMenu: string) {
    this.fullScreenMenu = false;
    if (!this.shortMenu) {
      this.activeMenu = activeMenu;
      this.selectedMenu = activeMenu;
    } else {
      this.activeMenu = null;
    }
    this.shortMenu = !this.shortMenu;
  }

  openShortMenu(activeMenu: string) {
    this.fullScreenMenu = false;
    this.activeMenu = activeMenu;
    this.selectedMenu = activeMenu;
    this.shortMenu = true;
  }

  toggleFullscreen(activeMenu: string) {
    this.shortMenu = false;
    if (!this.fullScreenMenu) {
      this.activeMenu = activeMenu;
      this.selectedMenu = activeMenu;
    } else {
      this.activeMenu = null;
    }
    this.fullScreenMenu = !this.fullScreenMenu;
  }

  openFullscreen(activeMenu: string, menus: Menu[]) {
    this.shortMenu = false;
    this.activeMenu = activeMenu;
    this.selectedMenu = activeMenu;
    this.fullScreenMenus = menus;
    this.fullScreenMenu = true;
  }

  toggleMenu() {
    if (this.menuType !== 'slim') {
      this.menuExpand = !this.menuExpand;
    }
  }

  openMenu() {
    if (this.menuType !== 'slim') {
      this.menuExpand = true;
    }
  }

  closeMenu() {
    this.menuExpand = false;
  }

  mouseEnter() {
    if (
      this.pinnedMenu ||
      this.menuType === 'overlay' ||
      this.menuType === 'mobile' ||
      this.menuType === 'static'
    ) {
      return;
    }
    this.openMenu();
  }

  mouseLeave() {
    if (
      this.pinnedMenu ||
      this.menuType === 'overlay' ||
      this.menuType === 'mobile' ||
      this.menuType === 'static'
    ) {
      return;
    }
    this.closeMenu();
  }
}
