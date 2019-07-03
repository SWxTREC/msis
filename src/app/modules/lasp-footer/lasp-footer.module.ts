import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import {
    MatButtonModule,
    MatToolbarModule,
} from '@angular/material';

export {
    // INavItem, // uncomment this line if you are using the LaspFooterComponent alone, without the LaspNavComponent
    IImageLink,
    ISocialLinks
} from './models';
import { LaspFooterComponent } from './lasp-footer.component';


@NgModule({
    declarations: [LaspFooterComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatToolbarModule,
        RouterModule
    ],
    exports: [LaspFooterComponent]
})
export class LaspFooterModule { }
