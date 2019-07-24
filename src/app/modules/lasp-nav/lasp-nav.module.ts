import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
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
