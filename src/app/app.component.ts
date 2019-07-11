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
            link: '.'
        }, {
            label: 'Missions',
            link: '.'
        }, {
            label: 'Tools',
            link: '.'
        }, {
            label: 'About',
            link: '.'
        }, {
            label: 'Reference',
            link: '.'
        }, {
            label: 'Science',
            link: '.'
        }, {
            label: 'Instruments',
            link: '.'
        }
    ];

    orgLogos: IImageLink[] = [
        {
            src: '../../../assets/images/lasp-logo-black.png',
            href: 'http://lasp.colorado.edu'
        }
    ];

    socialLinks: ISocialLinks = {
        facebook: 'https://www.facebook.com/LASPatCU/',
        twitter: 'https://twitter.com/LASPatCU',
        youtube: 'https://www.youtube.com/user/LASPatCUBoulder'
    };
}
