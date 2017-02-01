import Ember from 'ember';

export default Ember.Controller.extend({
    newProjects: Ember.A(),
    actions: {
        createProject(title, description) {
            const project = this.store.createRecord('node', {
                title:title,
                description:description,
                category:"project"
            });

            return project.save().then((project) => {
                this.get('newProjects').pushObject(project);
            });
        }
    }
});
