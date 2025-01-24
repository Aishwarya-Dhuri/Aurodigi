import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-revenue-generated',
  templateUrl: './revenue-generated.component.html',
  styleUrls: ['./revenue-generated.component.scss'],
})
export class RevenueGeneratedComponent implements OnInit {
  revenueGeneratedLoading: boolean = true;

  revenueGeneratedColDef: any =
    'commons/relationshipManagerService/private/revenueGeneratedColDefs';
  revenueGeneratedRowDataUrl: any = 'dashboard/relationshipManager/private/getRevenueGeneratedData';

  revenueGeneratedOptions: any = {};

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService
      .httpPost(this.revenueGeneratedRowDataUrl, { dataMap: {} })
      .subscribe((response: any) => {
        const revenueGeneratedData = response.data;

        // this.revenueGeneratedOptions = response.data;

        this.revenueGeneratedOptions = {
          data: revenueGeneratedData,
          formatter: (params: any) => {
            return `${revenueGeneratedData[params.itemId].product}\t\t\t${'USD'}\t${
              revenueGeneratedData[params.itemId].amount
            }`;
          },
          labelKey: 'product',
          angleKey: 'amount',
        };
        this.revenueGeneratedLoading = false;
      });
  }
}
