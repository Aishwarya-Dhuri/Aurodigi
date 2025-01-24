import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'lodash';
import { AppSetting } from '../../@models/app-setting';
import { Chart } from '../../@models/chart.model';
import { AppSettingService } from '../../@services/app-setting.service';

@Component({
  selector: 'aps-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnChanges {
  loading = true;

  @Input('options') options: Chart;

  yKeysOptions: any[] = [];
  selectedYKey: string = '';
  type: string;

  chartOptions: any;
  theme: any;

  highlightStyle: any = {};

  constructor(private appSettingService: AppSettingService) {}

  ngOnInit() {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      setTimeout(() => {
        this.buildTheme();
      }, 100);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeChartType(this.options.chartType);
  }

  buildTheme(): void {
    const chartTheme: string[] = [
      getComputedStyle(document.body).getPropertyValue('--chart-0'),
      getComputedStyle(document.body).getPropertyValue('--chart-1'),
      getComputedStyle(document.body).getPropertyValue('--chart-2'),
      getComputedStyle(document.body).getPropertyValue('--chart-3'),
      getComputedStyle(document.body).getPropertyValue('--chart-4'),
      getComputedStyle(document.body).getPropertyValue('--chart-5'),
      getComputedStyle(document.body).getPropertyValue('--chart-6'),
      getComputedStyle(document.body).getPropertyValue('--chart-7'),
      getComputedStyle(document.body).getPropertyValue('--chart-8'),
      getComputedStyle(document.body).getPropertyValue('--chart-9'),
    ];

    this.theme = {
      baseTheme: 'default',
      palette: {
        fills: [...chartTheme],
        strokes: [...chartTheme],
      },
    };

    this.highlightStyle = {
      item: {
        fill: getComputedStyle(document.body).getPropertyValue('--chart-highlight-fill-color'),
        stroke: getComputedStyle(document.body).getPropertyValue('--chart-highlight-stroke-color'),
      },
    };

    if (this.chartOptions) {
      this.applyTheme();
    }
  }

  getChartOptions() {
    const newOptions: any = {
      autoSize: true,
      theme: this.theme,
      lineTension: 2,
      padding: {
        left: this.options.leftPadding ? this.options.leftPadding : 20,
        right: this.options.rightPadding ? this.options.rightPadding : 20,
        top: this.options.topPadding ? this.options.topPadding : 20,
        bottom: this.options.bottomPadding ? this.options.bottomPadding : 20,
      },
      data: this.options.data,
      legend: {
        position: this.options.legendPosition,
        item: {
          marker: {
            shape: this.options.legendItemMarkerShape,
            size: this.options.legendItemMarkerSize,
          },

          label: {
            fontSize: this.options.legendItemLabelSize,
          },
        },
      },
    };

    return newOptions;
  }

  getAxesFormattedData(axes: any[]) {
    const newAxes: any[] = axes.map((curAxes: any) => {
      if (curAxes.type != 'number') {
        return curAxes;
      }

      curAxes = {
        ...curAxes,
        label: {
          formatter: function (params: any) {
            if (params.value >= 0 && params.value < 1000) {
              return params.value;
            } else if (params.value >= 1000 && params.value < 1000000) {
              return params.value / 1000 + 'k';
            } else if (params.value >= 1000000 && params.value < 1000000000) {
              return params.value / 1000000 + 'M';
            } else {
              return params.value / 1000000000 + 'B';
            }
          },
        },
      };

      return curAxes;
    });

    return newAxes;
  }

  changeChartType(type: string) {
    if (this.type == type) {
      return;
    }

    this.loading = true;
    this.type = type;
    switch (type) {
      case 'pie':
        this.changeToPieChart(false);
        break;
      case 'donut':
        this.changeToPieChart(true);
        break;
      case 'line':
        this.changeToLineChart();
        break;
      case 'bar':
        this.changeToBarOrColumnChart('bar', false);
        break;
      case 'groupedBar':
        this.changeToBarOrColumnChart('bar', true);
        break;
      case 'column':
        this.changeToBarOrColumnChart('column', false);
        break;
      case 'groupedColumn':
        this.changeToBarOrColumnChart('column', true);
        break;
      case 'lineColumn':
        this.changeToLineColumnChart(false);
        break;
      case 'lineGroupedColumn':
        this.changeToLineColumnChart(true);
        break;
    }
    setTimeout(() => {
      this.loading = false;
    }, 100);
  }

  changePieChartKey(key: any) {
    this.loading = true;

    let options = cloneDeep(this.chartOptions);

    options.series[0].angleKey = key;

    this.chartOptions = options;

    setTimeout(() => {
      this.loading = false;
    }, 100);
  }

  changeToPieChart(isDonutChart: boolean) {
    const keysAndLabels: any = this.getKeysAndLabels();

    this.yKeysOptions = [];

    keysAndLabels.yKeys.forEach((key: string, i: number) => {
      this.yKeysOptions.push({
        id: key,
        displayName: keysAndLabels.yNames[i],
      });
    });

    if (this.yKeysOptions.length > 0) {
      this.selectedYKey = this.yKeysOptions[0].id;
    }

    const options = this.getChartOptions();

    const newOptions = {
      ...options,
      data: this.options.data,
      series: [
        {
          type: 'pie',
          labelKey: keysAndLabels.xKey,
          angleKey: this.selectedYKey,
          innerRadiusOffset: 7,
          shadow: { enabled: this.options.chartShadow },
          highlightStyle: this.highlightStyle,
          label: {
            enabled: false,
          },
        },
      ],
    };

    if (!isDonutChart) {
      delete newOptions.series[0].innerRadiusOffset;
    }

    if (newOptions.axes) {
      delete newOptions.axes;
    }

    this.chartOptions = cloneDeep(newOptions);
  }

  changeToLineChart() {
    const keysAndLabels: any = this.getKeysAndLabels();

    const options = this.getChartOptions();

    let series: any[] = [];

    keysAndLabels.yKeys.forEach((key: string, i: number) => {
      series.push({
        type: 'line',
        xKey: keysAndLabels.xKey,
        xName: keysAndLabels.xName,
        yKey: key,
        yName: keysAndLabels.yNames[i],
        lineTension: 2,
        strokeWidth: 2,
        marker: {
          shape: 'circle',
          size: 6,
        },
        shadow: { enabled: this.options.chartShadow },
        highlightStyle: this.highlightStyle,
      });
    });

    const axes = [
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: this.options.categoryAxesTitle,
          enabled: !!this.options.categoryAxesTitle,
        },
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: this.options.numberAxesTitle.length > 0 ? this.options.numberAxesTitle[0] : '',
          enabled: this.options.numberAxesTitle.length > 0,
        },
      },
    ];

    const newOptions = {
      ...options,
      data: this.options.data,
      series,
      axes: this.getAxesFormattedData(axes),
    };

    this.chartOptions = newOptions;
  }

  changeToBarOrColumnChart(type: string, grouped: boolean) {
    const keysAndLabels: any = this.getKeysAndLabels();

    const options = this.getChartOptions();

    const axes: any[] = [
      {
        type: 'category',
        position: type == 'bar' ? 'left' : 'bottom',
        title: {
          text: this.options.categoryAxesTitle,
          enabled: !!this.options.categoryAxesTitle,
        },
      },
      {
        type: 'number',
        position: type == 'bar' ? 'bottom' : 'left',
        title: {
          text: this.options.numberAxesTitle.length > 0 ? this.options.numberAxesTitle[0] : '',
          enabled: this.options.numberAxesTitle.length > 0,
        },
      },
    ];

    const newOptions = {
      ...options,
      data: this.options.data,
      series: [
        {
          type: type,
          xKey: keysAndLabels.xKey,
          yKeys: [...keysAndLabels.yKeys],
          yNames: [...keysAndLabels.yNames],
          grouped: grouped,
          shadow: { enabled: this.options.chartShadow },
          highlightStyle: this.highlightStyle,
        },
      ],
      axes: this.getAxesFormattedData(axes),
    };

    this.chartOptions = cloneDeep(newOptions);
  }

  changeToLineColumnChart(grouped: boolean) {
    const keysAndLabels: any = this.getKeysAndLabels();

    const yKeysLength = keysAndLabels.yKeys.length;

    const noOfColumnKeys = Math.ceil(yKeysLength / 2);

    const columnKeys = [...keysAndLabels.yKeys].slice(0, noOfColumnKeys);
    const columLabels = [...keysAndLabels.yNames].slice(0, noOfColumnKeys);
    const lineKeys = [...keysAndLabels.yKeys].slice(noOfColumnKeys, yKeysLength);
    const lineLabels = [...keysAndLabels.yNames].slice(noOfColumnKeys, yKeysLength);

    const options = this.getChartOptions();

    const axes: any[] = [
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: this.options.categoryAxesTitle,
          enabled: !!this.options.categoryAxesTitle,
        },
      },
      {
        type: 'number',
        position: 'left',
        keys: columnKeys,
        title: {
          text: this.options.numberAxesTitle.length > 0 ? this.options.numberAxesTitle[0] : '',
          enabled: this.options.numberAxesTitle.length > 0,
        },
      },
      {
        type: 'number',
        position: 'right',
        keys: lineKeys,
        lineTension: 2,
        min: 0,
        title: {
          text: this.options.numberAxesTitle.length > 1 ? this.options.numberAxesTitle[1] : '',
          enabled: this.options.numberAxesTitle.length > 1,
        },
      },
    ];

    const series: any[] = [
      {
        type: 'column',
        xKey: keysAndLabels.xKey,
        yKeys: [...columnKeys],
        yNames: [...columLabels],
        grouped: grouped,
        shadow: { enabled: this.options.chartShadow },
        highlightStyle: this.highlightStyle,
      },
    ];

    lineKeys.forEach((key: string, i: number) => {
      series.push({
        type: 'line',
        xKey: keysAndLabels.xKey,
        xName: keysAndLabels.xName,
        yKey: key,
        yName: lineLabels[i],
        lineTension: 2,
        strokeWidth: 2,
        marker: {
          shape: 'circle',
          size: 6,
        },
        shadow: { enabled: this.options.chartShadow },
      });
    });

    const newOptions = {
      ...options,
      data: this.options.data,
      series: series,
      axes: this.getAxesFormattedData(axes),
    };

    this.chartOptions = cloneDeep(newOptions);
  }

  getKeysAndLabels() {
    const xKey = this.options.xKey;
    const xName = this.options.xLabel;

    const yKeys = this.options.yKeys;
    const yNames = this.options.yLabels;

    return {
      xKey,
      xName,
      yKeys,
      yNames,
    };
  }

  applyTheme = () => {
    const options = cloneDeep(this.chartOptions);

    options.theme = this.theme;

    if (options.series) {
      options.series = options.series.map((series: any) => {
        series['highlightStyle'] = this.highlightStyle;
        return series;
      });
    }

    this.chartOptions = options;
  };
}
