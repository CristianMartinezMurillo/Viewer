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
export class OrganizationalUnitService {
    url = environment.apiUrl + '/api/organizationalUnit';

    constructor(private http: HttpClient, helper: Helper) { }

    /**
     *
     * @param {any} id
     * @returns {Observable<any>}
     */
    public get(id = null): Observable<any> {
        const url = (id === null) ? this.url :  this.url + '/' + id;
        return this.http.get(url);
    }

    /**
     *
     * @returns {Observable<any>}
     */
    public getWithCompanies(): Observable<any> {
        const url = this.url + '/withCompanies';
        return this.http.get(url);
    }

    /**
     *
     * @returns {Observable<any>}
     */
    public add(data): Observable<any> {
        return this.http.post(this.url , data );
    }

    /**
     *
     * @param {number} id
     * @returns {Observable<any>}
     */
    public update(id: number, userData): Observable<any> {
        return this.http.put(this.url + '/' + id, userData);
    }

    /**
     *
     * @param {number} id
     * @returns {Observable<any>}
     */
    public delete(id: number): Observable<any> {
        return this.http.delete(this.url + '/' + id);
    }

    /**
     *
     * @param {number} id
     * @param data
     * @returns {Observable<any>}
     */
    public addMembers(id: number, data): Observable<any> {
        return this.http.post(this.url + '/' + id + '/addMembers', data);
    }

    /**
     *
     * @returns {Observable<any>}
     */
    public usersWithDifferentOrganizationalUnit(organizationalUnitId): Observable<any> {
        return this.http.post(this.url + '/usersWithDifferentOrganizationalUnit/' + organizationalUnitId, []);
    }

    /**
     *
     * @param {any} id
     * @returns {Observable<any>}
     */
    public getMembersOfOrganizationalUnit(id = null): Observable<any> {
        const url = this.url + '/'+ id + '/members';
        return this.http.get(url);
    }

    /**
     *
     * @param {number} id
     * @param data
     * @returns {Observable<any>}
     */
    public deleteMeber(id: number, idUser): Observable<any> {
        return this.http.delete(this.url + '/' + id + '/member/' + idUser);
    }

    /**
     *
     * @param id
     * @param idUser
     * @param data
     */
    public updateMemberRole(id: number, idUser, data): Observable<any> {
        return this.http.put(this.url + '/' + id + '/member/' + idUser + '/role', data);
    }

    /**
     *
     * @returns {Observable<any>}
     */
    public getOrganizationalUnitAndUsers(organizationalUnitId): Observable<any> {
        let url = this.url + '/organizationalUnitAndUsers/' + organizationalUnitId;
        return this.http.get(url);
    }

    /**
     *
     * @param id
     */
    public getExternalRecipients(id: number): Observable<any> {
        return this.http.get(this.url +'/getExternalRecipients/' + id);
    }
}
