import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ItbookService {
  private apiURL:string = "https://api.itbook.store/1.0";

  constructor(private http: HttpClient) { }

  searchByName(search:any, page:any): Observable<HttpResponse <any>> {
    let API_URL = `${this.apiURL}/search/${search}/${page}`;
    return this.http.get<any>(API_URL, {observe: 'response'});
  }
}
