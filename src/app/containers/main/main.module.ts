import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules';
import { MainComponent } from './main.container';
import { MainRoutingModule } from './main-routing.module';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        MainRoutingModule
    ],
    declarations: [ MainComponent ]
})
export class MainModule { }
