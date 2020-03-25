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
export class ForgotPasswordService {

  constructor(private http: HttpClient, helper: Helper) { }

  url = environment.apiUrl + '/api/';

  public sendMail(data) {
    return this.http.post(this.url + 'forgotPassword/sendEmailLink' , data);
  }

  public resetPassword(data) {
    return this.http.post(this.url + 'forgotPassword/reset' , data);
  }
}
