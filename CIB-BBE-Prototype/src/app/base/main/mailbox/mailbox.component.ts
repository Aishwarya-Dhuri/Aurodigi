import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { CommonService } from './shared/services/common.service';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
})
export class MailboxComponent implements OnInit {
  title = 'mail-box';
  isMenuActive: any;
  viewMail: boolean = false;
  listingType: string;

  constructor(private commonService: CommonService, private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.commonService.listingType.subscribe((listingType: string) => {
      this.listingType = listingType;
      this.viewMail = false;
    });

    this.commonService.isViewCall.subscribe((isViewCall: any) => {
      this.viewMail = !!isViewCall;
    });

    this.primengConfig.ripple = true;
    this.commonService.isMenuOpen.subscribe((isMenu) => {
      this.isMenuActive = isMenu;
    });
    this.getJwtToken();
  }

  getJwtToken() {
    let urlParams = window.location.href.substring(window.location.href.lastIndexOf('?') + 1);
    this.commonService.jwtToken = urlParams.split('&')[0];
    this.commonService.requestBy = urlParams.split('&')[1];
  }
}
