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
-  **Add model hook to projects route handler to [retrieve multiple projects](https://guides.emberjs.com/v2.11.0/models/finding-records/#toc_retrieving-multiple-records)** *app/routes/projects*
```js
import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.get('store').findAll('node');
    }
});
```
  - **Add HTML to projects template in ** *app/templates/projects.hbs*
  We are using an [`each`](https://guides.emberjs.com/v2.11.0/templates/displaying-a-list-of-items/) helper to iterate through all the projects in the model.

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
-  **Add model hook to detail route handler to [retrieve a single project](https://guides.emberjs.com/v2.11.0/models/finding-records/#toc_retrieving-a-single-record)** *app/routes/detail*
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
- **Add a [`link-to` component](https://guides.emberjs.com/v2.11.0/templates/links/#toc_the-code-link-to-code-component) to create a link to each project in** *app/templates/projects.hbs*

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
- **Add [file-browser](http://centerforopenscience.github.io/ember-osf/classes/file-browser.html) component (from Ember-OSF) to** *app/templates/detail.hbs*  Pass in the model (which is the project), to the file-browser component, so the component can fetch the project's files.

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
- **Generate a detail controller** so you have a place to define your openFile [action](https://guides.emberjs.com/v2.11.0/components/triggering-changes-with-actions/#toc_implementing-the-action). Type in your terminal:
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

- **Add the [file-renderer component](http://centerforopenscience.github.io/ember-osf/classes/file-renderer.html) (from Ember-OSF) to** *app/templates/detail.hbs* We are going to pass in the downloadUrl which is generated when you click on the file in the file-browser component.

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