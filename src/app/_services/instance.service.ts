import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InstanceMapper} from '../_mapper/Instance.mapper';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from "src/app/environments/environment";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class InstanceService {
  constructor(private http: HttpClient) { }

    url = environment.apiUrl + '/api/instances';

  getInstances(): Observable <InstanceMapper[]> {
      return this.http.get<InstanceMapper[]>(this.url)
          .pipe(
              catchError(this.handleError('getInstances', []))
          );
      /**console.log('getInstances service');
      console.log(InstanceMuck);
      return of(InstanceMuck);*/
  }
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.log(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
