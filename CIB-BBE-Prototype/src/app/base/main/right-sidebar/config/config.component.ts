import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppSetting, ExtraSetting } from 'src/app/shared/@models/app-setting';
import { Select } from 'src/app/shared/@models/select.model';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  menuType: 'sidebar' | 'slim' | 'overlay' | 'mobile' | 'static' | 'horizontal';
  direction: 'ltr' | 'rtl';
  theme: string | number;
  style: 'style1' | 'style2' | 'style3' | 'style4';
  iconStyle: 'far' | 'fal' | 'fas' | 'fad';
  toasterData: any;

  menuTypes: Select[] = [];

  directionTypes: Select[] = [];

  themes: Select[] = [];

  styles: Select[] = [];

  toasterPositions: Select[] = [];

  toasterTimes: Select[] = [];

  iconStyles: Select[] = [];

  constructor(
    private httpService: HttpService,
    private toasterService: ToasterService,
    private appSettingService: AppSettingService,
  ) {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.menuType = appSetting.menuType;
      this.theme = appSetting.themeId;
      this.style = appSetting.formControlStyle;
      this.iconStyle = appSetting.iconStyle;
      this.toasterData = {
        position: appSetting.toasterPosition,
        life: appSetting.toasterTimeInMiliSec,
      };
    });
    this.appSettingService.getExtraSettingSubject().subscribe((extraSetting: ExtraSetting) => {
      this.direction = extraSetting.direction;
    });
    this.getConfigDropdownLists();
    this.getThemeList();
  }

  ngOnInit(): void {}

  getConfigDropdownLists(): void {
    const url = 'commons/configurationService/private/getConfigDropdownLists';
    this.httpService.httpPost(url).subscribe((response: any) => {
      this.menuTypes = response.menuTypes;
      this.themes = response.themes;
      this.styles = response.formControlStyles;
      this.toasterPositions = response.toasterPositions;
      this.toasterTimes = response.toasterTimes;
      this.iconStyles = response.iconStyles;
    });
  }

  getThemeList(): void {
    const url = 'setup/cibSetup/uiConfiguration/themeConfiguration/private/getThemeList';
    this.httpService.httpPost(url).subscribe((response: any) => {
      this.themes = response.themes;
    });
  }

  changeMenu(menuType: 'sidebar' | 'static' | 'slim' | 'overlay' | 'horizontal' | 'mobile') {
    this.appSettingService.setMenuType(menuType);
    this.closeSidebar();
  }

  changeDirection(direction: 'ltr' | 'rtl') {
    if (direction !== this.direction) {
      this.appSettingService.setDirection(direction);
      this.closeSidebar();
    }
  }

  changeTheme(theme: string | number) {
    this.appSettingService.setThemeId(theme);
    this.closeSidebar();
  }

  changeStyle(style: 'style1' | 'style2' | 'style3' | 'style4') {
    this.appSettingService.setFormControlStyle(style);
    this.closeSidebar();
  }

  changeIconStyle(style: 'far' | 'fal' | 'fas' | 'fad') {
    this.appSettingService.setIconStyle(style);
    this.closeSidebar();
  }

  closeSidebar() {
    this.close.emit();
  }

  changeToasterPosition() {
    this.appSettingService.setToasterPosition(this.toasterData.position);
    this.closeSidebar();
    this.showToasterSample();
  }

  changeToasterTime() {
    if (this.toasterData.life == 1) this.appSettingService.setToasterTimeInMiliSec(1);
    else this.appSettingService.setToasterTimeInMiliSec(this.toasterData.life);
  }

  showToasterSample() {
    setTimeout(() => {
      this.toasterService.showToaster({ severity: 'success', detail: 'Sample Success message' });
      /* this.toasterService.showToaster({severity: 'info', detail: 'Sample Info message', life:5000});
      this.toasterService.showToaster({severity: 'warn', detail: 'Sample Warning message', life:7000});
      this.toasterService.showToaster({severity: 'error', detail: 'Sample Error message', life:5000}); */
    }, 1000);
    setTimeout(() => {
      this.toasterService.showToaster({ severity: 'error', detail: 'Sample Error message' });
    }, 2500);
  }
}
