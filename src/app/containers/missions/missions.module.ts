import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules';
import { MissionsComponent } from './missions.container';
import { MissionsRoutingModule } from './missions-routing.module';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        MissionsRoutingModule
    ],
    declarations: [ MissionsComponent ]
})
export class MissionsModule { }
