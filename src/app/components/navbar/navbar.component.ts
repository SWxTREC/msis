import {Component, ElementRef, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy{
    @ViewChild('stickyMenu') menuElement: ElementRef;

    fillerNav = ['Data', 'Missions', 'Tools', 'About', 'Reference', 'Science', 'Instruments'];
    navOpen = false;
    sticky = false;
    searchOpen = false;
    placeholder = 'Search Datasets or Missions';
    breakpointObserverSubscription: Subscription;

    @HostListener('window:scroll', ['$event'])
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
        const element = document.getElementById('search');
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
