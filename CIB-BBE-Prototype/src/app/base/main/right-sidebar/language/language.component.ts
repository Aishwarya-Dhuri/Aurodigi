import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Language } from 'src/app/shared/@models/language';
import { HttpService } from 'src/app/shared/@services/http.service';
import { LanguageService } from 'src/app/shared/@services/language.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  language: Language;
  languages: Language[];

  constructor(private languageService: LanguageService) {}

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

  changeLanguage(value: any) {
    const index = this.languages.findIndex((language: Language) => language.id === value);
    const language = this.languages[index];
    this.languageService.setLanguage(language);
  }

  closeSidebar() {
    this.close.emit();
  }
}
