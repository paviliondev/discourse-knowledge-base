import DiscourseURL from 'discourse/lib/url';

export default Ember.Controller.extend({
  actions: {
    goToTopic() {
      const topic = this.get('topics');
      DiscourseURL.routeTo(`/t/${topic.title.dasherize()}/${topic.id}`);
    },

    print() {
      const topic = this.get('topic');
      const category = this.get('category');
      window.location = `/k/${category.slug}/${topic.title.dasherize()}/${topic.id}/print`;
    }
  }
})
