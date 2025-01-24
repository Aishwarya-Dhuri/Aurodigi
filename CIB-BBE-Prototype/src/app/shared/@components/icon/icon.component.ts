import { Component, Input, OnInit } from '@angular/core';
import { AppSetting, ExtraSetting } from '../../@models/app-setting';
import { AppSettingService } from '../../@services/app-setting.service';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input('iconStyle') iconStyle?: string = 'fal';
  direction: string;
  @Input('icon') icon: string = '';
  @Input('rtlIcon') rtlIcon: string = '';
  @Input('styleClasses') styleClasses?: string = '';

  // @Output() click = new EventEmitter<void>();

  constructor(private appSettingService: AppSettingService) {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.iconStyle = appSetting.iconStyle;
    });
    this.appSettingService.getExtraSettingSubject().subscribe((extraSetting: ExtraSetting) => {
      this.direction = extraSetting.direction;
    });
  }

  ngOnInit(): void {
    // if (!this.iconStyle) {
    // }
  }
}
