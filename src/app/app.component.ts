import { Component } from '@angular/core';

import {
    IImageLink,
    INavItem,
    ISocialLink,
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
            label: 'About',
            link: '/about'
        }, {
            label: 'Calculator',
            link: '/calculator'
        }, {
            label: 'Documentation',
            link: '/docs'
        }
    ];

    orgLogos: IImageLink[] = [
        {
            src: 'https://lasp.colorado.edu/media/projects/base-app/images/footer-lasp-logo.png',
            href: 'http://lasp.colorado.edu'
        }
    ];

    socialLinks: ISocialLink[] = [
        {
            name: 'github',
            href: 'https://github.com/SWxTREC'
        }
    ];

    versions: IVersion[] = [
        {
            version: environment.version
        }
    ];

    constructor( private _snippets: LaspBaseAppSnippetsService ) {
        this._snippets.appComponent.allExcept([ this._snippets.appComponent.setupGoogleAnalytics ]);
    }
}
