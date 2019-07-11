import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../../modules';

import { MissionsRoutingModule } from './missions-routing.module';
import { MissionsComponent } from './missions.container';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        MissionsRoutingModule
    ],
    declarations: [ MissionsComponent ]
})
export class MissionsModule { }
