import Ember from 'ember';
import NodeActionsMixin from 'ember-osf/mixins/node-actions';
import TaggableMixin from 'ember-osf/mixins/taggable-mixin';



export default Ember.Controller.extend(NodeActionsMixin, TaggableMixin, {
    downloadUrl: null,
    fileManager:Ember.inject.service(),
    actions: {
        editProject(title, description) {
            return this.send('updateNode', title, description);
        },
        fileDetail(file) {
            this.set('downloadUrl', this.get('fileManager').getDownloadUrl(file));
        }
    }
});
