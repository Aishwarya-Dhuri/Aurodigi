import { Component, OnInit } from '@angular/core';
import { LinkDetail } from 'src/app/base/@models/screen-content';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-pre-login-footer',
  templateUrl: './pre-login-footer.component.html',
  styleUrls: ['./pre-login-footer.component.scss'],
})
export class PreLoginFooterComponent implements OnInit {
  footerData: {
    socialMedias: { icon: string; link: string }[];
    copyRight: string;
    links: LinkDetail[];
  };

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.httpPost('footer').subscribe((footerData: any) => {
      this.footerData = footerData;
    });
  }
}
