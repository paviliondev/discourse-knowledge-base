import { ajax } from 'discourse/lib/ajax';

export default Discourse.Route.extend({
  model(params) {
    return ajax(`/k/${params.slug}.json`);
  },

  afterModel(model) {
    console.log('topic after controller: ', model);
    if (model.failed) {
      return this.replaceWith('knowledgeBase');
    } else {
      this.controllerFor('knowledgeBase').set('currentItemId', model.topic_id);
    }
  },

  setupController(controller, model) {
    console.log('section: ', model)
    const topicsList = this.controllerFor('knowledgeBase').get('topicsList');
    const category = this.site.get('categories').find(c => c.id === model.category_id);
    let topics = topicsList[model.category_id];
    let topic = topics.find(t => t.id == model.topic_id);

    controller.setProperties({
      post: model.post,
      topic,
      category
    });
  },

  titleToken() {
    return this.controllerFor('knowledge-base-topic').get('category.name');
  }
});
