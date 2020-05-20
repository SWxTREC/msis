import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../modules';

import { CalculatorRoutingModule } from './calculator-routing.module';
import { CalculatorComponent } from './calculator.container';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CalculatorRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [ CalculatorComponent ]
})
export class CalculatorModule { }
