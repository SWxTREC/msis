# SESAM

Deployed site: https://swxtrec.github.io/vector

This is a frontend for interacting with the Space Weather Testbed SESAM model by Marcin Pilinski.

## Contacts

* **Product Owner:**
	Marcin Pilinski, marcin.pilinski@lasp.colorado.edu
* **Experienced Devs:**
    Front end: Jennifer Knuth, jennifer.knuth@lasp.colorado.edu
	Back end: Greg Lucas, greg.lucase@lasp.coloardo.edu

## Relevant JIRA Project(s)

* [SWT](http://mods-jira.lasp.colorado.edu:8080/browse/SWT/): Main project for the
	Space Weather Testbed codebase.
* [Incorporate SESAM Model](https://jira.lasp.colorado.edu/browse/SWT-41): Epic for SESAM calculator

## Related Projects

NA

## Production URLs

https://swxtrec.github.io/vector

## Necessary Permissions

TK

## Architecture

This is the frontend code that sets the parameters to run the SESAM model in AWS.

A Flask backend has been set up to create an API that receives a POST request with the model parameters and returns a GET request with the result.

## Running SESAM Locally

See 'Developement server' below.

### Project Dependencies

SESAM backend is needed in production.

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

If you are using docker, be sure to follow the instructions in after-fork.instructions.

### Building a docker image

Once you have followed the steps in after-fork.instructions you can run `./docker-build.sh` to build a new image locally

### Running a dev image locally

Once you have built your image using the command above, you can `./docker-run.sh` to start a local development image. This image will be served at `http://localhost:8080/dev`

To stop your image run `docker stop {{Project-name}}`

Cleaning up old images is also a good idea from time to time. To clean up your unused docker resources run `docker system prune`

### Pushing an image to the LASP web registry

When you are ready to push your image, contact the web team infrastructure group for credentials and instructions on how to log in. Once this is complete you can run `./docker-publish.sh` to publish your image to the server.

## Deploying SESAM

### Deployment build

Make sure you are in the master branch and all your code is linted, tested, reviewed, and committed.

Run `npm run lint` to make sure your project passes linting.

Run `npm test` to make sure your tests are passing.

Then, run `npm run build:prod` to create the `/docs` directory that will be deployed.

Make a copy of `docs/index.html` and name it `docs/404.html`. Why? I'm not sure, but maybe with this package instead, you can skip this step: https://github.com/angular-schule/angular-cli-ghpages

### Deploy to GitHub pages

Run `npm run deploy` and your current build from your current branch will be pushed up to the remote `gh-pages` branch and deployed to the site hosted by GitHub at https://swxtrec.github.io/vector.

### Requirements

Who needs to be made aware of a release? What limitations/restrictions are there before making a
release? For example, is there an explicit vetting process, or perhaps certain time windows when a
release shouldn't be made?

### Deploy process

Run `npm version <major | minor | patch>` on the master branch. This will:

* run the linter and unit tests, and abort if they fail
* increment the version, commit the change, and create a git tag
* push the changes and the new tag to the remote repo

What other steps are needed to deploy the app/server/project? What is the process for making a release? Many projects will
have a simple Hudson job, while others may be much more involved.

## FAQs and Help

### SESAM-specific common issues, gotchas

Any kind of project-specific issues that would pop up goes here, as well as any quirks or
inconsistencies within the project (e.g. hacks, workarounds, "I don't know why this works but....")

## External Resources

Useful documentation that isn't ours (for example, in LaTiS, maybe links to Scala documentation, or
higher level topics like RDB and Data Model articles/resources)
