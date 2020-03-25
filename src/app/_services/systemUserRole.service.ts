import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/app/environments/environment";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class SystemUserRoleService {

    constructor(
        private http: HttpClient,
        ) { }

    url = environment.apiUrl + '/api/systemUserRole';

    /**
     *
     * @param {any} idUser
     * @returns {Observable<any>}
     */
    get(): Observable<any> {
        const url = this.url;
        return this.http.get(url, httpOptions);
    }
}
