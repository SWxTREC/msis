import { Component } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
    selector: 'app-search-results',
    templateUrl: './search-results.container.html',
    styleUrls: ['./search-results.container.scss']
})
export class SearchResultsComponent {
    searchResults = {};

    constructor( searchService: SearchService ) {
        searchService.getResults().subscribe(
            results => this.searchResults = results
        );
    }
}
