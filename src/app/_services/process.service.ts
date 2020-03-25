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
export class ProcessService {

    constructor(private http: HttpClient, helper: Helper) { }

    url = environment.apiUrl + '/api/process';

    /**
     *
     * @param id
     * @returns {Observable<any>}
     */
    getProcess(id = null): Observable<any> {
        let url = (id > 0) ? this.url + '/' + id : this.url;
        return this.http.get(url, httpOptions);
    }

    /**
     *
     * @param id
     * @returns {Observable<any>}
     */
    getProcessMetadata(id): Observable<any> {
        let url = this.url + '/' + id + '/metadata';
        return this.http.get(url, httpOptions);
    }


    /**
     *
     * @returns {Observable<any>}
     */
    public buildProcess(data): Observable<any> {
        return this.http.post(this.url + '/build', data );
    }

    /**
     *
     * @returns {Observable<any>}
     */
    public addMetadata(id, data): Observable<any> {
        return this.http.post(this.url + '/' + id + '/metadata/add', data );
    }

    //
    // /**
    //  *
    //  * @param {number} idUser
    //  * @returns {Observable<any>}
    //  */
    // public updateUser(idUser: number, userData): Observable<any> {
    //     return this.http.put(this.userUrl + '/' + idUser, userData);
    // }
    //
    /**
     *
     * @param {number} id
     * @returns {Observable<any>}
     */
    public delete(id: number): Observable<any> {
        return this.http.delete(this.url + '/' + id , httpOptions);
    }

    /**
     *
     * @param {number} id
     * @returns {Observable<any>}
     */
    public deleteMetadata(idProcess: number, idMetadata: number): Observable<any> {
        return this.http.delete(this.url + '/' + idProcess + '/metadata/' + idMetadata , httpOptions);
    }

    /**
     *
     * @param {number} id
     * @returns {Observable<any>}
     */
    public updateMetadata(idProcess: number, idMetadata: number, data): Observable<any> {
        return this.http.put(this.url + '/' + idProcess + '/metadata/' + idMetadata , data);
    }

    public getProcessesByCompany(idCompany = null){
        let url = (idCompany > 0) ? this.url + '/byCompany/' + idCompany : this.url + '/byCompany';
        return this.http.post( url , []);
    }

    public getProcessesWithMetadata() {
        return this.http.get(this.url + '/processesWithMetadata', httpOptions);
    }
}
