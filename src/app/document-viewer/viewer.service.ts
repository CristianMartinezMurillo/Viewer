import {EventEmitter, Injectable, Output} from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/app/environments/environment";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class ViewerService {
  @Output() open: EventEmitter<boolean> = new EventEmitter();

  constructor(
      private http: HttpClient,
  ) { }

  url = environment.apiUrl + '/api/viewer';

  openDocument(repositoryType, document) {
    // console.log("openDocument");
    // console.log(document);
    document = {...document, repositoryType: repositoryType}

    this.open.emit(document);
  }

  getPdf64(documentId, repositoryType) : Observable<any> {
    return this.http.get(this.url + '/document/pdf/base64/' + documentId + '/' + repositoryType );
  }
}
