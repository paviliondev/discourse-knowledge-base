import { default as computed, observes } from 'ember-addons/ember-computed-decorators';

export default Ember.Component.extend({
  classNames: 'knowledge-base-topic-list',
  visible: false,

  @observes('currentItemId')
  setVisibleIfCurrent() {
    const topics = this.get('topics');
    const currentItemId = this.get('currentItemId');
    if (topics.find(t => t.id == currentItemId)) {
      this.set('visible', true);
    }
  },

  @computed
  categoryUrl() {
    const slug = this.get('category.slug');
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
