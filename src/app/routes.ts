import { Routes } from '@angular/router';

import { MainComponent } from './containers/main/main.container';
import { SearchResultsComponent } from './containers/search-results/search-results.container';
import { MissionsComponent } from './containers/missions/missions.container';
import { DatasetsComponent } from './containers/datasets/datasets.container';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/main',
        pathMatch: 'full'
    }, {
        path: 'main',
        component: MainComponent
    }, {
        path: 'search',
        component: SearchResultsComponent
    }, {
        path: 'missions/:id',
        component: MissionsComponent
    }, {
        path: 'datasets/:id',
        component: DatasetsComponent
    }, {
        path: '**',
        redirectTo: '/main',
        pathMatch: 'full'
    },
];
