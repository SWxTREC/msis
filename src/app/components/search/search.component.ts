import {Component, Input, Output, EventEmitter, Sanitizer, SecurityContext, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy{
    @Output() close = new EventEmitter();
    @Output() searchSent = new EventEmitter(); // emit when we send a search
    @Input() placeholder = 'Search';
    searchText = '';
    breakpointObserverSubscription: any;



    constructor(
        private router: Router,
        private sanitizer: Sanitizer,
        private breakPointObserver: BreakpointObserver
    ) {
        this.breakpointObserverSubscription = breakPointObserver.observe([
            ('(max-width: 960px)')
        ]).subscribe((state: BreakpointState) => {
            if (state.matches) {
                this.close.emit();
            }
        })
    }

    ngOnDestroy() {
        this.breakpointObserverSubscription.unsubscribe();
    }

    // @HostListener( 'window:resize', ['$event'] )
    // onResize( event ): void {
    //     this.screenWidth = window.innerWidth;
    //     this.handleScreenSizeChange( this.screenWidth );
    // }
    //
    // handleScreenSizeChange(screenSize: number) {
    //     if (screenSize < 960) {
    //         this.close.emit();
    //     }
    // }



    closeSearch() {
        this.searchText = '';
        this.close.emit();
    }

    search( query: string ) {
        this.searchSent.emit();
        this.router.navigateByUrl( this.sanitizer.sanitize( SecurityContext.URL, '/search?query=' + query  ) );
    }
}
