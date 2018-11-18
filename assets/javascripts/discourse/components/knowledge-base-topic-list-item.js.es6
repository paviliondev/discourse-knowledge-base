import { default as computed } from 'ember-addons/ember-computed-decorators';
import DiscourseURL from 'discourse/lib/url';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: [':knowledge-base-topic-list-item', 'active'],

  @computed('topic.id', 'currentItemId')
  active(topicId, currentItemId) {
    return topicId == currentItemId;
  },

  click() {
    const slug = this.get('category.slug');
    const topic = this.get('topic');
    DiscourseURL.routeTo('/k' + '/' + slug + '/' + topic.slug + '/' + topic.id);
  }
});
