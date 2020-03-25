import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Helper } from "../_helpers/Helper";
import { environment } from "src/app/environments/environment";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
};

@Injectable({
    providedIn: 'root'
})
export class CatDataTypeService {

    constructor(private http: HttpClient, helper: Helper) { }

    url = environment.apiUrl + '/api/catDataType';

    /**
     *
     * @param {any} idCataDataType
     * @returns {Observable<any>}
     */
    public get(idCataDataType = null): Observable<any> {
        const url = (idCataDataType === null) ? this.url :  this.url + '/' + idCataDataType;
        return this.http.get(url);
    }
}
