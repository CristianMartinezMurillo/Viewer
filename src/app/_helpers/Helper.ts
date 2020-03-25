import { Observable, of } from 'rxjs';
import {Injectable} from "@angular/core";
import { catchError, map, tap } from 'rxjs/operators';
import * as ReceptionType from "../_constants/ReceptionType.constants";

@Injectable({
    providedIn: 'root'
})
export class Helper {
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    public handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.log(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    static getReceptionType(recipient): string {
        if ( recipient.TURNAR === true || recipient.TURNAR === 1) {
            return ReceptionType.TURNAR;
        }

        if (recipient.CC === true || recipient.CC === 1) {
            return ReceptionType.CC;
        }

        if (recipient.CCC === true || recipient.CCC === 1) {
            return ReceptionType.CCC;
        }

        return "";
    }
}
