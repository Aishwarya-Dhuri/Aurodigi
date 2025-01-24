import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface GrouppedUnreadAlerts_Request {
  dataMap: { topRecords: string };
}

export interface BroadCastMessages_Response {
  responseStatus: ResponseStatus;
  paymentsalerts: any[];
  entityIdentifier: string;
  loggable: boolean;
}

export interface GrouppedUnreadAlerts_Response {
  responseStatus: ResponseStatus;
  totalCount: number;
  unReadCount: string;
  onlineAlertDetails: Alert[];
  entity: string;
  entityIdentifier: string;
  loggable: boolean;
}

export interface Alert {
  referenceEntityName: string;
  referenceEntityDisplayName: string;
  count: string;
  unReadCount: string;
}
