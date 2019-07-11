import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./containers/home/home.module').then(m => m.HomeModule)
    }, {
        path: 'search',
        loadChildren: () => import('./containers/search-results/search-results.module').then(m => m.SearchResultsModule)
    }, {
        path: 'missions/:id',
        loadChildren: () => import('./containers/missions/missions.module').then(m => m.MissionsModule)
    }, {
        path: 'datasets/:id',
        loadChildren: () => import('./containers/datasets/datasets.module').then(m => m.DatasetsModule)
    }, {
        path: '**',
        redirectTo: '/',
        pathMatch: 'full'
    },
];
