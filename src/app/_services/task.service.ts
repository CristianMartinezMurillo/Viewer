import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/app/environments/environment";
import { LocalstorageService } from "./Localstorage.service";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
      private http: HttpClient,
      private LocalStorage: LocalstorageService
  ) { }

  url = environment.apiUrl + '/api/task';

  /**
   *
   * @param {any} idUser
   * @returns {Observable<any>}
   */
  assignUser(data) : Observable<any> {
    const url = this.url + '/assignUser';

    return this.http.post(url, data);
  }

  addAnswer(data) : Observable<any> {
    const url = this.url + '/addAnswer';

    return this.http.post(url, data);
  }

  /**
   * Mark a task as completed
   * @param taskId
   */
  markAsCompleted(taskId) {
    const url = this.url + '/markAsCompleted/' + taskId;

    return this.http.post(url, httpOptions);
  }
  /**
   * reopen task
   * @param taskId
   */
  reopenTask(taskId) {
    const url = this.url + '/reopenTask/' + taskId;

    return this.http.post(url, httpOptions);
  }
}
