import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Moment } from "moment";
import { isNullOrUndefined, isObject } from "util";

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor() { }

    weekend = [0, 6];
    startWeek = 1;

    /**
     * return the next labor day
     * @param days
     */
    getNextWorkDay(days: number, fromDate: Moment): string {
        if(isNullOrUndefined(fromDate))
            fromDate = moment();

        const format = 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ';
        const fromDateString = fromDate.format(format);


        for (let cont = 1; cont <= days; cont++) {
            const snapdate = moment(fromDateString);
            const d = snapdate.add(cont, 'day');

            if (d.day() === 0 || d.day() === 6) {
                days++;
            } else {
                if(cont === days) {
                    return d.format(format);
                }
            }
        }
    }

    isLaborDay (d: Moment): boolean  {
        const day = d.day();

        return !this.weekend.some(day_ => day_ === day);
    }
}
