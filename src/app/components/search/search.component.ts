import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    @Output() close = new EventEmitter();
    placeholder = 'Search';

    closeSearch() {
        this.close.emit();
    }
}
