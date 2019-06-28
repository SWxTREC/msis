import { Component, ElementRef, HostListener, OnDestroy, ViewChild, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { INavItem } from './models/nav';

@Component({
    selector: 'lasp-nav',
    templateUrl: './lasp-nav.component.html',
    styleUrls: ['./lasp-nav.component.scss']
})

export class LaspNavComponent implements OnDestroy {

    @Input() largeLogoSrc: string;
    @Input() smallLogoSrc: string;
    @Input() orgLogoSrc: string;
    @Input() searchPlaceholder = 'Search';
    @Input() largeHeaderBgColor = 'black';
    @Input() mobileNavBgColor = 'black';
    @Input() navItems: INavItem[];

    @ViewChild( 'stickyMenu' ) menuElement: ElementRef;

    navOpen = false;
    closeNavImmediately = false;
    sticky = false;
    searchOpen = false;
    breakpointObserverSubscription: Subscription;

    @HostListener( 'window:scroll', ['$event'] )
    handleScroll() {
        const windowScroll = window.pageYOffset;
        if (windowScroll >= 160) {
            this.sticky = true;
        } else {
            this.sticky = false;
        }
    }

    constructor(
        private _breakpointObserver: BreakpointObserver
    ) {
        this.breakpointObserverSubscription = this._breakpointObserver.observe([
            Breakpoints.TabletLandscape,
        ]).subscribe(result => {
            if (result.matches) {
                this.navOpen = false;
            }
        });
    }

    ngOnDestroy() {
        this.breakpointObserverSubscription.unsubscribe();
    }

    /**
     * Open the nav menu, for narrow screens.
     */
    openNav() {
        this.navOpen = true;
        // the flag below will be set to true if one of the nav items is clicked on
        this.closeNavImmediately = false;
    }

    /**
     * Close the nav menu, either with an animation or immediately.
     * @param immediately: boolean
     */
    closeNav( immediately = false ) {
        if ( immediately ) {
            this.closeNavImmediately = true;
        }
        this.navOpen = false;
    }

    /**
    * Open the sitewide search area, then clear and focus the input field.
    * For wide screens.
    */
    openSearch() {
        const element = document.getElementById( 'search' );
        element.focus({ preventScroll: true });
        this.searchOpen = true;
    }

    /**
    * Close the sitewide search area.
    * For wide screens.
    */
    closeSearch() {
        this.searchOpen = false;
    }
}
