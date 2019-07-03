import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    LaspNavModule
} from '../lasp-nav/lasp-nav.module';

import {
    LaspFooterModule
} from '../lasp-footer/lasp-footer.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    exports: [
        LaspFooterModule,
        LaspNavModule
    ]
})
export class LaspAppModule { }
