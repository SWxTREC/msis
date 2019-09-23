import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../../modules';

import { FullwidthRoutingModule } from './fullwidth-routing.module';
import { FullwidthComponent } from './fullwidth.component';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FullwidthRoutingModule
    ],
    declarations: [ FullwidthComponent ]
})
export class FullwidthModule { }
