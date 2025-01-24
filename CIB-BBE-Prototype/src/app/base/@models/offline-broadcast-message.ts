import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface OfflineBroadcastMessage_Request {
  versionDetails: { version: string };
  clientDetails: { source: string };
}

export interface OfflineBroadcastMessage_Response {
  responseStatus: ResponseStatus;
  dataMap: {
    broadcastMessages: BroadcastMessage[];
  };
  entityIdentifier: string;
  entity: string;
  loggable: boolean;
}

export interface BroadcastMessage {
  briefMessage: string;
  messageDescription: string;
}
