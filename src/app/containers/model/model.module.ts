import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../../modules';

import { ModelRoutingModule } from './model-routing.module';
import { ModelComponent } from './model.container';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        ModelRoutingModule
    ],
    declarations: [ ModelComponent ]
})
export class ModelModule { }
