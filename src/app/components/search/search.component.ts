import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SearchService, ISearchResults } from '../../services/search.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    @Output() close = new EventEmitter();
    @Input() placeholder = 'Search';
    searchText = '';
    $results: Observable<ISearchResults>;

    constructor( private searchService: SearchService, private router: Router ) {}

    closeSearch() {
        this.searchText = '';
        this.close.emit();
    }

    search( query: string ) {
        this.searchService.getSearch( query );
        this.router.navigateByUrl('/search');
    }
}
