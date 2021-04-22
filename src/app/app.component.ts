import { Component } from '@angular/core';
import {
    LaspBaseAppSnippetsService
} from 'lasp-base-app-snippets';
import {
    IImageLink,
    INavItem,
    ISocialLink,
    IVersion
} from 'lasp-footer';
import {
    LatisService
} from 'src/app/services';

import { environment } from '../environments/environment';

/** Entry Component */
@Component({
    selector: 'swt-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
    latisLisird = environment.latisLisird;
    latisSwp = environment.latisSwp;

    // please have no more than 7 items in the nav menu
    navItems: INavItem[] = [
        {
            label: 'About',
            link: '/about'
        }, {
            label: 'Visualizer',
            link: '/visualizer'
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
        },
        {
            productName: 'Ap/ap data from GFZ German Research Centre for Geosciences provided via',
            version:  'LaTiS-swp',
            link: this.latisSwp,
            linkedPart: 'version'
        },
        {
            productName: 'Penticton F10.7 data from National Resources Canada provided via',
            version: 'LaTiS-lisird',
            link: this.latisLisird,
            linkedPart: 'version'
        }
    ];

    constructor(
        private _snippets: LaspBaseAppSnippetsService,
        // trigger latis service on app load to get most recent ap data
        private _latis: LatisService
    ) {
        this._snippets.appComponent.allExcept([ this._snippets.appComponent.setupGoogleAnalytics ]);
    }
}
