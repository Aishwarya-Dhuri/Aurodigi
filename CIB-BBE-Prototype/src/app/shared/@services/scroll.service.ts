import { ElementRef, Injectable } from '@angular/core';
import { AppSetting } from '../@models/app-setting';
import { AppSettingService } from './app-setting.service';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  direction: string;

  constructor(private appSettingService: AppSettingService) {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.direction = appSetting.direction;
    });
  }

  scrollLeft(element: ElementRef<any>, scrollThreshold: number) {
    if (this.direction === 'rtl') {
      scrollThreshold = scrollThreshold * -1;
    }
    element.nativeElement.scrollTo({
      left: element.nativeElement.scrollLeft + scrollThreshold,
      behavior: 'smooth',
    });
  }

  scrollRight(element: ElementRef<any>, scrollThreshold: number) {
    if (this.direction === 'rtl') {
      scrollThreshold = scrollThreshold * -1;
    }
    element.nativeElement.scrollTo({
      left: element.nativeElement.scrollLeft - scrollThreshold,
      behavior: 'smooth',
    });
  }
}
