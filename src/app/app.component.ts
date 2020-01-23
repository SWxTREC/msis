import { Component } from '@angular/core';

import {
    IImageLink,
    INavItem,
    ISocialLinks,
    IVersion
} from 'lasp-footer';

import {
    LaspBaseAppSnippetsService
} from 'lasp-base-app-snippets';

import { environment } from '../environments/environment';

/** Entry Component */
@Component({
    selector: 'swt-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent {

    // please have no more than 7 items in the nav menu
    navItems: INavItem[] = [
        {
            label: 'Single-Point Calculator',
            link: '/model'
        }, {
            label: 'Documentation',
            link: '/docs'
        }, {
            label: 'About',
            link: '/about'
        }
    ];

    orgLogos: IImageLink[] = [
        {
            src: 'https://lasp.colorado.edu/media/projects/base-app/images/footer-lasp-logo.png',
            href: 'http://lasp.colorado.edu'
        }
    ];

    socialLinks: ISocialLinks = {
        facebook: 'https://www.facebook.com/LASPatCU/',
        twitter: 'https://twitter.com/LASPatCU',
        youtube: 'https://www.youtube.com/user/LASPatCUBoulder'
    };

    versions: IVersion[] = [
        {
            version: environment.version
        }
    ];

    constructor( private _snippets: LaspBaseAppSnippetsService ) {
        this._snippets.appComponent.all({ googleAnalyticsId: environment.googleAnalyticsId });
    }
}
