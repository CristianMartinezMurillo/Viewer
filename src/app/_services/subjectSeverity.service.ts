import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Helper } from "../_helpers/Helper";
import { environment } from "src/app/environments/environment";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class SubjectSeverityService {

    constructor(private http: HttpClient, helper: Helper) { }

    url = environment.apiUrl + '/api/subjectSeverity';

    public getAll(): Observable<any> {
        return this.http.get(this.url, httpOptions);
    }

}
