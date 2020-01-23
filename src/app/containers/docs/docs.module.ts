import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../../modules';

import { DocsRoutingModule } from './docs-routing.module';
import { DocsComponent } from './docs.component';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        DocsRoutingModule
    ],
    declarations: [ DocsComponent ]
})
export class DocsModule { }
