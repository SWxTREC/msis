import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { cloneDeep, mean } from 'lodash';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { IAltitudeData, IAltitudeParameters, ISurfaceData, ISurfaceParameters } from 'src/app/models';
import {
    LatisService,
    ModelService
} from 'src/app/services';

export const DATEPICKER_FORMAT = {
    parse: {
        dateInput: 'YYYY-MM-DD'
    },
    display: {
        dateInput: 'YYYY-MM-DD',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'YYYY-MM-DD',
        monthYearA11yLabel: 'YYYY'
    }
};

@Component({
    selector: 'swt-visualizer',
    templateUrl: './visualizer.container.html',
    styleUrls: [ './visualizer.container.scss' ],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: DATEPICKER_FORMAT }
    ]
})
export class VisualizerComponent implements OnInit {
    invalidFieldMessage: string;
    invalidFields: string[];
    lastApDateWithValue: number = moment.utc().startOf('day').subtract(1, 'month').valueOf();
    modelForm = new FormGroup({
        date: new FormControl(moment.utc(this.lastApDateWithValue), [ Validators.required, Validators.min(0) ]),
        f107: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ]),
        f107a: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ]),
        apForm: new FormGroup({
            apDay: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ]),
            apCurrent: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ]),
            ap3: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ]),
            ap6: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ]),
            ap9: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ]),
            ap1233: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ]),
            ap3657: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ])
        })
    });
    surfaceForm = new FormGroup({
        altitude: new FormControl(200, [ Validators.min(0), Validators.max(1000) ])
    });
    altitudeForm = new FormGroup({
        latitude: new FormControl(0, [ Validators.min(-90), Validators.max(90) ]),
        longitude: new FormControl(0, [ Validators.min(-180), Validators.max(360) ])
    });
    variableForm = new FormControl('H');
    surfacePoints: ISurfaceData;
    altitudePoints: IAltitudeData;
    variables = [
        'AnomO',
        'Ar',
        'H',
        'He',
        'N',
        'N2',
        // 'NO', TODO: enable this when ready
        'O',
        'O2',
        'Mass',
        'Temperature'
    ];
    surfaceVariable = 'H';
    surfaceSvg: ISurfaceData;
    altitudeSvg: IAltitudeData;

    constructor(
        private modelService: ModelService,
        private latisService: LatisService
    ) {}

    ngOnInit() {
        // initial default date, currently the lastApDateWithValue
        // TODO: disable dates that don't have data, like the future or dates beyond laspApDateWithValue
        const momentDate = moment.utc(this.lastApDateWithValue);
        // figure out which f10.7 range to use, 54 days to past or 81 days centered on date, all must have values
        const f10DateRange: number[] = this.getF10Range( momentDate.valueOf() );
        const f10TimeQuery: string = this.latisService.getTimeQuery( f10DateRange[0], f10DateRange[1]);
        this.latisService.getF10Values( f10TimeQuery ).subscribe( (response: any) => {
            const data: number[] = response.penticton_radio_flux.data;
            this.setF107Values( data, momentDate );
            console.log('have f207Values');
        });
        this.latisService.getDailyAp( momentDate ).subscribe( (response: {[parameter: string]: { data: number[] }}) => {
            // daily Ap, or up to 8 values for the day, range: [ startOfDay, endOfDay ] then average
            const apValues = response.ap.data.map( values => values[1]);
            const averageDailyAp = mean(apValues);
            this.setDailyAp( averageDailyAp );
            console.log('have daily Ap');
        });
        this.latisService.getApValues( momentDate ).subscribe( (response: {[parameter: string]: { data: number[] }}) => {
            // current time (closest 3hr value) time<=momentDate&take_right(20)
            // NOTE: this will take the last 20 Ap values and put them into the model
            // if a value is missing, the next value is used, is this okay? The best we can do?
            const data = response.ap.data.map( values => values[1]);
            this.setApValues( data );
            console.log('have past Ap 20');
        });

        this.modelForm.controls.date.valueChanges.pipe(
                debounceTime(300)
            ).subscribe( (newMomentDate) => {
                console.log('date change');
                this.resetForm();
                const f10Range: number[] = this.getF10Range( newMomentDate.valueOf() );
                const timeQuery: string = this.latisService.getTimeQuery( f10Range[0], f10Range[1] );
                this.latisService.getF10Values(timeQuery).subscribe( (response: any) => {
                    const data: number[] = response.penticton_radio_flux.data;
                    this.setF107Values( data, newMomentDate );
                });
                this.latisService.getDailyAp( momentDate ).subscribe( (response: {[parameter: string]: { data: number[] }}) => {
                    // daily Ap, or up to 8 values for the day, range: [ startOfDay, endOfDay ] then average
                    const apValues = response.ap.data.map( values => values[1]);
                    const averageDailyAp = mean(apValues);
                    this.setDailyAp( averageDailyAp );
                    console.log('date change have daily Ap');
                });
                this.latisService.getApValues( momentDate ).subscribe( (response: {[parameter: string]: { data: number[] }}) => {
                    // current time (closest 3hr value) time<=momentDate&take_right(20)
                    // NOTE: this will take the last 20 Ap values and put them into the model
                    // if a value is missing, the next value is used, is this okay? The best we can do?
                    const data = response.ap.data.map( values => values[1]);
                    this.setApValues( data );
                    console.log('date change have past Ap 20');
                });
            });

        this.modelForm.valueChanges.pipe(
                debounceTime(300)
            ).subscribe( () => {
                console.log('model form value change, submit requests', this.modelForm.value);
                this.modelService.submitSurfaceRequest( this.getSurfaceParams() ).subscribe( (results: ISurfaceData) => {
                    this.surfacePoints = cloneDeep(results);
                });
                this.modelService.submitAltitudeRequest( this.getAltitudeParams() ).subscribe( (results: IAltitudeData) => {
                    this.altitudePoints = cloneDeep(results);
                });
            });
        this.surfaceForm.valueChanges.pipe(
                debounceTime(300)
            ).subscribe( () => {
                console.log('surface form value change, submit surface request');
                this.modelService.submitSurfaceRequest( this.getSurfaceParams() ).subscribe( (results: ISurfaceData) => {
                    this.surfacePoints = cloneDeep(results);
                });
            });
        this.altitudeForm.valueChanges.pipe(
                debounceTime(300)
            ).subscribe( () => {
                console.log('altitude form value change, submit altitude request');
                this.modelService.submitAltitudeRequest( this.getAltitudeParams() ).subscribe( (results: IAltitudeData) => {
                    this.altitudePoints = cloneDeep(results);
                });
            });
    }

    getF10Range( date: number ): number[] {
        const use54: boolean = Date.now() - date < (1000 * 60 * 60 * 24 * 41);
        const startOfDate: number = moment.utc(date).startOf('day').valueOf();
        const startRange: number = use54 ?  moment.utc(startOfDate).subtract(54, 'day').valueOf()
            : moment.utc(startOfDate).subtract(41, 'day').valueOf();
        const endRange: number = use54 ?  startOfDate : moment.utc(startOfDate).add(40, 'day').valueOf();
        return [ startRange, endRange ];
    }

    getAltitudeParams(): IAltitudeParameters {
        // fake an array of Ap values based on daily Ap, until the real values come through
        const apArray: number[] = this.modelForm.value.apForm.apCurrent ?
            Object.values(this.modelForm.value.apForm) : Array(7).fill(this.modelForm.value.apForm.apDay);
        console.log('apArray', apArray);
        return {
            ap: apArray,
            date: this.modelForm.value.date.format('YYYY-MM-DDTHH:mm'),
            f107: this.modelForm.value.f107 || 75,
            f107a: this.modelForm.value.f107a || 75,
            latitude: this.altitudeForm.value.latitude,
            longitude: this.altitudeForm.value.longitude
        };
    }

    getSurfaceParams(): ISurfaceParameters {
        // fake an array of Ap values based on daily Ap, until the real values come through
        const apArray: number[] = this.modelForm.value.apForm.apCurrent ?
            Object.values(this.modelForm.value.apForm) : Array(7).fill(this.modelForm.value.apForm.apDay);
        console.log('apArray', apArray);
        return {
            altitude: this.surfaceForm.value.altitude,
            ap: apArray,
            date: this.modelForm.value.date.format('YYYY-MM-DDTHH:mm'),
            f107: this.modelForm.value.f107 || 75,
            f107a: this.modelForm.value.f107a || 75
        };
    }

    getValidationMessage( control: string ): string {
        switch (control) {
        case 'date':
            if ( this.modelForm.controls.date.hasError('required') ) {
                return 'you must select a date';
            }
            break;
        case 'altitude':
            if ( this.surfaceForm.controls.altitude.hasError('min') ) {
                return 'altitude must be positive';
            }
            break;
        case 'latitude':
            if ( this.altitudeForm.controls.latitude.hasError('min') || this.altitudeForm.controls.latitude.hasError('max') ) {
                return 'must be between -90 and 90';
            }
            break;
        case 'longitude':
            if ( this.altitudeForm.controls.longitude.hasError('min') || this.altitudeForm.controls.longitude.hasError('max') ) {
                return 'must be between -180 and 360';
            }
            break;
        }
    }

    resetForm() {
        Object.keys(this.modelForm.controls).forEach( key => {
            if ( key !== 'date') {
                this.modelForm.controls[key].reset();
                this.modelForm.controls[key].disable();
            }
        });
    }

    setApValues( data: number[] ) {
        // current time
        // current time -3hr
        // current time -6hr
        // current time -9hr
        // average for 8 values from current time -12hr to current time -33hrs
        // average for 8 values from current time -36hr to current time -57hrs
        const data1233 = data.slice(4, 12);
        const data3657 = data.slice(12, 20);
        const average1233 = mean(data1233);
        const average3657 = mean(data3657);
        // set form values, there is probably a more succint way to do this…
        const apForm = this.modelForm.controls.apForm as FormGroup;
        apForm.controls.apCurrent.setValue(data[0]);
        apForm.controls.ap3.setValue(data[1]);
        apForm.controls.ap6.setValue(data[2]);
        apForm.controls.ap9.setValue(data[3]);
        apForm.controls.ap1233.setValue(+average1233.toFixed(2));
        apForm.controls.ap3657.setValue(+average3657.toFixed(2));
        apForm.enable();
    }

    setDailyAp( value: number ) {
        const apForm = this.modelForm.controls.apForm as FormGroup;
        apForm.controls.apDay.setValue(+value.toFixed(2));
        apForm.controls.apDay.enable();
    }

    setF107Values( data: number[], date: moment.Moment ) {
        // currently there are usually 3 values for each day, in future, we will switch to the one definitive value
        // until then, we need to choose a value, so we choose according to this logic:
        // the middle value in order of value, if there are 3 values,
        // the second value, highest value, if there are 2 values
        // the first value if there is 1 value
        // TODO: do we need a case for no values for the day?
        // group values by day
        const f107ByDay = data.reduce(  (aggregator, values)  => {
            const day = moment.utc(values[0]).startOf('day').valueOf();
            if ( aggregator[day] ) {
                aggregator[day].push(values[1]);
                aggregator[day].sort(); // when multiple values, sort to find median
            } else {
                aggregator[day] = [ values[1] ];
            }
            return aggregator;
        }, {});
        // get the previous day's value
        const startOfPreviousDay = date.subtract(1, 'day').startOf('day').valueOf();
        // median of the previous day, either the second value, or, if no second value, the first value
        const previousDayValue = f107ByDay[startOfPreviousDay][1] || f107ByDay[startOfPreviousDay][0];
        this.modelForm.controls.f107.setValue(+previousDayValue.toFixed(2));
        this.modelForm.controls.f107.enable();
        // get the values over the entire selection of days (54 or 82)
        // use the median (middle) value if it exists, otherwise, use the only value
        const arrayOfMedianValues = Object.values(f107ByDay).map( value => value[1] || value[0]);
        // get the average
        const averageValue = mean(arrayOfMedianValues);
        this.modelForm.controls.f107a.setValue(+averageValue.toFixed(2));
        this.modelForm.controls.f107a.enable();
    }

    updateLocation( coordinates: number[] ) {
        this.altitudeForm.controls.longitude.setValue(coordinates[0]);
        this.altitudeForm.controls.latitude.setValue(coordinates[1]);
    }
}
