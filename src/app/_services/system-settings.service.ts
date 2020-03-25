import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LocalstorageService} from "./Localstorage.service";
import {environment} from "src/app/environments/environment";
import {Observable} from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class SystemSettingsService {

  constructor(
      private http: HttpClient,
      private LocalStorage: LocalstorageService
  ) { }

  url = environment.apiUrl + '/api/systemSettings';

  /**
   *
   * @param {any} idUser
   * @returns {Observable<any>}
   */
  global(idUser = null): Observable<any> {
    const url = this.url + '/login';

    return this.http.get(url, httpOptions);
  }

  setLoginSettings(loginSettings) {
    this.LocalStorage.storeJsonItem("loginSettings", loginSettings);
  }

  getLoginSettings() {
    return this.LocalStorage.getJsonItem("loginSettings");
  }

  modifyTemplate(params): Observable<any> {
    const url = this.url + '/emailTemplates/modifyTemplate';

    return this.http.put(url, params);
  }

  getSystemSettings() {
    const url = this.url;

    return this.http.get(url, httpOptions);
  }

  setGlobalSettings(globalSettings) {
    this.LocalStorage.storeJsonItem("globalSettings", globalSettings);
  }

  getGlobalSettings() {
    return this.LocalStorage.getJsonItem("globalSettings");
  }

}
