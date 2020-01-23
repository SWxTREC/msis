import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'model',
        loadChildren: () => import( './containers/model/model.module').then( m => m.ModelModule )
    }, {
        path: 'docs',
        loadChildren: () => import( './containers/docs/docs.module').then( m => m.DocsModule )
    }, {
        path: 'about',
        loadChildren: () => import( './containers/about/about.module').then( m => m.AboutModule )
    }, {
        path: '**',
        loadChildren: () => import( './containers/model/model.module').then( m => m.ModelModule )
    }
];
