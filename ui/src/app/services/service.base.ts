import { ClassConstructor } from "class-transformer";
import { Observable } from "rxjs";
import { Mapper } from "../utils/mapper";
import { HttpService } from "./http.service";

export abstract class ServiceBase<T> {
  constructor(
    public readonly endpoint: string,
    public readonly type: ClassConstructor<T>,
    public readonly _http: HttpService,
  ) { }

  paginate(page: number = 1, size: number = 20, filter: string = '', order: string = ''): Observable<any> {
    return this._http.get(`${this.endpoint}/paginate?page=${page}&size=${size}&filter_by=${filter}&order_by=${order}`);
  }

  findById(id: string): Observable<T> {
    return this._http.getOne(`${this.endpoint}/${id}`, this.type);
  }

  save(request: T): Observable<T> {
    return this._http.post(`${this.endpoint}`, Mapper.toApi(request), this.type);
  }

  delete(id: string): Promise<T> {
    return this._http.delete(`${this.endpoint}/${id}`);
  }
}
