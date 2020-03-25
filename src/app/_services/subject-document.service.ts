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
export class SubjectDocumentService {
    constructor(private http: HttpClient, helper: Helper) { }

    url = environment.apiUrl + '/api/subjectDocument';

    /**
     *
     * @returns {Observable<any>}
     */
    public download(documentIds): Observable<any> {
        return this.http.post(this.url + "/download" , documentIds, {
            responseType: "blob",
            headers: new HttpHeaders().append("Content-Type", "application/json")
        } );
    }
}
