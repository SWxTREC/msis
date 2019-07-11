# BaseApp

This project contains the modules needed to build the LASP base app. The basic modules include a standard LASP nav, search, and footer.

## LASP Nav

This module requires and imports the LaspSearchModule.

## LASP Search

This module can stand alone, but is required in the LaspNavModule.

## LASP Footer

This module is a stand-alone LaspFooterModule.

## LASP App

The LaspAppModule rolls up the LaspNavModule and the LaspFooterModule into one module.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
