import { default as computed, observes, on } from 'ember-addons/ember-computed-decorators';
import Category from 'discourse/models/category';
import DiscourseURL from 'discourse/lib/url';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),

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
  },

  @computed('application.currentPath')
  isIndex(currentPath) {
    return currentPath === 'knowledgeBase.index';
  }
});
