import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'swt-model',
    templateUrl: './model.container.html',
    styleUrls: [ './model.container.scss' ]
})
export class ModelComponent {
    modelForm = new FormGroup({
        position: new FormGroup({
            x: new FormControl(''),
            y: new FormControl(''),
            z: new FormControl('')
        }),
        time: new FormControl(''),
        velocity: new FormControl(''),
        geometry: new FormControl('')
    });
    geometries = [ 'geometry option 1', 'geometry option 2', 'geometry option 3', 'geometry option 4', 'geometry option 5' ];

    onSubmit(): void {
        console.log(this.modelForm.value);
    }

}
