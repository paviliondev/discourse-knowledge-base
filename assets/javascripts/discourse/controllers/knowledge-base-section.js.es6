import DiscourseURL from 'discourse/lib/url';

export default Ember.Controller.extend({
  actions: {
    goToTopic() {
      const topic = this.get('topic');
      DiscourseURL.routeTo(`/t/${topic.slug}/${topic.id}`);
    },

    print() {
      const category = this.get('category');
      window.location = `/k/${category.slug}/print`;
    }
  }
})
