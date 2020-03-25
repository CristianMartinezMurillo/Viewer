import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Helper } from "../_helpers/Helper";
import { environment } from "src/app/environments/environment";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class NewSubjectService {
    url = environment.apiUrl + '/api/subject/';

    constructor(private http: HttpClient, helper: Helper) { }

    /**
     *
     * @returns {Observable<any>}
     */
    public request(processId, organizationalUnitId, data): Observable<any> {
        return this.http.post(this.url + 'request/' + processId + '/' + organizationalUnitId, data );
    }
    //
    // /**
    //  *
    //  * @param {number} idUser
    //  * @returns {Observable<any>}
    //  */
    // public update(idUser: number, userData): Observable<any> {
    //     return this.http.put(this.url + '/' + idUser, userData);
    // }
    //
    // /**
    //  *
    //  * @param {number} idUser
    //  * @returns {Observable<any>}
    //  */
    // public delete(idUser: number): Observable<any> {
    //     return this.http.delete(this.url + '/' + idUser);
    // }
}
