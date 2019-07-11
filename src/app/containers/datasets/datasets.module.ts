import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../../modules';

import { DatasetsRoutingModule } from './datasets-routing.module';
import { DatasetsComponent } from './datasets.container';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        DatasetsRoutingModule
    ],
    declarations: [ DatasetsComponent ]
})
export class DatasetsModule { }
