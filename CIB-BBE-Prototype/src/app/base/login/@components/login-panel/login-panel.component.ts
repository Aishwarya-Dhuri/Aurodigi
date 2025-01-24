import { Component, OnInit } from '@angular/core';
import {
  BasicAuthentication_Request,
  BasicAuthentication_Response,
} from 'src/app/base/@models/basic-authentication';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { LoginForm } from '../../@model/login.model';

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.scss'],
})
export class LoginPanelComponent implements OnInit {
  loginForm: LoginForm = new LoginForm();
  isViewPassword: boolean = false;
  isInvalidCredentials: boolean = false;
  isStep1Completed: boolean = false;
  constructor(private httpService: HttpService, private userService: UserService) {}

  ngOnInit(): void {}

  checkLoginDetails(): void {
    const requestData: BasicAuthentication_Request = {
      clientDetails: { source: 'WEB' },
      userName: this.loginForm.userName,
      //password: this.aesEncryptionService.doEncryption(this.loginForm.value.password),
      password: this.loginForm.password,
      versionDetails: { version: 1 },
    };

    this.httpService
      .httpPost('login/public/basicAuthentication', requestData)
      .subscribe((basicAuthenticationResponse: BasicAuthentication_Response) => {
        if (basicAuthenticationResponse.responseStatus.status === '0') {
          sessionStorage.setItem('securityId', basicAuthenticationResponse.securityId);
          this.userService.setUserName(this.loginForm.userName);
          this.userService.setDashboardRouteUrl(
            'dashboard/' + basicAuthenticationResponse.userDetails.landingPage,
          );
          this.userService.setUserDetails(basicAuthenticationResponse.userDetails);
          this.userService.setApplicationDate(
            basicAuthenticationResponse.userDetails.applicationDate,
          );
          this.userService.setUserName(this.loginForm.userName);
          this.isStep1Completed = true;
        } else if (basicAuthenticationResponse.responseStatus.status === '1') {
          this.isInvalidCredentials = true;
          this.isStep1Completed = false;
        }
      });
  }
}
