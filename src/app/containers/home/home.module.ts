import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../../modules';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.container';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        HomeRoutingModule
    ],
    declarations: [ HomeComponent ]
})
export class HomeModule { }
