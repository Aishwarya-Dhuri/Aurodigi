import { ResponseStatus } from 'src/app/shared/@models/response-status';
import { UserDetails } from './user.details';

export interface BasicAuthentication_Request {
  clientDetails: { source: string };
  password: string;
  userName: string;
  versionDetails: { version: number };
  corporateCode?: string;
}

export interface BasicAuthentication_Response {
  responseStatus: ResponseStatus;
  securityId: string;
  userDetails: UserDetails;
  enrichmentMap: {
    baseCountryId: string;
    baseCurrencyCode: string;
    languageSelected: string;
    passwordPolicyType: string;
    baseCurrencyId: string;
    baseCountryCode: string;
  };
  currentServerTime: string;
  entityIdentifier: string;
  loggable: boolean;
}
