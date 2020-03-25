import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { LocalstorageService } from "./Localstorage.service";
import { environment } from "src/app/environments/environment";
import { Observable } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class TempSubjectPluginService {


  constructor(
      private http: HttpClient,
      private LocalStorage: LocalstorageService
  ) { }

  url = environment.apiUrl + '/api/plugin/subject';

  /**
   *
   * @param {any} idUser
   * @returns {Observable<any>}
   */
  getTemporalSubjects(processId) : Observable<any> {
    const url = this.url + '/request/' + processId;

    return this.http.get(url, httpOptions);
  }

  getPdf64(tempSubjectId) : Observable<any> {
    const url = this.url + '/base64/' + tempSubjectId;

    return this.http.get(url, httpOptions);
  }

}
