import { default as computed, observes, on } from 'ember-addons/ember-computed-decorators';
import Category from 'discourse/models/category';
import DiscourseURL from 'discourse/lib/url';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),

  @computed('topicsList')
  navList(topicsList) {
    const categories = Category.list().filter(c => c.knowledge_base);
    return Object.keys(topicsList).map(categoryId => {
      return {
        category: categories.find(c => c.id.toString() === categoryId.toString()),
        topics: topicsList[categoryId]
      };
    });
  },

  @computed('application.currentPath')
  isIndex(currentPath) {
    return currentPath === 'knowledgeBase.index';
  },

  actions: {
    goToRoot() {
      DiscourseURL.routeTo('/k');
    }
  }
});
