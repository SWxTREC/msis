import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ModelComponent } from './model.container';


const routes: Routes = [
    {
        path: '',
        component: ModelComponent
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class ModelRoutingModule { }
