import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IModelParameters } from 'src/app/models';
import { ModelService } from 'src/app/services';

@Component({
    selector: 'swt-visualizer',
    templateUrl: './visualizer.container.html',
    styleUrls: [ './visualizer.container.scss' ]
})
export class VisualizerComponent implements OnInit {
    invalidFieldMessage: string;
    invalidFields: string[];
    modelForm = new FormGroup({
        date: new FormControl(Date.now, [ Validators.required ]),
        F10_7: new FormControl(0, [ Validators.required ]),
        F10_7a: new FormControl(0, [ Validators.required ]),
        ap: new FormControl(0, [ Validators.required ]),
        altitude: new FormControl(200, [ Validators.min(0), Validators.max(500) ]),
        latitude: new FormControl(0, [ Validators.min(-90), Validators.max(-90) ]),
        longitude: new FormControl(0, [ Validators.min(-180), Validators.max(180) ])
    });
    displayForm = new FormGroup({
        displayLog: new FormControl(false)
    });
    variables = [
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
        this.variables.forEach( (variable: string) => {
            this.displayForm.addControl( variable, new FormControl(false));
        });

        this.payload = this.createPayload(this.modelForm.value);

        this.modelForm.valueChanges.subscribe( () => {
            this.validateFields();
            this.payload = this.createPayload(this.modelForm.value);
            this.results = undefined;
        });
    }

    // format the model form values to values appropriate for the payload (numbers)
    createPayload( modelObject: IModelParameters ) {
        // const submitFormat: IModelParameters = {
        //     objectType: modelObject.objectType,
        //     diameter: Number(modelObject.diameter),
        //     length: Number(modelObject.length),
        //     area: Number(modelObject.area),
        //     pitch: Number(modelObject.pitch),
        //     sideslip: Number(modelObject.sideslip),
        //     temperature: Number(modelObject.temperature),
        //     speed: Number(modelObject.speed),
        //     composition: {
        //         o: Number(modelObject.composition.o),
        //         o2: Number(modelObject.composition.o2),
        //         n2: Number(modelObject.composition.n2),
        //         he: Number(modelObject.composition.he),
        //         h: Number(modelObject.composition.h)
        //     },
        //     accommodationModel: modelObject.accommodationModel,
        //     energyAccommodation: Number(modelObject.energyAccommodation),
        //     surfaceMass: Number(modelObject.surfaceMass)
        // };
        return modelObject;
    }

    getValidationMessage( control: string, subcontrol?: string ) {
        switch (control) {
        case 'objectType':
            if ( this.modelForm.controls.objectType.hasError('required') ) {
                return 'you must select an object type';
            }
            break;
        case 'diameter':
            if ( this.modelForm.controls.diameter.hasError('min') ) {
                return 'diameter must be positive';
            }
            break;
        case 'length':
            if ( this.modelForm.controls.length.hasError('min') ) {
                return 'length must be positive';
            }
            break;
        case 'area':
            if ( this.modelForm.controls.area.hasError('min') ) {
                return 'area must be positive';
            }
            break;
        case 'pitch':
            if ( this.modelForm.controls.pitch.hasError('min') || this.modelForm.controls.pitch.hasError('max') ) {
                return 'pitch angle must be between -90 and 90';
            }
            break;
        case 'sideslip':
            if ( this.modelForm.controls.sideslip.hasError('min') || this.modelForm.controls.sideslip.hasError('max') ) {
                return 'sideslip angle must be between -180 and 180';
            }
            break;
        case 'temperature':
            if ( this.modelForm.controls.temperature.hasError('min') ) {
                return 'temperature must be positive';
            }
            break;
        case 'speed':
            if ( this.modelForm.controls.speed.hasError('min') ) {
                return 'speed must be positive';
            }
            break;
        case 'composition':
            if (
                this.modelForm.controls.composition.invalid && this.modelForm.controls.composition['controls'][subcontrol].hasError('min')
            ) {
                return 'value must be positive';
            }
            break;
        case 'accommodationModel':
            if ( this.modelForm.controls.accommodationModel.hasError('required') ) {
                return 'you must select a model';
            }
            break;
        case 'energyAccommodation':
            if ( this.modelForm.controls.energyAccommodation.hasError('min')
                || this.modelForm.controls.energyAccommodation.hasError('max') ) {
                return 'energy accommodation must be between 0 and 1';
            }
            break;
        case 'surfaceMass':
            if ( this.modelForm.controls.surfaceMass.hasError('min') ) {
                return 'surface mass must be 1 or greater';
            }
            break;
        }
    }

    onSubmit(): void {
        if ( this.modelForm.valid ) {
            this.modelService.submitRequest( this.payload ).subscribe( data => {
                // this will only work for shallow objects from the api
                const results = Object.assign({}, data);
                this.results = results;
            });
        }
    }

    validateFields() {
        // create and format invalid field error message
        const invalidModelFormFields = Object.keys(this.modelForm.controls).filter( control => this.modelForm.controls[control].invalid );
        this.invalidFields = invalidModelFormFields;
        const invalidFieldsInComposition: string[] =
            Object.keys(this.modelForm.controls.composition['controls'])
                .filter( control => this.modelForm.controls.composition['controls'][control].invalid );
        if ( this.invalidFields.length ) {
            const speciesString = invalidFieldsInComposition.join(', ');
            const compositionString = 'composition (' + speciesString + ')';
            const compositionIndex = this.invalidFields.indexOf('composition');
            this.invalidFields[compositionIndex] = compositionString;
        }
        this.invalidFieldMessage = 'invalid fields: ' + this.invalidFields.join(', ');
    }

}
