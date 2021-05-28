import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LaspDateTimePickerModule } from 'lasp-range-slider';
import { MomentModule } from 'ngx-moment';

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
        LaspDateTimePickerModule,
        MaterialModule,
        MomentModule,
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
