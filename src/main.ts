import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
let baseHref: string;

if ( environment.production ) {
    enableProdMode();
    baseHref = '/vector/';
} else {
    baseHref = '/';
}

platformBrowserDynamic().bootstrapModule( AppModule )
.catch( err => console.error( err ) );
