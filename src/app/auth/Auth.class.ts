import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {InstanceMapper} from '../_mapper/Instance.mapper';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Helper } from '../_helpers/Helper';
import { environment } from "src/app/environments/environment";
import {LocalstorageService} from "../_services/Localstorage.service";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
    providedIn: 'root'
})
export class AuthClass{
    url = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private helper: Helper,
    ) {
    }

    /**
     * returns a token after authenticates in CSDocs
     * @returns {string}
     */
    public login(user: string, password: string): Observable <any> {
        const params = new HttpParams().set('email', user).set('password', password);

        return this.http.get<any>(this.url + '/auth/login', {
            params: params,
            responseType: 'json'
        });
    }

    public logout(){
        return this.http.post<any>(this.url + '/api/logout', httpOptions);
    }


}
