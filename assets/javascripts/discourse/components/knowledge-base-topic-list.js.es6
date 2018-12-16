import { default as computed, observes } from 'ember-addons/ember-computed-decorators';
import { ajax } from 'discourse/lib/ajax';
import { popupAjaxError } from 'discourse/lib/ajax-error';

export default Ember.Component.extend({
  classNames: 'knowledge-base-topic-list',
  visible: false,

  didInsertElement() {
    this.set('sortedTopics', this.flagFirstAndLast(this.get('topics')));
  },

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

  flagFirstAndLast(topics) {
    topics.forEach((t, i) => {
      if (i == 0) {
        Ember.set(t, 'isFirst', true);
        Ember.set(t, 'isLast', false);
      } else if (i == topics.length - 1) {
        Ember.set(t, 'isLast', true);
        Ember.set(t, 'isFirst', false);
      } else {
        Ember.set(t, 'isFirst', false);
        Ember.set(t, 'isLast', false);
      }
    });
    return topics;
  },

  sort(topicId, sort) {
    let sortedTopics = this.get('sortedTopics');
    let topic = sortedTopics.findBy('id', topicId);
    let index = sortedTopics.indexOf(topic);
    let newIndex;

    switch(sort) {
      case 'up':
        newIndex = index - 1;
        break;
      case 'down':
        newIndex = index + 1;
        break;
      case 'top':
        newIndex = 0;
        break;
      case 'bottom':
        newIndex = sortedTopics.length - 1;
        break;
      default:
        newIndex = index;
    }

    sortedTopics.splice(newIndex, 0, sortedTopics.splice(index, 1)[0]);

    sortedTopics = this.flagFirstAndLast(sortedTopics);

    this.propertyWillChange('sortedTopics');
    this.set('sortedTopics', sortedTopics);
    this.propertyDidChange('sortedTopics');
  },

  @computed('showSortControls', 'currentUser.admin')
  showSortToggle(showSortControls, isAdmin) {
    return !showSortControls && isAdmin;
  },

  saveSort() {
    const category = this.get('category');
    const topics = this.get('sortedTopics');

    this.set('saving', true);

    ajax(`/k/${category.slug}/sort`, {
      type: 'PUT',
      data: {
        sorted_ids: topics.map(t => t.id)
      }
    }).then((result) => {
      if (!result.success) {
        this.set('sortedTopics', this.get('topics'));
      }
      this.set('showSortControls', false);
    }).catch(popupAjaxError)
    .finally(() => this.set('saving', false));
  },

  actions: {
    toggleList() {
      this.toggleProperty('visible');
    },

    toggleSortControls() {
      this.toggleProperty('showSortControls');
    },

    sort(opts) {
      this.sort(opts.topicId, opts.sort);
    },

    saveSort() {
      this.saveSort();
    }
  }
});
