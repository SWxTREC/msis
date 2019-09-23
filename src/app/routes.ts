import { Routes } from '@angular/router';
import { Four04ComponentComponent } from './four04-component/four04-component.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import( './containers/home/home.module').then( m => m.HomeModule )
    }, {
        path: 'about',
        loadChildren: () => import( './containers/about/about.module').then( m => m.AboutModule )
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
        component: Four04ComponentComponent
    }, {
        path: '**',
        redirectTo: '/404',
        pathMatch: 'full'
    }
];
