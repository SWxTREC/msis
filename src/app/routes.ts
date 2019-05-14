import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/main',
        pathMatch: 'full'
    }, {
        path: 'main',
        loadChildren: './containers/main/main.module#MainModule'
    }, {
        path: 'search',
        loadChildren: './containers/search-results/search-results.module#SearchResultsModule'
    }, {
        path: 'missions/:id',
        loadChildren: './containers/missions/missions.module#MissionsModule'
    }, {
        path: 'datasets/:id',
        loadChildren: './containers/datasets/datasets.module#DatasetsModule'
    }, {
        path: '**',
        redirectTo: '/main',
        pathMatch: 'full'
    },
];
