import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules';
import { SearchResultsComponent } from './search-results.container';
import { SearchResultsRoutingModule } from './search-results-routing.module';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SearchResultsRoutingModule
    ],
    declarations: [ SearchResultsComponent ]
})
export class SearchResultsModule { }
