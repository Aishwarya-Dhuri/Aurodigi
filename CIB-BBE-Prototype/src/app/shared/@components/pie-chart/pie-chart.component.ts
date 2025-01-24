import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'lodash';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { AppSetting } from '../../@models/app-setting';
import { AppSettingService } from '../../@services/app-setting.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit, OnChanges {
  @Input('options') options!: any;
  @Input('isDynamicHeight') isDynamicHeight?: boolean = false;
  @Input('webHeight') webHeight?: number = 100;
  @Input('mobileHeight') mobileHeight?: number = 200;

  theme: any;
  viewport: string = 'web';
  chartTheme: string[];
  chartOptions: any;

  constructor(
    private viewportService: ViewportService,
    private appSettingService: AppSettingService,
  ) {}

  ngOnInit(): void {
    this.viewportService.getViewport().subscribe((viewport: any) => {
      this.viewport = viewport;
      if (this.chartOptions) {
        this.chartOptions.legend.position = this.viewport === 'web' ? 'right' : 'bottom';
        this.chartOptions.height = this.viewport === 'web' ? this.webHeight : this.mobileHeight;
        setTimeout(() => {
          this.applyTheme();
        });
      }
    });

    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      setTimeout(() => {
        const themeColors = this.appSettingService.getThemeColors();

        this.chartTheme = [...themeColors];

        this.theme = {
          baseTheme: 'default',
          palette: {
            fills: this.chartTheme,
            strokes: this.chartTheme,
          },
        };

        if (this.chartOptions) {
          this.applyTheme();
        }
      }, 100);
    });

    this.chartOptions = {
      autoSize: true,
      height: this.viewport === 'web' ? this.webHeight : this.mobileHeight,
      padding: {
        ...this.options.padding,
      },
      theme: this.theme,
      lineTension: 2,
      data: this.options.data,
      legend: {
        position: this.viewport === 'web' ? 'right' : 'bottom',
        item: {
          marker: { shape: 'circle', size: 8 },
          label: {
            fontSize: 10,
            formatter: this.options.formatter ? this.options.formatter : '',
          },
        },
        ...this.options.legend,
      },
      series: [
        {
          type: 'pie',
          labelKey: this.options.labelKey,
          angleKey: this.options.angleKey,
          shadow: { enabled: false },
          innerRadiusOffset: 7.5,
          showInLegend: true,
          label: {
            enabled: false,
          },
        },
      ],
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chartOptions) {
      this.chartOptions.data = changes.options.currentValue.data;
      this.changeOptionsData();
      this.changeFormatterData();
    }
  }

  changeOptionsData = () => {
    const options = cloneDeep(this.chartOptions);

    this.chartOptions = options;
  };

  changeFormatterData = () => {
    const options = cloneDeep(this.chartOptions);

    options.legend.item.label.formatter = this.options.formatter ? this.options.formatter : '';

    this.chartOptions = options;
  };

  applyTheme = () => {
    const options = cloneDeep(this.chartOptions);

    options.theme = this.theme;

    this.chartOptions = options;
  };
}
