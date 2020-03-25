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
export class SubjectService {

    constructor(private http: HttpClient, helper: Helper) { }

    url = environment.apiUrl + '/api/subject';

    /**
     *
     * @returns {Observable<any>}
     */
    public add(userData): Observable<any> {
        return this.http.post(this.url , userData );
    }

    /**
     *
     * @param answer
     */
    public addAnswer(answer, recipientId): Observable<any> {
        return this.http.post(this.url + '/addAnswer/' + recipientId , answer );
    }

    /**
     *
     * @param id
     */
    public finalizarAsunto(id) : Observable<any> {
        return this.http.post(this.url + '/finalizarAsunto/' + id, httpOptions);
    }

    /**
     *
     * @param subjectRequestId
     * @param status
     */
    public marcarResuelto(recipientId: number, status : number) {
        return this.http.post(this.url + '/resolver/' + recipientId + '/' + status, httpOptions);
    }

    /**
     *
     * @param subjectRequestId
     * @param data
     */
    public avanzar(subjectRequestId: number, organizationalUnitId: number, data ) {
        return this.http.post(this.url + '/avanzar/' + subjectRequestId + '/' + organizationalUnitId, data);
    }

    /**
     *
     * @param recipientId
     */
    public rejectSubject(recipientId: number ): Observable<any> {
        return this.http.post(this.url + '/reject/' + recipientId, httpOptions);
    }

    /**
     *
     * @param recipientId
     * @param data
     */
    public addSubjectAttachments(recipientId: number, data): Observable<any> {
        return this.http.post(this.url + '/attachments/' + recipientId, data);
    }

    /**
     *
     * @param subjectRequestId
     */
    public cancel(recipientId): Observable<any> {
        return this.http.post(this.url + '/cancel/' + recipientId, httpOptions);
    }

}
