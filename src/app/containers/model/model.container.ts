import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IModelParameters } from 'src/app/models';
import { ModelService } from 'src/app/services';

@Component({
    selector: 'swt-model',
    templateUrl: './model.container.html',
    styleUrls: [ './model.container.scss' ]
})
export class ModelComponent implements OnInit {
    modelForm = new FormGroup({
        objectType: new FormControl('sphere'),
        diameter: new FormControl(1.212.toFixed(3)),
        length: new FormControl(2.010.toFixed(3)),
        area: new FormControl(3.400.toFixed(3)),
        pitch: new FormControl(35.6.toFixed(1)),
        sideslip: new FormControl(12.5.toFixed(1)),
        temperature: new FormControl(1200.5.toFixed(1)),
        speed: new FormControl(7800.45.toFixed(2)),
        composition: new FormGroup({
            o: new FormControl(100000000000.0.toPrecision(3)),
            o2: new FormControl(1000000.0.toPrecision(3)),
            n2: new FormControl(1000000.0.toPrecision(3)),
            he: new FormControl(1000000.0.toPrecision(3)),
            h: new FormControl(10000.0.toPrecision(3))
        }),
        accommodationModel: new FormControl('SESAM'),
        energyAccommodation: new FormControl(0.930.toFixed(3)),
        surfaceMass: new FormControl(65.0.toFixed(1))
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
    payload: IModelParameters;
    resultTranslator = {
        dragCoefficient: 'Drag Coefficient',
        forceCoefficient: 'Force Coefficient',
        projectedArea: 'Projected Area'
    };
    results: {};
    showArea: boolean;
    showDiameter: boolean;
    showEnergyAccommodation: boolean;
    showLength: boolean;
    showPitch: boolean;
    showSideslip: boolean;
    showSurfaceMass: boolean;

    constructor(private modelService: ModelService) {}

    ngOnInit() {
        this.payload = this.createPayload(this.modelForm.value);
        this.setShowHideConditions();

        this.modelForm.valueChanges.subscribe( () => {
            this.payload = this.createPayload(this.modelForm.value);
            this.setShowHideConditions();
            this.results = undefined;
        });
    }

    onSubmit(): void {

        this.modelService.submitSinglePointRequest(this.payload).subscribe( data => {
            this.results = data;
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
                o: (+this.payload.composition.o).toPrecision(3),
                o2: (+this.payload.composition.o2).toPrecision(3),
                n2: (+this.payload.composition.n2).toPrecision(3),
                he: (+this.payload.composition.he).toPrecision(3),
                h: (+this.payload.composition.h).toPrecision(3)
            },
            energyAccommodation: this.payload.energyAccommodation,
            surfaceMass: this.payload.surfaceMass
        });
    }

    setShowHideConditions(): void {
        this.showArea = this.modelForm.value.objectType === 'plate';
        this.showDiameter =
            this.modelForm.value.objectType === 'sphere' || this.modelForm.value.objectType === 'cylinder';
        this.showLength = this.modelForm.value.objectType === 'cylinder';
        this.showPitch =
            this.modelForm.value.objectType === 'cylinder' ||
            this.modelForm.value.objectType === 'plate' ||
            this.modelForm.value.objectType === 'geometry file';
        this.showSideslip = this.modelForm.value.objectType === 'geometry file';
        this.showEnergyAccommodation = this.modelForm.value.accommodationModel === 'Fixed';
        this.showSurfaceMass = this.modelForm.value.accommodationModel === 'Goodman';
    }

    // format the model form values to values appropriate for the payload
    createPayload( modelObject: IModelParameters ) {
        const submitFormat: IModelParameters = {
            objectType: modelObject.objectType,
            diameter: Number((+modelObject.diameter).toFixed(3)),
            length: Number((+modelObject.length).toFixed(3)),
            area: Number((+modelObject.area).toFixed(3)),
            pitch: Number((+modelObject.pitch).toFixed(1)),
            sideslip: Number((+modelObject.sideslip).toFixed(1)),
            temperature: Number((+modelObject.temperature).toFixed(1)),
            speed: Number((+modelObject.speed).toFixed(2)),
            composition: {
                o: Number(modelObject.composition.o),
                o2: Number(modelObject.composition.o2),
                n2: Number(modelObject.composition.n2),
                he: Number(modelObject.composition.he),
                h: Number(modelObject.composition.h)
            },
            accommodationModel: modelObject.accommodationModel,
            energyAccommodation: Number((+modelObject.energyAccommodation).toFixed(3)),
            surfaceMass: Number((+modelObject.surfaceMass).toFixed(1))
        };
        return submitFormat;
    }

}
