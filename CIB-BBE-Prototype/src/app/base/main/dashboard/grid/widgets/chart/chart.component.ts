import { HttpService } from 'src/app/shared/@services/http.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UserService } from 'src/app/shared/@services/user.service';
import { ActionType } from '../../@enums/widget-actions';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @ViewChild('chart') chart: any;

  @Input('item') widgetObj: any;
  @Input('index') index: any;
  @Input('title') title: any;
  @Input('id') id: any;
  @Input('serviceUrl') serviceUrl: any;
  @Input('showChangeChartOption') showChangeChartOption: any;

  @Output() action = new EventEmitter<{ type: string; i?: number }>();

  options: any;

  loading = true;

  constructor(private userService: UserService, private httpService: HttpService) {}

  ngOnInit() {
    if (!this.widgetObj.dynamicWidgetId) {
      this.getWidgetData();
    } else {
      this.generateDynamicWidget();
    }
  }

  getWidgetData(): void {
    /*  const data = {
      dataMap: {
      },
    }; */
    this.httpService.httpPost(this.serviceUrl, {}).subscribe((response: any) => {
      this.options = response.data;

      this.loading = false;
    });
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
        this.options = response.chartOptions[0];
        this.options.yKeys = this.options.yKeysStr.split(',');
        this.options.yLabels = this.options.yLabelsStr.split(',');
        this.options.numberAxesPosition = this.options.numberAxesPositionStr.split(',');
        this.options.numberAxesTitle = this.options.numberAxesTitleStr.split(',');
        this.options.numberAxesRotationAngle = this.options.numberAxesRotationAngleStr.split(',');
        this.getChartData();
      });
  }

  getChartData(): void {
    this.options.data = [
      {
        xLabel: 'Jan',
        yLabel0: 180,
        yLabel1: 20,
        yLabel2: 30,
        yLabel3: 180,
        yLabel4: 20,
        yLabel5: 30,
        yLabel6: 180,
        yLabel7: 20,
        yLabel8: 30,
        yLabel9: 30,
      },
      {
        xLabel: 'Feb',
        yLabel0: 110,
        yLabel1: 100,
        yLabel2: 110,
        yLabel3: 180,
        yLabel4: 20,
        yLabel5: 30,
        yLabel6: 180,
        yLabel7: 20,
        yLabel8: 30,
        yLabel9: 30,
      },
      {
        xLabel: 'March',
        yLabel0: 90,
        yLabel1: 90,
        yLabel2: 100,
        yLabel3: 180,
        yLabel4: 20,
        yLabel5: 30,
        yLabel6: 180,
        yLabel7: 20,
        yLabel8: 30,
        yLabel9: 30,
      },
      {
        xLabel: 'April',
        yLabel0: 50,
        yLabel1: 40,
        yLabel2: 50,
        yLabel3: 180,
        yLabel4: 20,
        yLabel5: 30,
        yLabel6: 180,
        yLabel7: 20,
        yLabel8: 30,
        yLabel9: 30,
      },
      {
        xLabel: 'May',
        yLabel0: 60,
        yLabel1: 10,
        yLabel2: 20,
        yLabel3: 180,
        yLabel4: 20,
        yLabel5: 30,
        yLabel6: 180,
        yLabel7: 20,
        yLabel8: 30,
        yLabel9: 30,
      },
    ];
    this.loading = false;
  }

  actionEvent(e: { type: string; event?: any }) {
    if (e.type == ActionType.changeChartType) {
      if (this.chart) {
        this.chart.changeChartType(e.event);
      }
      return;
    }

    this.action.emit({ type: e.type, i: this.index });
  }
}
