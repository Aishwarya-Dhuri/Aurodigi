import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridListingComponent;
  @Input('item') widgetObj: any;
  @Input('index') index: any;
  @Input('title') title: any;
  @Input('id') id: any;
  @Input('serviceUrl') serviceUrl: any;
  @Input('showChangeChartOption') showChangeChartOption: any;

  @Output() action = new EventEmitter<{ type: string; i?: number }>();

  data = [];
  options: any;
  isLoading: boolean = false;

  dailyData = [
    {
      chequeNo: '100101',
      chequeAmount: '1,100,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100102',
      chequeAmount: '950,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100103',
      chequeAmount: '68,000.00.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100104',
      chequeAmount: '49,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100105',
      chequeAmount: '120,500.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
  ];
  weeklyData = [
    {
      chequeNo: '100101',
      chequeAmount: '950,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100102',
      chequeAmount: '1,100,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100103',
      chequeAmount: '49,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100104',
      chequeAmount: '68,000.00.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100105',
      chequeAmount: '1,100,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100106',
      chequeAmount: '49,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100107',
      chequeAmount: '120,500.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
  ];
  monthlyData = [
    {
      chequeNo: '100101',
      chequeAmount: '1,100,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100102',
      chequeAmount: '950,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100103',
      chequeAmount: '68,000.00.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100104',
      chequeAmount: '49,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100105',
      chequeAmount: '120,500.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100106',
      chequeAmount: '950,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100107',
      chequeAmount: '1,100,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100108',
      chequeAmount: '49,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100109',
      chequeAmount: '68,000.00.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100110',
      chequeAmount: '1,100,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100111',
      chequeAmount: '49,000.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
    {
      chequeNo: '100112',
      chequeAmount: '120,500.00',
      liquidationDate: '25-Apr-2018',
      returnReason: 'Insufficient Fund',
    },
  ];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    if (!this.widgetObj.dynamicWidgetId) {
      this.data = this.weeklyData;
    } else {
      this.generateDynamicWidget();
    }
  }

  generateDynamicWidget(): void {
    this.isLoading = true;
    const data = {
      dataMap: {
        id: this.widgetObj.dynamicWidgetId,
      },
    };
    this.httpService
      .httpPost('setup/cibSetup/widgetBuilder/private/view', data)
      .subscribe((response: any) => {
        this.options = response.tableGridOptions[0];
        this.getGridData();
      });
  }

  getGridData(): void {
    if (this.options.isApiBasedColDefs) {
      this.options.tableGridWidgetColDefList = [];
      for (let i = 0; i < 3; i++) {
        this.options.tableGridWidgetColDefList.push({
          headerName: 'Column' + (i + 1),
          field: 'column1',
          sortable: true,
        });
      }
    }
    this.options.rowData = [];
    for (let i = 0; i < 5; i++) {
      let row = {};
      this.options.tableGridWidgetColDefList.forEach((col: any) => {
        row[col.field] = col.headerName + Math.floor(Math.random() * 100);
      });
      this.options.rowData.push(row);
    }
    this.isLoading = false;

    setTimeout(() => {
      this.agGrid.fitColumns();
    }, 1000);
  }

  timePeriodChanged(type: string) {
    if (type === 'daily') {
      this.data = this.dailyData;
    } else if (type === 'weekly') {
      this.data = this.weeklyData;
    } else if (type === 'monthly') {
      this.data = this.monthlyData;
    }
  }

  actionEvent(e: { type: string; event?: any }) {
    this.action.emit({ type: e.type, i: this.index });
  }
}
