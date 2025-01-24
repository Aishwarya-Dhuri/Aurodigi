import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDetails } from 'src/app/base/@models/user.details';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userName = new BehaviorSubject<string>('');
  private applicationDate = new BehaviorSubject<string>('');
  private dashboardRouteUrl = new BehaviorSubject<string>('');
  private userDetails = new BehaviorSubject<UserDetails>(new UserDetails());

  constructor(private httpService: HttpService) {
    // sessionStorage.removeItem('securityId');
    this.updateSessionData();
  }

  updateSessionData(): void {
    this.httpService.httpPost('login/private/getUserSessionData').subscribe((response: any) => {
      this.setUserDetails(response.userDetails);
      this.setApplicationDate(response.userDetails.applicationDate);
      this.setUserName(response.userDetails.userName);
    });
  }

  getUserName(): Observable<string> {
    return this.userName;
  }

  setUserName(userName: string): void {
    this.userName.next(userName);
  }

  getApplicationDate(): Observable<string> {
    return this.applicationDate;
  }

  setApplicationDate(applicationDate: string): void {
    this.applicationDate.next(applicationDate);
  }

  getDashboardRouteUrl(): Observable<string> {
    return this.dashboardRouteUrl;
  }

  setDashboardRouteUrl(dashboardRouteUrl: string): void {
    this.dashboardRouteUrl.next(dashboardRouteUrl);
  }

  getUserDetails(): Observable<any> {
    return this.userDetails;
  }

  setUserDetails(userDetails: any): void {
    this.userDetails.next(userDetails);
  }
}
