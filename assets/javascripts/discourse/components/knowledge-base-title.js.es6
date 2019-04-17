import DiscourseURL from 'discourse/lib/url';
import { getOwner } from 'discourse-common/lib/get-owner';

export default Ember.Component.extend({
  classNames: 'knowledge-base-title',

  actions: {
    goHome() {
      const controller = getOwner(this).lookup('controller:knowledge-base');
      controller.set('currentItemId', null);
      this.toggleMenu();
      DiscourseURL.routeTo('/k');
    }
  }
})
