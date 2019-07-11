import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';

import { LaspSearchModule } from '../lasp-search/lasp-search.module';

import { LaspNavComponent } from './lasp-nav.component';
export { INavItem } from './models';

@NgModule({
    declarations: [
        LaspNavComponent
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        LaspSearchModule,
        RouterModule
    ],
    exports: [
        LaspNavComponent
    ]
})
export class LaspNavModule { }
