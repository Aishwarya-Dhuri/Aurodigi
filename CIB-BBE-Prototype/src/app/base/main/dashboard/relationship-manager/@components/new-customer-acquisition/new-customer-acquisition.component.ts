import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-customer-acquisition',
  templateUrl: './new-customer-acquisition.component.html',
  styleUrls: ['./new-customer-acquisition.component.scss'],
})
export class NewCustomerAcquisitionComponent implements OnInit {
  newCustomerAcquisitionColDef: any =
    'commons/relationshipManagerService/private/newCustomerAquizitionColDefs';
  newCustomerAcquisitionRowDataUrl: any =
    'dashboard/relationshipManager/private/getNewCustomerAcquisition';

  context: any = { componentParent: this };
  fameworkComponents: any = {};

  gridServerSideOptions: any = {
    rowModelType: 'serverSide',
    pagination: false,
  };

  constructor() {}

  ngOnInit(): void {}
}
