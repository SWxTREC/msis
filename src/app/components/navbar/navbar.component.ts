import {Component, ElementRef, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';

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
    breakpointObserverSubscription: any;

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
        private breakPointObserver: BreakpointObserver
    ) {
        this.breakpointObserverSubscription = breakPointObserver.observe([
            ('(min-width: 960px)')
        ]).subscribe((state: BreakpointState) => {
            if (state.matches) {
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
