import { Routes } from '@angular/router';

import { MainComponent } from './containers/main/main.container';
import { SearchResultsComponent } from './containers/search-results/search-results.container';

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
    }
];
