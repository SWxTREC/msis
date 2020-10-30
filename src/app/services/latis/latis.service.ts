import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LatisService {
    lastApDate: number;

    constructor(private http: HttpClient) {
        this.getLastAp().subscribe( (response: { [dataset: string]: { data: number[]}}) => {
            this.lastApDate = response.ap.data[0];
            console.log('service found last date', response.ap.data);
        });
    }

    getApValues( date: moment.Moment ) {
        // get the nearest Ap value in the past 3 hours, then the previous 20 values
        const endDate: number = moment.utc(date).valueOf();
        // const startDate: number = moment.utc(date).subtract( 60, 'hours').valueOf();
        // const timeQuery: string = this.getTimeQuery( startDate, endDate );
        // console.log('timeQuery closest', timeQuery);
        return this.http.get(`${environment.latisSwp}ap.jsond?time<=${ endDate }&take_right(20)`);
    }

    getDailyAp( date: moment.Moment ) {
        const startDate: number = moment.utc(date).startOf('day').valueOf();
        const endDate: number = moment.utc(date).endOf('day').valueOf();
        const timeQuery: string = this.getTimeQuery( startDate, endDate );
        console.log('timeQuery day', timeQuery );
        // get all of the Ap readings from today (up to 8 every 24 hours)
        return this.http.get(`${environment.latisSwp}ap.jsond?${ timeQuery }`);
    }

    getLastAp() {
        // get all of the Ap readings from today (up to 8 every 24 hours)
        return this.http.get(`${environment.latisSwp}ap.jsond?last()`);
    }

    getF10Values( timeQuery: string ) {
        // we need
        // the average (81 or 54 days, depending how close to today)
        // the previous day's value

        return this.http.get(`${environment.latisLisird}penticton_radio_flux.jsond?${timeQuery}`);
    }
    getTimeQuery(startTimestamp: number, endTimestamp: number): string {
        const start = moment.utc( startTimestamp ).format();
        const end = moment.utc( endTimestamp ).format();
        return `time>=${start}&time<=${end}`;
    }





}
