import { Component, Input, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { AppSetting } from '../../@models/app-setting';
import { AppSettingService } from '../../@services/app-setting.service';
import { ToasterService } from '../../@services/toaster.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
})
export class ToasterComponent implements OnInit {
  @Input('key') key?: string = 'main';
  @Input('position') position?: string;

  constructor(
    private toasterService: ToasterService,
    private messageService: MessageService,
    private appSettingService: AppSettingService,
  ) {}

  ngOnInit(): void {
    if (!this.position) {
      this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
        this.position = appSetting.toasterPosition;
      });
    }

    this.toasterService.getToasterMessage().subscribe((message: Message) => {
      if (!message.key) message.key = 'main';
      if (!message.life) message.life = this.appSettingService.getToasterTimeInMiliSec();
      if (message.life == 1) {
        delete message.life;
        message.sticky = true;
      }
      if (!message.severity) message.severity = 'info';

      this.messageService.add(message);
    });
  }
}
