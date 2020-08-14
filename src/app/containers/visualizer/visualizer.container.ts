import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { IModelParameters } from 'src/app/models';
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
        date: new FormControl((new Date()).toISOString(), [ Validators.required, Validators.min(0) ]),
        F107: new FormControl(0, [ Validators.required, Validators.min(0) ]),
        F107a: new FormControl(0, [ Validators.required, Validators.min(0) ]),
        ap: new FormControl(0, [ Validators.required, Validators.min(0) ])
    });
    surfaceForm = new FormGroup({
        altitude: new FormControl(200, [ Validators.min(0), Validators.max(1000) ])
    });
    altitudeForm = new FormGroup({
        latitude: new FormControl(0, [ Validators.min(-90), Validators.max(90) ]),
        longitude: new FormControl(0, [ Validators.min(-180), Validators.max(360) ])
    });
    variables = [
        'Mass',
        'He',
        'O',
        'N2',
        '02',
        'Ar',
        'H',
        'N',
        'Oanom',
        'Temp'
    ];
    payload: IModelParameters;
    results: {};

    constructor(
        private modelService: ModelService
    ) {}

    ngOnInit() {
        this.modelForm.valueChanges.subscribe( () => {
            console.log('modelForm', this.modelForm);
        });
        this.surfaceForm.valueChanges.subscribe( () => {
            console.log('surfaceForm', this.surfaceForm);
        });
        this.altitudeForm.valueChanges.subscribe( () => {
            console.log('altitudeForm', this.altitudeForm);
        });
    }

    getValidationMessage( control: string ) {
        console.log('control', control);
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

    onSubmit(): void {
        if ( this.modelForm.valid ) {
            // create url for request
            const url = '';
            this.modelService.submitRequest( url ).subscribe( data => {
                // this will only work for shallow objects from the api
                const results = Object.assign({}, data);
                this.results = results;
            });
        }
    }
}
