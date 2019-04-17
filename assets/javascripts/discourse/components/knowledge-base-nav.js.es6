import { default as computed } from 'ember-addons/ember-computed-decorators';
import Category from 'discourse/models/category';
import DiscourseURL from 'discourse/lib/url';

export default Ember.Component.extend({
  classNameBindings: [':knowledge-base-nav', 'expanded'],

  didInsertElement() {
    Ember.$(document).on('click', Ember.run.bind(this, this.outsideClick));
  },

  willDestroyElement() {
    Ember.$(document).off('click', Ember.run.bind(this, this.outsideClick));
  },

  outsideClick(e) {
    if (this.site.mobileView &&
        !this.isDestroying &&
        !$(e.target).closest('.knowledge-base-nav').length) {
      this.set('expanded', false);
    }
  },

  @computed('topicsList')
  navList(topicsList) {
    const categories = Category.list().filter(c => c.knowledge_base);
    return Object.keys(topicsList).map(categoryId => {
      let category = categories.find(c => c.id.toString() === categoryId.toString());
      let topics = topicsList[categoryId].filter(t => t.id !== category.topic_id);
      return {
        category,
        topics
      };
    });
  }
})
