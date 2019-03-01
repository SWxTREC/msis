import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-search-results',
    templateUrl: './search-results.container.html',
    styleUrls: ['./search-results.container.scss']
})
export class SearchResultsComponent implements OnInit {
    query: string;
    searchResults = {};

    constructor( private searchService: SearchService, private route: ActivatedRoute ) {}

    ngOnInit() {
        this.searchService.getResults().subscribe(
            results => this.searchResults = results
        );
        this.route.queryParamMap.subscribe(
            query => {
                this.query = query.get('query');
                this.searchService.getSearch( this.query );
            }
        );
    }
}
