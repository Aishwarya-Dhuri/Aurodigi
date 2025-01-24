import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-ongoing-transactions',
  templateUrl: './ongoing-transactions.component.html',
  styleUrls: ['./ongoing-transactions.component.scss'],
})
export class OngoingTransactionsComponent implements OnInit {
  ongoingTransactionsDataLoading: boolean = true;
  ongoingTransactionsOptions: any = {};

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService
      .httpPost('dashboard/relationshipManager/private/getOngoingTransactionData', {
        dataMap: {},
      })
      .subscribe((response: any) => {
        const ongoingTransactionsData = response.data;

        this.ongoingTransactionsOptions = {
          data: ongoingTransactionsData,
          formatter: (params: any) => {
            return `${ongoingTransactionsData[params.itemId].label}\t\t\t\t${
              ongoingTransactionsData[params.itemId].amount
            }`;
          },
          labelKey: 'label',
          angleKey: 'amount',
        };
        this.ongoingTransactionsDataLoading = false;
      });
  }
}
