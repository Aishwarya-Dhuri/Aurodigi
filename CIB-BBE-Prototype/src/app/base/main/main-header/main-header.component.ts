import { Component, OnInit } from '@angular/core';
import { AppSetting } from 'src/app/shared/@models/app-setting';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { UserDetails } from '../../@models/user.details';
import { MainComponent } from '../main.component';
import { SidebarComponents } from '../right-sidebar/@enums/sidebar-components';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {
  userInfo: boolean = false;
  moreOptions: boolean = false;
  helpOptions: boolean = false;
  sidebarComponents = SidebarComponents;
  menuPinned: boolean;
  isDarkTheme: boolean;
  userDetails: any;

  headerAssetsUrl: string = '';
  bankLogoUrl: string = '';
  productLogoUrl: string = '';

  constructor(
    public mainComponent: MainComponent,
    private httpService: HttpService,
    private userService: UserService,
    private appSettingService: AppSettingService,
  ) {
    this.headerAssetsUrl = this.httpService.getAssetUrl('assets/header-images/');
    this.productLogoUrl = this.headerAssetsUrl + 'product-logo.png';
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      if (
        appSetting.bankLogoFileName &&
        this.bankLogoUrl != this.headerAssetsUrl + appSetting.bankLogoFileName
      ) {
        this.bankLogoUrl = this.headerAssetsUrl + appSetting.bankLogoFileName;
      }
      if (this.menuPinned != appSetting.pinnedMenu) {
        this.menuPinned = appSetting.pinnedMenu;
      }
      if (this.isDarkTheme != appSetting.isDarkTheme) {
        this.isDarkTheme = appSetting.isDarkTheme;
      }
    });
    this.userService.getUserDetails().subscribe((userDetails: UserDetails) => {
      this.userDetails = userDetails;
    });
  }

  ngOnInit(): void {}

  togglePinnedMenu() {
    this.appSettingService.setPinnedMenu(!this.menuPinned);
  }

  openSidebar(component: string) {
    this.mainComponent.openSidebar(component);
  }

  changeThemeDarkMode(): void {
    this.appSettingService.setIsDarkTheme(!this.isDarkTheme);
  }
}
