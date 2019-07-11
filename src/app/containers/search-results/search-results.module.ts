import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../../modules';

import { SearchResultsRoutingModule } from './search-results-routing.module';
import { SearchResultsComponent } from './search-results.container';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SearchResultsRoutingModule
    ],
    declarations: [ SearchResultsComponent ]
})
export class SearchResultsModule { }
