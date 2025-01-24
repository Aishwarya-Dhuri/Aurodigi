import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppSetting } from 'src/app/shared/@models/app-setting';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { AccessibilityConfig, DYSLEXIA_FONT_FAMILY_LIST } from '../../@models/accessibility.model';

@Component({
  selector: 'app-accessibility-modal',
  templateUrl: './accessibility-modal.component.html',
  styleUrls: ['./accessibility-modal.component.scss'],
})
export class AccessibilityModalComponent implements OnInit {
  @Output() isHideInterface = new EventEmitter<boolean>();
  @Output() isBigWhiteCursor = new EventEmitter<boolean>();
  @Output() isBigBlackCursor = new EventEmitter<boolean>();
  @Output() isReadingGuide = new EventEmitter<boolean>();
  @Output() isCancel = new EventEmitter<boolean>();

  contentScalingPercantage: string;
  accessibilityConfig: AccessibilityConfig = new AccessibilityConfig();
  defaultFontSize: number;
  viewport: string;

  constructor(
    private appSettingService: AppSettingService,
    private viewportService: ViewportService,
  ) {
    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });
    if (JSON.parse(localStorage.getItem('accessibility'))) {
      this.accessibilityConfig = JSON.parse(localStorage.getItem('accessibility'));
    } else {
      this.accessibilityConfig = new AccessibilityConfig();
    }
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.defaultFontSize = appSetting.fontSize;
    });
  }

  ngOnInit(): void {
    this.contentScalingPercantage = getComputedStyle(document.body).getPropertyValue(
      '--content-scaling-percentage',
    );
  }

  cancel(): void {
    this.isCancel.emit(true);
  }

  addClassToBody(className: string): void {
    const body: any = document.getElementsByTagName('body')[0];
    body.classList.add(className);
  }
  removeClassToBody(className: string): void {
    const body: any = document.getElementsByTagName('body')[0];
    body.classList.remove(className);
  }

  resetSetting(): void {
    this.accessibilityConfig = new AccessibilityConfig();
    if (!this.accessibilityConfig.isSeizerSafeProfile) {
      this.removeClassToBody('monochrome');
    }
    if (!this.accessibilityConfig.isVisionImpairedProfile) {
      document.documentElement.style.setProperty('--font-size', this.defaultFontSize + 'px');
      this.removeClassToBody('high-saturation');
    }
    if (!this.accessibilityConfig.isCognitiveDisabilityProfile) {
      this.removeClassToBody('hightlight-titles');
    }

    this.changeContentScaling(0);

    if (!this.accessibilityConfig.isReadableFont) {
      this.removeClassToBody('text-bold');
    }
    if (!this.accessibilityConfig.isHightlightTitles) {
      this.removeClassToBody('hightlight-titles');
    }
    if (!this.accessibilityConfig.isHightlightLinks) {
      this.removeClassToBody('highlight-links');
    }
    this.changeDyslexiaFriendly(0);
    this.changeAdjustFontSizeBy(0);

    if (!this.accessibilityConfig.isAlignCenter) {
      this.removeClassToBody('text-center');
    }
    this.changeLineHeight(0);
    if (!this.accessibilityConfig.isAlignLeft) {
      this.removeClassToBody('text-left');
    }
    this.changeLetterSpacing(0);
    if (!this.accessibilityConfig.isAlignRight) {
      this.removeClassToBody('text-right');
    }
    if (!this.accessibilityConfig.isDarkContrast) {
      this.appSettingService.setIsDarkTheme(!this.accessibilityConfig.isDarkContrast);
    }
    if (!this.accessibilityConfig.isLightContrast) {
      this.removeClassToBody('light-contrast');
    }
    if (!this.accessibilityConfig.isMonochrome) {
      this.removeClassToBody('monochrome');
    }
    if (!this.accessibilityConfig.isHighSaturation) {
      this.removeClassToBody('high-saturation');
    }
    if (!this.accessibilityConfig.textColor) {
      this.toggleAdjustTextColor('');
    }
    if (!this.accessibilityConfig.isHighContrast) {
      this.removeClassToBody('high-contrast');
    }

    this.toggleAdjustTitleColor('');

    if (!this.accessibilityConfig.isHideImage) {
      this.removeClassToBody('hide-img');
    }
    this.isReadingGuide.emit(false);
    this.isBigBlackCursor.emit(false);
    this.isBigWhiteCursor.emit(false);
  }

  hideInteface(): void {
    this.isHideInterface.emit(true);
  }

  toggleSeizerSafeProfile(): void {
    if (this.accessibilityConfig.isSeizerSafeProfile) {
      this.addClassToBody('monochrome');
    } else {
      this.removeClassToBody('monochrome');
    }
  }

  toggleVisionImpairedProfile(): void {
    if (this.accessibilityConfig.isVisionImpairedProfile) {
      document.documentElement.style.setProperty('--font-size', '18px');
      this.addClassToBody('high-saturation');
    } else {
      document.documentElement.style.setProperty('--font-size', this.defaultFontSize + 'px');
      this.removeClassToBody('high-saturation');
    }
  }

  toggleCognitiveDisabilityProfile(): void {
    if (this.accessibilityConfig.isCognitiveDisabilityProfile) {
      document.documentElement.style.setProperty('--font-size', '18px');
      this.addClassToBody('hightlight-titles');
    } else {
      this.removeClassToBody('hightlight-titles');
    }
  }

  toggleADHDFriendlyProfile(): void {}

  changeContentScaling(value: number): void {
    if (value > 15 || value < -15) {
      return;
    }
    this.accessibilityConfig.contentScalingBy = value;
    document.documentElement.style.setProperty(
      '--content-scaling-percentage',
      this.accessibilityConfig.contentScalingBy + 100 + '%',
    );
  }

  toggleReadableFont(): void {
    this.accessibilityConfig.isReadableFont = !this.accessibilityConfig.isReadableFont;
    if (this.accessibilityConfig.isReadableFont) {
      this.addClassToBody('text-bold');
    } else {
      this.removeClassToBody('text-bold');
    }
  }

  changeHighlightTitles(): void {
    this.accessibilityConfig.isHightlightTitles = !this.accessibilityConfig.isHightlightTitles;
    if (this.accessibilityConfig.isHightlightTitles) {
      this.addClassToBody('hightlight-titles');
    } else {
      this.removeClassToBody('hightlight-titles');
    }
  }

  changeHighlightLinks(): void {
    this.accessibilityConfig.isHightlightLinks = !this.accessibilityConfig.isHightlightLinks;
    if (this.accessibilityConfig.isHightlightLinks) {
      this.addClassToBody('highlight-links');
    } else {
      this.removeClassToBody('highlight-links');
    }
  }

  toggleDyxlexiaFriendly(): void {
    if (this.accessibilityConfig.isDyslexiaFriendly) {
      this.changeDyslexiaFriendly(1);
      this.changeAdjustFontSizeBy(2);
      this.changeLetterSpacing(0.5);
      this.changeLineHeight(1.5);
    } else {
      this.changeAdjustFontSizeBy(0);
      this.changeLetterSpacing(0);
      this.changeLineHeight(0);
      this.changeDyslexiaFriendly(0);
      this.removeClassToBody('font-arial');
      this.removeClassToBody('font-calibri');
      this.removeClassToBody('font-verdana');
      this.accessibilityConfig.dyslexiaFriendly = 0;
    }
  }

  changeDyslexiaFriendly(value: number): void {
    if (value > 0 && value <= 3) {
      this.accessibilityConfig.dyslexiaFriendly = value;
      document.body.style.setProperty('font-family', DYSLEXIA_FONT_FAMILY_LIST[value - 1]);
      if (value == 1) {
        this.addClassToBody('font-arial');
      } else if (value == 2) {
        this.addClassToBody('font-calibri');
      } else if (value == 3) {
        this.addClassToBody('font-verdana');
      }
    }
  }

  changeAdjustFontSizeBy(value: number): void {
    if (value > 3 || value < -3) {
      return;
    }
    this.accessibilityConfig.adjustFontSizeBy = value;
    document.documentElement.style.setProperty(
      '--font-size',
      this.accessibilityConfig.adjustFontSizeBy + this.defaultFontSize + 'px',
    );
  }

  toggleAlignCenter(): void {
    this.accessibilityConfig.isAlignCenter = !this.accessibilityConfig.isAlignCenter;
    if (this.accessibilityConfig.isAlignCenter) {
      this.addClassToBody('text-center');
    } else {
      this.removeClassToBody('text-center');
    }
  }

  changeLineHeight(value: number): void {
    if (value > 0.5 || value < -0.5) {
      return;
    }
    this.accessibilityConfig.lineHeightBy = value;
    document.documentElement.style.setProperty(
      '--line-height',
      (this.accessibilityConfig.lineHeightBy + 1.5).toString(),
    );
  }

  toggleAlignLeft(): void {
    this.accessibilityConfig.isAlignLeft = !this.accessibilityConfig.isAlignLeft;
    if (this.accessibilityConfig.isAlignLeft) {
      this.addClassToBody('text-left');
    } else {
      this.removeClassToBody('text-left');
    }
  }

  changeLetterSpacing(value: number): void {
    if (value > 1 || value < -1) {
      return;
    }
    this.accessibilityConfig.letterSpacingBy = value;
    document.documentElement.style.setProperty(
      '--letter-spacing',
      this.accessibilityConfig.letterSpacingBy.toString() + 'px',
    );
  }

  toggleAlignRight(): void {
    this.accessibilityConfig.isAlignRight = !this.accessibilityConfig.isAlignRight;
    if (this.accessibilityConfig.isAlignRight) {
      this.addClassToBody('text-right');
    } else {
      this.removeClassToBody('text-right');
    }
  }

  toggleDarkContrast(): void {
    this.accessibilityConfig.isDarkContrast = !this.accessibilityConfig.isDarkContrast;
    if (this.accessibilityConfig.isDarkContrast) {
      this.appSettingService.setIsDarkTheme(!this.accessibilityConfig.isDarkContrast);
    } else {
      this.appSettingService.setIsDarkTheme(!this.accessibilityConfig.isDarkContrast);
    }
  }

  toggleLightContrast(): void {
    this.accessibilityConfig.isLightContrast = !this.accessibilityConfig.isLightContrast;
    if (this.accessibilityConfig.isLightContrast) {
      this.addClassToBody('light-contrast');
    } else {
      this.removeClassToBody('light-contrast');
    }
  }

  toggleMonochrome() {
    this.accessibilityConfig.isMonochrome = !this.accessibilityConfig.isMonochrome;
    if (this.accessibilityConfig.isMonochrome) {
      this.addClassToBody('monochrome');
    } else {
      this.removeClassToBody('monochrome');
    }
  }

  toggleHighSaturation(): void {
    this.accessibilityConfig.isHighSaturation = !this.accessibilityConfig.isHighSaturation;
    if (this.accessibilityConfig.isHighSaturation) {
      this.addClassToBody('high-saturation');
    } else {
      this.removeClassToBody('high-saturation');
    }
  }

  toggleAdjustTextColor(colorCode: string): void {
    this.accessibilityConfig.textColor = colorCode;
    document.documentElement.style.setProperty(
      '--text-color',
      this.accessibilityConfig.textColor ? this.accessibilityConfig.textColor : '',
    );
    // document.documentElement.style.setProperty('--inverted-text-color', this.accessibilityConfig.textColor ? this.accessibilityConfig.textColor : '#666666');
    document.documentElement.style.setProperty(
      '--text-color-light-shade-1',
      this.accessibilityConfig.textColor ? this.accessibilityConfig.textColor : '',
    );
    document.documentElement.style.setProperty(
      '--text-color-light-shade-2',
      this.accessibilityConfig.textColor ? this.accessibilityConfig.textColor : '',
    );
    document.documentElement.style.setProperty(
      '--text-color-light-shade-3',
      this.accessibilityConfig.textColor ? this.accessibilityConfig.textColor : '',
    );
    document.documentElement.style.setProperty(
      '--text-color-dark-shade-1',
      this.accessibilityConfig.textColor ? this.accessibilityConfig.textColor : '',
    );
    document.documentElement.style.setProperty(
      '--text-color-dark-shade-2',
      this.accessibilityConfig.textColor ? this.accessibilityConfig.textColor : '',
    );
    document.documentElement.style.setProperty(
      '--text-color-dark-shade-3',
      this.accessibilityConfig.textColor ? this.accessibilityConfig.textColor : '',
    );
  }

  toggleHighContrast(): void {
    this.accessibilityConfig.isHighContrast = !this.accessibilityConfig.isHighContrast;
    if (this.accessibilityConfig.isHighContrast) {
      this.addClassToBody('high-contrast');
    } else {
      this.removeClassToBody('high-contrast');
    }
  }

  toggleAdjustTitleColor(colorCode: string): void {
    document.body.style.setProperty('--adjust-title-color', colorCode);
    if (colorCode) {
      this.addClassToBody('title-color');
    } else {
      this.removeClassToBody('title-color');
    }
    this.accessibilityConfig.titleColor = colorCode;
  }

  toggleHideImage(): void {
    this.accessibilityConfig.isHideImage = !this.accessibilityConfig.isHideImage;
    if (this.accessibilityConfig.isHideImage) {
      this.addClassToBody('hide-img');
    } else {
      this.removeClassToBody('hide-img');
    }
  }

  toggleReadingGuide(): void {
    this.accessibilityConfig.isReadingGuide = !this.accessibilityConfig.isReadingGuide;
    this.isReadingGuide.emit(this.accessibilityConfig.isReadingGuide);
  }

  toggleReadingMask(): void {}

  toggleBigBlackCursor(): void {
    this.accessibilityConfig.isBigBlackCursor = !this.accessibilityConfig.isBigBlackCursor;
    this.isBigBlackCursor.emit(this.accessibilityConfig.isBigBlackCursor);
  }
  toggleBigWhiteCursor(): void {
    this.accessibilityConfig.isBigWhiteCursor = !this.accessibilityConfig.isBigWhiteCursor;
    this.isBigWhiteCursor.emit(this.accessibilityConfig.isBigWhiteCursor);
  }

  ngOnDestroy(): void {
    localStorage.setItem('accessibility', JSON.stringify(this.accessibilityConfig));
  }
}
