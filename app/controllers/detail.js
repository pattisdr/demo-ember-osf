import Ember from 'ember';
import NodeActionsMixin from 'ember-osf/mixins/node-actions';
import TaggableMixin from 'ember-osf/mixins/taggable-mixin';
import loadAll from 'ember-osf/utils/load-relationship';

export default Ember.Controller.extend(NodeActionsMixin, TaggableMixin, {
    downloadUrl: null,
    fileManager:Ember.inject.service(),
    dropzoneOptions: {
        maxFiles: 1,
        method: 'PUT',
        uploadMultiple: false,
    },
    file: null,
    callback: null,
    url: null,
    contributors: Ember.A(),
    getContributors: Ember.observer('model', function() {
        let model = this.get('model');
        let contributors = Ember.A();
        loadAll(model, 'contributors', contributors).then(() => {
            this.set('contributors', contributors);
        });
    }),

    actions: {
        editProject(title, description) {
            return this.send('updateNode', title, description);
        },
        fileDetail(file) {
            this.set('downloadUrl', this.get('fileManager').getDownloadUrl(file));
        },
        addContrib(userId) {
            return this.send('addContributor', userId, 'write', true);
        },
        buildUrl() {
            return this.get('url');
        },
        preUpload(_, dropzone, file) {
            this.set('file', file);
            this.set('callback', Ember.RSVP.defer());
            return this.get('model.files').then(files => {
                 this.set('url', files.findBy('name', 'osfstorage').get('links.upload')  + '?' + Ember.$.param({
                    kind: 'file',
                    name: this.get('file.name'),
                }));
                this.callback.resolve(this.get('file'));
            });
        },
        // Dropzone hooks
        sending(_, dropzone, file, xhr/* formData */) {
            // Called just before each file is sent.
            let _send = xhr.send;
            xhr.send = function() {
                _send.call(xhr, file);
            };
            xhr.withCredentials = true;
        },
        complete(__, dropzone, file) {
            // Called when the upload was either successful or erroneous.
            // Complete is called when swapping out files for some reason...
            if (file.xhr === undefined) {
                return;
            }
        },
        maxfilesexceeded(_, dropzone, file) {
            dropzone.removeAllFiles();
            dropzone.addFile(file);
        },
    },

});
