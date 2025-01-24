import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-product-wise-distribution',
  templateUrl: './product-wise-distribution.component.html',
  styleUrls: ['./product-wise-distribution.component.scss'],
})
export class ProductWiseDistributionComponent implements OnInit {
  productWiseDistributionDataLoading: boolean = true;
  productWiseDistributionOptions: any = {};

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService
      .httpPost('dashboard/relationshipManager/private/getProductWiseDistributionData', {
        dataMap: {},
      })
      .subscribe((response: any) => {
        const productWiseDistributionData = response.data;

        this.productWiseDistributionOptions = {
          data: productWiseDistributionData,
          formatter: (params: any) => {
            return `${productWiseDistributionData[params.itemId].label}\t\t\t${
              productWiseDistributionData[params.itemId].currency
            }\t${productWiseDistributionData[params.itemId].amount}`;
          },
          labelKey: 'label',
          angleKey: 'amount',
        };
        this.productWiseDistributionDataLoading = false;
      });
  }
}
