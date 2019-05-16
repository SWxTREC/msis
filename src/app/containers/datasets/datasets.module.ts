import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules';
import { DatasetsComponent } from './datasets.container';
import { DatasetsRoutingModule } from './datasets-routing.module';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        DatasetsRoutingModule
    ],
    declarations: [ DatasetsComponent ]
})
export class DatasetsModule { }
