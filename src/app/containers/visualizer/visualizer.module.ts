import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../modules';

import {
    SwtAltitudePlotComponent,
    SwtSurfacePlotComponent
} from './components';
import { VisualizerRoutingModule } from './visualizer-routing.module';
import { VisualizerComponent } from './visualizer.container';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        VisualizerRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [
        SwtAltitudePlotComponent,
        SwtSurfacePlotComponent,
        VisualizerComponent
    ]
})
export class VisualizerModule { }
