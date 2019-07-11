import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatButtonModule,
    MatToolbarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';

export {
    // INavItem, // uncomment this line if you are using the LaspFooterComponent without the LaspNavComponent
    IImageLink,
    ISocialLinks
} from './models';
import { LaspFooterComponent } from './lasp-footer.component';


@NgModule({
    declarations: [ LaspFooterComponent ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatToolbarModule,
        RouterModule
    ],
    exports: [ LaspFooterComponent ]
})
export class LaspFooterModule { }
