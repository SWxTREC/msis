import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import * as d3 from 'd3';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { IAltitudeData, IAltitudeParameters, ISurfaceData, ISurfaceParameters } from 'src/app/models';
import { ModelService } from 'src/app/services';

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
    modelForm = new FormGroup({
        date: new FormControl(moment.utc(), [ Validators.required, Validators.min(0) ]),
        // default to penticton around 100.1 for now
        f107: new FormControl(100.1, [ Validators.required, Validators.min(0) ]),
        f107a: new FormControl(99.8, [ Validators.required, Validators.min(0) ]),
        // default to ap of 48 for now
        ap: new FormControl(48, [ Validators.required, Validators.min(0) ])
    });
    surfaceForm = new FormGroup({
        altitude: new FormControl(200, [ Validators.min(0), Validators.max(1000) ])
    });
    altitudeForm = new FormGroup({
        latitude: new FormControl(0, [ Validators.min(-90), Validators.max(90) ]),
        longitude: new FormControl(0, [ Validators.min(-180), Validators.max(360) ])
    });
    surfaceData: ISurfaceData;
    altitudeData: IAltitudeData;
    variables = [
        'AnomO',
        'Ar',
        'H',
        'He',
        'Mass',
        'N',
        'N2',
        'N0',
        'O',
        'O2',
        'Temperature'
    ];
    surfacePoints: any;
    altitudePoints: any;
    surfaceVariable = 'H';
    surfaceSvg: ISurfaceData;
    altitudeSvg: IAltitudeData;
    variable = 'H';
    // path;
    // TODO: Make these responsive or put a few breakpoints for good sizes in
    // margin = 40;
    // surfaceWidth = 800 - (this.margin * 2);
    // surfaceHeight = 600 - (this.margin * 2);

    constructor(
        private modelService: ModelService
    ) {
        const surfacePointsUrl =
            `https://gist.githubusercontent.com/greglucas
            /c00879a8463fa1a931caca2a5bc4b713/raw/a2e789985ad14bd5b3dc8e090914884a58b82ff5/surface_points.json`;
        d3.json(surfacePointsUrl).then( data =>  {
            console.log('surfacePoints', data);
            this.surfacePoints = data;
        });
        const altitudePointsUrl =
            `https://gist.githubusercontent.com/greglucas
            /c00879a8463fa1a931caca2a5bc4b713/raw/a2e789985ad14bd5b3dc8e090914884a58b82ff5/altitude_test.json`;
        d3.json(altitudePointsUrl).then( data =>  {
            console.log('altitudePoints', data);
            this.altitudePoints = data;
        });
    }

    ngOnInit() {
        // create the SVGs and draw the initial default plots
        // this.createSurfaceSvg();
        // this.createAltitudeSvg();
        // Moving onto the actual data now
        // const _this = this;
        // this.surfacePoints.then(function(data) {
        //     return _this.drawSurface(data);
        // });
        // this.altitudePoints.then(function(data) {
        //     return _this.drawAltitude(data);
        // });

        // this.modelService.submitSurfaceRequest( this.getSurfaceParams() ).subscribe( (results: ISurfaceData) => {
        //     this.surfaceData = cloneDeep(results);
        // });
        // this.modelService.submitAltitudeRequest( this.getAltitudeParams() ).subscribe( (results: IAltitudeData) => {
        //     this.altitudeData = cloneDeep(results);
        // });

        // this.modelForm.valueChanges.pipe(
        //     debounceTime(300)
        // ).subscribe( () => {
        //     this.modelService.submitSurfaceRequest( this.getSurfaceParams() ).subscribe( (results: ISurfaceData) => {
        //         this.surfaceData = cloneDeep(results);
        //     });
        //     this.modelService.submitAltitudeRequest( this.getAltitudeParams() ).subscribe( (results: IAltitudeData) => {
        //         this.altitudeData = cloneDeep(results);
        //     });
        // });
        // this.surfaceForm.valueChanges.pipe(
        //     debounceTime(300)
        // ).subscribe( () => {
        //     this.modelService.submitSurfaceRequest( this.getSurfaceParams() ).subscribe( (results: ISurfaceData) => {
        //         this.surfaceData = cloneDeep(results);
        //     });
        // });
        // this.altitudeForm.valueChanges.pipe(
        //     debounceTime(300)
        // ).subscribe( () => {
        //     this.modelService.submitAltitudeRequest( this.getAltitudeParams() ).subscribe( (results: IAltitudeData) => {
        //         this.altitudeData = cloneDeep(results);
        //     });
        // });
    }

    getAltitudeParams(): IAltitudeParameters {
        return {
            ap: this.modelForm.value.ap,
            date: this.modelForm.value.date.format('YYYY-MM-DDTHH:mm'),
            f107: this.modelForm.value.f107,
            f107a: this.modelForm.value.f107a,
            latitude: this.altitudeForm.value.latitude,
            longitude: this.altitudeForm.value.longitude
        };
    }

    getSurfaceParams(): ISurfaceParameters {
        return {
            altitude: this.surfaceForm.value.altitude,
            ap: this.modelForm.value.ap,
            date: this.modelForm.value.date.format('YYYY-MM-DDTHH:mm'),
            f107: this.modelForm.value.f107,
            f107a: this.modelForm.value.f107a
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
}
