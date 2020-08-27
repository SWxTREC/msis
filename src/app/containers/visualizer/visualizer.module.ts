import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../modules';

import { VisualizerRoutingModule } from './visualizer-routing.module';
import { VisualizerComponent } from './visualizer.container';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        VisualizerRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [ VisualizerComponent ]
})
export class VisualizerModule { }
