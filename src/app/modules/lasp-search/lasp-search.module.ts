import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
