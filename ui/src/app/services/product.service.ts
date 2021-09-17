import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../types/Entity.Types";
import { HttpService } from "./http.service";
import { ServiceBase } from "./service.base";


@Injectable({
  providedIn: 'root'
})
export class ProductService extends ServiceBase<Product> {
  constructor(public readonly _http: HttpService) {
    super('/api/products', Product, _http);
  }

  getProductTypes(): Observable<string[]> {
    return this._http.get(`${this.endpoint}/types`);
  }
}
