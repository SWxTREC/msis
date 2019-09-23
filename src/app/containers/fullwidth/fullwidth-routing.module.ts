import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FullwidthComponent } from './fullwidth.component';


const routes: Routes = [
    {
        path: '',
        component: FullwidthComponent
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class FullwidthRoutingModule { }
