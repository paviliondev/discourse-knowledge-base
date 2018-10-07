import { default as computed } from 'ember-addons/ember-computed-decorators';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: [':knowledge-base-topic-list-item', 'active'],

  @computed('topic.id', 'currentItemId')
  active(topicId, currentItemId) {
    return topicId == currentItemId;
  },

  @computed
  topicUrl() {
    const slug = this.get('category.slug');
    const topic = this.get('topic');
    return '/k' + '/' + slug + '/' + topic.title.dasherize() + '/' + topic.id;
  }
});
