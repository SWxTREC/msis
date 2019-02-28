import { Component, Input, Output, EventEmitter, Sanitizer, SecurityContext } from '@angular/core';
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

    constructor(
        private router: Router,
        private sanitizer: Sanitizer
    ) {}

    closeSearch() {
        this.searchText = '';
        this.close.emit();
    }

    search( query: string ) {
        this.router.navigateByUrl( this.sanitizer.sanitize( SecurityContext.URL, '/search?query=' + query  ) );
    }
}
