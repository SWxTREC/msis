import { Routes } from '@angular/router';

import { LaspFour04Component } from 'lasp-four04';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import( './containers/home/home.module').then( m => m.HomeModule )
    }, {
        path: 'fullwidth',
        loadChildren: () => import( './containers/fullwidth/fullwidth.module').then( m => m.FullwidthModule )
    }, {
        path: 'search',
        loadChildren: () => import( './containers/search-results/search-results.module' ).then( m => m.SearchResultsModule )
    }, {
        path: 'missions/:id',
        loadChildren: () => import( './containers/missions/missions.module' ).then( m => m.MissionsModule )
    }, {
        path: 'datasets/:id',
        loadChildren: () => import( './containers/datasets/datasets.module' ).then( m => m.DatasetsModule )
    }, {
        path: '404',
        component: LaspFour04Component
    }, {
        path: '**',
        component: LaspFour04Component
    }
];
