import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../../modules';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        AboutRoutingModule
    ],
    declarations: [ AboutComponent ]
})
export class AboutModule { }
