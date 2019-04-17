import { default as computed, observes, on } from 'ember-addons/ember-computed-decorators';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  menuExpanded: false,

  @computed('application.currentPath')
  isIndex(currentPath) {
    return currentPath === 'knowledgeBase.index';
  },

  actions: {
    toggleMenu() {
      this.toggleProperty('menuExpanded');
    }
  }
});
