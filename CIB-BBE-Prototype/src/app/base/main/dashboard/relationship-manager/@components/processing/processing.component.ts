import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.scss'],
})
export class ProcessingComponent implements OnInit {
  processingDataLoading: boolean = true;

  processingOptions: any = {};

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService
      .httpPost('dashboard/relationshipManager/private/getProcessingData', { dataMap: {} })
      .subscribe((response: any) => {
        const processingData = response.data;

        this.processingOptions = {
          data: processingData,
          formatter: (params: any) => {
            return `${processingData[params.itemId].label}\t\t\t${
              processingData[params.itemId].currency
            }\t${processingData[params.itemId].amount}`;
          },
          labelKey: 'label',
          angleKey: 'amount',
        };
        this.processingDataLoading = false;
      });
  }
}
