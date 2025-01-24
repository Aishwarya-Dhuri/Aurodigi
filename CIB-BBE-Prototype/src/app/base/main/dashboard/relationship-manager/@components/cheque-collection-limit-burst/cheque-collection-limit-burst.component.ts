import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-cheque-collection-limit-burst',
  templateUrl: './cheque-collection-limit-burst.component.html',
  styleUrls: ['./cheque-collection-limit-burst.component.scss'],
})
export class ChequeCollectionLimitBurstComponent implements OnInit {
  @ViewChild('chequeCollectionLimitBurstGrid')
  chequeCollectionLimitBurstGrid: AgGridListingComponent;

  chequeCollectionLimitBurstLoading: boolean = true;

  chequeCollectionLimitBurstColDef: any =
    'commons/relationshipManagerService/private/chequeCollectionColDefs';

  chequeCollectionLimitBurstRowDataUrl: any =
    'dashboard/relationshipManager/private/getChequeCollectionData';

  chequeCollectionLimitBurstRowData: any[] = [];

  context: any = { componentParent: this };
  fameworkComponents: any = {};

  gridOptions: any = {
    rowModelType: 'clientSide',
    pagination: false,
  };

  gridServerSideOptions: any = {
    rowModelType: 'serverSide',
    pagination: false,
  };

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService
      .httpPost(this.chequeCollectionLimitBurstRowDataUrl, { dataMap: {} })
      .subscribe((response: any) => {
        this.chequeCollectionLimitBurstRowData = response.data;
        this.chequeCollectionLimitBurstLoading = false;
      });
  }

  onHold(chequeNo: string) {
    const chequeIndex = this.chequeCollectionLimitBurstRowData.findIndex(
      (cheque: any) => cheque.chequeNo == chequeNo,
    );
    this.chequeCollectionLimitBurstRowData.splice(chequeIndex, 1);
    this.chequeCollectionLimitBurstGrid.setRowData(this.chequeCollectionLimitBurstRowData);
  }

  onApprove(chequeNo: string) {
    const chequeIndex = this.chequeCollectionLimitBurstRowData.findIndex(
      (cheque: any) => cheque.chequeNo == chequeNo,
    );
    this.chequeCollectionLimitBurstRowData.splice(chequeIndex, 1);
    this.chequeCollectionLimitBurstGrid.setRowData(this.chequeCollectionLimitBurstRowData);
  }

  onClearFunds(chequeNo: string) {
    const chequeIndex = this.chequeCollectionLimitBurstRowData.findIndex(
      (cheque: any) => cheque.chequeNo == chequeNo,
    );
    this.chequeCollectionLimitBurstRowData.splice(chequeIndex, 1);
    this.chequeCollectionLimitBurstGrid.setRowData(this.chequeCollectionLimitBurstRowData);
  }
}
