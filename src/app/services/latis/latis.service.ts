import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LatisService {
    mostRecentAp: BehaviorSubject<number> = new BehaviorSubject(undefined);

    constructor(private http: HttpClient) {
        // get the most recent ap value on app load
        this.http.get(`${environment.latisSwp}ap.jsond?last()`).subscribe( (response: any) => {
            this.mostRecentAp.next(response.ap.data[ 0 ][ 0 ]);
        });
    }

    getApValues( endDate: number ) {
        const startDate: number = endDate - ( 1000 * 60 * 60 * 24 * 5 );
        const timeQuery: string = this.getTimeQuery( startDate, endDate );
        // return the 20 values before the selected date
        return this.http.get(`${environment.latisSwp}ap.jsond?${ timeQuery }&take_right(20)`);
    }

    getDailyAp( date: moment.Moment ) {
        const startDate: number = moment.utc(date).startOf('day').valueOf();
        const endDate: number = moment.utc(date).endOf('day').valueOf();
        const timeQuery: string = this.getTimeQuery( startDate, endDate );
        // return all of the ap readings from selected date (up to 8 every 24 hours)
        return this.http.get(`${environment.latisSwp}ap.jsond?${ timeQuery }`);
    }

    getF10Values( timeQuery: string ) {
        return this.http.get(`${environment.latisLisird}penticton_radio_flux_nearest_noon.jsond?${timeQuery}`);
    }

    getTimeQuery(startTimestamp: number, endTimestamp: number): string {
        const start = moment.utc( startTimestamp ).format();
        const end = moment.utc( endTimestamp ).format();
        return `time>=${start}&time<=${end}`;
    }
}
