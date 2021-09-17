import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const shoppr_access_token = localStorage.getItem('shoppr_access_token');
    let request = httpRequest;
    if (shoppr_access_token !== null) {
      const tokenInfo = JSON.parse(atob(shoppr_access_token));
      request = httpRequest.clone({ setHeaders: { Authorization: `Bearer ${tokenInfo.access_token}` } })
    }
    return next.handle(request);
  }
}
