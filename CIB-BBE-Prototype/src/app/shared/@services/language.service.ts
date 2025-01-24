import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from '../@models/language';
import { AppSettingService } from './app-setting.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private language = new BehaviorSubject<Language>(null);
  private languages = new BehaviorSubject<Language[]>([]);

  constructor(
    private translateService: TranslateService,
    private appSettingService: AppSettingService,
    private httpService: HttpService,
  ) {}

  setLanguages(languages: Language[]) {
    this.languages.next(languages);
  }

  getLocalLanguages() {
    return this.languages;
  }

  getLanguages() {
    this.httpService.httpPost('languages').subscribe((languages: Language[]) => {
      this.setLanguages(languages);
    });
  }

  setLanguage(language: Language) {
    this.language.next(language);
    this.translateService.use(language.id);
    this.appSettingService.setDirection(language.direction);
  }

  getLanguage() {
    return this.language;
  }
}
