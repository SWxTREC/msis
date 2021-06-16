import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { cloneDeep, mean } from 'lodash';
import * as moment from 'moment';
import { debounceTime, every } from 'rxjs/operators';
import { IAltitudeData, IAltitudeParameters, ISurfaceData, ISurfaceParameters } from 'src/app/models';
import {
    LatisService,
    ModelService
} from 'src/app/services';

import { SwtSurfacePlotComponent } from './components';

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
    @ViewChild('surfacePlot') surfacePlot: SwtSurfacePlotComponent;

    // extent of ap and penticton data
    invalidFieldMessage: string;
    invalidFields: string[];
    lastApDateWithValue: number;
    dataExtent: number[];
    modelForm = new FormGroup({
        dateTime: new FormControl(undefined, [ Validators.required ]),
        f107: new FormControl({ value: 75, disabled: true }, [ Validators.required, Validators.min(0) ]),
        f107a: new FormControl({ value: 75, disabled: true }, [ Validators.required, Validators.min(0) ]),
        apForm: new FormGroup({
            apDay: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ]),
            apCurrent: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ]),
            ap3: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ]),
            ap6: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ]),
            ap9: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ]),
            ap12T33: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ]),
            ap36T57: new FormControl({ value: undefined, disabled: true }, [ Validators.required, Validators.min(0) ])
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
    ) {
        this.latisService.mostRecentAp.subscribe( (timestamp: number) => {
            this.lastApDateWithValue = timestamp;
            this.dataExtent = [ moment.utc('1947-01-01').valueOf(), moment.utc(this.lastApDateWithValue).valueOf() ];
            this.modelForm.controls.dateTime.setValue(this.dataExtent[1]);
        });

    }

    ngOnInit() {
        const initialTimestamp: number = this.dataExtent[1];
        // figure out which f10.7 range to use, 54 days to past or 81 days centered on date, all must have values
        const f10DateRange: number[] = this.getF10Range( initialTimestamp );
        const f10TimeQuery: string = this.latisService.getTimeQuery( f10DateRange[0], f10DateRange[1]);
        this.latisService.getF10Values( f10TimeQuery ).subscribe( (response: any) => {
            const data: number[] = response.penticton_radio_flux_nearest_noon.data;
            this.setF107Values( data, initialTimestamp );
        });
        this.latisService.getDailyAp( moment.utc(initialTimestamp) ).subscribe( (response: {[parameter: string]: { data: number[] }}) => {
            // daily Ap, or up to 8 values for the day, range: [ startOfDay, endOfDay ] then average
            const apValues = response.ap.data.map( values => values[1]);
            const averageDailyAp = apValues.length ? mean( apValues ) : undefined;
            if ( averageDailyAp ) {
                this.setDailyAp( averageDailyAp );
            }
        });
        this.latisService.getApValues( this.dataExtent[1] ).subscribe( (response: {[parameter: string]: { data: number[] }}) => {
            // current time (closest 3hr value) time<=date&take_right(20).reverse();
            // NOTE: this will take the last 20 Ap values and put them into the model
            // if a value is missing, the next value is used, is this okay? The best we can do?
            const data = response.ap.data.map( values => values[1]).reverse();
            this.setApValues( data );
        });

        this.modelForm.controls.dateTime.valueChanges.pipe(
                debounceTime(300)
            ).subscribe( (newTimestamp: number) => {
                this.resetForm();
                const f10Range: number[] = this.getF10Range( newTimestamp );
                const timeQuery: string = this.latisService.getTimeQuery( f10Range[0], f10Range[1] );
                this.latisService.getDailyAp( moment.utc(newTimestamp) )
                .subscribe( (response: {[parameter: string]: { data: number[] }}) => {
                    // daily Ap, or up to 8 values for the day, range: [ startOfDay, endOfDay ] then average
                    const apValues = response.ap.data.map( values => values[1]);
                    const averageDailyAp = apValues.length ? mean( apValues ) : undefined;
                    if ( averageDailyAp ) {
                        this.setDailyAp( averageDailyAp );
                    }
                });
                this.latisService.getApValues( newTimestamp )
                .subscribe( (response: {[parameter: string]: { data: number[] }}) => {
                    // current time (closest 3hr value) time<=momentDate&take_right(20)
                    // NOTE: this will take the last 20 Ap values and put them into the model
                    // if a value is missing, the next value is used, is this okay? The best we can do?
                    const data = response.ap.data.map( values => values[1]).reverse();
                    this.setApValues( data );
                });
                this.latisService.getF10Values(timeQuery).subscribe( (response: any) => {
                    const data: number[] = response.penticton_radio_flux_nearest_noon.data;
                    this.setF107Values( data, newTimestamp );
                });
            });

        this.modelForm.valueChanges.pipe(
            // if no default ap value, when every ap value has been defined, submit the request
            every( form => {
                if ( form.apForm ) {
                    return Object.values(form.apForm).some( value => value === undefined);
                } else {
                    return true;
                }
            }),
            debounceTime(300)
        ).subscribe( () => {
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
            this.modelService.submitSurfaceRequest( this.getSurfaceParams() ).subscribe( (results: ISurfaceData) => {
                this.surfacePoints = cloneDeep(results);
            });
        });
        this.altitudeForm.valueChanges.pipe(
            debounceTime(300)
        ).subscribe( () => {
            this.modelService.submitAltitudeRequest( this.getAltitudeParams() ).subscribe( (results: IAltitudeData) => {
                this.altitudePoints = cloneDeep(results);
            });
        });
    }

    getF10Range( date: number ): number[] {
        // if we are within 41 days of today's date, then only use the most recent 54 days
        // otherwise: use 41 days before to 40 days after (81 total days)
        // moment addition and substraction mutates the variable, so clone first
        const use54: boolean = Date.now() - date < (1000 * 60 * 60 * 24 * 41);
        const startOfDate: moment.Moment = moment.utc(date).clone().startOf('day');
        const date54: number = startOfDate.clone().subtract(54, 'day').valueOf();
        const date81Start: number = startOfDate.clone().subtract(41, 'day').valueOf();
        const date81End: number = startOfDate.clone().add(40, 'day').valueOf();
        const startRange: number = use54 ?  date54
            : date81Start;
        const endRange: number = use54 ?  date : date81End;
        return [ startRange, endRange ];
    }

    getAltitudeParams(): IAltitudeParameters {
        return {
            ap: Object.values(this.modelForm.value.apForm),
            date: moment.utc(this.modelForm.value.dateTime).format('YYYY-MM-DDTHH:mm'),
            f107: this.modelForm.controls.f107.value,
            f107a: this.modelForm.controls.f107.value,
            latitude: this.altitudeForm.value.latitude,
            longitude: this.altitudeForm.value.longitude
        };
    }

    getSurfaceParams(): ISurfaceParameters {
        return {
            altitude: this.surfaceForm.value.altitude,
            ap: Object.values(this.modelForm.value.apForm),
            date: moment.utc(this.modelForm.value.dateTime).format('YYYY-MM-DDTHH:mm'),
            f107: this.modelForm.controls.f107.value,
            f107a: this.modelForm.controls.f107.value
        };
    }

    getValidationMessage( control: string ): string {
        switch (control) {
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
        // keep the values as temporary values, but disable until they are replaced with real values??
        Object.keys(this.modelForm.controls).forEach( key => {
            if ( key !== 'dateTime') {
                this.modelForm.controls[key].disable();
            }
        });
    }

    setApValues( data: number[] ) {
        // current time
        // current time -3hr
        // current time -6hr
        // current time -9hr
        // average for 8 values from current time -12hr to current time -33hrs, don't allow NaN
        // average for 8 values from current time -36hr to current time -57hrs, don't allow NaN
        const data12T33 = data.slice(4, 12);
        const data36T57 = data.slice(12, 20);
        const average12T33 = data12T33.length ? mean(data12T33) : undefined;
        const average36T57 = data36T57.length ? mean(data36T57) : undefined;
        const apForm = this.modelForm.controls.apForm as FormGroup;
        apForm.patchValue({
            apCurrent: data[0],
            ap3: data[1],
            ap6: data[2],
            ap9: data[3],
            ap12T33: +average12T33 ? +average12T33.toFixed(2) : undefined,
            ap36T57: +average36T57 ? +average36T57.toFixed(2) : undefined
        });
        apForm.enable();
    }

    setDailyAp( value: number ) {
        const apForm: FormGroup = this.modelForm.controls.apForm as FormGroup;
        apForm.controls.apDay.setValue(+value.toFixed(2));
        // if the rest of the ap values have yet to come in, show the temporary values
        // in the request, but do not enable the form controls
        if ( apForm.controls.apCurrent.disabled ) {
            apForm.patchValue({
                apCurrent: value.toFixed(2),
                ap3: value.toFixed(2),
                ap6: value.toFixed(2),
                ap9: value.toFixed(2),
                ap12T33: value.toFixed(2),
                ap36T57: value.toFixed(2)
            });
        }
        apForm.controls.apDay.enable();
    }

    setF107Values( data: number[], timestamp: number ) {
        // group values by day
        const f107ByDay = data.reduce(  (aggregator, values)  => {
            const day = moment.utc(values[0]).startOf('day').valueOf();
            if ( aggregator[day] ) {
                aggregator[day].push(values[1]);
            } else {
                aggregator[day] =  values[1];
            }
            return aggregator;
        }, {});
        // get the previous day's value
        const startOfPreviousDay = moment.utc(timestamp).clone().subtract(1, 'day').startOf('day').valueOf();
        const previousDayValue = f107ByDay[startOfPreviousDay];
        this.modelForm.controls.f107.setValue(+previousDayValue.toFixed(2));
        this.modelForm.controls.f107.enable();
        // get the values over the entire selection of days (54 or 82)
        const arrayOfValues = Object.keys(f107ByDay).map( key => {
            return f107ByDay[key];
        });
        // get the average
        const averageValue = mean(arrayOfValues);
        this.modelForm.controls.f107a.setValue(+averageValue.toFixed(2));
        this.modelForm.controls.f107a.enable();
    }

    downloadSvg( element: any ) {
        const nativeElement = this[element].elRef.nativeElement;
        const altitudeBox = nativeElement.querySelector('#altitude-box');
        altitudeBox.style.display = 'none';
        const serializer = new XMLSerializer;
        const serializedSvg = serializer.serializeToString(nativeElement);
        const blob = new Blob([ serializedSvg ], { type: 'image/svg+xml' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'swxtrec-msis-surface-plot-' + moment.utc(this.modelForm.value.date).format('YYYY-MM-DD') + '.svg';
        anchor.target = '_self';
        anchor.click();
        window.URL.revokeObjectURL(url);
        anchor.remove();
        altitudeBox.style.display = 'unset';
    }

    updateLocation( coordinates: number[] ) {
        this.altitudeForm.controls.longitude.setValue(coordinates[0]);
        this.altitudeForm.controls.latitude.setValue(coordinates[1]);
    }
}
