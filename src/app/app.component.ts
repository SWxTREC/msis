import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import {
    IImageLink,
    INavItem,
    ISocialLinks,
    IVersion
} from 'lasp-footer';

import { environment } from '../environments/environment';

/** Entry Component */
@Component({
    selector: 'app-root',
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
            src: 'assets/images/lasp-logo-black.png',
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
            version: 'v0.1.2'
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

    constructor( private _router: Router ) {
        // we will load an external script for Google Analytics. The script may not load until after the router has changed one or more
        // times. We want to keep track of the route changes that happen before we can log the changes to Google Analytics.
        // Only in rare cases will the route change before the analytics script has loaded.
        const loadedRoutes: string[] = [];

        // track router changes in google analytics
        this._router.events.subscribe( event => {
            if ( event instanceof NavigationEnd ) {
                // window['gtag'] only exists after the analytics script has loaded. If it hasn't loaded, keep track of the route change.
                if ( window['gtag'] ) {
                    this._logToGoogleAnalytics( event.urlAfterRedirects );
                } else {
                    loadedRoutes.push( event.urlAfterRedirects );
                }
            }
        });

        // load the analytics script
        const script: any = document.createElement( 'script' );
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.googleAnalyticsId;
        script.onload = () => {
            // some standard gtag code given by google
            window['dataLayer'] = window['dataLayer'] || [];
            window['gtag'] = function() {
                window['dataLayer'].push( arguments );
            };
            window['gtag']( 'js', new Date() );

            // now log any route changes that happened before this script loaded
            loadedRoutes.forEach( route => this._logToGoogleAnalytics(route) );
        };
        document.getElementsByTagName( 'head' )[0].appendChild( script );
    }

    private _logToGoogleAnalytics( path: string ) {
        window['gtag']( 'config', environment.googleAnalyticsId, {
            page_path: path
        });
    }
}
