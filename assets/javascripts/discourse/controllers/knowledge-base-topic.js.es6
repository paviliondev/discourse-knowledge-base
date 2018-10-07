import DiscourseURL from 'discourse/lib/url';

export default Ember.Controller.extend({
  actions: {
    goToTopic() {
      const topic = this.get('topic');
      DiscourseURL.routeTo(`/t/${topic.title.dasherize()}/${topic.id}`);
    }
  }
})
