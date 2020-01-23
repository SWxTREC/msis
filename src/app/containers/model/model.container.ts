import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'swt-model',
    templateUrl: './model.container.html',
    styleUrls: [ './model.container.scss' ]
})
export class ModelComponent implements OnInit {
    modelForm = new FormGroup({
        objectType: new FormControl,
        diameter: new FormControl,
        length: new FormControl,
        area: new FormControl,
        pitch: new FormControl,
        sideslip: new FormControl,
        temperature: new FormControl,
        speed: new FormControl,
        composition: new FormGroup({
            o: new FormControl(''),
            o2: new FormControl(''),
            n2: new FormControl(''),
            he: new FormControl(''),
            h: new FormControl('')
        }),
        accomodationModel: new FormControl('')
    });
    objectTypes = [
        'sphere',
        'cylinder',
        'plate',
        'plate-model'
    ];
    models = [
        'SESAM',
        'Goodman',
        'fixed'
    ];

    ngOnInit() {
        this.modelForm.valueChanges.subscribe( value => {
            console.log('form', this.modelForm, value);
        });
    }

    onSubmit(): void {
        console.log(this.modelForm.value);
    }

}
