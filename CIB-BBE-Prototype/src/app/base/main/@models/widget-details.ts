import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface WidgetDetails_Response {
  responseStatus: ResponseStatus;
  dataList: Widget[];
  entityIdentifier: string;
  loggable: boolean;
}

export interface Widget {
  id?: string;
  displayName?: string;
  enrichments?: {
    corporateWidget?: string;
    widgetName?: string;
    maxwidgetCount?: number | string;
  };
  [key: string]: any;
}
