import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthEndpoints } from "../types/endpoints";
import { User } from "../types/Entity.Types";
import { HttpService } from "./http.service";
import { ServiceBase } from "./service.base";


@Injectable({
  providedIn: 'root'
})
export class UserService extends ServiceBase<User> {


  constructor(public readonly _http: HttpService) {
    super('/api/users', User, _http);
  }

  get isAuthenticated(): boolean {
    const session = localStorage.getItem('shoppr_session');
    return session !== null && session !== undefined;
  }

  currentUser(): Observable<User> {
    return this._http.getOne(`${this.endpoint}/me`, User);
  }

  register(user: User): Observable<any> {
    return this._http.post(AuthEndpoints.REGISTER, user);
  }

  login(username: string, password: string): Observable<any> {
    const request = `username=${encodeURIComponent(username)}&password=${password}`;
    return this._http.authorize(AuthEndpoints.LOGIN, request);
  }
}
