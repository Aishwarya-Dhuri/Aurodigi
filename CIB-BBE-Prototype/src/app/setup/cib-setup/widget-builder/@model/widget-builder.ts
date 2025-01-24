import { Chart } from 'src/app/shared/@models/chart.model';

export class WidgetBuilder {
  isForAdminPortal: boolean;
  widgetCode: string;
  widgetName: string;
  moduleId: string | number;
  moduleName: string;
  widgetType: 'Chart' | 'Table/Grid' | 'Calender' | 'Advertisement';
  chartOptions: Chart[];
  tableGridOptions: TableGridWidget[];
  advertisementOptions: AdvertisementWidget[];

  constructor() {
    this.isForAdminPortal = false;
    this.widgetCode = '';
    this.widgetName = '';
    this.moduleId = '';
    this.moduleName = '';
    this.widgetType = 'Chart';
    this.chartOptions = [new Chart()];
    this.tableGridOptions = [new TableGridWidget()];
    this.advertisementOptions = [new AdvertisementWidget()];
  }
}

export class TableGridWidget {
  dataSource: string;
  isApiBasedColDefs: boolean;
  colDefUrl?: string;
  tableGridWidgetColDefList?: any[];
  dataFrom: 'API' | 'Query';
  rowDefUrl: string;
  rowDefQueryString: string;
  rowData: any[];

  constructor() {
    this.dataSource = 'CIB';
    this.isApiBasedColDefs = true;
    this.colDefUrl = '';
    this.tableGridWidgetColDefList = [];
    this.dataFrom = 'API';
    this.rowDefUrl = '';
    this.rowDefQueryString = '';
    this.rowData = [];
  }
}

export class AdvertisementWidget {
  isUrlBased: boolean;
  advertisementUrl: string;
  advertisementImgUrl: string;
  advertisementFileList: any[];

  constructor() {
    this.isUrlBased = false;
    this.advertisementUrl = '';
    this.advertisementImgUrl = '';
    this.advertisementFileList = [];
  }
}
