import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppSetting, ExtraSetting } from '../@models/app-setting';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AppSettingService {
  private appSetting: AppSetting = new AppSetting();
  private extraSetting: ExtraSetting = new ExtraSetting();
  private appSettingSubject = new BehaviorSubject<AppSetting>(this.appSetting);
  private extraSettingSubject = new BehaviorSubject<ExtraSetting>(this.extraSetting);
  private isForceApplySetting = new BehaviorSubject<boolean>(false);

  constructor(private httpService: HttpService) {
    this.getAppConfigurations();
  }

  getForceApplySetting(): BehaviorSubject<boolean> {
    return this.isForceApplySetting;
  }

  setForceApplySetting(isForceApplySetting: boolean): void {
    this.isForceApplySetting.next(isForceApplySetting);
  }

  getAppConfigurations(): void {
    const url = 'commons/configurationService/private/view';
    let data: any = { dataMap: { id: '2' } };
    this.httpService.httpPost(url, data).subscribe((response: any) => {
      delete response.responseStatus;
      this.setForceApplySetting(true);
      this.setAppSetting({ ...response });
      setTimeout(() => {
        this.setForceApplySetting(false);
      }, 100);
    });
  }

  setAppSetting(setting: AppSetting) {
    this.appSetting = setting;
    this.appSettingSubject.next(this.appSetting);
  }

  getAppSetting() {
    return this.appSettingSubject;
  }

  setBankLogoFileName(bankLogoFileName: string): void {
    this.appSetting.bankLogoFileName = bankLogoFileName;
    this.appSettingSubject.next(this.appSetting);
  }

  setMenuType(menuType: 'sidebar' | 'static' | 'slim' | 'overlay' | 'horizontal' | 'mobile'): void {
    this.appSetting.menuType = menuType;
    this.appSettingSubject.next(this.appSetting);
  }

  setPinnedMenu(pinnedMenu: boolean) {
    this.appSetting.pinnedMenu = pinnedMenu;
    this.appSettingSubject.next(this.appSetting);
  }

  setThemeId(themeId: string | number) {
    this.appSetting.themeId = themeId;
    this.appSettingSubject.next(this.appSetting);
  }

  setIsDarkTheme(isDarkTheme: boolean) {
    this.appSetting.isDarkTheme = isDarkTheme;
    this.appSettingSubject.next(this.appSetting);
  }

  setFormControlStyle(style: 'style1' | 'style2' | 'style3' | 'style4') {
    this.appSetting.formControlStyle = style;
    this.appSettingSubject.next(this.appSetting);
  }

  setIconStyle(iconStyle: 'far' | 'fal' | 'fas' | 'fad') {
    this.appSetting.iconStyle = iconStyle;
    this.appSettingSubject.next(this.appSetting);
  }

  setButtonBorderRadius(buttonBorderRadius: string) {
    this.appSetting.buttonBorderRadius = buttonBorderRadius;
    this.appSettingSubject.next(this.appSetting);
  }

  setIs3dButton(is3dButton: boolean) {
    this.appSetting.is3dButton = is3dButton;
    this.appSettingSubject.next(this.appSetting);
  }

  setFormCardBorderRadius(formCardBorderRadius: string) {
    this.appSetting.formCardBorderRadius = formCardBorderRadius;
    this.appSettingSubject.next(this.appSetting);
  }

  setFontId(fontId: string | number) {
    this.appSetting.fontId = fontId;
    this.appSettingSubject.next(this.appSetting);
  }

  setFontSize(fontSize: number) {
    this.appSetting.fontSize = fontSize;
    this.appSettingSubject.next(this.appSetting);
  }

  setToasterPosition(
    toasterPosition:
      | 'top-center'
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-left'
      | 'bottom-center'
      | 'center',
  ): void {
    this.appSetting.toasterPosition = toasterPosition;
    this.appSettingSubject.next(this.appSetting);
  }

  setToasterTimeInMiliSec(
    toasterTimeInMiliSec:
      | 1
      | 3000
      | 5000
      | 7000
      | 10000
      | 15000
      | 20000
      | 25000
      | 30000
      | 45000
      | 60000,
  ): void {
    this.appSetting.toasterTimeInMiliSec = toasterTimeInMiliSec;
    this.appSettingSubject.next(this.appSetting);
  }

  getToasterTimeInMiliSec(): number {
    return this.appSetting.toasterTimeInMiliSec;
  }

  getThemeColors() {
    return [
      getComputedStyle(document.body).getPropertyValue('--chart-0'),
      getComputedStyle(document.body).getPropertyValue('--chart-1'),
      getComputedStyle(document.body).getPropertyValue('--chart-2'),
      getComputedStyle(document.body).getPropertyValue('--chart-3'),
      getComputedStyle(document.body).getPropertyValue('--chart-4'),
      getComputedStyle(document.body).getPropertyValue('--chart-5'),
      getComputedStyle(document.body).getPropertyValue('--chart-6'),
      getComputedStyle(document.body).getPropertyValue('--chart-7'),
      getComputedStyle(document.body).getPropertyValue('--chart-8'),
      getComputedStyle(document.body).getPropertyValue('--chart-9'),
    ];
  }

  getExtraSettingSubject() {
    return this.extraSettingSubject;
  }

  setIsFullScreen(isFullScreen: boolean) {
    this.extraSetting.isFullScreen = isFullScreen;
    this.extraSettingSubject.next(this.extraSetting);
  }

  setDirection(direction: 'ltr' | 'rtl') {
    this.extraSetting.direction = direction;
    this.extraSettingSubject.next(this.extraSetting);
  }
}
