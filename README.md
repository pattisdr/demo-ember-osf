[![Build Status](https://travis-ci.org/abought/demo-ember-osf.svg?branch=develop)](https://travis-ci.org/abought/demo-ember-osf)
[![Coverage Status](https://coveralls.io/repos/github/abought/demo-ember-osf/badge.svg?branch=develop)](https://coveralls.io/github/abought/demo-ember-osf?branch=develop)

# Demo-ember-osf

This is a demonstration project that consumes the ember-osf Ember addon, produced by the Center for Open Science.

The focus is on basic scaffolding, incorporating opinionated best practices such as documentation tools, style guide 
checking, and CI build scripts/ code coverage metrics. 

This application is based on Ember 2.8 LTS, yarn, nvm, Sass, and YUIDoc.  It applies linters for JS and template style, 
and incorporates badges and config for health reporting services such as Travis and Coveralls.io.

In the future we may add a dependency on `ember-i18n`, depending on goals for this demonstration app.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [NVM](https://github.com/creationix/nvm) or [Node.js](http://nodejs.org/)
* [Yarn](https://yarnpkg.com/en/docs/install) (NPM replacement)
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone https://github.com/abought/demo-ember-osf.git -o upstream` this repository
* `cd demo-ember-osf`
* `yarn install --pure-lockfile`
* `bower install`
* `ember generate ember-osf` - will generate `config/local.yml`; fill in the
 [required fields](https://github.com/CenterForOpenScience/ember-osf#configuration)

 
## Additional configuration
If you would like to log errors to Sentry, add `SENTRY_DSN` to the correct section of your `local.yml` file, and 
specify the appropriate configuration string for your server/ project. We encourage remote error logging for all COS 
projects.
 
## Running / Development

### Without Docker
* `BACKEND=stage ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### With Docker
* `docker build -t demo-ember-osf . && docker run -p 4200:4200 demo-ember-osf BACKEND=stage ./node_modules/ember-cli/bin/ember serve`

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

Unit tests can be run as follows:
* `ember test`
* `ember test --server`

To run all tests required for CI, use:
* `yarn test`

Testing with docker:
* `docker build -t demo-ember-osf . && docker run demo-ember-osf`

### Building

* `ember build` (development)
* `ember build --environment production` (production)


## Tips: where to go from here
There are several packages that can enhance your large-scale applications, but are not included in this scaffold:
- `ember-i18n` (may be added in the future)

## Future features to add to this app
In the future, we will add:
- Demonstrate nested route / paginated requests according to ember best practices
- Improve a11y testing (currently runs during acceptance tests, but does not cause tests to fail; 
  see [known pending issue](https://github.com/ember-a11y/ember-a11y-testing/issues/47))


# Workshop Instructions
## 1. To change the background color:
- **Add css to stylesheet** *app/styles/app.scss*
```css
body {
  background-color: red;
}
```
## 2.  To define a projects route that displays a list of projects:
- **Type in your terminal:**
    $ _ember generate route projects_
-  **Add model hook to projects route handler to fetch projects** *app/routes/projects*
```js
import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.get('store').findAll('node');
    }
});
```
  - **Add HTML to projects template** *app/templates/projects.hbs*

```html
<h1> Projects </h1>

<ul>
    {{#each model as |project|}}
        <li>
            <p> {{project.title}} </p>
            {{#if project.description}}
                <p> Description: {{project.description}} </p>
            {{/if}}
        </li>
    {{/each}}
</ul>
```

## 3.  To define a detail route displaying a single project:
- **Type in your terminal:**
    $ _ember generate route detail_
- **Add detail path so `/projects/:project_id` will load detail route in** *app/router.js*
```js
import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function () {
  this.route('login');
  this.route('me');
  this.route('projects');
  this.route('detail', {path: 'projects/:project_id'});
});

export default Router;

```
-  **Add model hook to detail route handler to fetch a single project** *app/routes/detail*
```js
import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.get('store').findRecord('node', params.project_id);
    }
});
```
- **Add HTML to detail template to display project** *app/templates/detail.hbs*

```html
<h1> {{model.title}} </h1>
<h2> {{model.description}} </h2>
<h3> Public: {{model.public}} </h3>
```
- **Add `link-to` helper to create a link to each project in** *app/templates/projects.hbs*

```html
<h1> Projects </h1>

<ul>
    {{#each model as |project|}}
        <li>
            {{#link-to 'detail' project.id}}
                <p> {{project.title}} </p>
            {{/link-to}}
            {{#if project.description}}
                <p> Description: {{project.description}} </p>
            {{/if}}
        </li>
    {{/each}}
</ul>
```

## 4.  Add a file-browser to view all the files stored in a project
- **Add file-browser component (from Ember-OSF) to** *app/templates/detail.hbs*  Pass in the model (which is the project), to the file-browser component, so the component can fetch the project's files.

```html
<h1> {{model.title}} </h1>
<h2> {{model.description}} </h2>
<h3> Public: {{model.public}} </h3>

<div class="row">
    <div class="col-xs-4">
        {{file-browser
            rootItem=model
        }}
    </div>
</div>
```

## 5.  **Add file-rendering** to render an individual file in the browser
- **Pass in an openFile action to the file-browser component** in *app/templates/detail.hbs*. When you click on a file, the openFile action will run.  We will define this action shortly.
```html
<h1> {{model.title}} </h1>
<h2> {{model.description}} </h2>
<h3> Public: {{model.public}} </h3>

<div class="row">
    <div class="col-xs-4">
        {{file-browser
            rootItem=model
            openFile=(action 'openFile')
        }}
    </div>
</div>
```
- **Generate a detail controller so you have a place to define your openFile action** Type in your terminal:
    $ _ember generate controller detail_

- **Add three pieces to your detail controller**   These pieces will help build a downloadUrl that we can pass to the file-renderer. ** 1) Add a downloadUrl property with an initial value of null. 2) Inject the fileManager service.  This is an Ember-OSF service which helps you do things with files.  3) Add an openFile action. When you click on your file in the file-browser, this action will run.  All it does is create the downloadUrl to download that particular file (with the help of the fileManager service).  in *app/controllers/detail.js*

```js
import Ember from 'ember';

export default Ember.Controller.extend({
    downloadUrl: null,
    fileManager: Ember.inject.service(),
    actions: {
       openFile(file) {
            this.set('downloadUrl', this.get('fileManager').getDownloadUrl(file));
        }
    }
});
```

- **Add the file-renderer component (from Ember-OSF) to** *app/templates/detail.hbs* We are going to pass in the downloadUrl which is generated when you click on the file in the file-browser component.

```html
<h1> {{model.title}} </h1>
<h2> {{model.description}} </h2>
<h3> Public: {{model.public}} </h3>

<div class="row">
    <div class="col-xs-4">
        {{file-browser
            rootItem=model
            openFile=(action 'openFile')
        }}
    </div>
    <div class="col-xs-8">
        {{#file-renderer download=downloadUrl
            width="800" height="1000"}}
        {{/file-renderer}}
    </div>
</div>
```
