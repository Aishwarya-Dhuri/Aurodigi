import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface ScreenContent_Response {
  responseStatus: ResponseStatus;
  loginDetails: LoginDetails;
  logoutDetails: LogoutDetails;
  landingDetails: { advertisementDetailsList: string };
  previousJsonValue: { advertisementDetailsList: string };
  loggable: false;
  entityIdentifier: string;
}

export interface LoginDetails {
  advertisementDetailsList: AdvertisementDetailsList[];
  linksDetailsList: LinkDetail[];
}

export interface LogoutDetails {
  advertisementDetailsList: AdvertisementDetailsList[];
  supportingtext: string;
  feeback: string;
  connectMap: LinkDetail[];
}

export interface AdvertisementDetailsList {
  default1image: string;
  default1SystemImageName: string;
  default1clicked: false;
  default1url: string;
  image1: string;
  systemImage1: string;
  image1clicked: false;
  imageurl: string;
  image1effectivefrom: string;
  imageeffectivetill: string;
  actualImage: string;
  actualClicked: false;
  actualUrl: string;
}

export interface LinkDetail {
  displayName: string;
  linkType?: string;
  link: string;
  uploadFileName?: string;
  systemUploadFileName?: string;
  linkIcon?: string;
}
