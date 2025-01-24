import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { RelationshipManagerComponent } from '../../relationship-manager.component';

@Component({
  selector: 'app-deviation-matrix',
  templateUrl: './deviation-matrix.component.html',
  styleUrls: ['./deviation-matrix.component.scss'],
})
export class DeviationMatrixComponent implements OnInit {
  @Input('parentRef') parentRef: RelationshipManagerComponent;

  deviationMatrixData: any[] = [];

  context: any = { componentParent: this };
  frameworkComponents: any = {};

  gridServerSideOptions: any = {
    rowModelType: 'serverSide',
    pagination: false,
  };

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService
      .httpPost(this.parentRef.deviationMatrixDataUrl, { dataMap: {} })
      .subscribe((response: any) => {
        response.data.forEach((dm: any, i: number) => {
          if (i < 4) {
            this.deviationMatrixData.push({
              label: dm.corporateName,
              value: dm.noOfTransactions,
            });
          }
        });
      });
  }
}
