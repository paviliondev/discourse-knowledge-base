import { default as computed } from 'discourse-common/utils/decorators';
import DiscourseURL from 'discourse/lib/url';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: [':knowledge-base-topic-list-item', 'active'],
  title: Ember.computed.alias('topic.title'),

  @computed('topic.id', 'currentItemId')
  active(topicId, currentItemId) {
    return topicId == currentItemId;
  },

  click() {
    const slug = this.get('category.fullSlug');
    const topic = this.get('topic');
    this.toggleMenu();
    DiscourseURL.routeTo('/k' + '/' + slug + '/' + topic.slug + '/' + topic.id);
  }
});
