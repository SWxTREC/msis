import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules';
import { HomeComponent } from './home.container';
import { HomeRoutingModule } from './home-routing.module';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        HomeRoutingModule
    ],
    declarations: [ HomeComponent ]
})
export class HomeModule { }
