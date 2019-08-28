import { Component } from '@angular/core';

import {
    IImageLink,
    INavItem,
    ISocialLinks
} from './modules';

/** Entry Component */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    navItems: INavItem[] = [
        {
            label: 'Data',
            link: '/data'
        }, {
            label: 'Missions',
            link: '/missions'
        }, {
            label: 'Tools',
            link: '/tools'
        }, {
            label: 'About',
            link: '/about'
        }, {
            label: 'Reference',
            link: 'https://google.com'
        }, {
            label: 'Science',
            link: '/science'
        }, {
            label: 'Instruments',
            link: '/instruments'
        }
    ];

    orgLogos: IImageLink[] = [
        {
            src: 'assets/images/lasp-logo-black.png',
            href: 'http://lasp.colorado.edu'
        }
    ];

    socialLinks: ISocialLinks = {
        facebook: 'https://www.facebook.com/LASPatCU/',
        twitter: 'https://twitter.com/LASPatCU',
        youtube: 'https://www.youtube.com/user/LASPatCUBoulder'
    };
}
