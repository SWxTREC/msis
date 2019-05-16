import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: './containers/home/home.module#HomeModule'
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
        redirectTo: '/',
        pathMatch: 'full'
    },
];
