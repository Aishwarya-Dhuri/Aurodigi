import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from 'src/app/shared/@services/http.service';
import {
  BroadCastMessages_Response,
  GrouppedUnreadAlerts_Request,
  GrouppedUnreadAlerts_Response,
} from '../@models/alerts';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private httpService: HttpService) {}

  getGrouppedUnreadAlerts(requestData: GrouppedUnreadAlerts_Request) {
    // this.httpService.httpPost( 'getGrouppedUnreadAlerts', requestData ).pipe(
    this.httpService.httpPost('/getGrouppedUnreadAlerts', requestData).pipe(
      map((grouppedUnreadAlerts: GrouppedUnreadAlerts_Response) => {
        return grouppedUnreadAlerts;
      }),
      catchError((err: any) => {
        return throwError(err);
      }),
    );
  }

  getBroadCastMessages() {
    // this.httpService.httpPost( 'getBroadCastMessages' ).pipe(
    this.httpService.httpPost('/getBroadCastMessages').pipe(
      map((grouppedUnreadAlerts: BroadCastMessages_Response) => {
        return grouppedUnreadAlerts;
      }),
      catchError((err: any) => {
        return throwError(err);
      }),
    );
  }
}
