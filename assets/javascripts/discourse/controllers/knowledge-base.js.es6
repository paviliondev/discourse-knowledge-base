import { default as computed } from 'discourse-common/utils/decorators';
import { inject as service } from "@ember/service";

export default Ember.Controller.extend({
  router: service(),
  menuExpanded: false,

  @computed('router.currentRouteName')
  isIndex(currentRouteName) {
    return currentRouteName === 'knowledgeBase.index';
  },

  actions: {
    toggleMenu() {
      this.toggleProperty('menuExpanded');
    }
  }
});
