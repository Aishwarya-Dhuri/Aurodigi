import { Component, OnInit } from '@angular/core';
import { LinkDetail } from 'src/app/base/@models/screen-content';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss'],
})
export class MainFooterComponent implements OnInit {
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
