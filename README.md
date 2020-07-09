# MSIS

Deployed site: https://swxtrec.github.io/msis

This is a frontend for interacting with the MSIS model.

## Contacts

* **Product Owner:**
	Greg Lucas, greg.lucas@lasp.colorado.edu
* **Experienced Devs:**
    Front end: Jennifer Knuth, jennifer.knuth@lasp.colorado.edu
	Back end: Greg Lucas, greg.lucas@lasp.coloardo.edu

## Relevant JIRA Project(s)

* [SWT](http://mods-jira.lasp.colorado.edu:8080/browse/SWT/): Main project for the
	Space Weather Testbed codebase.
* [MSIS Website](https://jira.lasp.colorado.edu/browse/SWT-65): Epic for MSIS calculator

## Related Projects

[VECTOR](https://swxtrec.github.io/vector) and the SWx TREC Model Staging Platform.

## Production URLs

https://swxtrec.github.io/msis

<!-- ## Necessary Permissions

TK -->

## Architecture

This is the frontend code that sets the parameters to run the MSIS model in AWS.

A Flask backend has been set up to create an API that receives GET requests with the model parameters and returns a GET request with the result.

## Running MSIS Locally

See 'Development server' below.

### Project Dependencies

MSIS backend is needed in production.

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

### Local build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Run `npm run build:prod` for a production build.

### Linting

Run `npm run lint` to lint your code, or run `npm run lint:watch` to automatically lint every time you change a file.

Automatically fix many linter warnings by running `npm run lint:fix`.

### Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## DOCKER

<!-- If you are using docker, be sure to follow the instructions in after-fork.instructions. -->

### Building a docker image

<!-- Once you have followed the steps in after-fork.instructions  -->

You can run `./docker-build.sh` to build a new image locally

### Running a dev image locally

Once you have built your image using the command above, you can `./docker-run.sh` to start a local development image. This image will be served at `http://localhost:8080/dev`

To stop your image run `docker stop {{Project-name}}`

Cleaning up old images is also a good idea from time to time. To clean up your unused docker resources run `docker system prune`

<!-- ### Pushing an image to the LASP web registry

When you are ready to push your image, contact the web team infrastructure group for credentials and instructions on how to log in. Once this is complete you can run `./docker-publish.sh` to publish your image to the server. -->

## Deploy MSIS

MSIS is publicly hosted by GitHub in the SWxTREC organization.
<!-- Who needs to be made aware of a release? What limitations/restrictions are there before making a
release? For example, is there an explicit vetting process, or perhaps certain time windows when a
release shouldn't be made? -->

### Bump the version

From the master branch, run `npm version <major | minor | patch>` where major indicates a breaking change, minor is noticeable but non-breaking interface change, and patch is a non-breaking, under-the-hood refinement.

This will:

* run the linter and unit tests, and abort if they fail
* increment the version, commit the change, and create a git tag
* push the changes and the new tag to the remote repo

### Deploy to GitHub pages

From the master branch, run `npm run deploy`

This will:

* Run `npm run build:pages` to create the `/docs` directory that will be deployed
* Make a copy of `docs/index.html` and name it `docs/404.html` (for some reason the angular instructions say to do this)
* Take the current build of `/docs` from the current branch and push it up to the remote `gh-pages` branch were it will be served

After a few minutes, you will see the changes at the GitHub-hosted site https://swxtrec.github.io/msis.

You can run this script from any branch, but the site should reflect the content of the current master branch.

<!-- ## FAQs and Help

### MSIS-specific common issues, gotchas

Any kind of project-specific issues that would pop up goes here, as well as any quirks or
inconsistencies within the project (e.g. hacks, workarounds, "I don't know why this works but....")

## External Resources

Useful documentation that isn't ours (for example, in LaTiS, maybe links to Scala documentation, or
higher level topics like RDB and Data Model articles/resources) -->
