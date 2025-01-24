export class Chart {
  dataSource: string;
  dataFrom: 'API' | 'Query';
  apiUrl?: string;
  queryString?: string;
  data?: ChartData[];
  xKey?: 'xLabel';
  xLabel: string;
  yKeys: string[];
  yKeysStr?: string;
  yLabels: string[];
  yLabelsStr?: string;
  chartType:
    | 'pie'
    | 'donut'
    | 'line'
    | 'bar'
    | 'groupedBar'
    | 'column'
    | 'groupedColumn'
    | 'lineColumn'
    | 'lineGroupedColumn';
  leftPadding?: number;
  rightPadding?: number;
  topPadding?: number;
  bottomPadding?: number;
  chartShadow?: boolean;
  categoryAxesPosition?: 'left' | 'right' | 'top' | 'bottom';
  categoryAxesTitle?: string;
  categoryAxesRotationAngle?: number;
  numberAxesPosition?: string[];
  numberAxesPositionStr?: string;
  numberAxesTitle?: string[];
  numberAxesTitleStr?: string;
  numberAxesRotationAngle?: number[];
  numberAxesRotationAngleStr?: string;
  legendPosition?: 'left' | 'right' | 'top' | 'bottom';
  legendItemMarkerShape?: 'circle' | 'cross' | 'diamond' | 'plus' | 'square' | 'triangle';
  legendItemMarkerSize?: number;
  legendItemLabelSize?: number;
  legendItemLabeFormatterMethodname?: string;
  parentRef?: any;
  constructor() {
    this.dataSource = 'CIB';
    this.dataFrom = 'API';
    this.apiUrl = '';
    this.queryString = '';
    this.data = [];
    this.xKey = 'xLabel';
    this.xLabel = 'xLabel';
    this.yKeys = ['yLabel0', 'yLabel1'];
    this.yLabels = ['Category1', 'Category2'];
    this.chartType = 'column';
    this.leftPadding = 10;
    this.rightPadding = 10;
    this.topPadding = 10;
    this.bottomPadding = 10;
    this.chartShadow = false;
    this.categoryAxesPosition = 'right';
    this.categoryAxesTitle = 'Title';
    this.categoryAxesRotationAngle = 0;
    this.numberAxesPosition = [''];
    this.numberAxesTitle = ['Title'];
    this.numberAxesRotationAngle = [];
    this.legendPosition = 'bottom';
    this.legendItemMarkerShape = 'circle';
    this.legendItemMarkerSize = 8;
    this.legendItemLabelSize = 12;
    this.legendItemLabeFormatterMethodname = '';
  }
}

class ChartData {
  constructor(
    public xLabel: string,
    public yLabel0: string | number,
    public yLabel1?: string | number,
    public yLabel2?: string | number,
    public yLabel3?: string | number,
    public yLabel4?: string | number,
    public yLabel5?: string | number,
    public yLabel6?: string | number,
    public yLabel7?: string | number,
    public yLabel8?: string | number,
    public yLabel9?: string | number,
  ) {}
}
