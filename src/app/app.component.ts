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
            label: 'Full-width page',
            link: '/fullwidth'
        }, {
            label: 'External link',
            link: 'https://google.com'
        }, {
            label: 'Data',
            link: '/data'
        }, {
            label: 'Missions',
            link: '/missions'
        }, {
            label: 'Tools',
            link: '/tools'
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
        }, {
            productName: 'LaTiS',
            version: 'v9.87.6-SNAPSHOT',
            link: 'https://en.wikipedia.org/wiki/Latis'
        }, {
            productName: 'foo',
            version: '3.5.5',
            link: 'http://bar.com',
            linkedPart: 'version'
        }
    ];

    constructor( private _snippets: LaspBaseAppSnippetsService ) {
        this._snippets.appComponent.all({ googleAnalyticsId: environment.googleAnalyticsId });
    }
}
