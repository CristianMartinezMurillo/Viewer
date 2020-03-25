import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Helper } from "../_helpers/Helper";
import { environment } from "src/app/environments/environment";
import {UsersService} from "./users.service";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class RolesService {

    constructor(private http: HttpClient, helper: Helper) { }

    url = environment.apiUrl + '/api/roles';

    /**
     *
     * @param {any} id
     * @returns {Observable<any>}
     */
    getRoles(id = null): Observable<any> {
        const url = (id === null) ? this.url :  this.url + '/' + id;
        return this.http.get(url, httpOptions);
    }

    /**
     *
     * @returns {Observable<any>}
     */
    public add(userData): Observable<any> {
        return this.http.post(this.url , userData );
    }

    /**
     *
     * @param {number} id
     * @returns {Observable<any>}
     */
    public update(id: number, data): Observable<any> {
        return this.http.put(this.url + '/' + id, data);
    }

    /**
     *
     * @param {number} idUser
     * @returns {Observable<any>}
     */
    public delete(idUser: number): Observable<any> {
        return this.http.delete(this.url + '/' + idUser, httpOptions);
    }
}
