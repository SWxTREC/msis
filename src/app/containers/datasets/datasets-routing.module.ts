import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatasetsComponent } from './datasets.container';


const routes: Routes = [
    {
        path: '',
        component: DatasetsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DatasetsRoutingModule { }
