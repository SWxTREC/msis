import { version } from '../../package.json';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    // latisSwp: 'https://swp-dev.pdmz.lasp.colorado.edu/space-weather-portal/latis/dap/',
    // latisLisird: 'http://lisird-stage.pdmz.lasp.colorado.edu/lisird/latis/dap/',
    latisSwp: 'https://lasp.colorado.edu/space-weather-portal/latis/dap/',
    latisLisird: 'https://lasp.colorado.edu/lisird/latis/dap/',
    msisApi: 'https://msis-api.dev.swx-trec.com/',
    production: false,
    version: version
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
