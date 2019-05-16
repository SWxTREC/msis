import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MissionsComponent } from './missions.container';


const routes: Routes = [
    {
        path: '',
        component: MissionsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MissionsRoutingModule { }
