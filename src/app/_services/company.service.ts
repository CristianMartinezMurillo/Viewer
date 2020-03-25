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
export class CompanyService {

    constructor(private http: HttpClient, helper: Helper) { }

    url = environment.apiUrl + '/api/company';

    /**
     *
     * @param {any} idUser
     * @returns {Observable<any>}
     */
    public get(idUser = null): Observable<any> {
        const url = (idUser === null) ? this.url :  this.url + '/' + idUser;
        return this.http.get(url);
    }

    /**
     *
     * @returns {Observable<any>}
     */
    public add(userData): Observable<any> {
        return this.http.post(this.url + '/add', userData );
    }

    /**
     *
     * @param {number} idUser
     * @returns {Observable<any>}
     */
    public update(idUser: number, userData): Observable<any> {
        return this.http.put(this.url + '/' + idUser, userData);
    }

    /**
     *
     * @param {number} idUser
     * @returns {Observable<any>}
     */
    public delete(idUser: number): Observable<any> {
        return this.http.delete(this.url + '/' + idUser);
    }

}
