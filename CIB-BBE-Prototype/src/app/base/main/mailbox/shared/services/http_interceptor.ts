import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private commonService: CommonService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authToken = `Bearer ${this.commonService.jwtToken}`;
    const authReq = req.clone({
      headers: new HttpHeaders({
        Authorization: authToken,
      }),
    });
    return next.handle(authReq);
  }
}
