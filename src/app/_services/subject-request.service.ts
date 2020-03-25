import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Helper } from "../_helpers/Helper";
import { environment } from "src/app/environments/environment";
import {SubjectRequestModel} from "../_models/SubjectRequest.model";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
};
@Injectable({
  providedIn: 'root'
})
export class SubjectRequestService {

    constructor(private http: HttpClient, helper: Helper) {
    }

    url = environment.apiUrl + '/api/subjectRequest';

    /**
     *
     * @returns {Observable<any>}
     */
    public subjectRequest(addresseeId): Observable<any> {
        return this.http.get(this.url + '/' + addresseeId);
    }

    /**
     *
     * @param subjectRequestId
     */
    public getExternalSubjectRequest(subjectRequestId): Observable<any> {
        return this.http.get(this.url + '/external/' + subjectRequestId);
    }

    /**
     *
     * @param subjectRequestId
     */
    public getSubjectFlow(subjectRequestId): Observable<any> {
        return this.http.get(this.url + '/subjectFlow/' + subjectRequestId);
    }
}
