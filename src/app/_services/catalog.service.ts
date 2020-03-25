import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Helper } from "../_helpers/Helper";
import { environment } from "src/app/environments/environment";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

    constructor(private http: HttpClient, helper: Helper) { }

    url = environment.apiUrl + '/api/catalog';

    public add(idMetadata: number, data): Observable<any> {
        return this.http.post(this.url + '/' + idMetadata , data);
    }

    public delete( idOption: number): Observable<any> {
        return this.http.delete(this.url + '/' + idOption , httpOptions);
    }

    public update(idOption: number, data): Observable<any> {
        return this.http.put(this.url + '/' + idOption , data);
    }
}
