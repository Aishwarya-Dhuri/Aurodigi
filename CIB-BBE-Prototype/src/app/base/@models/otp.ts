import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface ValidateOTP_Request {
  password: string;
  authType: string;
}

export interface OTP_Response {
  responseStatus: ResponseStatus;
  securityId: string;
  entityIdentifier: string;
  loggable: boolean;
}

export interface OTPPasswordRequirement_Response {
  responseStatus: ResponseStatus;
  otpFormat: string;
  crossSiteScriptXssToken: string;
  pwd: Password[];
  loggable: boolean;
  entityIdentifier: string;
}

interface Password {
  responseStatus: ResponseStatus;
  id: string;
  displayName: string;
  value: string;
  loggable: boolean;
  entityIdentifier: string;
}
