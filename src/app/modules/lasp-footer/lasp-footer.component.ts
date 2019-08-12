import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { IImageLink, INavItem, ISocialLinks } from './models';

@Component({
    selector: 'lasp-footer',
    templateUrl: './lasp-footer.component.html',
    styleUrls: [ './lasp-footer.component.scss' ]
})
export class LaspFooterComponent {

    @Input() navItems: INavItem[] = [];
    @Input() orgLogos?: IImageLink[] = [];
    @Input() socialLinks?: ISocialLinks = {};
    @Input() partners?: IImageLink[] = [];
    @Input() privacyPolicyRoute?: string;
    @Input() termsOfServiceRoute?: string;
    @Input() copyrightedBy ? = 'Regents of the University of Colorado';

    currentYear = new Date().getFullYear();

    constructor( private _router: Router ) {}

    /**
     * Navigate to a local route, or open an external link in a new window/tab.
     */
    onNavClick( urlOrRoute: string ) {
        urlOrRoute.match(/^https?:\/\//) === null ? this._router.navigateByUrl( urlOrRoute ) : window.open( urlOrRoute, '_blank' );
    }
}