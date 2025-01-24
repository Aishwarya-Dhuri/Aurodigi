import { Component, OnInit } from '@angular/core';
import {
  BroadcastMessage,
  OfflineBroadcastMessage_Request,
  OfflineBroadcastMessage_Response,
} from 'src/app/base/@models/offline-broadcast-message';
import { LinkDetail } from 'src/app/base/@models/screen-content';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss'],
})
export class InfoPanelComponent implements OnInit {
  broadcastMessages: BroadcastMessage[] = [];
  broadcastMessageIndex: number;
  broadcastMessage: BroadcastMessage;

  screenDetails: any;
  bannerImageUrl: string;

  footerData: {
    socialMedias: { icon: string; link: string }[];
    copyRight: string;
    links: LinkDetail[];
  };

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    const requestData: OfflineBroadcastMessage_Request = {
      versionDetails: { version: '1' },
      clientDetails: { source: 'WEB' },
    };
    this.httpService.httpPost('broadcastMessages', requestData).subscribe(
      (broadcastMessageResponse: OfflineBroadcastMessage_Response) => {
        this.broadcastMessages = broadcastMessageResponse.dataMap.broadcastMessages;

        let i = 0;
        this.broadcastMessageIndex = i;
        this.broadcastMessage = this.broadcastMessages[i];

        const broadcastMessagesMaxIndex = this.broadcastMessages.length - 1;
        setInterval(() => {
          i++;
          this.changeMessage(i);

          if (i === broadcastMessagesMaxIndex) {
            i = -1;
          }
        }, 5000);
      },
      (error: any) => {},
    );

    this.httpService.httpPost('screenDetails').subscribe((screenDetails: any) => {
      this.screenDetails = screenDetails;

      let i = 0;
      const bgImagesMaxIndex = screenDetails.backgroundImages.length - 1;

      this.setBackgroundImage(i);

      setInterval(() => {
        i++;
        this.setBackgroundImage(i);
        if (i === bgImagesMaxIndex) {
          i = -1;
        }
      }, 5000);
    });

    this.httpService.httpPost('footer').subscribe((footerData: any) => {
      this.footerData = footerData;
    });
  }

  changeMessage(i: number) {
    this.broadcastMessage = this.broadcastMessages[i];
    this.broadcastMessageIndex = i;
  }

  setBackgroundImage(i: number) {
    this.bannerImageUrl = this.httpService.getAssetUrl(
      'assets/images/login-background/' + this.screenDetails.backgroundImages[i].link,
    );
  }
}
