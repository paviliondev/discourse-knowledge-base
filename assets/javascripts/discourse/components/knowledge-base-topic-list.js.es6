import { default as computed, observes } from 'ember-addons/ember-computed-decorators';

export default Ember.Component.extend({
  classNames: 'knowledge-base-topic-list',
  visible: false,

  @observes('currentItemId')
  setVisibleIfCurrent() {
    const topics = this.get('topics');
    const category = this.get('category');
    const currentItemId = this.get('currentItemId');
    if (topics.find(t => t.id == currentItemId) || category.topic_id == currentItemId) {
      this.set('visible', true);
    }
  },

  @computed('category.topic_id', 'currentItemId')
  categoryClass(categoryTopicId, currentItemId) {
    let categoryClass = 'title';
    if (currentItemId == categoryTopicId) {
      categoryClass += ' active';
    }
    return categoryClass;
  },

  @computed('category.slug')
  categoryUrl(slug) {
    return '/k/' + slug;
  },

  @computed('visible')
  topicListClasses(visible) {
    let classes = 'topics';
    if (visible) classes += ' visible';
    return classes;
  },

  actions: {
    toggleList() {
      this.toggleProperty('visible');
    }
  }
});
