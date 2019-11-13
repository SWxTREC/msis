# {{Project-Name}}

Here is where you would give a quick "elevator pitch" about your project. Who is it for, why is was it needed, what does it do, things like that.

## Contacts

* **Product Owner {{Organization}}:**
	{{Product Owner Name. Duplicate as necessary}} (<{{email@address.com}}>)
* **Experienced Devs:**
    * {List Of Devs}


## Relevant JIRA Project(s)

Either a single JIRA project, or a list of JIRA projects that are relevant to this codebase. For
example, these are relevant to Lisird3:

* [LISIRDIII](http://mods-jira.lasp.colorado.edu:8080/browse/LISIRDIII/): Main project for the
	Lisird3 codebase
* [LATIS](http://mods-jira.lasp.colorado.edu:8080/browse/LATIS/): Project for the latis project,
	which provides the backend to Lisird3
* [METAREPO](http://mods-jira.lasp.colorado.edu:8080/browse/METAREPO/): Project for the LEMR
	metadata repository, which also provides data to Lisird3

## Related Projects

If this is part of the webtcad/latis family, a link to the core project is required. Here, you
should put links to other JIRA projects that this project uses. For example, if this were
Webtcad-maven, links to webtcad-core and latis would be here.

* [{{JIRA Project Name}}]({{Link To Project}})

## Production URLs

Where can you find this project in production? For example:

* Production site: https://lasp.colorado.edu/mms/sdc/team/
	* NOTE: see "Necessary Permissions" for WebIAM group
* Testing site: http://sdc-webdev1.lasp.colorado.edu/mms/sdc/team/

## Necessary Permissions

What permissions, if any, are necessary to work on this project, deploy it, or view it in
production? For example, if this page will be protected by WebIAM, what WebIAM group does a user
need to be in to be able to see the page/site? Example:

* Hudson permissions: ask Steve
* WebIAM group for production: mms-sdc-science-team

## Architecture

How is the project itself set up? Where would the code live in the big picture, what would it
communicate with? Code/directory structure, front/back-end explanations, and testing procedure would
be appropriate here. 

## Running {{Project-Name}} Locally

### Project Dependencies

For example, does the project depend on having a local apache server? Fuseki? Can this project be
run independently? As an example, webtcad-core can't exactly do much on its own.

### Special DevEnv Issues

Is there anything platform specific being run? Does it need to live inside a VM to reproduce
behaviour? Connected to a VPN/internal network?

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Run `npm run build:prod`  for a production build.

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

## Deploying {{Project-Name}}

### Requirements

Who needs to be made aware of a release? What limitations/restrictions are there before making a
release? For example, is there an explicity vetting process, or perhaps certain time windows when a
release shouldn't be made?

### Deploy process

Run `npm version <major | minor | patch>` on the master branch. This will:

* run the linter and unit tests, and abort if they fail
* increment the version, commit the change, and create a git tag
* push the changes and the new tag to the remote repo

What other steps are needed to deploy the app/server/project? What is the process for making a release? Many projects will
have a simple Hudson job, while others may be much more involved.

## FAQs and Help

### {{Project-Name}}-specific common issues, gotchas

Any kind of project-specific issues that would pop up goes here, as well as any quirks or
inconsistiencies within the project (e.g. hacks, workarounds, "I don't know why this works but....")

## External Resources

Useful documentation that isn't ours (for example, in LaTiS, maybe links to Scala documentation, or
higher level topics like RDB and Data Model articles/resources)
