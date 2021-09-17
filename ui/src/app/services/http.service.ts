import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassConstructor } from 'class-transformer';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Mapper } from '../utils/mapper';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly _snakcBar: MatSnackBar
  ) { }

  get headers() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
  }

  private extractErrorAndThrow(): (err: any, caught: Observable<any>) => Observable<any> {
    return (err: any) => {
      console.log(err);
      const message = err.error instanceof ErrorEvent
        ? `Error: ${err.error.message}` : this.getServerErrorMessage(err);
      this._snakcBar.open(message, 'x', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['bg-danger', 'bg-gradient']
      });
      return throwError(err);
    };
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 404: {
        return `Not Found: ${error.error.detail}`;
      }
      case 403: {
        return `Access Denied: ${error.error.detail}`;
      }
      case 500: {
        return `Internal Server Error: ${error.error.detail}`;
      }
      default: {
        return `${error.error.detail}`;
      }
    }
  }

  get<T>(url: string, responeType?: ClassConstructor<T>): Observable<T[]> {
    return this.httpClient.get(url, this.headers)
      .pipe(
        catchError(this.extractErrorAndThrow()),
        map(result => responeType ? Mapper.toModelList(responeType, result) : result),
      );
  }

  getOne<T>(url: string, responeType?: ClassConstructor<T>): Observable<T> {
    return this.httpClient.get(url, this.headers)
      .pipe(
        catchError(this.extractErrorAndThrow()),
        map(result => responeType ? Mapper.toModel(responeType, result) : result),
      );
  }

  post<T, V>(url: string, body: T, responeType?: ClassConstructor<V>): Observable<V> {
    return this.httpClient.post(url, body, this.headers)
      .pipe(
        catchError(this.extractErrorAndThrow()),
        map(result => responeType ? Mapper.toModel(responeType, result) : result),
      );
  }

  postRespondsWithList<T, V>(url: string, body: T, responeType?: ClassConstructor<V>): Observable<V[]> {
    return this.httpClient.post(url, body, this.headers)
      .pipe(
        catchError(this.extractErrorAndThrow()),
        map(result => responeType ? Mapper.toModelList(responeType, result) : result),
      );
  }

  upload(url: string, formData: FormData): Promise<any> {
    return this.httpClient.post(url, formData, this.headers)
      .pipe(catchError(this.extractErrorAndThrow())).toPromise();
  }

  authorize<T, V>(url: string, formData: T, responeType?: ClassConstructor<V>): Observable<V> {
    return this.httpClient.post(url, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        'accept': 'application/json'
      })
    })
      .pipe(
        catchError(this.extractErrorAndThrow()),
        map(result => responeType ? Mapper.toModel(responeType, result) : result)
      );
  }

  put<T, V>(url: string, body: T, responeType?: ClassConstructor<V>): Observable<V> {
    return this.httpClient.post(url, body, this.headers)
      .pipe(
        catchError(this.extractErrorAndThrow()),
        map(result => responeType ? Mapper.toModel(responeType, result) : result)
      );
  }

  patch<T, V>(url: string, body: T, responeType?: ClassConstructor<V>): Observable<V> {
    return this.httpClient.patch(url, body, this.headers)
      .pipe(
        catchError(this.extractErrorAndThrow()),
        map(result => responeType ? Mapper.toModel(responeType, result) : result)
      );
  }

  delete(url: string): Promise<any> {
    return this.httpClient.delete<any>(url, this.headers)
      .pipe(catchError(this.extractErrorAndThrow())).toPromise();
  }
}
