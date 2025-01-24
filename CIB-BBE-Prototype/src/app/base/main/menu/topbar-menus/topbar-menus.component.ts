import { MainComponent } from '../../main.component';
import { DashboardService } from '../../@services/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { Menu, Module } from '../../@models/menus';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-topbar-menus',
  templateUrl: './topbar-menus.component.html',
  styleUrls: ['./topbar-menus.component.scss'],
})
export class TopbarMenusComponent implements OnInit {
  shortMenu: boolean = false;
  fullScreenMenu: boolean = false;
  activeMenu: string;
  menus: Module[];
  fullScreenMenus: Menu[] = [];

  constructor(
    public app: DashboardService,
    public mainComponent: MainComponent,
    private httpService: HttpService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.httpService
      .httpPost('commons/menuService/private/getMenus')
      .subscribe((menus: Module[]) => {
        this.menus = menus;
      });
  }

  closeMenus() {
    this.fullScreenMenu = false;
    this.shortMenu = false;
    this.activeMenu = null;
    this.fullScreenMenus = [];
  }

  toggleShortMenu(activeMenu: string) {
    this.fullScreenMenu = false;
    if (!this.shortMenu) {
      this.activeMenu = activeMenu;
    } else {
      this.activeMenu = null;
    }
    this.shortMenu = !this.shortMenu;
  }

  openShortMenu(activeMenu: string) {
    this.fullScreenMenu = false;
    this.activeMenu = activeMenu;
    this.shortMenu = true;
  }

  toggleFullscreen(activeMenu: string) {
    this.shortMenu = false;
    if (!this.fullScreenMenu) {
      this.activeMenu = activeMenu;
    } else {
      this.activeMenu = null;
    }
    this.fullScreenMenu = !this.fullScreenMenu;
  }

  openFullscreen(activeMenu: string, menus: Menu[]) {
    this.shortMenu = false;
    this.activeMenu = activeMenu;
    this.fullScreenMenus = menus;

    this.fullScreenMenu = true;
  }
}
