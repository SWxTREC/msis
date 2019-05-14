import { Component, ElementRef, HostListener, OnDestroy, ViewChild, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { INavItem } from '../../models/header-footer';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy{

    @Input() largeLogoSrc: string;
    @Input() smallLogoSrc: string;
    @Input() orgLogoSrc: string;
    @Input() searchPlaceholder: string = 'Search';
    @Input() largeHeaderBgColor: string = 'black';
    @Input() mobileNavBgColor: string = 'black';
    @Input() navItems: INavItem[];

    @ViewChild( 'stickyMenu' ) menuElement: ElementRef;

    navOpen = false;
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
        private breakpointObserver: BreakpointObserver
    ) {
        this.breakpointObserverSubscription = breakpointObserver.observe([
            Breakpoints.TabletLandscape,
        ]).subscribe(result => {
            if (result.matches) {
                this.navOpen = false;
            }
        })
    }

    ngOnDestroy() {
        this.breakpointObserverSubscription.unsubscribe();
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
