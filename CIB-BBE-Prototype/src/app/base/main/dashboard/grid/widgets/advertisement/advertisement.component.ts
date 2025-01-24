import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss'],
})
export class AdvertisementComponent implements OnInit {
  @Input('item') widgetObj: any;
  isLoading: boolean = false;
  url: string;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.isLoading = true;
    if (!this.widgetObj.dynamicWidgetId) {
      this.url = './../../../../../../../assets/images/advertisement-L.png';
      this.isLoading = false;
    } else {
      this.generateDynamicWidget();
    }
  }

  generateDynamicWidget(): void {
    const data = {
      dataMap: {
        id: this.widgetObj.dynamicWidgetId,
      },
    };
    this.httpService
      .httpPost('setup/cibSetup/widgetBuilder/private/view', data)
      .subscribe((response: any) => {
        if (response.advertisementOptions[0].isUrlBased) {
          this.url = response.advertisementOptions[0].advertisementUrl;
        } else {
          this.url = this.httpService.getAssetUrl(
            response.advertisementOptions[0].advertisementFileList[0]?.sysFileName,
          );
        }

        this.isLoading = false;
      });
  }
}
