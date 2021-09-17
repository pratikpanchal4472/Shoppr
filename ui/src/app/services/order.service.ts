import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Order } from "../types/Entity.Types";
import { HttpService } from "./http.service";
import { ServiceBase } from "./service.base";

@Injectable({
  providedIn: 'root'
})
export class OrderService extends ServiceBase<Order> {
  constructor(public readonly _http: HttpService) {
    super('/api/orders', Order, _http);
  }

  findAll(): Observable<Order[]> {
    return this._http.get(`${this.endpoint}`, this.type);
  }
}
