import { EventEmitter, Injectable, Output } from '@angular/core';
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
export class MailboxService {

    constructor(private http: HttpClient, helper: Helper) { }

    url = environment.apiUrl + '/api/mailbox';

    /**
     *
     * @param {any} id
     * @returns {Observable<any>}
     */
    getMailbox(mailboxType, subjectType = '', organizationalUnitId, params = null): Observable<any> {
        const url = this.url + '/' + mailboxType + '/' + subjectType + '/' + organizationalUnitId;

        if(params === null || params === undefined)
            return this.http.get(url, httpOptions);
        else{
            httpOptions['params'] = params;

            return this.http.get(url, httpOptions);
        }
    }

    /**
     *
     * @param mailboxType
     * @param mailboxStatus
     * @param organizationalUnitId
     * @param params
     */
    getExternalMailbox(mailboxType, mailboxStatus, organizationalUnitId, params = null): Observable<any> {
        const url = (mailboxType !== null) ? this.url + '/external/' + mailboxType + '/' + mailboxStatus + '/' + organizationalUnitId
            : this.url  + '/external/' + mailboxStatus + '/' + organizationalUnitId

        if(params === null || params === undefined)
            return this.http.get(url, httpOptions);
        else{
            httpOptions['params'] = params;

            return this.http.get(url, httpOptions);
        }
    }


    historico(organizationalUnitId) {
        const url = this.url + '/historico/' + organizationalUnitId;
        return this.http.get(url, httpOptions);
    }

    externalHistorico(organizationalUnitId) {
        const url = this.url + '/external/historico/' + organizationalUnitId;
        return this.http.get(url, httpOptions);
    }

    unreadMailbox() {
        return this.http.get(this.url + '/unread', httpOptions);
    }
}
