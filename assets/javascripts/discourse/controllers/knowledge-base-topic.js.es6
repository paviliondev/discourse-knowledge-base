import DiscourseURL from 'discourse/lib/url';
import { default as computed } from 'ember-addons/ember-computed-decorators';

export default Ember.Controller.extend({
  @computed
  printLabel() {
    return this.site.mobileView ? '' : I18n.t("topic.print.title");
  },

  actions: {
    goToTopic() {
      const topic = this.get('topic');
      DiscourseURL.routeTo(`/t/${topic.slug}/${topic.id}`);
    },

    print() {
      const topic = this.get('topic');
      const category = this.get('category');
      window.location = `/k/${category.slug}/${topic.slug}/${topic.id}/print`;
    }
  }
})
