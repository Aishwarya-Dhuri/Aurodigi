export interface AppSettings {
  login: LoginSetting;
}

export interface LoginSetting {
  imageCarousalIntervalInSec: number;
  offlineBroadcastIntervalInSec: number;
  resendSecondFactorCodeInSec: number;
}
