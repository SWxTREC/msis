import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatIconModule,
} from '@angular/material';

import { LaspSearchComponent } from './lasp-search.component';

@NgModule({
    declarations: [
        LaspSearchComponent
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        MatButtonModule,
        MatIconModule
    ],
    exports: [
        LaspSearchComponent
    ]
})
export class LaspSearchModule { }
