import { Component, Input } from '@angular/core';

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
}
