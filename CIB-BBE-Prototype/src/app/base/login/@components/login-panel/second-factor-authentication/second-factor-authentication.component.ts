import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OTP_Response, ValidateOTP_Request } from 'src/app/base/@models/otp';
import { UserDetails } from 'src/app/base/@models/user.details';
// import { LoginService } from 'src/app/base/login/@services/login.service';
import { AESEncriptionService } from 'src/app/shared/@services/aesencryption-service.service';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-second-factor-authentication',
  templateUrl: './second-factor-authentication.component.html',
  styleUrls: ['./second-factor-authentication.component.scss'],
})
export class SecondFactorAuthenticationComponent implements OnInit {
  private dashboardRouteUrl: string;
  userDetails: UserDetails = new UserDetails();
  verificationMode: string;
  verificationCode: string;
  isViewVerificationCode: boolean = false;

  submit = false;
  timer: number = 60;
  invalidVerificationCode: boolean;

  isBiometricGray: boolean = true;

  constructor(
    /* private loginService: LoginService, */
    private router: Router,
    private aesEncryptionService: AESEncriptionService,
    private httpService: HttpService,
    private userService: UserService,
    private toasterService: ToasterService,
    private appSettingService: AppSettingService,
  ) {
    this.userService.getDashboardRouteUrl().subscribe((dashboardRouteUrl: string) => {
      this.dashboardRouteUrl = dashboardRouteUrl;
    });
    this.userService.getUserDetails().subscribe((userDetails: UserDetails) => {
      this.userDetails = userDetails;
    });
  }

  ngOnInit(): void {
    this.setTimer();
  }

  setTimer() {
    this.timer = 60;
    const x = setInterval(() => {
      if (this.timer === 0) {
        this.timer = 60;
      }
      this.timer--;
    }, 1000);
  }

  getTime() {
    return this.timer.toString().padStart(2, '0');
  }

  generateOTP() {
    this.invalidVerificationCode = false;
    this.httpService.httpPost('login/public/generateOTP').subscribe(
      (otpResponse: OTP_Response) => {},
      (error: any) => {},
    );
  }

  validateOTP() {
    if (this.verificationCode) {
      this.submit = true;

      const requestData: ValidateOTP_Request = {
        authType: this.verificationMode,
        password: this.verificationCode,
      };

      this.httpService
        .httpPost('login/public/validateOTP', requestData)
        .subscribe((validateOtpResponse: OTP_Response) => {
          if (validateOtpResponse.responseStatus.status === '0') {
            this.invalidVerificationCode = false;
            this.navigateToDashboard();
          } else if (validateOtpResponse.responseStatus.status === '1') {
            this.invalidVerificationCode = true;
            this.submit = false;
          }
        });
    }
  }

  getMaskedNumber(): string {
    if (this.userDetails.mobileNumber && this.userDetails.mobileNumber.toString().length > 4) {
      let mobileNo = '';
      for (let i = 0; i < this.userDetails.mobileNumber.toString().length - 4; i++) {
        mobileNo = mobileNo + 'X';
      }
      mobileNo =
        mobileNo +
        this.userDetails.mobileNumber
          .toString()
          .substring(this.userDetails.mobileNumber.toString().length - 4);
      return mobileNo;
    } else {
      return this.userDetails.mobileNumber;
    }
  }

  onBiometricLogin(): void {
    setTimeout(() => {
      this.isBiometricGray = false;
      setTimeout(() => {
        this.navigateToDashboard();
      }, 500);
    }, 500);
  }

  navigateToDashboard(): void {
    this.router.navigateByUrl(this.dashboardRouteUrl);
  }
}
