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
