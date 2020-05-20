import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IModelParameters } from 'src/app/models';
import { ModelService } from 'src/app/services';

@Component({
    selector: 'swt-calculator',
    templateUrl: './calculator.container.html',
    styleUrls: [ './calculator.container.scss' ]
})
export class CalculatorComponent implements OnInit {
    invalidFieldMessage: string;
    invalidFields: string[];
    modelForm = new FormGroup({
        objectType: new FormControl('sphere', [ Validators.required ]),
        diameter: new FormControl(1.212.toFixed(3), [ Validators.min(0) ]),
        length: new FormControl(2.010.toFixed(3), [ Validators.min(0) ]),
        area: new FormControl(3.400.toFixed(3), [ Validators.min(0) ]),
        pitch: new FormControl(35.6.toFixed(1), [ Validators.min(-90), Validators.max(90) ]),
        sideslip: new FormControl(12.5.toFixed(1), [ Validators.min(-180), Validators.max(180) ]),
        temperature: new FormControl(1200.5.toFixed(1), [ Validators.min(0) ]),
        speed: new FormControl(7800.45.toFixed(2), [ Validators.min(0) ]),
        composition: new FormGroup({
            o: new FormControl(100000000000.0.toPrecision(3), [ Validators.min(0) ]),
            o2: new FormControl(1000000.0.toPrecision(3), [ Validators.min(0) ]),
            n2: new FormControl(1000000.0.toPrecision(3), [ Validators.min(0) ]),
            he: new FormControl(1000000.0.toPrecision(3), [ Validators.min(0) ]),
            h: new FormControl(10000.0.toPrecision(3), [ Validators.min(0) ])
        }),
        accommodationModel: new FormControl('SESAM', [ Validators.required ]),
        energyAccommodation: new FormControl(0.930.toFixed(3), [ Validators.min(0), Validators.max(1) ]),
        surfaceMass: new FormControl(65.0.toFixed(1), [ Validators.min(10) ])
    });
    models = [
        'SESAM',
        'Goodman',
        'Fixed'
    ];
    objectTypes = [
        'sphere',
        'cylinder',
        'plate',
        'geometry file'
    ];
    geometryFileName: string;
    geometryFiles = [
        {
            label: 'SORCE',
            identifier: 'sorce'
        },
        {
            label: 'CubeSat, 1U',
            identifier: 'cubesat1u'
        },
        {
            label: 'CubeSat, 3U with Panels',
            identifier: 'deployable3u'
        },
        {
            label: 'upload',
            identifier: ''
        }
    ];
    imageFileId: string;
    imageOutOfDate = false;
    fileNotChosen: string;
    payload: IModelParameters;
    resultTranslator = {
        dragCoefficient: {
            title: 'Drag Coefficient',
            units: ''
        },
        energyAccommodation: {
            title: 'Energy Accommodation',
            units: ''
        },
        forceCoefficient: {
            title: 'Force Coefficient',
            units: 'm<sup>2</sup>'
        },
        projectedArea: {
            title: 'Projected Area',
            units: 'm<sup>2</sup>'
        }
    };
    results: {};
    showArea: boolean;
    showDiameter: boolean;
    showEnergyAccommodation: boolean;
    showLength: boolean;
    showPitch: boolean;
    showSideslip: boolean;
    showSurfaceMass: boolean;
    uploadedFileName: string;
    uploadSelected = false;
    vrmlImageSrc: SafeUrl;

    constructor(
        private modelService: ModelService,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.payload = this.createPayload(this.modelForm.value);
        this.setShowHideConditions();

        this.modelForm.valueChanges.subscribe( () => {
            this.validateFields();
            this.setShowHideConditions();
            this.payload = this.createPayload(this.modelForm.value);
            this.results = undefined;
        });

        // reset image if pitch, sildeslip, or objectType changes
        // there is a bug where for number inputs, valueChanges is called twice
        // but that doesn't matter here, just FYI https://github.com/angular/angular/issues/12540
        this.modelForm.controls.pitch.valueChanges
            .subscribe( () => this.resetImage() );
        this.modelForm.controls.sideslip.valueChanges
            .subscribe( () => this.resetImage() );
        this.modelForm.controls.objectType.valueChanges
            .subscribe( () => {
                this.uploadSelected = false;
                this.fileNotChosen = undefined;
                this.geometryFileName = undefined;
                this.resetImage();
            });
    }

    // format the model form values to values appropriate for the payload (numbers)
    createPayload( modelObject: IModelParameters ) {
        const submitFormat: IModelParameters = {
            objectType: modelObject.objectType,
            diameter: Number(modelObject.diameter),
            length: Number(modelObject.length),
            area: Number(modelObject.area),
            pitch: Number(modelObject.pitch),
            sideslip: Number(modelObject.sideslip),
            temperature: Number(modelObject.temperature),
            speed: Number(modelObject.speed),
            composition: {
                o: Number(modelObject.composition.o),
                o2: Number(modelObject.composition.o2),
                n2: Number(modelObject.composition.n2),
                he: Number(modelObject.composition.he),
                h: Number(modelObject.composition.h)
            },
            accommodationModel: modelObject.accommodationModel,
            energyAccommodation: Number(modelObject.energyAccommodation),
            surfaceMass: Number(modelObject.surfaceMass)
        };
        return submitFormat;
    }

    // triggered only when a file is uploaded
    fileUpload(file: File): void {
        this.fileNotChosen = undefined;
        // reset filename
        this.uploadedFileName = undefined;
        this.resetImage();
        this.uploadedFileName = file ? file.name : undefined;
        this.validateFileUpload();
        if ( file ) {
            this.modelService.submitGeometryFile( 'custom', file )
                .subscribe( result => {
                    this.imageFileId = result.userId;
                });
        }
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

    // triggered when any geometry file is chosen
    getFileId( geometry: { identifier: string, label: string} ): void {
        this.imageFileId = undefined;
        // preloaded file with an identifier
        if ( geometry.identifier ) {
            this.geometryFileName = geometry.label;
            this.modelService.submitGeometryFile( geometry.identifier )
                .subscribe( result => {
                    this.imageFileId = result.userId;
                });
        } else {
            // invalid until a file is chosen
            this.uploadSelected = true;
            this.validateFileUpload();
        }
    }

    onSubmit(): void {
        if ( this.modelForm.valid ) {
            this.modelService.submitSinglePointRequest( this.payload, this.imageFileId ).subscribe( data => {
                // this will only work for shallow objects from the api
                const results = Object.assign({}, data);
                Object.keys( data ).forEach( key => results[key] = this.round( data[key], 4 ));
                this.results = results;
                if ( this.imageFileId && this.imageOutOfDate && ( this.uploadSelected || this.geometryFileName )) {
                    this.imageOutOfDate = false;
                    this.modelService.getImage( this.imageFileId ).subscribe( blob => {
                        const objectUrl = URL.createObjectURL( blob );
                        this.vrmlImageSrc = this.sanitizer.bypassSecurityTrustUrl( objectUrl );
                    });
                }
            });
            // format the model form values back to values appropriate for the form
            this.modelForm.patchValue({
                diameter: this.payload.diameter,
                length: this.payload.length,
                area: this.payload.area,
                pitch: this.payload.pitch,
                sideslip: this.payload.sideslip,
                temperature: this.payload.temperature,
                speed: this.payload.speed,
                composition: {
                    o: (+this.payload.composition.o).toPrecision(4),
                    o2: (+this.payload.composition.o2).toPrecision(4),
                    n2: (+this.payload.composition.n2).toPrecision(4),
                    he: (+this.payload.composition.he).toPrecision(4),
                    h: (+this.payload.composition.h).toPrecision(4)
                },
                energyAccommodation: this.payload.energyAccommodation,
                surfaceMass: this.payload.surfaceMass
            }, { emitEvent: false, onlySelf: true });
        }
    }

    resetImage() {
        this.uploadedFileName = this.uploadSelected ? this.uploadedFileName : undefined;
        this.vrmlImageSrc = undefined;
        this.imageOutOfDate = true;
    }

    round(value: number, decimals: number): string {
        const roundedNumber: number = Number(Math.round(+(value + 'e' + decimals)) + 'e-' + decimals);
        return roundedNumber.toFixed(4);
    }

    setShowHideConditions(): void {
        this.showArea = this.modelForm.value.objectType === 'plate';
        this.showDiameter =
            this.modelForm.value.objectType === 'sphere' || this.modelForm.value.objectType === 'cylinder';
        this.showLength = this.modelForm.value.objectType === 'cylinder';
        this.showPitch =
            this.modelForm.value.objectType === 'cylinder' ||
            this.modelForm.value.objectType === 'plate' ||
            this.modelForm.value.objectType === 'custom';
        this.showSideslip = this.modelForm.value.objectType === 'custom';
        this.showEnergyAccommodation = this.modelForm.value.accommodationModel === 'Fixed';
        this.showSurfaceMass = this.modelForm.value.accommodationModel === 'Goodman';
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

    validateFileUpload() {
        const fileNotChosen = this.uploadSelected && !this.uploadedFileName;
        if ( fileNotChosen ) {
            this.fileNotChosen = 'choose .wrl file';
        }
    }

}
