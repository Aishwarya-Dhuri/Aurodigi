import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSetting } from 'src/app/shared/@models/app-setting';
import { Language } from 'src/app/shared/@models/language';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { LanguageService } from 'src/app/shared/@services/language.service';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-pre-login-header',
  templateUrl: './pre-login-header.component.html',
  styleUrls: ['./pre-login-header.component.scss'],
})
export class PreLoginHeaderComponent implements OnInit {
  language: Language;
  languages: Language[];

  headerAssetsUrl: string = '';
  bankLogoUrl: string = '';
  productLogoUrl: string = '';

  constructor(
    private languageService: LanguageService,
    private appSettingService: AppSettingService,
    private httpService: HttpService,
    private userService: UserService,
    private router: Router,
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
    });
  }

  ngOnInit(): void {
    this.languageService.getLanguage().subscribe((language: Language) => {
      this.language = language;
    });

    this.languageService.getLocalLanguages().subscribe((languages: Language[]) => {
      if (languages.length === 0) {
        this.languageService.getLanguages();
        return;
      }

      this.languages = languages;
      if (!this.language) {
        this.languageService.setLanguage(languages[0]);
      }
    });
  }

  changeLanguage(event: any) {
    const index = this.languages.findIndex(
      (language: Language) => language.id === event.target.value,
    );
    const language = this.languages[index];
    this.languageService.setLanguage(language);
  }

  proceedLogin(id: number): void {
    const requestData: any = {
      clientDetails: { source: 'WEB' },
      userName: id == 1 ? 'adminmaker' : id == 2 ? 'adminchecker' : 'rmmaker',
      password: 'admin#123',
      versionDetails: { version: 1 },
    };

    this.httpService.httpPost('login/public/basicAuthentication', requestData).subscribe(
      (basicAuthenticationResponse: any) => {
        if (basicAuthenticationResponse.responseStatus.status === '0') {
          // this.loginService.securityId = basicAuthenticationResponse.securityId;
          sessionStorage.setItem('securityId', basicAuthenticationResponse.securityId);
          this.userService.setUserDetails(basicAuthenticationResponse.userDetails);
          this.userService.setApplicationDate(
            basicAuthenticationResponse.userDetails.applicationDate,
          );
          this.userService.setUserName(basicAuthenticationResponse.userDetails.userName);
          this.userService.setDashboardRouteUrl(
            'dashboard/' + basicAuthenticationResponse.userDetails.landingPage,
          );
          this.router.navigateByUrl(
            'dashboard/' + basicAuthenticationResponse.userDetails.landingPage,
          );
        } else if (basicAuthenticationResponse.responseStatus.status === '1') {
        }
      },
      (error: any) => {},
    );
  }
}
